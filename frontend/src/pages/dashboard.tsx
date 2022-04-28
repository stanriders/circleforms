import Head from "next/head";

import DefaultLayout from "../layouts";

import { useContext, useEffect, useState } from "react";
import SVG from "react-inlinesvg";

import Link from "next/link";

import { useTranslations } from "next-intl";
import useSWR from "swr";
import api from "../libs/api";
import Unauthorized from "../components/Unauthorized";
import Title from "../components/Title";
import FormCard from "../components/FormCard";
import UserContext from "../context/UserContext";
import { Locales, PostResponse } from "../types/common-types";

export default function Dashboard() {
  const t = useTranslations();
  const { user } = useContext(UserContext);
  const [forms, setForms] = useState(Array.from({ length: 11 }));
  const { data: posts } = useSWR<PostResponse[]>("/me/posts", api);

  useEffect(() => {
    if (posts && posts.length > 0) {
      const newForms = [...forms];
      posts.forEach((el, index) => {
        newForms.splice(index, 1, el);
      });
      setForms(newForms);
    }
    //TODO FIXME
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);

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
          <Link href="/create-a-form" passHref>
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
