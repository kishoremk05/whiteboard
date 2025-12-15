import { Header } from '../components/landing/Header';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { UseCases } from '../components/landing/UseCases';
import { CTA } from '../components/landing/CTA';
import { Footer } from '../components/landing/Footer';

export function Landing() {
    return (
        <div className="min-h-screen">
            <Header />
            <Hero />
            <Features />
            <UseCases />
            <CTA />
            <Footer />
        </div>
    );
}
