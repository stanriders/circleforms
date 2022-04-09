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

export async function getServerSideProps(context) {
  const { id } = context.params

  const form = await api(`/posts/${id}`)
  const author = await api(`/users/${form.author_id}/minimal`)

  return {
    props: {
      form,
      author
    }
  }
}

export async function getStaticProps({ locale }) {
  const [translations, global] = await Promise.all([
    import(`../messages/single-form/${locale}.json`),
    import(`../messages/global/${locale}.json`),
  ])


  const messages = {
    ...translations,
    ...global
  }

  return {
    props: {
      messages
    }
  };
}