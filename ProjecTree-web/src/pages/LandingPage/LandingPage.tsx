import LandingHeader from "./components/LandingHeader"
import HeroSection from "./components/HeroSection"
import FeaturesSection from "./components/FeatureSection"
import ComparisonSection from "./components/ComparisonSection"
import { CTASection } from "./components/CTASection"
import LandingFooter from "./components/LandingFooter"

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            <LandingHeader />
            <main>
                <HeroSection />
                <FeaturesSection />
                <ComparisonSection />
                <CTASection />
            </main>
            <LandingFooter />
        </div>
    )
}
