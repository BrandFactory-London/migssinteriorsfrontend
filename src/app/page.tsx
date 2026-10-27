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
import { pageMetadata } from "@/lib/seo";
import { getHomeProjects } from "@/lib/wix/projects";
import { ogImage } from "@/lib/wix/og-image";

/** The rail reads the live portfolio, so the page refreshes in the background. */
export const revalidate = 60;

export async function generateMetadata() {
  const image = await ogImage("home-hero");

  return pageMetadata({
    title: "Migss Interiors | High-End Bathroom & Kitchen Renovation, North London & Chigwell",
    description:
      "High-end bathrooms, kitchens and interiors across north London and Chigwell, from Hampstead and Highgate to Chigwell and Epping. Our own tradespeople, a fixed written quote and a ten-year labour guarantee.",
    path: "/",
    image: image?.url,
    imageAlt: image?.alt,
  });
}

export default async function Home() {
  const projects = await getHomeProjects();

  return (
    <>
      <SiteHeader />

      <main id="top" className="scroll-mt-0">
        <Hero />
        <AssuranceBar />
        <FeaturedWork projects={projects} />
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
