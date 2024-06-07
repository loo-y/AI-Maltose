import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className="signmodule flex w-fit mx-auto my-10">
            <SignIn
                appearance={{
                    elements: {
                        footerAction: { display: 'none' },
                    },
                }}
            />
        </div>
    )
}
