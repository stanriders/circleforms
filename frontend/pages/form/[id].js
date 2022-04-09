import Head from 'next/head'
import DefaultLayout from '../../layouts'
import Form from '../../components/molecules/Form'
import api from '../../libs/api'

export default function SingleForm({
  form,
  author
}) {
  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - {form.title}</title>
      </Head>

      <section className="container mb-12">
        <Form
          author={author}
          {...form} />
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
  const author = await api(`/users/${form.author_id}/minimal`)


  const messages = {
    ...translations,
    ...global
  }

  return {
    props: {
      form,
      author,
      messages
    }
  }
}