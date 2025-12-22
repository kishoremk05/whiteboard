import { Header } from '../components/landing/Header';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { HowItWorks } from '../components/landing/HowItWorks';
import { UseCases } from '../components/landing/UseCases';
import { CTA } from '../components/landing/CTA';
import { Footer } from '../components/landing/Footer';

export function Landing() {
    return (
        <div className="min-h-screen">
            <Header />
            <Hero />
            <Features />
            <HowItWorks />
            <UseCases />
            <CTA />
            <Footer />
        </div>
    );
}
