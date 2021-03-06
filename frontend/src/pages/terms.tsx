import Head from "next/head";
import { useTranslations } from "next-intl";

import Hero from "../components/Hero";
import DefaultLayout from "../layouts";
import { Locales } from "../types/common-types";

export default function Terms() {
  const t = useTranslations();

  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - {t("title")}</title>
      </Head>

      <Hero>
        <div className="flex flex-col items-center justify-center py-16 md:py-32 lg:pt-52 lg:pb-72">
          <p className="text-center text-4xl lg:-mt-10">TODO</p>
        </div>
      </Hero>
    </DefaultLayout>
  );
}

export async function getStaticProps({ locale }: { locale: Locales }) {
  const [translations, global] = await Promise.all([
    import(`../messages/terms/${locale}.json`),
    import(`../messages/global/${locale}.json`)
  ]);

  const messages = {
    ...translations,
    ...global
  };

  return {
    props: {
      messages
    }
  };
}
