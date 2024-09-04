// resolvers/getUser.ts
import { GraphQLError } from 'graphql';
import { pool } from '@/lib/db';

type Context = {
    db: any;
};

type GetUserArgs = {
    email: string;
};

export default async function getUser(_: any, args: GetUserArgs, context: Context) {
    try {
        console.log('getUser resolver called with email:', args.email);
        const { email } = args;

        if (!email) {
            throw new GraphQLError('No email provided');
        }

        const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (res.rows.length === 0) {
            console.log('User not found');
            return null
        }

        const user = res.rows[0];

        user.id = user.id.toString();
        const mappedUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatar_url,
            description: user.description,
            linkedinUrl: user.linkedin_url,
        };

        console.log('Mapped user object:', mappedUser);

        return mappedUser;

    } catch (error) {
        console.error('Error in getUser resolver:', error);
        throw new GraphQLError('An error occurred while fetching the user');
    }
}


