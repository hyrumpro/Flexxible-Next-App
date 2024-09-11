import { GraphQLError } from 'graphql';
import { pool } from '@/lib/db';

type UpdateUserArgs = {
    id: string;
    name?: string;
    description?: string;
    githubUrl?: string;
    linkedinUrl?: string;
};

type FieldMapping = {
    [key: string]: string;
};

export default async function updateUser(_: any, args: UpdateUserArgs) {
    const { id, ...updateFields } = args;

    // Validate input
    if (updateFields.name && (updateFields.name.length < 2 || updateFields.name.length > 100)) {
        throw new GraphQLError('Name must be between 2 and 100 characters');
    }

    const client = await pool.connect();
    try {
        const fieldMapping: FieldMapping = {
            name: 'name',
            description: 'description',
            githubUrl: 'github_url',
            linkedinUrl: 'linkedin_url'
        };

        const setClause = Object.entries(updateFields)
            .map(([key, _], index) => `${fieldMapping[key as keyof typeof fieldMapping]} = $${index + 2}`)
            .join(', ');

        const values = [id, ...Object.values(updateFields)];

        const query = `
      UPDATE users 
      SET ${setClause}
      WHERE id = $1
      RETURNING id, name, email, avatar_url, description, github_url, linkedin_url
    `;

        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            throw new GraphQLError('User not found');
        }

        const updatedUser = result.rows[0];
        return {
            id: updatedUser.id.toString(),
            name: updatedUser.name,
            email: updatedUser.email,
            avatarUrl: updatedUser.avatar_url,
            description: updatedUser.description,
            githubUrl: updatedUser.github_url,
            linkedinUrl: updatedUser.linkedin_url
        };
    } catch (error) {
        console.error('Error in updateUser resolver:', error);
        throw new GraphQLError('An error occurred while updating the user');
    } finally {
        client.release();
    }
}