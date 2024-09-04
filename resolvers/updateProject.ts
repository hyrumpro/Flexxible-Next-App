import { GraphQLError } from 'graphql';
import { pool } from '@/lib/db';

type FieldToColumnMap = {
    [key: string]: string;
};

const fieldToColumnMap: FieldToColumnMap = {
    liveSiteUrl: 'live_site_url',
    githubUrl: 'github_url'
};

export default async function updateProject(_: any, args: {
    id: string;
    title?: string;
    description?: string;
    image?: string;
    liveSiteUrl?: string;
    githubUrl?: string;
    category?: string;
}) {
    const { id, ...updateFields } = args;

    if (!id) {
        throw new GraphQLError('Project ID is required');
    }

    const client = await pool.connect();
    try {
        // Build the update query dynamically
        const updateEntries = Object.entries(updateFields)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => [fieldToColumnMap[key as keyof FieldToColumnMap] || key, value]);

        if (updateEntries.length === 0) {
            throw new GraphQLError('No fields to update');
        }

        const setClause = updateEntries.map(([key, _], index) => `"${key}" = $${index + 2}`).join(', ');
        const values = updateEntries.map(([_, value]) => value);

        const query = `
      UPDATE projects
      SET ${setClause}
      WHERE id = $1
      RETURNING *
    `;

        const result = await client.query(query, [id, ...values]);

        if (result.rowCount === 0) {
            throw new GraphQLError('Project not found');
        }

        const updatedProject = result.rows[0];
        return {
            id: updatedProject.id.toString(),
            title: updatedProject.title,
            description: updatedProject.description,
            image: updatedProject.image,
            liveSiteUrl: updatedProject.live_site_url,
            githubUrl: updatedProject.github_url,
            category: updatedProject.category,
        };
    } catch (error) {
        console.error('Error in updateProject resolver:', error);
        throw new GraphQLError('An error occurred while updating the project');
    } finally {
        client.release();
    }
}