import React, { useRef } from "react";
import SVG from "react-inlinesvg";
import { useQuery } from "react-query";
import VisuallyHidden from "@reach/visually-hidden";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { PostFilter } from "../../openapi";
import Button from "../components/Button";
import FormEntry from "../components/FormEntry";
import Loading from "../components/Loading";
import DefaultLayout from "../layouts";
import { Locales } from "../types/common-types";
import { apiClient } from "../utils/apiClient";

const Index: NextPage = () => {
  const router = useRouter();
  const { isLoading, error, data } = useQuery(["posts", 1], () =>
    apiClient.pages.postsPagePageGet({ page: 1, filter: PostFilter.Active, pageSize: 4 })
  );
  const t = useTranslations();
  const scrollRef = useRef<HTMLHeadingElement>(null);
  const scrollToReadMore = () => scrollRef.current?.scrollIntoView({ behavior: "smooth" });

  if (error instanceof Error) return <p>{"An error has occurred: " + error.message}</p>;

  return (
    <DefaultLayout classname="">
      <Head>
        <title>CircleForms - {t("title")}</title>
      </Head>

      <div className="flex flex-col justify-center items-center min-h-screen">
        <VisuallyHidden>Circle Forms</VisuallyHidden>
        <SVG className="w-3/4 max-w-6xl" src="/svg/logo.svg" />
        <p className="mt-4 font-museo text-center lg:text-4xl">{t("description")}</p>
        <div className="flex flex-col gap-8 pb-2 mt-14 lg:flex-row lg:pb-0">
          <Button onClick={() => router.push("/dashboard")} theme="secondary" large>
            {t("createForm")}
          </Button>
          <Button onClick={scrollToReadMore} theme="tertiary" large>
            {t("readMore")}
          </Button>
        </div>
      </div>

      <div className="py-32 w-full bg-black-darker">
        <section className="small-container">
          <div className="flex flex-col justify-between items-center mb-8 lg:flex-row">
            <h2 ref={scrollRef} className="text-6xl font-semibold uppercase">
              {t("about.title")}
            </h2>

            <SVG className="h-8 lg:-ml-8 lg:h-11" src="/svg/circles-sliders.svg" />
          </div>
          <div className="flex flex-col gap-8 text-xl font-medium lg:flex-row">
            <p className="lg:flex-1">{t("about.first")}</p>
            <p className="lg:flex-1">{t("about.second")}</p>
          </div>
        </section>
      </div>

      <div className="py-24 w-full bg-black">
        <section className="container">
          <div className="mb-8 text-center">
            <h2 className="uppercase type-h1">{t("recentForms.title")}</h2>
            <p className="text-2xl text-white text-opacity-50">{t("recentForms.description")}</p>
          </div>
          <div className="p-6 bg-black-darker rounded-3xl">
            <div className="flex relative z-10 flex-col gap-y-2">
              <div
                className="absolute inset-0 z-20 pointer-events-none"
                style={{
                  background: `linear-gradient(rgba(12, 12, 12, 0) 22%, rgb(12, 12, 12) 113.44%)`
                }}
              ></div>
              <div className="relative space-y-3">
                {isLoading && (
                  <div className="flex absolute top-4 left-1/2 z-50 justify-center -translate-x-1/2">
                    <Loading />
                  </div>
                )}

                {data && data?.posts?.length === 0 && (
                  <p className="font-semibold text-center">{t("noForms")}</p>
                )}

                {data &&
                  data?.posts?.length! > 0 &&
                  data.posts?.map((form) => {
                    const user = data.users?.find((user) => user.id === form.author_id);
                    return (
                      <FormEntry href={`/form/${form.id}`} key={form.id} user={user} {...form} />
                    );
                  })}
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Button href="/forms" theme="secondary">
                {t("showMore")}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </DefaultLayout>
  );
};

export async function getStaticProps({ locale }: { locale: Locales }) {
  const [translations, global] = await Promise.all([
    import(`../messages/index/${locale}.json`),
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

export default Index;
