import { Kysely } from "kysely";
import { Plugin } from "vite";

export default async function (db: Kysely<any>) {
    await db
        .schema
        .createTable("users")
        .addColumn('id', 'serial', (col) => col.primaryKey())
        .addColumn('name', 'varchar(32)', (col) => col.notNull())
        .addColumn('avatar', 'varchar', (col) => col.notNull())
        .addColumn('key', 'varchar', (col) => col.notNull())
        .execute();
}

export function fgaPlugin(): Plugin | Plugin[] {
    
    return [];
}