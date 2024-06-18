import { createSchema, createYoga, useExecutionCancellation } from 'graphql-yoga'
import { schema } from './schema'
import { useDeferStream } from '@graphql-yoga/plugin-defer-stream'
import { auth, currentUser } from '@clerk/nextjs/server'
import { getUser, createUser } from './dal/Supabase/queries'
import _ from 'lodash'
// vercel edge runtime
export const runtime = 'edge'

const { handleRequest } = createYoga({
    schema,
    context: async () => {
        const { userId } = auth()

        let emailAddres = '',
            userName = '',
            balance = 0
        if (userId) {
            const user = await currentUser()
            console.log(`user`, user)
            emailAddres = user?.emailAddresses?.[0]?.emailAddress || ''
            userName = user?.username || ''

            const userInfo = await getUser({
                userid: userId,
            })
            balance = userInfo?.balance || balance
        }

        return { userId, emailAddres, userName, balance }
    },
    plugins: [useDeferStream(), useExecutionCancellation()],
    // While using Next.js file convention for routing, we need to configure Yoga to use the correct endpoint
    graphqlEndpoint: '/graphql',
    // Yoga needs to know how to create a valid Next response
    fetchAPI: { Response },
})

export { handleRequest as GET, handleRequest as POST, handleRequest as OPTIONS }
