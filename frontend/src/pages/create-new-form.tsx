import React from "react";
import { Toaster } from "react-hot-toast";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@reach/tabs";
import Head from "next/head";
import { useTranslations } from "next-intl";

import Button from "../components/Button";
import TabDesign from "../components/CreateForm/TabDesign";
import TabOptions from "../components/CreateForm/TabOptions";
import TabPost from "../components/CreateForm/TabPost";
import TabQuestions from "../components/CreateForm/TabQuestions";
import DefaultLayout from "../layouts";
import { Locales } from "../types/common-types";

const CreateNewForm = () => {
  const t = useTranslations();

  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - {t("title")}</title>
      </Head>

      <Toaster />

      <section className="container space-y-8 mb-12 ">
        <Tabs>
          <TabList>
            <Tab>{t("tabs.design")}</Tab>
            <Tab>Post</Tab>
            <Tab>{t("tabs.questions")}</Tab>
            <Tab>{t("tabs.options")}</Tab>
          </TabList>

          <TabPanels className="bg-black-lightest px-8 py-5 rounded-b-3xl">
            <TabPanel>
              <TabDesign />
            </TabPanel>

            <TabPanel className="relative">
              <TabPost />
            </TabPanel>
            {/* Questions */}
            <TabPanel className="relative">
              <TabQuestions />
            </TabPanel>
            <TabPanel>
              <TabOptions />
            </TabPanel>
          </TabPanels>
        </Tabs>

        <div className="flex justify-center">
          <Button>{t("createForm")}</Button>
        </div>
      </section>
    </DefaultLayout>
  );
};

export async function getStaticProps({ locale }: { locale: Locales }) {
  const [translations, global] = await Promise.all([
    import(`../messages/create-a-form/${locale}.json`),
    import(`../messages/global/${locale}.json`)
  ]);

  const messages = {
    ...translations,
    ...global
  };

  return {
    props: {
      messages
    }
  };
}

export default CreateNewForm;
