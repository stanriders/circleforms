import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";

import Form from "../../../components/Form";
import DefaultLayout from "../../../layouts";
import { getApiClient } from "../../../utils/getApiClient";

type ServerSideProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const SingleForm: NextPage<ServerSideProps> = (props) => {
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
  const formid = context.params?.formid || "";
  const apiClient = getApiClient(context.req.headers.cookie);

  const [translations, global, postData] = await Promise.all([
    import(`../../../messages/single-form/${context.locale}.json`),
    import(`../../../messages/global/${context.locale}.json`),
    apiClient.posts.postsIdGet({ id: formid as string })
  ]);

  const authorUser = await apiClient.users.usersIdGet({ id: postData.post?.author_id as string });

  const messages = {
    ...translations,
    ...global
  };

  return {
    props: {
      postData,
      authorUser,
      messages
    }
  };
};

export default SingleForm;
