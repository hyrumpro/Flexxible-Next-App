import { config, connector, graph, auth } from '@grafbase/sdk'

const g = graph.Standalone()

const pg = connector.Postgres('pg', {
    url: g.env('DATABASE_URL')
})



g.datasource(pg)



const Project = g.type('Project', {
    id: g.id(),
    title: g.string(),
    description: g.string().optional(),
    image: g.url(),
    liveSiteUrl: g.string().optional(),
    githubUrl: g.url().optional(),
    category: g.string(),
    createdBy: g.ref('User')
})

const User = g.type('User', {
    id: g.id(),
    name: g.string(),
    email: g.email(),
    avatarUrl: g.url(),
    description: g.string().optional(),
    githubUrl: g.url().optional(),
    linkedinUrl: g.url().optional(),
    projects: g.ref(Project).optional().list()
})


g.mutation('updateUser', {
    args: {
        id: g.id(),
        name: g.string().optional(),
        description: g.string().optional(),
        githubUrl: g.url().optional(),
        linkedinUrl: g.url().optional(),
    },
    returns: g.ref(User),
    resolver: 'updateUser',
})



g.query('getUser', {
    args: { id: g.int() },
    returns: g.ref(User).optional(),
    resolver: 'getUser',
})

g.query('getProjects', {
    args: {
        category: g.string().optional(),
        first: g.int().default(10),
        after: g.string().optional()
    },
    returns: g.ref(Project).list(),
    resolver: 'getProjects',
})


g.query('getProjectsByCreator', {
    args: { id: g.string() },
    returns: g.ref(Project).list().optional(),
    resolver: 'getProjectsByUser',
});


g.query('getProjectDetails', {
    args: { id: g.string() },
    returns: g.ref(Project).optional(),
    resolver: 'getProjectDetails',
})

// Mutations
g.mutation('createUser', {
    args: {
        name: g.string(),
        email: g.string(),
        avatarUrl: g.string()
    },
    returns: g.ref(User),
    resolver: 'createUser',
})

g.mutation('createProject', {
    args: {
        title: g.string(),
        description: g.string().optional(),
        image: g.string(),
        liveSiteUrl: g.string().optional(),
        githubUrl: g.string().optional(),
        category: g.string(),
        creatorId: g.string()
    },
    returns: g.ref(Project),
    resolver: 'createProject',
})


g.mutation('updateProject', {
    args: {
        id: g.string(),
        title: g.string().optional(),
        description: g.string().optional(),
        image: g.string().optional(),
        liveSiteUrl: g.string().optional(),
        githubUrl: g.string().optional(),
        category: g.string().optional(),
    },
    returns: g.ref('Project'),
    resolver: 'updateProject',
})

g.mutation('deleteProject', {
    args: {
        id: g.string(),
    },
    returns: g.boolean(),
    resolver: 'deleteProject',
})


const jwt = auth.JWT({
   issuer: "grafbase",
   secret: g.env("NEXTAUTH_SECRET")
})


export default config({
    graph: g,
    cache: {
        rules: [
            {
                types: ['Query'],
                maxAge: 60,
                staleWhileRevalidate: 60,
            },
        ],
    },
    auth: {
        providers: [jwt],
        rules: (rules) => rules.private(),
    },
});