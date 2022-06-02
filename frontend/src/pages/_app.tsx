import { ReactQueryDevtools } from "react-query/devtools";
import type { AppProps } from "next/app";
import { NextIntlProvider } from "next-intl";
import NextNProgress from "nextjs-progressbar";
import UserContext from "src/context/UserContext";
import useAuth from "src/hooks/useAuth";
import { AllTheProviders } from "src/utils/providers";

import "../styles/globals.scss";
import "@reach/listbox/styles.css";

const isDevelopmentEnv = process.env.NODE_ENV === "development";

// i18n setup
// https://codesandbox.io/s/github/amannn/next-intl/tree/main/packages/example-advanced?file=/src/pages/_app.tsx

function MyApp({ Component, pageProps }: AppProps) {
  const { user } = useAuth();

  return (
    <AllTheProviders>
      <UserContext.Provider value={{ user }}>
        <NextIntlProvider messages={pageProps.messages}>
          <NextNProgress color="#FF66AA" />
          <Component {...pageProps} />
          {isDevelopmentEnv && <ReactQueryDevtools initialIsOpen={false} />}
        </NextIntlProvider>
      </UserContext.Provider>
    </AllTheProviders>
  );
}

export default MyApp;
