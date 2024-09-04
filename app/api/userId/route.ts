import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';

export async function GET(request: NextRequest) {
    try {
        const session = await getCurrentUser();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;

        return NextResponse.json({ userId });
    } catch (error) {
        console.error('Error fetching user ID:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}