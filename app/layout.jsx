import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/shared/navbar/Navbar";
import Footer from "./components/shared/footer/Footer";
import { AppProvider } from "./context/AppContext";
import QuereyProvider from "./providers/QueryProvider"
import { Toaster } from "react-hot-toast";
import BottomBar from "./components/shared/bottombar/BottomBar";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
});

export const metadata = {
  title: "Enayamall",
  description: "Enayamall Shopping App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
              ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
              ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
              for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
              ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
              ttq.load=function(e,n){
                var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;
                ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,
                ttq._o=ttq._o||{},ttq._o[e]=n||{};
                n=document.createElement("script");
                n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;
                e=document.getElementsByTagName("script")[0];
                e.parentNode.insertBefore(n,e)
              };
              ttq.load('D3DUH4RC77U8DNM9THNG');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>

        {/* Google Analytics */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-5VC163Q5QH" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5VC163Q5QH');
          `}
        </Script>
      </head>

      <body>
      
        <QuereyProvider>
          <AppProvider>
            <Navbar />
            <Toaster position="top-center" />
            {children}
            <Footer />
            <div className="fixed lg:hidden bottom-0 z-[9998] w-full">
              <BottomBar />
            </div>
          </AppProvider>
        </QuereyProvider>
      </body>
    </html>
  );
}
