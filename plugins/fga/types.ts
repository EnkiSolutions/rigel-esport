import { Database as EDatabase, EntityRow } from "../entities/types"

export interface UserRow extends EntityRow {
    name: string;
    avatar: string;
    key: string;
}

export interface Database extends EDatabase {
    e_users: UserRow;
}