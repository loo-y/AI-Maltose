import { SignIn } from '@clerk/nextjs'

export const runtime = 'edge'

export default function Page() {
    return (
        <div className="signmodule flex w-fit mx-auto my-10">
            <SignIn />
        </div>
    )
}
