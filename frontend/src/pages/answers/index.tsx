import React, { useMemo } from "react";
import { useQuery } from "react-query";
import Head from "next/head";
import FormEntry from "src/components/FormEntry";
import FormEntrySkeletonList from "src/components/FormEntrySkeletonList";
import Title from "src/components/Title";
import Unauthorized from "src/components/Unauthorized";
import useAuth from "src/hooks/useAuth";
import DefaultLayout from "src/layouts";
import { Locales } from "src/types/common-types";
import { apiClient } from "src/utils/apiClient";

const Answers = () => {
  const { isLoading: isLoadingPosts, data } = useQuery(["meAnswersGet"], () =>
    apiClient.users.meAnswersGet()
  );
  const { data: user } = useAuth();

  const sortedData = useMemo(() => {
    if (!data) return;

    return [...data].sort(
      (a, b) => b.answer?.answer_time?.getTime()! - a.answer?.answer_time?.getTime()!
    );
  }, [data]);

  const formUser = {
    id: user?.id,
    avatar_url: user?.osu?.avatar_url,
    discord: user?.discord,
    username: user?.osu?.username
  };

  const showFormEntries = data && data?.length! > 0;

  if (!user) {
    return <Unauthorized />;
  }

  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - Answers</title>
      </Head>

      <Title title="Submissions" description="You can edit your answers" />

      <section className="max-height container">
        <div className="mb-12 flex h-full flex-col justify-between rounded-70 bg-black-dark2">
          <div className="h-full">
            <div className="mt-6 px-7">
              <div className="relative flex flex-col gap-y-3">
                {!data && isLoadingPosts && <FormEntrySkeletonList length={10} />}
                {!showFormEntries && (
                  <p className="text-center font-semibold">You didn`t submit any responses yet.</p>
                )}
                {showFormEntries &&
                  sortedData?.map((form) => {
                    return (
                      <FormEntry
                        href={`answers/${form.post?.id}`}
                        key={form.post?.id}
                        user={formUser}
                        id={form.post?.id}
                        banner={form.post?.id}
                        title={form.post?.title}
                        excerpt={form.post?.excerpt}
                        publish_time={form.post?.publish_time}
                      />
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export async function getStaticProps({ locale }: { locale: Locales }) {
  const [translations, global] = await Promise.all([
    import(`../../messages/forms/${locale}.json`),
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

export default Answers;
