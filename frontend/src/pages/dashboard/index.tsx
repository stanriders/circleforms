import { useContext, useMemo } from "react";
import SVG from "react-inlinesvg";
import { useQuery } from "react-query";
import Head from "next/head";
import Link from "next/link";
import { useTranslations } from "next-intl";

import FormCard from "../../components/FormCard";
import FormEntry from "../../components/FormEntry";
import FormEntrySkeletonList from "../../components/FormEntrySkeletonList";
import Title from "../../components/Title";
import Unauthorized from "../../components/Unauthorized";
import UserContext from "../../context/UserContext";
import DefaultLayout from "../../layouts";
import { Locales } from "../../types/common-types";
import { apiClient } from "../../utils/apiClient";

export default function Dashboard() {
  const t = useTranslations();
  const { user } = useContext(UserContext);

  const { error, data, isLoading } = useQuery("mePostsGet", () => apiClient.users.mePostsGet());

  const unpublishedPosts = useMemo(
    () => data?.filter((val) => val.published === false).reverse(),
    [data]
  );
  const publishedPosts = useMemo(
    () => data?.filter((val) => val.published === true).reverse(),
    [data]
  );

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

      <div className="container flex flex-col gap-8 py-5 px-8 bg-black-dark2 rounded-40">
        <p className="text-xl text-center">Unpublished</p>
        <section>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <Link href="/create-new-form" passHref>
              <a
                className="flex justify-center items-center h-[88px] bg-pink rounded-20  transition-transform hover:scale-99 ease-out-cubic"
                title="Create your form"
              >
                <SVG src="/svg/plus.svg" />
              </a>
            </Link>
            {unpublishedPosts?.map((form, index) => (
              <FormCard key={form?.id ? form.id : index} post={form} />
            ))}
          </div>
        </section>
        {publishedPosts?.length !== 0 && <p className="text-xl text-center">Published</p>}
        <section className="flex relative flex-col gap-y-3">
          {!data && isLoading && <FormEntrySkeletonList length={10} />}
          {publishedPosts &&
            publishedPosts?.map((form) => {
              return (
                <FormEntry
                  href={`/form/${form.id}`}
                  key={form.id}
                  user={{
                    username: user.osu?.username,
                    avatar_url: "/images/avatar-guest.png",
                    id: user.id
                  }}
                  id={form.id}
                  banner={form.banner}
                  title={form.title}
                  excerpt={form.excerpt}
                  publish_time={form.publish_time}
                />
              );
            })}
        </section>
      </div>
    </DefaultLayout>
  );
}

export async function getStaticProps({ locale }: { locale: Locales }) {
  const [translations, global] = await Promise.all([
    import(`../../messages/dashboard/${locale}.json`),
    import(`../../messages/global/${locale}.json`)
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
