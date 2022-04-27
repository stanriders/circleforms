import Head from "next/head"
import Form from "../../components/Form"
import DefaultLayout from "../../layouts"
import api from "../../libs/api"

export default function SingleForm({ form, author }) {
  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - {form.posts.title}</title>
      </Head>

      <section className="container mb-12">
        <Form {...form} />
      </section>
    </DefaultLayout>
  )
}

export async function getServerSideProps({ params, locale }) {
  const { id } = params

  const [form, translations, global] = await Promise.all([
    await api(`/posts/${id}`),
    import(`../../messages/single-form/${locale}.json`),
    import(`../../messages/global/${locale}.json`),
  ])

  const messages = {
    ...translations,
    ...global,
  }

  return {
    props: {
      form,
      messages,
    },
  }
}
