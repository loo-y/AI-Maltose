import _ from 'lodash'
export default function Pricing() {
    const pricingList = [
        {
            type: `Personal`,
            costText: `Free`,
            benifits: [
                `100 Credits`,
                `No Credits Required`,
                `No Credit Limit`,
                `Personal Assistant`
            ],
            isRecommend: false,
        },
        {
            type: `Startup`,
            costText: `$9`,
            benifits: [
                `All Free Features`,
                `Unlimited Conversations`,
                `No Credits Required`,
                `No Credit Limit`,
            ],
            //是否推荐
            isRecommend: true,
        },
        {
            type: `Business`,
            costText: `$29`,
            benifits: [
                `All Free Features`,
                `Unlimited Conversations`,
                `No Credits Required`,
                `No Credit Limit`,
            ],
            isRecommend: false,
        }
    ]
    return (
        <div>
            <div className="mt-16 text-center">
                <h1 className="text-4xl lg:text-5xl font-bold lg:tracking-tight"> Pricing </h1>
                <p className="text-lg mt-4 text-slate-600"> 
                Simple & Predictable pricing. No Surprises.
                </p>
            </div>
        <div id="pricing" className="grid md:grid-cols-3 gap-10 mx-auto max-w-screen-lg mt-12">
            {_.map(pricingList, (item, pricing_idx) => {
                const { type, costText, benifits, isRecommend } = item || {}
                return (
                    <div key={`pricing-${pricing_idx}`}>
                        <div className='flex flex-col w-full order-first lg:order-none border-2 border-[#D8DEE9] border-opacity-50 py-5 px-6 rounded-md'>
                            <div className='text-center'>
                                <h4 className='text-lg font-medium text-gray-400'>
                                    {type}
                                </h4>
                                <p className='mt-3 text-4xl font-bold text-black md:text-4xl'>{costText}</p>
                            </div>
                            <div className='flex items-center justify-center'>
                            <ul className='grid mt-8 text-left gap-y-4'>
                                {_.map(benifits, (benifit, benifit_idx) => {
                                    return (
                                        <li className='flex items-start gap-3 text-gray-800' key={`benifit-${pricing_idx}-${benifit_idx}`}>
                                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity=".16"></circle><path fillRule="evenodd" clipRule="evenodd" d="M3.75 12a8.25 8.25 0 0 1 11.916-7.393.75.75 0 1 0 .668-1.343A9.713 9.713 0 0 0 12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75c0-.366-.02-.727-.06-1.082a.75.75 0 1 0-1.49.164A8.25 8.25 0 1 1 3.75 12Zm17.78-6.47a.75.75 0 0 0-1.06-1.06L12 12.94l-2.47-2.47a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l9-9Z" fill="currentColor"></path> </svg>
                                            <span>{benifit}</span>
                                        </li>
                                    )
                                })
                                }
                            </ul>
                            </div>
                            <div className='flex mt-8'>
                                {isRecommend ? (
                                <a href='/' className='rounded text-center transition focus-visible:ring-2 ring-offset-2 ring-gray-200 w-full px-5 py-2.5 bg-black text-white hover:bg-gray-800  border-2 border-transparent'>Get Started </a>) : (<a href='/' className='rounded text-center transition focus-visible:ring-2 ring-offset-2 ring-gray-200 w-full px-5 py-2.5 bg-white border-2 border-black hover:bg-gray-100 text-black ' >Get Started </a>) }
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
        </div>
    )
}