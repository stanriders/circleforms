import Head from "next/head";

import DefaultLayout from "../layouts";

import Hero from "./Hero";

export default function Unauthorized({
  title = "Not Authorized",
  description = "You are not logged in."
}) {
  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - {title}</title>
      </Head>

      <Hero>
        <div className="flex flex-col items-center justify-center py-16 md:py-32 lg:pt-52 lg:pb-72">
          <p className="text-center text-4xl lg:-mt-10">{description}</p>
        </div>
      </Hero>
    </DefaultLayout>
  );
}
