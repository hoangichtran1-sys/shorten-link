import { ContactSection } from "@/modules/marketing/components/contact-section";
import { FaqSection } from "@/modules/marketing/components/faq-section";
import { FooterSection } from "@/modules/marketing/components/footer-section";
import { HeroSection } from "@/modules/marketing/components/hero-section";

export default function Page() {
    return (
        <div className="min-h-svh p-6">
            <HeroSection />
            <FaqSection />
            <ContactSection />
            <FooterSection />
        </div>
    );
}
