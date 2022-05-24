import { GetStaticPropsContext, InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";

import DefaultLayout from "../../layouts";
import { apiClient } from "../../libs/apiClient";

import ResponseSubmission from "../../components/ResponseSubmission";
import { useContext } from "react";
import UserContext from "../../context/UserContext";
import Unauthorized from "../../components/Unauthorized";

type StaticSideProps = InferGetStaticPropsType<typeof getStaticProps>;

const Questions: NextPage<StaticSideProps> = (props) => {
  const { post, authorUser } = props;

  const { user } = useContext(UserContext);
  if (!user) {
    return <Unauthorized />;
  }

  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - {post.title}</title>
      </Head>

      <ResponseSubmission post={post} authorUser={authorUser} />
    </DefaultLayout>
  );
};

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps(context: GetStaticPropsContext) {
  const id = context.params?.id;

  const [translations, global, post] = await Promise.all([
    import(`../../messages/single-form/${context.locale}.json`),
    import(`../../messages/global/${context.locale}.json`),
    apiClient.posts.postsIdGet({ id: id as string })
  ]);
  const messages = {
    ...translations,
    ...global
  };

  const authorUser = await apiClient.users.usersIdGet({ id: post.authorId as string });

  return {
    props: {
      post,
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
  const pageIds = await apiClient.posts.postsAllGet();

  // Get the paths we want to pre-render based on posts
  const paths = pageIds.map((pageId) => ({
    params: { id: pageId }
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: "blocking" };
}

export default Questions;
