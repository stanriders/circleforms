import React, { useContext } from "react";
import { useQuery } from "react-query";
import Head from "next/head";
import FormEntry from "src/components/FormEntry";
import FormEntrySkeletonList from "src/components/FormEntrySkeletonList";
import SubTitle from "src/components/SubTitle";
import Unauthorized from "src/components/Unauthorized";
import UserContext from "src/context/UserContext";
import DefaultLayout from "src/layouts";
import { Locales } from "src/types/common-types";
import { apiClient } from "src/utils/apiClient";

const Answers = () => {
  const { isLoading: isLoadingPosts, data } = useQuery(["meAnswersGet"], () =>
    apiClient.users.meAnswersGet()
  );

  const { user } = useContext(UserContext);

  const formUser = {
    id: user?.id,
    // @ts-ignore
    avatarUrl: user?.osu?.avatar_url,
    discord: user?.discord,
    username: user?.osu?.username
  };

  if (!user) {
    return <Unauthorized />;
  }

  const showFormEntries = data && data?.length! > 0;

  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - Answers</title>
      </Head>

      <section className="container max-height">
        <div className="flex flex-col justify-between mb-12 bg-black-dark2 rounded-70 h-full">
          <div className="h-full">
            <div className="mt-6 px-7">
              <SubTitle>Your submissions</SubTitle>
              <div className="flex flex-col gap-y-3 relative">
                {!data && isLoadingPosts && <FormEntrySkeletonList length={10} />}
                {!showFormEntries && (
                  <p className="font-semibold text-center">You didn`t submit any responses yet.</p>
                )}
                {showFormEntries &&
                  data?.map((form) => {
                    return (
                      <FormEntry
                        href={`form/${form.post?.id}/${user.id}`}
                        key={form.post?.id}
                        user={formUser}
                        id={form.post?.id}
                        banner={form.post?.id}
                        title={form.post?.title}
                        excerpt={form.post?.excerpt}
                        publishTime={form.post?.publishTime}
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
