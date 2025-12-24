"use client";

import Script from "next/script";

export default function SnapPixel() {
  return (
    <Script id="snap-pixel" strategy="afterInteractive">
      {`
        (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
        {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
        a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
        r.src=n;var u=t.getElementsByTagName(s)[0];
        u.parentNode.insertBefore(r,u);})(window,document,
        'https://sc-static.net/scevent.min.js');

        snaptr('init', '994823a7-e76b-4039-957a-7ca7ac3a23ff', {
          'user_email': '' 
        });

        snaptr('track', 'PAGE_VIEW');
        snaptr('track', 'AD_CLICK');
      `}
    </Script>
  );
}
