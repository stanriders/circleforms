import InferNextPropsType from "infer-next-props-type";
import { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { AsyncReturnType } from "src/utils/misc";

import Form from "../../../components/Form";
import DefaultLayout from "../../../layouts";
import { getApiClient } from "../../../utils/getApiClient";

// https://github.com/vercel/next.js/issues/15913#issuecomment-950330472
type ServerSideProps = InferNextPropsType<typeof getServerSideProps>;

const SingleForm: NextPage<ServerSideProps> = (props: ServerSideProps) => {
  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - {props.postData.post?.title}</title>
      </Head>

      <section className="container mb-12">
        <Form postData={props.postData} authorUser={props.authorUser} />
      </section>
    </DefaultLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  // we need to create a new apiClient because cookies are not present on the server
  const apiClient = getApiClient(context.req.headers.cookie);

  const formid = context.params?.formid || "";
  const accessKey = context.query?.access_key || "";

  const promises = await Promise.allSettled([
    import(`../../../messages/single-form/${context.locale}.json`),
    import(`../../../messages/global/${context.locale}.json`),
    apiClient.posts.postsIdGet({ id: formid as string, key: accessKey as string })
  ]);

  const [translations, global, postData] = promises.map((p) =>
    p.status === "fulfilled" ? p?.value : null
  );

  const typedPost = postData as AsyncReturnType<typeof apiClient.posts.postsIdGet>;

  if (!typedPost) {
    return {
      notFound: true
    };
  }

  const authorUser = await apiClient.users.usersIdGet({ id: typedPost.post?.author_id as string });

  const messages = {
    ...translations,
    ...global
  };

  return {
    props: {
      postData: typedPost,
      authorUser,
      messages
    }
  };
};

export default SingleForm;
