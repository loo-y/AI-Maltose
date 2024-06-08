import { redirect } from 'next/navigation'
import { auth, currentUser } from '@clerk/nextjs/server'
import { createUser } from '@/app/(routes)/graphql/dal/Supabase/queries'

export default async function Page({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const { userId } = auth()
    console.log(`page userId`, userId)
    if (userId) {
        const user = await currentUser()
        const { username, emailAddresses } = user || {}
        const userInfo = await createUser({
            username: username || '',
            userid: userId,
            email: emailAddresses?.[0]?.emailAddress || '',
            balance: 100,
        })
    }

    redirect('/')
}
