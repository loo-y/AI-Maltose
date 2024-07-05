import SectionWrapper from "../../SectionWrapper"
// import wordpress from "../../../public/icons/wordpress.svg"
// import nextjs from "../../../public/icons/nextjs.svg"
// import tailwind from "../../../public/icons/tailwind.svg"
import _ from 'lodash'
const ToolKit = () => {

    const features = [
        {
            // icon: wordpress,
            icon: '',
            title: "Wordpress",
            desc: "WordPress is an open-source content management system (CMS)."
        },
        {
            // icon: nextjs,
            title: "Next.js",
            desc: "Next.js is a React framework that gives you building blocks to create web apps."
        },
        {
            // icon: tailwind,
            title: "Tailwind CSS",
            desc: "Tailwind CSS is basically a utility-first CSS framework for rapidly building UIs."
        },
    ]

    return (
        <SectionWrapper>
            <div id="toolkit" className="max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8">
                <div className="max-w-2xl mx-auto space-y-3 sm:text-center">
                    <h2 className="text-gray-800 text-3xl font-semibold sm:text-4xl">
                        Work with the best toolkit
                    </h2>
                    <p>
                        These are a few of our favourite things
                    </p>
                </div>
                <div className="mt-12">
                    <ul className="grid gap-y-8 gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
                        {
                            _.map(features, (item, idx) => (
                                <li key={idx} className="flex gap-x-4">
                                    <div className="flex-none w-12 h-12 gradient-border rounded-full flex items-center justify-center">
                                        <img src={item?.icon || ''} alt={item.title} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg text-gray-800 font-semibold">
                                            {item.title}
                                        </h4>
                                        <p className="mt-3">
                                            {item.desc}
                                        </p>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </SectionWrapper>
    )
}

export default ToolKit