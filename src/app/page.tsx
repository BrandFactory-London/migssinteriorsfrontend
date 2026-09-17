import { Areas } from "@/components/home/areas";
import { AssuranceBar } from "@/components/home/assurance-bar";
import { Enquire } from "@/components/home/enquire";
import { FeaturedWork } from "@/components/home/featured-work";
import { Hero } from "@/components/home/hero";
import { Process } from "@/components/home/process";
import { Resources } from "@/components/home/resources";
import { Testimonials } from "@/components/home/testimonials";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="top" className="scroll-mt-0">
        <Hero />
        <AssuranceBar />
        <FeaturedWork />
        <Process />
        <Areas />
        <Testimonials />
        <Enquire />
        <Resources />
      </main>

      <SiteFooter />
      <SiteChrome />
    </>
  );
}
