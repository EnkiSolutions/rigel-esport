import { ColumnType, DataTypeExpression, Generated } from 'kysely';

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface EntityRow {
    id: Generated<bigint>;
    deleted: boolean;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
}

export interface RelationRow {
    id: Generated<bigint>;
    object_id: bigint;
    related_object_id: bigint;
    deleted: boolean;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
}

export type EntityType = `e_${string}`;
export type RelationType = `r_${string}`;

export interface Database {
    [key: EntityType]: EntityRow;
    [key: RelationType]: RelationRow;
}

type EntityTable = {
    tableName: string;
    columns: { [key: string] : DataTypeExpression };
}