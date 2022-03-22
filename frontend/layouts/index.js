import Head from 'next/head'
import Header from "../components/Header";
import Footer from "../components/Footer";
import constants from '../constants';
import { Fragment } from 'react';

export default function DefaultLayout({ children }) {
  return (
    <div className="flex flex-col h-full">
      <Head>
        <title>CircleForms</title>
        <meta name="description" content={constants.meta.description} />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <Header />

      <main className="flex-1">
        { children }
      </main>

      <Footer />
    </div>
  )
}