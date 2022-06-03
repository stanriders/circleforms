import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import toast from "react-hot-toast";
import { QueryCache, QueryClient, QueryClientProvider } from "react-query";
import { ModalsProvider } from "@mantine/modals";
import { NextIntlProvider } from "next-intl";
import ErrorFallback from "src/components/ErrorFallback";
import { FormDataProvider } from "src/components/FormContext";
import { MantineStyles } from "src/components/MantineStyles";
import PublishModal from "src/components/PublishModal";

// should probably import all messages somehow
// or manually import correct messages for each test
import messages from "../messages/global/en-US.json";

export const AllTheProviders: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) =>
        error instanceof Error && toast.error(`Something went wrong: ${error.message}`)
    })
  });

  return (
    <NextIntlProvider locale="en" messages={messages}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <QueryClientProvider client={queryClient} contextSharing={true}>
          <FormDataProvider>
            <MantineStyles>
              <ModalsProvider modals={{ publish: PublishModal }}>{children}</ModalsProvider>
            </MantineStyles>
          </FormDataProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </NextIntlProvider>
  );
};
