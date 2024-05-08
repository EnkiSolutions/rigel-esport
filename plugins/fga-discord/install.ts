import { Kysely } from "kysely";

export default async function (db: Kysely<any>) {
    await db
        .schema
        .createTable("discordUsers")
        .addColumn('id', 'bigint', (col) => col.primaryKey())
        .addColumn('userId', 'integer', (col) => col.notNull())
        .execute();
}