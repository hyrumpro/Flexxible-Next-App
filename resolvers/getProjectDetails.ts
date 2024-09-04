import { GraphQLError } from 'graphql';
import { pool } from '@/lib/db';

type GetProjectDetailsArgs = {
    id: string;
};

export default async function getProjectDetails(_: any, args: GetProjectDetailsArgs) {
    const { id } = args;

    if (!id) {
        throw new GraphQLError('Project ID is required');
    }

    const client = await pool.connect();
    try {
        const query = `
            SELECT p.*, u.id as user_id, u.name, u.email, u.avatar_url
            FROM projects p
            JOIN users u ON p.created_by = u.id
            WHERE p.id = $1
        `;
        const result = await client.query(query, [id]);

        if (result.rowCount === 0) {
            return null;
        }

        const project = result.rows[0];
        return {
            id: project.id.toString(),
            title: project.title,
            description: project.description,
            image: project.image,
            liveSiteUrl: project.live_site_url,
            githubUrl: project.github_url,
            category: project.category,
            createdBy: {
                id: project.user_id.toString(),
                name: project.name,
                email: project.email,
                avatarUrl: project.avatar_url
            }
        };
    } catch (error) {
        console.error('Error in getProjectDetails resolver:', error);
        throw new GraphQLError('An error occurred while fetching the project details');
    } finally {
        client.release();
    }
}