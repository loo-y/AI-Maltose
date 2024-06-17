import { redirect } from 'next/navigation'
import { auth, currentUser } from '@clerk/nextjs/server'
import { createUser } from '@/app/(routes)/graphql/dal/Supabase/queries'

export default async function Page({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const { userId } = auth()
    console.log(`page after_signup userId`, userId)
    if (userId) {
        const user = await currentUser()
        const { username, emailAddresses } = user || {}
        console.log(`page after_signup username`, username, emailAddresses)
        const userInfo = await createUser({
            username: username || '',
            userid: userId,
            email: emailAddresses?.[0]?.emailAddress || '',
            balance: 100,
        })
        console.log(`page after_signup userInfo`, userInfo)
    }

    redirect('/')
}
