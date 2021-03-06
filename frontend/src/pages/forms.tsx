import { Fragment, useEffect, useState } from "react";
import { useQuery } from "react-query";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { PostFilter } from "../../openapi";
import Button from "../components/Button";
import FormEntry from "../components/FormEntry";
import FormEntrySkeletonList from "../components/FormEntrySkeletonList";
import StatusRadio from "../components/StatusRadio";
import SubTitle from "../components/SubTitle";
import DefaultLayout from "../layouts";
import { Locales } from "../types/common-types";
import { apiClient } from "../utils/apiClient";

export default function FormsList() {
  const router = useRouter();
  const t = useTranslations();
  const [filter, setFilter] = useState<PostFilter>(PostFilter.Active);
  const [page, setPage] = useState(1);

  const { data: pinnedForms } = useQuery(["postsPagePinnedGet", page], () =>
    apiClient.pages.postsPagePinnedGet()
  );

  const { isLoading: isLoadingPosts, data } = useQuery(["postsPagePageGet", page, filter], () =>
    apiClient.pages.postsPagePageGet({ page: page, filter: filter, pageSize: 10 })
  );

  // Handle direct link to page and/or filter
  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    const qsPage = Number(qs.get("page"));
    const qsFilter = qs.get("filter") || "";

    if (qsPage > 0) {
      setPage(qsPage);
    }

    if (["Both", "Active", "Inactive"].includes(qsFilter)) {
      setFilter(qsFilter as PostFilter);
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
    // TODO fixme
    // the fact that adding router as a missing dependency causes infinite rerenders is not good...
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, page]);

  function handlePrevClick() {
    if (page > 1) {
      setPage(page - 1);
    }
  }

  function handleFilterClick(value: PostFilter) {
    setFilter(value);

    if (page === 1) return;
    setPage(1);
  }

  const showPinnedPosts = pinnedForms && pinnedForms?.posts?.length! > 0;
  const showFormEntries = data && data?.posts?.length! > 0;

  return (
    <DefaultLayout>
      <Head>
        <title>
          CircleForms - {t("title")} ({t("page")} {page})
        </title>
      </Head>

      <section className="max-height container">
        <div className="mb-12 flex h-full flex-col justify-between rounded-70 bg-black-dark2">
          <div className="h-full">
            <div className="flex flex-col justify-between rounded-full bg-black-lighter lg:flex-row">
              <div className="pt-7 pb-4 pl-20">
                <h2 className="text-5xl font-bold uppercase">{t("subtitle")}</h2>
                <p className="text-white text-opacity-50">{t("description")}</p>
              </div>
              <div className="flex h-auto flex-col items-center justify-center rounded-full bg-black-lightest px-8">
                <h3 className="mb-1 flex gap-x-2 text-3xl font-medium">
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
                  <StatusRadio
                    name="filter"
                    value="Both"
                    onClick={(e) => handleFilterClick(e.currentTarget.value as PostFilter)}
                    active={"Both" === filter}
                  >
                    {t("filters.all")}
                  </StatusRadio>
                  <StatusRadio
                    name="filter"
                    value="Active"
                    color="bg-green"
                    onClick={(e) => handleFilterClick(e.currentTarget.value as PostFilter)}
                    active={"Active" === filter}
                  >
                    {t("filters.active")}
                  </StatusRadio>
                  <StatusRadio
                    name="filter"
                    value="Inactive"
                    color="bg-red"
                    onClick={(e) => handleFilterClick(e.currentTarget.value as PostFilter)}
                    active={"Inactive" === filter}
                  >
                    {t("filters.inactive")}
                  </StatusRadio>
                </div>
              </div>
            </div>
            <div className="mt-6 px-7">
              {showPinnedPosts && (
                <Fragment>
                  <SubTitle>{t("pinnedForms")}</SubTitle>
                  <div className="flex flex-col gap-y-3">
                    {pinnedForms?.posts?.map((form) => {
                      const user = pinnedForms?.users?.find((user) => user.id === form.author_id);
                      return (
                        <FormEntry
                          href={`/form/${form.id}`}
                          key={form.id}
                          user={user}
                          id={form.id}
                          banner={form.banner}
                          title={form.title}
                          excerpt={form.excerpt}
                          publish_time={form.publish_time}
                        />
                      );
                    })}
                  </div>
                </Fragment>
              )}

              <SubTitle>{t("title")}</SubTitle>
              <div className="relative flex flex-col gap-y-3">
                {!data && isLoadingPosts && <FormEntrySkeletonList length={10} />}
                {!showFormEntries && <p className="text-center font-semibold">{t("noForms")}</p>}
                {showFormEntries &&
                  data?.posts?.map((form) => {
                    const user = data?.users?.find((user) => user.id === form.author_id);
                    return (
                      <FormEntry
                        href={`/form/${form.id}`}
                        key={form.id}
                        user={user}
                        id={form.id}
                        banner={form.banner}
                        title={form.title}
                        excerpt={form.excerpt}
                        publish_time={form.publish_time}
                      />
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-x-6 py-8">
            <Button theme="grey" onClick={handlePrevClick}>
              {t("prev")}
            </Button>

            <Button theme="grey" rounded active onClick={() => {}} classname="cursor-default">
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

export async function getStaticProps({ locale }: { locale: Locales }) {
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
