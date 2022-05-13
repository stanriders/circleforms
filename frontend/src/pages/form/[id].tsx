import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";
import Form from "../../components/Form";
import DefaultLayout from "../../layouts";
import { getServerApiClient } from "../../utils/getServerApiClient";

type ServerSideProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const SingleForm: NextPage<ServerSideProps> = (props) => {
  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - {props.posts.title}</title>
      </Head>

      <section className="container mb-12">
        <Form
          posts={props.posts}
          users={props.usersAndAnswers.users}
          answers={props.usersAndAnswers.answers}
        />
      </section>
    </DefaultLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  // we need to create a new apiClient because cookies are not present on the server
  const apiClient = getServerApiClient(context.req.headers.cookie);

  const id = context.params?.id;
  const idString = String(id);

  const postsRes = await apiClient.posts.postsIdGet({ id: idString });
  const usersAndAnswers = await apiClient.posts.postsIdAnswersGet({ id: idString });

  const [translations, global] = await Promise.all([
    import(`../../messages/single-form/${context.locale}.json`),
    import(`../../messages/global/${context.locale}.json`)
  ]);

  const messages = {
    ...translations,
    ...global
  };

  return {
    props: {
      // because it needs to serialize Dates in JSON to pass them to the page
      posts: JSON.parse(JSON.stringify(postsRes)),
      usersAndAnswers: usersAndAnswers,
      messages: messages
    }
  };
};

export default SingleForm;
