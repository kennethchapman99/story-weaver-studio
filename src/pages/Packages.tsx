import { PageShell } from "@/components/layout/PageShell";
import { Section } from "@/components/storyloom/Section";
import { PackageCards } from "@/components/storyloom/PackageCards";
import { CtaFooter } from "@/components/storyloom/CtaFooter";

export default function Packages() {
  return (
    <PageShell>
      <Section
        align="center"
        eyebrow="Pricing"
        title="Choose your StoryLoom package"
        subtitle="Every package includes a story blueprint, human review, and at least one revision pass."
      >
        <PackageCards />
      </Section>
      <CtaFooter />
    </PageShell>
  );
}
