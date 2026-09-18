import { ServicePage } from "@/components/service/service-page";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { pageMetadata } from "@/lib/seo";
import { SERVICES } from "@/lib/services";
import { ogImage } from "@/lib/wix/og-image";

const service = SERVICES.kitchen;

export async function generateMetadata() {
  const image = await ogImage("kitchen-hero");

  return pageMetadata({
    title: `${service.title} in London & Essex | Migss Interiors`,
    description: service.metaDescription,
    path: "/renovation-services/kitchen",
    image: image?.url,
    imageAlt: image?.alt,
  });
}

/** The projects rail reads the live collection. */
export const revalidate = 60;

export default function Page() {
  return (
    <>
      <SiteHeader />
      <ServicePage service={service} />
      <SiteFooter />
      <SiteChrome />
    </>
  );
}
