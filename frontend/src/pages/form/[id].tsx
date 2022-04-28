import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Form from "../../components/Form";
import DefaultLayout from "../../layouts";
import api from "../../libs/api";
import { Locales } from "../../types/common-types";

export default function SingleForm({
  form,
  author
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <DefaultLayout>
      <Head>
        {/* @ts-ignore */}
        <title>CircleForms - {form.posts.title}</title>
      </Head>

      <section className="container mb-12">
        {/* @ts-ignore */}
        <Form {...form} />
      </section>
    </DefaultLayout>
  );
}

interface Props {
  params: { id: number };
  locale: Locales;
}
export async function getServerSideProps({ params, locale }: Props) {
  const { id } = params;

  const [form, translations, global] = await Promise.all([
    await api(`/posts/${id}`),
    import(`../../messages/single-form/${locale}.json`),
    import(`../../messages/global/${locale}.json`)
  ]);

  const messages = {
    ...translations,
    ...global
  };

  return {
    props: {
      form,
      messages
    }
  };
}
