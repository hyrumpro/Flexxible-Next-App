import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { QueryResult } from 'pg';

export async function GET() {
    try {
        const result: QueryResult = await query('SELECT NOW()');
        return NextResponse.json({
            message: 'Database connection successful',
            serverTime: result.rows[0].now
        });
    } catch (err) {
        console.error('Error connecting to the database:', err);
        return NextResponse.json(
            { error: 'Failed to connect to the database' },
            { status: 500 }
        );
    }
}