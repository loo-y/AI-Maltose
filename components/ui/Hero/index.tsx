import NavLink from "../NavLink"

const Hero = () => (
    <section>
        <div className="custom-screen py-28 text-gray-600">
            <div className="space-y-5 max-w-4xl mx-auto text-center">
                <h1 className="text-4xl text-gray-800 font-extrabold mx-auto sm:text-6xl flex flex-col">
                <span>Explore the AI World, </span>
                <span>All-in-One Experience</span>
                </h1>
                <p className="max-w-xl mx-auto">
                From Conversation to Creation, Multiple AI Assistants to Power Your Imagination.
                </p>
                <div className="flex items-center justify-center gap-x-3 font-medium text-sm">
                    <NavLink
                        href="/chat"
                        className="text-white bg-gray-800 hover:bg-gray-600 active:bg-gray-900 "
                    >
                        Start chat
                    </NavLink>
                    {/* <NavLink
                        href="#cta"
                        className="text-gray-700 border hover:bg-gray-50"
                        scroll={false}
                    >
                        Learn more
                    </NavLink> */}
                </div>
            </div>
        </div>
    </section>
)

export default Hero