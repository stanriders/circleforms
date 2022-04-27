import Head from "next/head";
import { MouseEventHandler, useEffect } from "react";
import DefaultLayout from "../layouts";

interface IErrorFallback {
  error: Record<string, any>;
  resetErrorBoundary: MouseEventHandler<HTMLButtonElement>;
}

const ErrorFallback = ({ error, resetErrorBoundary }: IErrorFallback) => {
  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - An error has occured</title>
      </Head>

      <div className="container text-center bg-black-light p-4 rounded-20">
        <h2 className="text-red-300 text-xl">Sorry, something went wrong:</h2>
        <pre>{error?.message}</pre>
        <button onClick={resetErrorBoundary}>Try again</button>
      </div>
    </DefaultLayout>
  );
};

export default ErrorFallback;
