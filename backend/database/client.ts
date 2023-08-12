import { createKysely } from '@vercel/postgres-kysely';
import { ChampionshipsTable, Database, MatchsTable, TeamsTable } from './types';

const db = createKysely<Database>();

export function getUser(discordId: bigint) {
    return db
        .selectFrom('users')
        .selectAll()
        .where('discordId', '=', discordId)
        .executeTakeFirst();
}

export async function createUser(data: {
    key: string,
    discordId: bigint,
    discordName: string,
    discordAvatar: string
}) {
    return (await db
        .insertInto('users')
        .values(data)
        .execute())[0];
}

export async function databaseAddChampionship(id: string, data: Omit<ChampionshipsTable, 'id'>) {
    await db
        .insertInto("championships")
        .values(data)
        .execute();

    await db
        .schema
        .createTable(`cham-${id}-teams`)
        .addColumn('id', 'serial', (col) => col.primaryKey())
        .addColumn("name", 'varchar')
        .addColumn("logo", 'varchar')
        .addColumn("managerId", 'bigint', (col) => col.notNull())
        .addColumn("playersIds", 'json')
        .addColumn("victory", 'integer')
        .addColumn("defeat", 'integer')
        .execute();

    await db
        .schema
        .createTable(`cham-${id}-matchs`)
        .addColumn("round", 'integer', (col) => col.notNull())
        .addColumn("team1", 'integer', (col) => col.notNull())
        .addColumn("team2", 'integer', (col) => col.notNull())
        .execute();
}
export async function GetChampionships() {
    return await db.selectFrom("championships")
        .selectAll()
        .execute();
}
export async function GetChampionship(id: number) {
    return await db.selectFrom("championships")
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst();
}
export async function GetChampionshipPerCategory(id: bigint) {
    return await db.selectFrom("championships")
        .selectAll()
        .where('channelCategory', '=', id)
        .executeTakeFirst();
}
export async function getTeams(championshipId:string) {
    return await db.selectFrom(`cham-${championshipId}-teams`)
        .selectAll()
        .execute();
}
export async function createTeam(championshipId: string, data: Omit<TeamsTable, 'id'>) {
    return await db
        .insertInto(`cham-${championshipId}-teams`)
        .values(data)
        .execute();
}

export async function getTeamByManager(managerId:string, championshipId:string) {
    return await db.selectFrom(`cham-${championshipId}-teams`)
        .selectAll()
        .where('managerId', '=', BigInt(managerId))
        .executeTakeFirst();
}

export async function createMatch(championshipId: string, data: Omit<MatchsTable, 'id'>) {
    return await db
        .insertInto(`cham-${championshipId}-matchs`)
        .values(data)
        .execute();
}