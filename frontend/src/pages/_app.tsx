import "../styles/globals.scss";
import "@reach/listbox/styles.css";

import type { AppProps } from "next/app";
import useAuth from "../hooks/useAuth";
import NextNProgress from "nextjs-progressbar";
import { ErrorBoundary } from "react-error-boundary";

import { NextIntlProvider } from "next-intl";

import UserContext from "../context/UserContext";
import ErrorFallback from "../components/ErrorFallback";

function MyApp({ Component, pageProps }: AppProps) {
  const { user } = useAuth();
  return (
    <NextIntlProvider messages={pageProps.messages}>
      <UserContext.Provider value={{ user }}>
        <NextNProgress color="#FF66AA" />
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Component {...pageProps} />
        </ErrorBoundary>
      </UserContext.Provider>
    </NextIntlProvider>
  );
}

export default MyApp;
