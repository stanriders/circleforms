import React from "react";
import InferNextPropsType from "infer-next-props-type";
import { GetServerSidePropsContext } from "next";
import useAuth from "src/hooks/useAuth";
import { AsyncReturnType } from "src/utils/misc";

import CreateForm from "../../components/CreateForm/CreateForm";
import Unauthorized from "../../components/Unauthorized";
import { getApiClient } from "../../utils/getApiClient";

// https://github.com/vercel/next.js/issues/15913#issuecomment-950330472
type ServerSideProps = InferNextPropsType<typeof getServerSideProps>;

const EditForm = (props: ServerSideProps) => {
  const { data: user } = useAuth();

  if (!user) {
    return <Unauthorized />;
  }

  return <CreateForm postData={props.postData} />;
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  // we need to create a new apiClient because cookies are not present on the server
  const apiClient = getApiClient(context.req.headers.cookie);
  const formid = context.params?.id || "";
  const locale = context.locale;

  const promises = await Promise.allSettled([
    import(`../../messages/create-a-form/${locale}.json`),
    import(`../../messages/global/${locale}.json`),
    apiClient.posts.postsIdGet({ id: formid as string })
  ]);
  const [translations, global, post] = promises.map((p) =>
    p.status === "fulfilled" ? p?.value : null
  );
  const typedPost = post as AsyncReturnType<typeof apiClient.posts.postsIdGet>;

  if (!typedPost?.post?.id) {
    return {
      notFound: true
    };
  }

  const messages = {
    ...translations,
    ...global
  };

  return {
    props: {
      postData: typedPost,
      messages
    }
  };
};
export default EditForm;
