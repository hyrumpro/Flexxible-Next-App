import { Pool, PoolClient, QueryResult } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export async function query(text: string, params: any[] = []): Promise<QueryResult> {
    const client: PoolClient = await pool.connect();
    try {
        const result: QueryResult = await client.query(text, params);
        return result;
    } finally {
        client.release();
    }
}

export { pool };

