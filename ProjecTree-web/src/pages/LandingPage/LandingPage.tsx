import LandingHeader from "./components/LandingHeader"
import HeroSection from "./components/HeroSection"
import FeaturesSection from "./components/FeatureSection"
import ComparisonSection from "./components/ComparisonSection"
import { CTASection } from "./components/CTASection"
import LandingFooter from "./components/LandingFooter"

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-5%] h-[600px] w-[600px] rounded-full bg-emerald-100/40 blur-[100px]" />
            <div className="absolute bottom-[10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-[100px]" />
            <div className="absolute top-[40%] left-[60%] h-[300px] w-[300px] rounded-full bg-purple-100/30 blur-[80px]" />

            <LandingHeader />
            <main className="relative z-10">
                <HeroSection />
                <FeaturesSection />
                <ComparisonSection />
                <CTASection />
            </main>
            <LandingFooter />
        </div>
    )
}
