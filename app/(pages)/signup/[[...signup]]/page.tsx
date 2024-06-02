import { SignUp } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className="signmodule flex w-fit mx-auto my-10">
            <SignUp />
        </div>
    )
}
