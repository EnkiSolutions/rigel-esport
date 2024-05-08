import { createKysely } from '@vercel/postgres-kysely';
import { createCipheriv, createHash, randomBytes } from "crypto";
import { Database } from './types';
import { addGuildMember, getAccessToken, getCurrentAuthorizationInformation, getGuildMember } from "../discord/api";
import { 
    createUser as RBACCreateUser,
    getUser as RBACGetUser,
} from '../fga';

const db = createKysely<Database>();

export async function createUser(data: {
    discordId: bigint,
    discordName: string,
    discordAvatar: string,
    key: string
}) {   
    const { id } = await RBACCreateUser({
        name: data.discordName,
        avatar: data.discordAvatar,
        key: data.key
    });
    
    await db
        .insertInto('discordUsers')
        .values({
            id: data.discordId,
            userId: id
        })
        .execute();
}

export async function getUser(discordId: bigint) {
    const { userId } = await db
        .selectFrom('discordUsers')
        .selectAll()
        .where('id', '=', discordId)
        .executeTakeFirst();
    
    return RBACGetUser(userId);
}

export async function connect(code: string, origin: string): Promise<{
    member: any,
    token: string,
    expiresAt:Date
}> {
    // Get access token from discord auth response
    const { access_token, expires_in, refresh_token } = await (
        await getAccessToken(code, origin)
    ).json();
    // ToDo : refresh token
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expires_in);
    // Get the user infos using the token
    const { user } = await getCurrentAuthorizationInformation(access_token);
    const { avatar, global_name, id } = user;
    const discordId = BigInt(id);
    let member = await getGuildMember(id);
    const profile = await getUser(discordId);
    let key: string;
    // If the user doesn't exist, we need to sign him in
    if (profile) key = profile.key;
    else {
        // We need to check if we're already a guild member
        if (member.code == 10007) {
            // ToDo : set roles according to passed data (pass data first)
            member = await addGuildMember(id, { access_token });
        }
        key = JSON
            .stringify(createHash("sha256")
            .update(randomBytes(32))
            .digest());
        await createUser({ 
            key, 
            discordId, 
            discordName: global_name, 
            discordAvatar: avatar
        });
    }
    // Now we're sure the user exists, send his profile and roles
    const iv = randomBytes(16);
    const cipher = createCipheriv(
        "aes-256-cbc",
        Buffer.from(JSON.parse(key).data),
        iv
    );
    const encrypted = cipher.update(
        JSON.stringify({ access_token, refresh_token })
    );
    const token = 
        iv.toString("hex")
        + "."
        + Buffer
            .concat([encrypted, cipher.final()])
            .toString("hex");
    return {
        member,
        token,
        expiresAt
    }
}