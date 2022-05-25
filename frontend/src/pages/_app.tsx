import "../styles/globals.scss";
import "@reach/listbox/styles.css";

import type { AppProps } from "next/app";
import useAuth from "../hooks/useAuth";
import NextNProgress from "nextjs-progressbar";
import { ErrorBoundary } from "react-error-boundary";

import { NextIntlProvider } from "next-intl";

import UserContext from "../context/UserContext";
import ErrorFallback from "../components/ErrorFallback";

import { QueryClient, QueryClientProvider } from "react-query";
import { FormDataProvider } from "../components/FormContext";

const queryClient = new QueryClient();

// i18n setup
// https://codesandbox.io/s/github/amannn/next-intl/tree/main/packages/example-advanced?file=/src/pages/_app.tsx

function MyApp({ Component, pageProps }: AppProps) {
  const { user } = useAuth();
  return (
    <QueryClientProvider client={queryClient}>
      <NextIntlProvider messages={pageProps.messages}>
        <FormDataProvider>
          <UserContext.Provider value={{ user }}>
            <NextNProgress color="#FF66AA" />
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Component {...pageProps} />
            </ErrorBoundary>
          </UserContext.Provider>
        </FormDataProvider>
      </NextIntlProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
