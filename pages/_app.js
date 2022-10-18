import CartProvider from "../context/cart";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />

      <script strategy="lazyOnload">
        {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                    page_path: window.location.pathname,
                    });
                `}
      </script>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </>
  );
}

export default MyApp;
