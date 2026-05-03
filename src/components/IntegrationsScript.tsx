"use client";

import Script from "next/script";
import { useSiteSettings } from "@/store/SiteSettingsContext";

export default function IntegrationsScript() {
  const { settings } = useSiteSettings();

  return (
    <>
      {/* Google Analytics */}
      {settings.googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${settings.googleAnalyticsId}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* Google Ads */}
      {settings.googleAdsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAdsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-ads" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${settings.googleAdsId}');
            `}
          </Script>
        </>
      )}

      {/* Google Tag Manager */}
      {settings.gtmId && (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${settings.gtmId}');
          `}
        </Script>
      )}

      {/* Microsoft Clarity */}
      {settings.clarityId && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${settings.clarityId}");
          `}
        </Script>
      )}

      {/* Hotjar */}
      {settings.hotjarId && settings.hotjarSv && (
        <Script id="hotjar" strategy="afterInteractive">
          {`
            (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:${settings.hotjarId},hjsv:${settings.hotjarSv}};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}
        </Script>
      )}

      {/* Dynamic SEO Meta Title Injection */}
      {settings.metaTitle && (
        <Script id="seo-title" strategy="afterInteractive">
          {`document.title = "${settings.metaTitle} | Carlão Imóveis";`}
        </Script>
      )}
      {settings.metaDescription && (
        <Script id="seo-description" strategy="afterInteractive">
          {`
            let metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
              metaDesc.setAttribute("content", "${settings.metaDescription}");
            } else {
              metaDesc = document.createElement('meta');
              metaDesc.name = "description";
              metaDesc.content = "${settings.metaDescription}";
              document.head.appendChild(metaDesc);
            }
          `}
        </Script>
      )}

      {/* Custom Scripts / Tags */}
      {settings.customScripts && (
        <div 
          id="custom-scripts-container" 
          dangerouslySetInnerHTML={{ __html: settings.customScripts }} 
        />
      )}
    </>
  );
}
