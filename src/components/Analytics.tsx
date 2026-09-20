'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function Analytics() {
  const [gaId, setGaId] = useState(process.env.NEXT_PUBLIC_GA_ID || '');
  const [fbId, setFbId] = useState(process.env.NEXT_PUBLIC_FB_PIXEL_ID || '');

  useEffect(() => {
    fetch('/api/appearance', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d?.seo?.googleAnalyticsId) setGaId(d.seo.googleAnalyticsId);
        if (d?.seo?.facebookPixelId) setFbId(d.seo.facebookPixelId);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}

      {fbId && (
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${fbId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}
