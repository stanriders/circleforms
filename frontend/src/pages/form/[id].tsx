import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";
import Form from "../../components/Form";
import DefaultLayout from "../../layouts";
import { getApiClient } from "../../utils/getApiClient";

type ServerSideProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const SingleForm: NextPage<ServerSideProps> = (props) => {
  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - {props.posts.title}</title>
      </Head>

      <section className="container mb-12">
        <Form posts={props.posts} user={props.user} />
      </section>
    </DefaultLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  // we need to create a new apiClient because cookies are not present on the server
  const apiClient = getApiClient(context.req.headers.cookie);
  const id = context.params?.id || "";

  const [translations, global, posts] = await Promise.all([
    import(`../../messages/single-form/${context.locale}.json`),
    import(`../../messages/global/${context.locale}.json`),
    apiClient.posts.postsIdGet({ id: id as string })
  ]);

  const user = await apiClient.users.usersIdGet({ id: posts.authorId as string });

  const messages = {
    ...translations,
    ...global
  };

  return {
    props: {
      posts,
      user,
      messages
    }
  };
};

export default SingleForm;
