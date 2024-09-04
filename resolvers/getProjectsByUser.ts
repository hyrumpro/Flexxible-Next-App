import { GraphQLError } from 'graphql';
import { pool } from '@/lib/db';

export default async function getProjectsByCreator(_: any, args: { id: string }, context: any) {
    const { id: creatorId } = args;

    const client = await pool.connect();
    try {
        const projectsQuery = 'SELECT * FROM projects WHERE created_by = $1';
        const projectsResult = await client.query(projectsQuery, [creatorId]);

        // Ensure all project IDs are strings
        const projects = projectsResult.rows.map(project => ({
            ...project,
            id: project.id.toString(),
        }));

        return projects;
    } catch (error) {
        console.error('Error in getProjectsByCreator resolver:', error);
        throw new GraphQLError('An error occurred while fetching the projects');
    } finally {
        client.release();
    }
}