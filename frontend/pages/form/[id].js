import Head from 'next/head'
import { GetServerSidePropsContext } from 'next'
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

      <section className="container mb-12">
        <Form
          author={author}
          {...form} />
      </section>
    </DefaultLayout>
  )
}

/**
 * Get form data
 *
 * @param {GetServerSidePropsContext} context
 * @returns
 */
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