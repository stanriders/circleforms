import { useContext, useEffect, useState } from "react";
import SVG from "react-inlinesvg";
import { useQuery } from "react-query";
import Head from "next/head";
import Link from "next/link";
import { useTranslations } from "next-intl";

import FormCard from "../components/FormCard";
import Title from "../components/Title";
import Unauthorized from "../components/Unauthorized";
import UserContext from "../context/UserContext";
import DefaultLayout from "../layouts";
import { apiClient } from "../libs/apiClient";
import { Locales } from "../types/common-types";

export default function Dashboard() {
  const t = useTranslations();
  const { user } = useContext(UserContext);
  const [forms, setForms] = useState(Array.from({ length: 11 }));

  const { error, data } = useQuery("mePostsGet", () => apiClient.users.mePostsGet());

  useEffect(() => {
    if (data && data.length > 0) {
      const newForms = [...forms];
      data.forEach((el, index) => {
        newForms.splice(index, 1, el);
      });
      setForms(newForms);
    }
    //TODO FIXME
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (error instanceof Error) return <p>{"An error has occurred: " + error.message}</p>;

  if (!user) {
    return <Unauthorized />;
  }

  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - {t("title")}</title>
      </Head>

      <Title title={t("subtitle")}>{t("description")}</Title>

      <section className="container bg-black-lightest rounded-40 px-8 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <Link href="/create-new-form" passHref>
            <a
              className="flex justify-center items-center bg-pink rounded-20 h-40 transition-transform ease-out-cubic hover:scale-99"
              title="Create your form"
            >
              <SVG src="/svg/plus.svg" />
            </a>
          </Link>
          {forms.map((form: any, index) => (
            <FormCard key={form?.id ? form.id : index} {...form} />
          ))}
        </div>
      </section>
    </DefaultLayout>
  );
}

export async function getStaticProps({ locale }: { locale: Locales }) {
  const [translations, global] = await Promise.all([
    import(`../messages/dashboard/${locale}.json`),
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
