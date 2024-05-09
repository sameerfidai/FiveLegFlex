import Router from "next/router";
import NProgress from "nprogress";
import "../app/globals.css";
import "nprogress/nprogress.css"; // Styles of nprogress

NProgress.configure({ showSpinner: false });

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;