import { GraphQLError } from 'graphql';
import { pool } from '@/lib/db';

type Context = {
    db: any;
};

type GetProjectsArgs = {
    category?: string;
    first: number;
    after?: string;
};

export default async function getProjects(_: any, args: GetProjectsArgs, context: Context) {
    const { category, first, after } = args;

    // Validate input
    if (first <= 0) {
        throw new GraphQLError('The "first" argument must be greater than 0');
    }

    const client = await pool.connect();
    try {
        console.log('getProjects resolver called with args:', args);

        // Construct the query with a join to fetch createdBy details
        let query = `
            SELECT 
                projects.*, 
                users.id AS user_id, 
                users.name AS user_name, 
                users.email AS user_email, 
                users.avatar_url AS user_avatarUrl
            FROM projects
            LEFT JOIN users ON projects.created_by = users.id
        `;
        const queryParams: any[] = [];
        const conditions: string[] = [];

        if (category) {
            conditions.push('projects.category = $' + (queryParams.length + 1));
            queryParams.push(category);
        }

        if (after) {
            conditions.push('projects.id > $' + (queryParams.length + 1));
            queryParams.push(after);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY projects.id DESC LIMIT $' + (queryParams.length + 1);
        queryParams.push(first);

        console.log('Executing query:', query, 'with params:', queryParams);

        const result = await client.query(query, queryParams);

        const projects = result.rows.map(project => ({
            id: project.id.toString(),
            title: project.title,
            description: project.description || '',
            image: project.image,
            liveSiteUrl: project.live_site_url,
            githubUrl: project.github_url,
            category: project.category,
            createdBy: {
                id: project.user_id ? project.user_id.toString() : '',
                name: project.user_name || '',
                email: project.user_email || '',
                avatarUrl: project.user_avatarurl || 'https://example.com/default-avatar.jpg',
            },
        }));

        console.log('Projects fetched:', projects);
        return projects;

    } catch (error) {
        console.error('Error in getProjects resolver:', error);
        throw new GraphQLError('An error occurred while fetching the projects');
    } finally {
        client.release();
    }
}