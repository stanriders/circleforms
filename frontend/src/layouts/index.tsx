import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

import classNames from "classnames";
import { useTranslations } from "next-intl";

interface IDefaultLayout {
  children: React.ReactNode;
  classname?: string;
}
export default function DefaultLayout({ children, classname = "mt-28" }: IDefaultLayout) {
  const t = useTranslations("global");

  return (
    <div className="flex flex-col h-full">
      <Head>
        <title>CircleForms</title>
        <meta name="description" content={t("meta.description")} />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <Header />
      <main className={classNames("flex-1", classname)}>{children}</main>
      <Footer />
    </div>
  );
}
