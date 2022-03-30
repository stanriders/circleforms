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
        <title>CircleForms - Form</title>
      </Head>

      <section class="container mb-12">
        <Form
          author={author}
          {...form} />
      </section>
    </DefaultLayout>
  )
}

export async function getServerSideProps(context) {
  const form = await api('/posts/id')
  const author = await api('/users/id/minimal')

  return {
    props: {
      form,
      author
    }
  }
}