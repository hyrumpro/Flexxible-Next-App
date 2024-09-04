import { GraphQLError } from 'graphql';
import { pool } from '@/lib/db';

type CreateUserArgs = {
    name: string;
    email: string;
    avatarUrl: string;
};

export default async function createUser(_: any, args: CreateUserArgs) {
    const { name, email, avatarUrl } = args;

    // Validate input
    if (name.length < 2 || name.length > 100) {
        throw new GraphQLError('Name must be between 2 and 100 characters');
    }

    if (!email.includes('@')) {
        throw new GraphQLError('Invalid email address');
    }

    const client = await pool.connect();
    try {
        const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            throw new GraphQLError('User with this email already exists');
        }

        const result = await client.query(
            'INSERT INTO users (name, email, avatar_url) VALUES ($1, $2, $3) RETURNING *',
            [name, email, avatarUrl]
        );

        const newUser = result.rows[0];

        newUser.id = newUser.id.toString();

        return newUser;
    } catch (error) {
        console.error('Error in createUser resolver:', error);
        throw new GraphQLError('An error occurred while creating the user');
    } finally {
        client.release();
    }
}

