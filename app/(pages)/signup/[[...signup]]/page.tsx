import { SignUp } from '@clerk/nextjs'
import { useSearchParams, redirect } from 'next/navigation'

export default function Page() {
    const searchParams = useSearchParams()
    const clerkTicket = searchParams.get('__clerk_ticket')
    if (!clerkTicket) {
        redirect('/signin')
        return
    }

    return (
        <div className="signmodule flex w-fit mx-auto my-10">
            <SignUp />
        </div>
    )
}
