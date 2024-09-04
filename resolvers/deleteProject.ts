import { GraphQLError } from 'graphql';
import { pool } from '@/lib/db';

type DeleteProjectArgs = {
    id: string;
};

export default async function deleteProject(_: any, args: DeleteProjectArgs) {
    const { id } = args;

    // Input validation
    if (!id) {
        throw new GraphQLError('Project ID is required');
    }

    const client = await pool.connect();
    try {
        // Check if the project exists
        const projectCheck = await client.query('SELECT id FROM projects WHERE id = $1', [id]);
        if (projectCheck.rowCount === 0) {
            throw new GraphQLError('Project not found');
        }

        // Delete the project
        const result = await client.query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);

        if (result.rowCount === 1) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error in deleteProject resolver:', error);
        throw new GraphQLError('An error occurred while deleting the project');
    } finally {
        client.release();
    }
}