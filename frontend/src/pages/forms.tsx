import Head from "next/head";
import DefaultLayout from "../layouts";
import { Fragment, useEffect, useState } from "react";
import useSWR from "swr";
import api from "../libs/api";

import { useRouter } from "next/router";

import { useTranslations } from "next-intl";
import Radio from "../components/Radio";
import SubTitle from "../components/SubTitle";
import FormEntrySkeletonList from "../components/FormEntrySkeletonList";
import FormEntry from "../components/FormEntry";
import Button from "../components/Button";

export default function FormsList() {
  const router = useRouter();
  const t = useTranslations();
  const [filter, setFilter] = useState("Both");
  const [page, setPage] = useState(1);

  const {
    data: pinnedForms,
    error: pinnedError,
    isValidating: pinnedValidating
  } = useSWR(`/posts/page/pinned`, api);

  const { data, error, isValidating } = useSWR(
    `/posts/page/${page}?filter=${filter}&pageSize=10`,
    api
  );

  // Handle direct link to page and/or filter
  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    const qsPage = Number(qs.get("page"));
    const qsFilter = qs.get("filter");

    if (qsPage > 0) {
      setPage(qsPage);
    }

    if (["Both", "Active", "Inactive"].includes(qsFilter)) {
      setFilter(qsFilter);
    }
  }, []);

  // Update history and url when filter/page changesp
  useEffect(() => {
    router.push(
      {
        query: {
          page,
          filter
        }
      },
      undefined,
      {
        scroll: false
      }
    );
  }, [filter, page]);

  function handlePrevClick() {
    if (page > 1) {
      setPage(page - 1);
    }
  }

  function handleFilterClick(value) {
    setFilter(value);

    if (page === 1) return;
    setPage(1);
  }

  return (
    <DefaultLayout>
      <Head>
        <title>
          CircleForms - {t("title")} ({t("page")} {page})
        </title>
      </Head>

      <section className="container max-height">
        <div className="flex flex-col justify-between mb-12 bg-black-dark2 rounded-70 h-full">
          <div className="h-full">
            <div className="flex flex-col lg:flex-row justify-between bg-black-lighter rounded-full">
              <div className="pl-20 pt-7 pb-4">
                <h2 className="uppercase text-5xl font-bold">{t("subtitle")}</h2>
                <p className="text-white text-opacity-50">{t("description")}</p>
              </div>
              <div className="flex flex-col items-center justify-center bg-black-lightest h-auto rounded-full px-8">
                <h3 className="text-3xl font-medium flex gap-x-2 mb-1">
                  {t("filters.title")}
                  <svg
                    width="145"
                    height="23"
                    viewBox="0 0 145 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="122" width="23" height="23" rx="11.5" fill="white" />
                    <rect width="118" height="23" rx="11.5" fill="white" />
                  </svg>
                </h3>
                <div className="space-x-2">
                  <Radio
                    name="filter"
                    value="Both"
                    onClick={(e) => handleFilterClick(e.target.value)}
                    active={"Both" === filter}
                  >
                    {t("filters.all")}
                  </Radio>
                  <Radio
                    name="filter"
                    value="Active"
                    color="bg-green"
                    onClick={(e) => handleFilterClick(e.target.value)}
                    active={"Active" === filter}
                  >
                    {t("filters.active")}
                  </Radio>
                  <Radio
                    name="filter"
                    value="Inactive"
                    color="bg-red"
                    onClick={(e) => handleFilterClick(e.target.value)}
                    active={"Inactive" === filter}
                  >
                    {t("filters.inactive")}
                  </Radio>
                </div>
              </div>
            </div>
            <div className="mt-6 px-7">
              {pinnedForms && pinnedForms.posts.length > 0 && (
                <Fragment>
                  <SubTitle>{t("pinnedForms")}</SubTitle>
                  <div className="flex flex-col gap-y-3">
                    {pinnedForms &&
                      pinnedForms.posts.length > 0 &&
                      pinnedForms.posts.map((form) => {
                        const user = pinnedForms.users.find((user) => user.id === form.author_id);
                        return <FormEntry key={form.id} user={user} {...form} />;
                      })}
                  </div>
                </Fragment>
              )}

              <SubTitle>{t("title")}</SubTitle>
              <div className="flex flex-col gap-y-3 relative">
                {!data && isValidating && <FormEntrySkeletonList length={10} />}
                {data && data.posts.length === 0 && (
                  <p className="font-semibold text-center">{t("noForms")}</p>
                )}
                {data &&
                  data.posts.length > 0 &&
                  data.posts.map((form) => {
                    const user = data.users.find((user) => user.id === form.author_id);
                    return <FormEntry key={form.id} user={user} {...form} />;
                  })}
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-x-6 py-8">
            <Button theme="grey" onClick={handlePrevClick}>
              {t("prev")}
            </Button>

            <Button theme="grey" rounded active classname="cursor-default">
              {page}
            </Button>

            <Button theme="grey" onClick={() => setPage(page + 1)}>
              {t("next")}
            </Button>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}

export async function getStaticProps({ locale }) {
  const [translations, global] = await Promise.all([
    import(`../messages/forms/${locale}.json`),
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
