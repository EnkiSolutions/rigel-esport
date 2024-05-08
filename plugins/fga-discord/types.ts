import { Database as FGADatabase } from "../rbac/types"

export interface DiscordUsersTable {
    id: bigint;
    userId: bigint;
}

export interface Database extends FGADatabase {
    discordUsers: DiscordUsersTable;
}