import Head from "next/head";
import DefaultLayout from "../layouts";

export default function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - An error has occured</title>
      </Head>

      <div className="container text-center bg-black-light p-4 rounded-20">
        <h2 className="text-red-300 text-xl">Sorry, something went wrong:</h2>
        <pre>{error.toString()}</pre>
      </div>
    </DefaultLayout>
  );
}
