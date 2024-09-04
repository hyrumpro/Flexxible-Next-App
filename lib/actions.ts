import { GraphQLClient } from 'graphql-request';

const isProduction = process.env.NODE_ENV === 'production';
const apiUrl = isProduction
    ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL || ''
    : 'http://127.0.0.1:4000/graphql';



const token = process.env.NEXTAUTH_SECRET || 'default-token';

const client = new GraphQLClient(apiUrl, {
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': token,
    },
});

// Define types for user and project inputs
type UserInput = {
    name: string;
    email: string;
    avatarUrl: string;
};

type ProjectInput = {
    title: string;
    description?: string;
    image: string;
    liveSiteUrl: string;
    githubUrl?: string;
    category: string;
    creatorId: string;
};

// Define types for GraphQL responses
interface GetUserResponse {
    getUser: {
        id: string;
        name: string;
        email: string;
        avatarUrl: string;
        description?: string;
        githubUrl?: string;
        linkedinUrl?: string;
    };
}

interface CreateUserResponse {
    createUser: {
        id: string;
        name: string;
        email: string;
        avatarUrl: string;
    };
}

interface CreateProjectResponse {
    createProject: {
        id: string;
        title: string;
        description?: string;
        image: string;
        liveSiteUrl: string;
        githubUrl?: string;
        category: string;
        createdBy: {
            id: string;
        };
    };
}

interface GetProjectsResponse {
    getProjects: {
        pageInfo: {
            hasNextPage: boolean;
            hasPreviousPage: boolean;
            startCursor: string;
            endCursor: string;
        };
        edges: {
            node: {
                id: string;
                title: string;
                description?: string;
                image: string;
                liveSiteUrl: string;
                githubUrl?: string;
                category: string;
                createdBy: {
                    id: string;
                    name: string;
                    email: string;
                    avatarUrl: string;
                };
            };
        }[];
    };
}



// Define types for GraphQL responses
interface CreateProjectResponse {
    createProject: {
        id: string;
        title: string;
        description?: string;
        image: string;
        liveSiteUrl: string;
        githubUrl?: string;
        category: string;
        createdBy: {
            id: string;
        };
    };
}

interface GetProjectDetailsResponse {
    getProjects: {
        id: string;
        title: string;
        description?: string;
        image: string;
        liveSiteUrl: string;
        githubUrl?: string;
        category: string;
        createdBy: {
            id: string;
            name: string;
            email: string;
            avatarUrl: string;
        };
    }[];
}

interface GetUserProjectsResponse {
    getProjectsByCreator: {
        id: string;
        title: string;
        description?: string;
        image: string;
        liveSiteUrl: string;
        githubUrl?: string;
        category: string;
    }[];
}


interface UpdateProjectResponse {
    updateProject: Project;
}

interface DeleteProjectResponse {
    deleteProject: boolean;
}


// Utility function to make GraphQL requests
const makeGraphQLRequest = async <T>(query: string, variables: Record<string, any> = {}): Promise<T> => {
    try {
        return await client.request<T>(query, variables);
    } catch (error) {
        console.error('GraphQL Request Error:', error);
        throw new Error('Failed to fetch data from the server.');
    }
};

// Fetch user by email
export const getUser = async (email: string) => {
    const query = `
    query GetUser($email: String!) {
      getUser(email: $email) {
        id
        name
        email
        avatarUrl
        description
        githubUrl
        linkedinUrl
      }
    }
  `;

    const result = await makeGraphQLRequest<GetUserResponse>(query, { email });
    return result.getUser;
};

// Create a new user
export const createUser = async (user: UserInput) => {
    const mutation = `
    mutation CreateUser($name: String!, $email: String!, $avatarUrl: String!) {
      createUser(name: $name, email: $email, avatarUrl: $avatarUrl) {
        id
        name
        email
        avatarUrl
      }
    }
  `;

    const result = await makeGraphQLRequest<CreateUserResponse>(mutation, user);
    return result.createUser;
};

export const createProject = async (project: ProjectInput) => {
    const mutation = `
    mutation CreateProject($title: String!, $description: String, $image: String!, $liveSiteUrl: String!, $githubUrl: String, $category: String!, $creatorId: String!) {
      createProject(title: $title, description: $description, image: $image, liveSiteUrl: $liveSiteUrl, githubUrl: $githubUrl, category: $category, creatorId: $creatorId) {
        id
        title
        description
        image
        liveSiteUrl
        githubUrl
        category
      }
    }
  `;

    try {
        const result = await client.request<CreateProjectResponse>(mutation, project);
        return result.createProject;
    } catch (error) {
        console.error('Error creating project:', error);
        throw error;
    }
};

export const getProjects = async (category?: string, first: number = 10, after?: string) => {
    const query = `
    query GetProjects($category: String, $first: Int!, $after: String) {
      getProjects(category: $category, first: $first, after: $after) {
        id
        title
        description
        image
        liveSiteUrl
        githubUrl
        category
        createdBy {
          id
          name
          email
          avatarUrl
        }
      }
    }
  `;

    const variables = { category, first, after };

    try {
        const result = await client.request<GetProjectsResponse>(query, variables);
        return result.getProjects;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};

export const getProjectDetails = async (id: string) => {
    const query = `
    query GetProjectDetails($id: String!) {
      getProjectDetails(id: $id) {
        id
        title
        description
        image
        liveSiteUrl
        githubUrl
        category
        createdBy {
          id
          name
          email
          avatarUrl
        }
      }
    }
  `;

    try {
        const result = await client.request<{ getProjectDetails: Project }>(query, { id });
        return result.getProjectDetails;
    } catch (error) {
        console.error('Error fetching project details:', error);
        throw error;
    }
};

export const getUserProjects = async (creatorId: string) => {
    const query = `
    query GetProjectsByCreator($id: String!) {
      getProjectsByCreator(id: $id) {
        id
        title
        description
        image
        liveSiteUrl
        githubUrl
        category
      }
    }
  `;

    const variables = { id: creatorId };

    try {
        const result = await client.request<GetUserProjectsResponse>(query, variables);
        return result.getProjectsByCreator || [];
    } catch (error) {
        console.error('Error fetching user projects:', error);
        throw error;
    }
};


export const editProject = async (project: Partial<ProjectInput> & { id: string }) => {
    const mutation = `
    mutation UpdateProject($id: String!, $title: String, $description: String, $image: String, $liveSiteUrl: String, $githubUrl: String, $category: String) {
      updateProject(id: $id, title: $title, description: $description, image: $image, liveSiteUrl: $liveSiteUrl, githubUrl: $githubUrl, category: $category) {
        id
        title
        description
        image
        liveSiteUrl
        githubUrl
        category
      }
    }
  `;

    try {
        const result = await client.request<{ updateProject: Project }>(mutation, project);
        return result.updateProject;
    } catch (error) {
        console.error('Error updating project:', error);
        if (error.response?.errors) {
            throw new Error(error.response.errors[0].message);
        }
        throw new Error('An error occurred while updating the project');
    }
};

export const deleteProject = async (id: string) => {
    const mutation = `
    mutation DeleteProject($id: String!) {
      deleteProject(id: $id)
    }
  `;

    try {
        const result = await client.request<DeleteProjectResponse>(mutation, { id });
        return result.deleteProject;
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
};