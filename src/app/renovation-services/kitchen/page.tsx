import type { Metadata } from "next";

import { ServicePage } from "@/components/service/service-page";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SERVICES } from "@/lib/services";

const service = SERVICES.kitchen;

export const metadata: Metadata = {
  title: service.title,
  description: service.metaDescription,
};

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
