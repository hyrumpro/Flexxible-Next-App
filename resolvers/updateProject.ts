import { GraphQLError } from 'graphql';
import { pool } from '@/lib/db';

type UpdateProjectArgs = {
    id: string;
    title?: string;
    description?: string;
    image?: string;
    liveSiteUrl?: string;
    githubUrl?: string;
    category?: string;
};

export default async function updateProject(_: any, args: UpdateProjectArgs) {
    const { id, title, description, image, liveSiteUrl, githubUrl, category } = args;

    // Input validation
    if (!id) {
        throw new GraphQLError('Project ID is required');
    }

    if (title && (title.length < 3 || title.length > 100)) {
        throw new GraphQLError('Title must be between 3 and 100 characters');
    }

    if (description && description.length > 1000) {
        throw new GraphQLError('Description must not exceed 1000 characters');
    }

    const client = await pool.connect();
    try {
        // Check if the project exists
        const projectCheck = await client.query('SELECT id FROM projects WHERE id = $1', [id]);
        if (projectCheck.rowCount === 0) {
            throw new GraphQLError('Project not found');
        }

        // Build the update query dynamically
        let updateQuery = 'UPDATE projects SET ';
        const updateValues = [];
        let paramCount = 1;

        if (title) {
            updateQuery += `title = $${paramCount}, `;
            updateValues.push(title);
            paramCount++;
        }
        if (description !== undefined) {
            updateQuery += `description = $${paramCount}, `;
            updateValues.push(description);
            paramCount++;
        }
        if (image) {
            updateQuery += `image = $${paramCount}, `;
            updateValues.push(image);
            paramCount++;
        }
        if (liveSiteUrl) {
            updateQuery += `live_site_url = $${paramCount}, `;
            updateValues.push(liveSiteUrl);
            paramCount++;
        }
        if (githubUrl !== undefined) {
            updateQuery += `github_url = $${paramCount}, `;
            updateValues.push(githubUrl);
            paramCount++;
        }
        if (category) {
            updateQuery += `category = $${paramCount}, `;
            updateValues.push(category);
            paramCount++;
        }

        // Remove the trailing comma and space
        updateQuery = updateQuery.slice(0, -2);

        updateQuery += ` WHERE id = $${paramCount} RETURNING *`;
        updateValues.push(id);

        const result = await client.query(updateQuery, updateValues);

        if (result.rowCount === 1) {
            const updatedProject = result.rows[0];
            updatedProject.id = updatedProject.id.toString();
            return updatedProject;
        } else {
            throw new GraphQLError('Failed to update project');
        }
    } catch (error) {
        console.error('Error in updateProject resolver:', error);
        throw new GraphQLError('An error occurred while updating the project');
    } finally {
        client.release();
    }
}