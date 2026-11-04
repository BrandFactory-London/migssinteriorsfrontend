import Script from "next/script";

/**
 * Google Analytics 4, loaded through the Google tag (gtag.js).
 *
 * `next/script` rather than `@next/third-parties/google`: the latter wraps the
 * same two tags but pulls in a dependency we would otherwise not have, and its
 * `GoogleAnalytics` component offers nothing we need here.
 *
 * `afterInteractive` keeps the request off the critical path — the tag is
 * measurement, so it must not compete with the page's own fonts and images for
 * bandwidth during first paint. It still fires on the first page view.
 *
 * Client-side route changes need no `useEffect` here: GA4's enhanced
 * measurement counts `page_view` from browser history events, which is how the
 * App Router navigates. Should enhanced measurement ever be switched off in the
 * GA property, in-app navigations would stop being counted and this component
 * would need to send them itself.
 */
export function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Unset in local development and in any preview that has not been given the
  // variable, so that neither pollutes the client's reporting.
  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      {/* `id` is required on an inline Script: Next uses it to guarantee the
          snippet runs once across route changes. */}
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${measurementId}');`}
      </Script>
    </>
  );
}
