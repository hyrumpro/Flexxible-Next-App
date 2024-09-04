import { GraphQLError } from 'graphql';
import { pool } from '@/lib/db';

type CreateProjectArgs = {
    title: string;
    description?: string;
    image: string;
    liveSiteUrl: string;
    githubUrl?: string;
    category: string;
    creatorId: string;
};

export default async function createProject(_: any, args: CreateProjectArgs) {
    const { title, description, image, liveSiteUrl, githubUrl, category, creatorId } = args;

    // Input validation
    if (title.length < 3 || title.length > 100) {
        throw new GraphQLError('Title must be between 3 and 100 characters');
    }

    if (description && description.length > 1000) {
        throw new GraphQLError('Description must not exceed 1000 characters');
    }

    if (!liveSiteUrl) {
        throw new GraphQLError('Live Site URL is required.');
    }

    if (!category) {
        throw new GraphQLError('Category is required.');
    }

    const client = await pool.connect();
    try {
        // Verify that the creatorId exists in the users table
        const userCheck = await client.query('SELECT id FROM users WHERE id = $1', [creatorId]);
        if (userCheck.rowCount === 0) {
            throw new GraphQLError('Creator ID does not exist.');
        }

        const result = await client.query(
            'INSERT INTO projects (title, description, image, live_site_url, github_url, category, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [title, description, image, liveSiteUrl, githubUrl, category, creatorId]
        );

        const newProject = result.rows[0];
        newProject.id = newProject.id.toString();

        return newProject;
    } catch (error) {
        console.error('Error in createProject resolver:', error);
        throw new GraphQLError('An error occurred while creating the project.');
    } finally {
        client.release();
    }
}

