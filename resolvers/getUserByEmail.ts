import { GraphQLError } from 'graphql';
import { pool } from '@/lib/db';

type Context = {
    db: any;
};

type GetUserByEmailArgs = {
    email: string;
};

export default async function getUserByEmail(_: any, args: GetUserByEmailArgs, context: Context) {
    const client = await pool.connect();
    try {
        console.log('getUserByEmail resolver called with email:', args.email);
        const { email } = args;

        if (!email || typeof email !== 'string') {
            throw new GraphQLError('Invalid or missing email', {
                extensions: { code: 'BAD_USER_INPUT' },
            });
        }

        const query = `
            SELECT id, name, email, avatar_url, description, github_url, linkedin_url
            FROM users
            WHERE email = $1
        `;
        const res = await client.query(query, [email]);

        if (res.rows.length === 0) {
            console.log('User not found');
            return null;
        }

        const user = res.rows[0];

        const mappedUser = {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            avatarUrl: user.avatar_url,
            description: user.description,
            githubUrl: user.github_url,
            linkedinUrl: user.linkedin_url,
        };

        console.log('Mapped user object:', mappedUser);

        return mappedUser;

    } catch (error) {
        console.error('Error in getUserByEmail resolver:', error);
        throw new GraphQLError('An error occurred while fetching the user', {
            extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
    } finally {
        client.release();
    }
}