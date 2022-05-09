import { GetServerSideProps, GetServerSidePropsResult, NextPage } from "next";
import Head from "next/head";
import Form from "../../components/Form";
import DefaultLayout from "../../layouts";
import { apiClient } from "../../libs/apiClient";
import { Locales, PostsId, PostsIdAnswers } from "../../types/common-types";

const SingleForm: NextPage<ServerProps> = ({ posts, usersAndAnswers }) => {
  console.log(posts);

  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - {posts.title}</title>
      </Head>

      <section className="container mb-12">
        <Form posts={posts} users={usersAndAnswers.users} answers={usersAndAnswers.answers} />
      </section>
    </DefaultLayout>
  );
};

type ServerProps = {
  posts: PostsId;
  messages: any;
  usersAndAnswers: PostsIdAnswers;
};

type ServerParams = {
  id: string;
  locale: Locales;
};

export const getServerSideProps: GetServerSideProps<ServerProps, ServerParams> = async (
  context
): Promise<GetServerSidePropsResult<ServerProps>> => {
  const id = context.params as ServerParams;
  const idString = String(id)

  type Resp = [PostsId, PostsIdAnswers, any, any];
  const [posts, usersAndAnswers, translations, global] = await Promise.all<Resp>([
    await apiClient.posts.postsIdGet({id: idString}),
    await apiClient.posts.postsIdAnswersGet({id : idString }),
    import(`../../messages/single-form/${context.locale}.json`),
    import(`../../messages/global/${context.locale}.json`)
  ]);

  const messages = {
    ...translations,
    ...global
  };

  return {
    props: {
      posts,
      usersAndAnswers,
      messages
    }
  };
};

export default SingleForm;
