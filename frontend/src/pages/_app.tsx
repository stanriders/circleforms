import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "react-query";
import type { AppProps } from "next/app";
import { NextIntlProvider } from "next-intl";
import NextNProgress from "nextjs-progressbar";

import ErrorFallback from "../components/ErrorFallback";
import { FormDataProvider } from "../components/FormContext";
import { MantineStyles } from "../components/MantineStyles";
import UserContext from "../context/UserContext";
import useAuth from "../hooks/useAuth";

import "../styles/globals.scss";
import "@reach/listbox/styles.css";

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
              <MantineStyles>
                <Component {...pageProps} />
              </MantineStyles>
            </ErrorBoundary>
          </UserContext.Provider>
        </FormDataProvider>
      </NextIntlProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
