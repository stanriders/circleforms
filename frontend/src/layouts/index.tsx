import classNames from "classnames";
import Head from "next/head";
import { useTranslations } from "next-intl";

import Footer from "../components/Footer";
import Header from "../components/Header";

interface IDefaultLayout {
  children: React.ReactNode;
  classname?: string;
}
export default function DefaultLayout({ children, classname = "mt-28" }: IDefaultLayout) {
  const t = useTranslations("global");

  return (
    <div className="flex h-full flex-col">
      <Head>
        <title>CircleForms</title>
        <meta name="description" content={t("meta.description")} />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          defer
          src="https://umami.stanr.info/script.js"
          data-website-id="3057c664-6ce5-4b09-a802-efe927c7d998"
        ></script>
      </Head>

      <Header />
      <main className={classNames("flex-1", classname)}>{children}</main>
      <Footer />
    </div>
  );
}
