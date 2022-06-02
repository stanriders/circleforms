import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "react-query";
import { NextIntlProvider } from "next-intl";
import ErrorFallback from "src/components/ErrorFallback";
import { FormDataProvider } from "src/components/FormContext";
import { MantineStyles } from "src/components/MantineStyles";

// should probably import all messages somehow
// or manually import correct messages for each test
import messages from "../messages/global/en-US.json";

export const AllTheProviders: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <NextIntlProvider locale="en" messages={messages}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <QueryClientProvider client={queryClient} contextSharing={true}>
          <FormDataProvider>
           
            <MantineStyles>{children}</MantineStyles>
          </FormDataProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </NextIntlProvider>
  );
};
