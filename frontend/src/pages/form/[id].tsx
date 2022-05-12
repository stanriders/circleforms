import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";
import Form from "../../components/Form";
import DefaultLayout from "../../layouts";
import { apiClient } from "../../libs/apiClient";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const id = context.params;
  const idString = String(id);

  const posts = await apiClient.posts.postsIdGet({ id: idString });
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
      posts: posts,
      usersAndAnswers: usersAndAnswers,
      messages: messages
    }
  };
};

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

export default SingleForm;
