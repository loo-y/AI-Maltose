import SectionWrapper from "../../SectionWrapper"
import NavLink from "../NavLink"

const FooterCTA = () => (
    <SectionWrapper>
        <div className="custom-screen">
            <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-gray-800 text-3xl font-semibold sm:text-4xl">
                    Get started with Sheepaw AI today
                </h2>
                <p className="mt-3 text-gray-600">
                    {`Start Your AI Journey, Reshape Your Work and Life with AI.`}
                </p>
                <NavLink
                    href="/hairstyle"
                    className="mt-4 inline-block font-medium text-sm text-white bg-gray-800 hover:bg-gray-600 active:bg-gray-900"
                >
                    Start painting
                </NavLink>
            </div>
        </div>
    </SectionWrapper>
)

export default FooterCTA