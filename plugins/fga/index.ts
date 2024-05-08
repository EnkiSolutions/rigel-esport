import { createKysely } from "@vercel/postgres-kysely";
import { Database } from "./types";

const db = createKysely<Database>();

export async function createUser(data: {
    name: string,
    avatar: string,
    key: string }) {
    await db
        .insertInto('e_users')
        .values(data)
        .execute();
    
    return db
        .selectFrom('e_users')
        .selectAll()
        .orderBy('id', 'desc')
        .executeTakeFirst();
}

export async function getUser(id: bigint) {
    return db
        .selectFrom('e_users')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst();
}