import Head from 'next/head'
import GradientWrapper from '@/components/GradientWrapper'
import CTA from '@/components/ui/CTA'
import Features from '@/components/ui/Features'
import FooterCTA from '@/components/ui/FooterCTA'
import Hero from '@/components/ui/Hero'
import LogoGrid from '@/components/ui/LogoGrid'
import Testimonials from '@/components/ui/Testimonials'
import Pricing from '@/components/ui/Pricing'
import ToolKit from '@/components/ui/ToolKit'
import Navbar from '@/components/ui/Navbar'

export default function Landing({ userId }: { userId?: string }) {
    return (
        <div className="overflow-scroll max-h-lvh">
            <Head>
                <meta name="robots" content="index" />
            </Head>
            <Navbar userId={userId} />
            <Hero />
            <LogoGrid />
            <GradientWrapper>
                <Features />
                <CTA />
            </GradientWrapper>
            <ToolKit />
            <GradientWrapper>
                <Pricing />
            </GradientWrapper>
            <FooterCTA />
        </div>
    )
}
