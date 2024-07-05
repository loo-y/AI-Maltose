import MainPage from '@/app/(pages)/main/page'
import Landing from './(pages)/landing/page'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { AI_BOT_TYPE } from '@/app/shared/interface'
import { getAIBots } from '@/app/(routes)/graphql/dal/Supabase/queries'
import _ from 'lodash'

export default async function Home() {
    const { userId } = auth()
    console.log(`page userId`, userId)
    return <Landing userId={userId || ''} />
}
