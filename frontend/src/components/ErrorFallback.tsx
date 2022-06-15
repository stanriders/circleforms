import { FallbackProps } from "react-error-boundary";
import Head from "next/head";

import DefaultLayout from "../layouts";

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - An error has occured</title>
      </Head>

      <div role="alert" className="container p-4 text-center bg-black-light rounded-20">
        <h2 className="text-xl text-red-300">Sorry, something went wrong:</h2>
        <pre>{error?.message}</pre>
        <button onClick={resetErrorBoundary}>Try again</button>
      </div>
    </DefaultLayout>
  );
};

export default ErrorFallback;
