import { ChannelCreateMessage } from "./types";

const entryPoint = "https://discord.com/api/v10/"

async function discordPost(endPoint: string, data: {}) {
    return await(await fetch(entryPoint + endPoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bot ${process.env.DISCORD_TOKEN}`
        },
        body: JSON.stringify(data),
    })).json();
}

async function discordGet(endPoint: string) {
    return (await fetch(entryPoint + endPoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bot ${process.env.DISCORD_TOKEN}`
        },
    })).json();
}

async function discordPut(endPoint: string, data?: {}) {
    return await fetch(entryPoint + endPoint, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bot ${process.env.DISCORD_TOKEN}`
        },
        body: data?JSON.stringify(data): undefined
    })
}

export function createChannel(data: { name: string, type: number, parent_id?: string, permission_overwrites?:{id:string, type:number, allow?:string, deny?:string}[] }) {
    return discordPost(`guilds/${process.env.DISCORD_GUILD_ID}/channels`, data);
}

export function verifiedPermission (commandID:string){
    return discordGet (`/applications/${process.env.VITE_DISCORD_APPLICATION_ID}/guilds/${process.env.GUILD_ID}/commands/${commandID}/permissions`)
}

export function addGuildMemberRole(userId:string, roleId:string) {
    return discordPut(`/guilds/${process.env.DISCORD_GUILD_ID}/members/${userId}/roles/${roleId}`)
}

export function createGuildRole (data: { name?:string, permissions?:string, color?:number, hoist?:boolean, mentionable?:boolean } = {} ){
    return discordPost(`guilds/${process.env.DISCORD_GUILD_ID}/roles`,data);
}

export function createDM(data: { recipient_id: string }) {
    return discordPost(`users/@me/channels`, data);
}

export function createMessage(channelId: string, data: ChannelCreateMessage) {
    return discordPost(`channels/${channelId}/messages`, data);
}

export function getGlobalApplicationCommands(): Promise<{name: string, id: string }[]> {
    return discordGet(`applications/${process.env.VITE_DISCORD_APPLICATION_ID}/commands`);
}

export async function getAccessToken(code: string, origin: string) {
    return await fetch(`${entryPoint}oauth2/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'client_id': process.env.VITE_DISCORD_APPLICATION_ID!,
            'client_secret': process.env.DISCORD_CLIENT_SECRET!,
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': origin + "/#/auth/discord/success"
        })
    })
}

export async function getCurrentAuthorizationInformation(accessToken: string) {
    return await (await fetch(`${entryPoint}oauth2/@me`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })).json();
}

export async function getGuildMember(userId: string) {
    return await discordGet(`guilds/${process.env.DISCORD_GUILD_ID}/members/${userId}`)
}

export async function addGuildMember(userId: string, data: { access_token: string, roles?: string[] }) {
    return (await discordPut(`guilds/${process.env.DISCORD_GUILD_ID}/members/${userId}`, data)).json()
}