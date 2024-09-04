import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { getUserProjects } from '@/lib/actions';

export async function GET(request: NextRequest) {
    try {
        const session = await getCurrentUser();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const projects = await getUserProjects(session.user.id);

        return NextResponse.json({ projects });
    } catch (error) {
        console.error('Error fetching user projects:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}