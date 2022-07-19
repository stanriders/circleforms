import { GetStaticPropsContext, InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import useAuth from "src/hooks/useAuth";

import ResponseSubmission from "../../components/ResponseSubmission";
import Unauthorized from "../../components/Unauthorized";
import DefaultLayout from "../../layouts";
import { apiClient } from "../../utils/apiClient";

export type StaticSideProps = InferGetStaticPropsType<typeof getStaticProps>;

const Questions: NextPage<StaticSideProps> = (props) => {
  const { postData, authorUser } = props;

  const { data: user } = useAuth();
  if (!user) {
    return <Unauthorized />;
  }

  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - {postData.post?.title}</title>
      </Head>

      <ResponseSubmission post={postData.post} authorUser={authorUser} />
    </DefaultLayout>
  );
};

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps(context: GetStaticPropsContext) {
  const id = context.params?.id;

  const [translations, global, postData] = await Promise.all([
    import(`../../messages/single-form/${context.locale}.json`),
    import(`../../messages/global/${context.locale}.json`),
    apiClient.posts.postsIdGet({ id: id as string })
  ]);
  const messages = {
    ...translations,
    ...global
  };

  const authorUser = await apiClient.users.usersIdGet({ id: postData.post?.author_id as string });

  return {
    props: {
      postData,
      messages,
      authorUser
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 60 seconds
    revalidate: 60 // In seconds
  };
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
export async function getStaticPaths() {
  let pageIds;
  try {
    pageIds = await apiClient.posts.postsAllGet();
  } catch (e) {
    console.log("Failed to get posts/all");
    console.log(e);
  }

  // Get the paths we want to pre-render based on posts
  const paths = pageIds?.map((pageId) => ({
    params: { id: pageId }
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths: paths || [], fallback: "blocking" };
}

export default Questions;
