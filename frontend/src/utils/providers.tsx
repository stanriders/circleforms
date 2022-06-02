import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "react-query";
import { NextIntlProvider } from "next-intl";
import NextNProgress from "nextjs-progressbar";
import ErrorFallback from "src/components/ErrorFallback";
import { FormDataProvider } from "src/components/FormContext";
import { MantineStyles } from "src/components/MantineStyles";
import UserContext from "src/context/UserContext";
import useAuth from "src/hooks/useAuth";

// should probably import all messages somehow
// or manually import correct messages for each test
import messages from "../messages/global/en-US.json";

export const AllTheProviders: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { user } = useAuth();
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <NextIntlProvider messages={messages}>
        <FormDataProvider>
          <UserContext.Provider value={{ user }}>
            <NextNProgress color="#FF66AA" />
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <MantineStyles>{children}</MantineStyles>
            </ErrorBoundary>
          </UserContext.Provider>
        </FormDataProvider>
      </NextIntlProvider>
    </QueryClientProvider>
  );
};
