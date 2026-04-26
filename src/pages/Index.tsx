import { PageShell } from "@/components/layout/PageShell";
import { HeroSection } from "@/components/storyloom/HeroSection";
import { HowItWorks } from "@/components/storyloom/HowItWorks";
import { ProductFormatCards } from "@/components/storyloom/ProductFormatCards";
import { UseCases } from "@/components/storyloom/UseCases";
import { TrustSection } from "@/components/storyloom/TrustSection";
import { CtaFooter } from "@/components/storyloom/CtaFooter";
import { Section } from "@/components/storyloom/Section";
import { PackageCards } from "@/components/storyloom/PackageCards";

const Index = () => {
  return (
    <PageShell>
      <HeroSection />
      <HowItWorks />
      <ProductFormatCards />
      <Section eyebrow="Packages" title="Pick the package that fits the gift" subtitle="Single novels, three-book arcs, and gift-ready editions.">
        <PackageCards />
      </Section>
      <UseCases />
      <TrustSection />
      <CtaFooter />
    </PageShell>
  );
};

export default Index;
