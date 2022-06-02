import { ErrorBoundary } from "react-error-boundary";
import { ReactQueryDevtools } from "react-query/devtools";
import type { AppProps } from "next/app";
import { NextIntlProvider } from "next-intl";
import ErrorFallback from "src/components/ErrorFallback";
import { AllTheProviders } from "src/utils/providers";

import "../styles/globals.scss";
import "@reach/listbox/styles.css";

const isDevelopmentEnv = process.env.NODE_ENV === "development";

// i18n setup
// https://codesandbox.io/s/github/amannn/next-intl/tree/main/packages/example-advanced?file=/src/pages/_app.tsx

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AllTheProviders>
        <NextIntlProvider messages={pageProps.messages}>
          <Component {...pageProps} />
          {isDevelopmentEnv && <ReactQueryDevtools initialIsOpen={false} />}
        </NextIntlProvider>
      </AllTheProviders>
    </ErrorBoundary>
  );
}

export default MyApp;
