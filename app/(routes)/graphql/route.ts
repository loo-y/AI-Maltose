import { createSchema, createYoga } from 'graphql-yoga'
import { schema } from './schema'
import { useDeferStream } from '@graphql-yoga/plugin-defer-stream'
import { auth, currentUser } from '@clerk/nextjs/server'

// vercel edge runtime
export const runtime = 'edge'

const { handleRequest } = createYoga({
    schema,
    context: async () => {
        const { userId } = auth()
        let emailAddres = ''
        if (userId) {
            const user = await currentUser()
            console.log(`user`, user)
            emailAddres = user?.emailAddresses?.[0]?.emailAddress || ''
        }
        return { userId, emailAddres }
    },
    plugins: [useDeferStream()],
    // While using Next.js file convention for routing, we need to configure Yoga to use the correct endpoint
    graphqlEndpoint: '/graphql',
    // Yoga needs to know how to create a valid Next response
    fetchAPI: { Response },
})

export { handleRequest as GET, handleRequest as POST, handleRequest as OPTIONS }
