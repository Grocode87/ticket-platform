import { useRouter } from "next/router";
import { useEffect } from "react";
import CartProvider from "../context/cart";
import "../styles/globals.css";
import { pageview } from "../utils/ga";
import { Analytics } from "@vercel/analytics/react";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      pageview(url);
    };
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on("routeChangeComplete", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
      <Analytics />
    </>
  );
}

export default MyApp;
