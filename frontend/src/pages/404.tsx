import Head from "next/head";
import Hero from "../components/Hero";
import DefaultLayout from "../layouts";

import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import Button from "../components/Button";

export default function Error404() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - 404</title>
      </Head>

      <Hero>
        <div className="flex flex-col justify-center items-center py-16 md:py-32 lg:pt-52 lg:pb-72">
          <h3 className="text-4xl lg:-mt-10 text-center">{t("subtitle")}</h3>
          <code className="mt-2 p-2 bg-black-lightest">{router.asPath}</code>
          <div className="flex flex-col lg:flex-row mt-14 gap-8 pb-2 lg:pb-0">
            <Button theme="secondary" large href="/">
              {t("goBack")}
            </Button>
          </div>
        </div>
      </Hero>
    </DefaultLayout>
  );
}

export async function getStaticProps({ locale }) {
  const [translations, global] = await Promise.all([
    import(`../messages/404/${locale}.json`),
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
