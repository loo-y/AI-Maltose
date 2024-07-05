import SectionWrapper from "../../SectionWrapper"
import NavLink from "../NavLink"
// import ctaImage from "../../../public/cta-image.jpg"
// import Image from "next/image"

const CTA = () => {
    return (
        <SectionWrapper id="cta" className="pb-0">
            <div className="custom-screen">
                <div className="items-center gap-x-12 lg:flex">
                    <div className="flex-1 sm:hidden lg:block">
                        {/* <Image src={ctaImage} className="rounded-lg md:max-w-lg" alt="Start Your AI Journey" /> */}
                    </div>
                    <div className="max-w-xl mt-6 md:mt-0 lg:max-w-2xl">
                        <h2 className="text-gray-800 text-3xl font-semibold sm:text-4xl">
                            Start Your AI Journey
                        </h2>
                        <p className="mt-3 text-gray-600">
                        We offer a diverse AI chat experience, featuring top-tier dialogue models like ChatGPT, Claude, Gemini, and advanced AI art generation capabilities. Whether for daily communication, creative inspiration, or professional consultation, you'll find the perfect AI assistant here.
                        </p>
                        <NavLink
                            href="/chat"
                            className="inline-block mt-4 font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800"
                        >
                            Get started
                        </NavLink>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    )
}

export default CTA