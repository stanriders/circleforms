import Head from 'next/head'
import Header from "../components/Header";
import Footer from "../components/Footer";
import constants from '../constants';

export default function DefaultLayout({ children }) {
  return (
    <div className="h-full flex flex-col">
      <Head>
        <title>CircleForms</title>
        <meta name="description" content={constants.meta.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-1">
        { children }
      </main>

      <Footer />
    </div>
  )
}