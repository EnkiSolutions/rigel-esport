import { createKysely } from "@vercel/postgres-kysely";
import { Database, EntityType, RelationType } from "./types";

const db = createKysely<Database>();

export async function addObject(namespace: EntityType, data: any) {
    try {
        const result = await db
            .insertInto(namespace)
            .values(data)
            .returning('id')
            .execute();
        return { status: 201, data: result[0] };
    } catch (error) {
        return { status: 500, error: 'Failed to add object' };
    }
}

export async function listObjects(namespace: EntityType) {
    try {
        const objects = await db
            .selectFrom(namespace)
            .where('deleted', '=', false)
            .execute();
        return { status: 200, data: objects };
    } catch (error) {
        return { status: 500, error: 'Failed to list objects' };
    }
}

export async function getObject(namespace: EntityType, id: bigint) {
    try {
        const object = await db
            .selectFrom(namespace)
            .where('id', '=', id)
            .execute();
        return { status: 200, data: object[0] };
    } catch (error) {
        return { status: 500, error: 'Failed to get object' };
    }
}

export async function updateObject(namespace: EntityType, id: bigint, data: any) {
    try {
        await db
            .updateTable(namespace)
            .set(data)
            .where('id', '=', id)
            .executeTakeFirst();
        return { status: 200, message: 'Object updated successfully' };
    } catch (error) {
        return { status: 500, error: 'Failed to update object' };
    }
}

export async function deleteObject(namespace: EntityType, id: bigint) {
    try {
        await db
            .updateTable(namespace)
            .set({ deleted: true })
            .where('id', '=', id)
            .executeTakeFirst();
        return { status: 200, message: 'Object marked as deleted successfully' };
    } catch (error) {
        return { status: 500, error: 'Failed to mark object as deleted' };
    }
}

export async function addRelation(relationType: string, data: any) {
    try {
        const result = await db
            .insertInto(`r_${relationType}`)
            .values(data)
            .returning('id')
            .execute();
        return { status: 201, data: result[0] };
    } catch (error) {
        return { status: 500, error: 'Failed to add relation' };
    }
}

export async function listRelations(relationType: string, objectId: bigint) {
    try {
        const relations = await db
            .selectFrom(`r_${relationType}`)
            .where('object_id', '=', objectId)
            .execute();
        return { status: 200, data: relations };
    } catch (error) {
        return { status: 500, error: 'Failed to list relations' };
    }
}

export async function deleteRelation(relationType: string, relationId: bigint) {
    try {
        await db
            .updateTable(`r_${relationType}`)
            .set({ deleted: true })
            .where('id', '=', relationId)
            .executeTakeFirst();
        return { status: 200, message: 'Relation marked as deleted successfully' };
    } catch (error) {
        return { status: 500, error: 'Failed to mark relation as deleted' };
    }
}

export async function createZookie(namespace: string, referenceId: number, operation: string) {
    try {
        const oldData = await db
            .selectFrom(namespace)
            .where('id', '=', referenceId)
            .execute();
        const result = await db.insertInto('zookies').values({
            reference_id: referenceId,
            namespace,
            operation,
            modified_at: new Date(),
            old_data: oldData[0]
        }).returning('zookie_id').execute();
        return { status: 201, data: result[0] };
    } catch (error) {
        return { status: 500, error: 'Failed to create zookie' };
    }
}

export async function getZookiesForReference(namespace: string, referenceId: number) {
    try {
        const zookies = await db.selectFrom('zookies')
            .where('namespace', '=', namespace)
            .where('reference_id', '=', referenceId)
            .orderBy('modified_at', 'desc')
            .execute();
        return { status: 200, data: zookies };
    } catch (error) {
        return { status: 500, error: 'Failed to retrieve zookies' };
    }
}

export async function undo(namespace: EntityType | RelationType, referenceId: number) {
    try {
        const latestZookie = await db.selectFrom('zookies')
            .where('namespace', '=', namespace)
            .where('reference_id', '=', referenceId)
            .orderBy('modified_at', 'desc')
            .limit(1)
            .execute();

        if (!latestZookie[0]) {
            return { status: 404, error: 'No history found for this reference' };
        }

        await db
            .updateTable(namespace)
            .set(latestZookie[0].old_data)
            .where('id', '=', referenceId)
            .executeTakeFirst();

        return { status: 200, message: 'Undo operation successful' };
    } catch (error) {
        return { status: 500, error: 'Failed to undo operation' };
    }
}