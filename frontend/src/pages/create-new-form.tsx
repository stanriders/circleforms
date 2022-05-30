import React from "react";
import { Toaster } from "react-hot-toast";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@reach/tabs";
import Head from "next/head";
import { useTranslations } from "next-intl";

import Button from "../components/Button";
import DesignTab from "../components/CreateForm/DesignTab";
import QuestionsTab from "../components/CreateForm/QuestionsTab";
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
              <DesignTab />
            </TabPanel>

            <TabPanel className="relative">
              <div>post</div>
            </TabPanel>
            {/* Questions */}
            <TabPanel className="relative">
              <QuestionsTab />
            </TabPanel>
            <TabPanel>
              <div>options</div>
            </TabPanel>
            {/* Options */}
            {/* <TabPanel>
              <Select
                defaultValue={ACCESSIBILITY_OPTIONS[0]}
                options={ACCESSIBILITY_OPTIONS.map((option) => ({
                  value: option,
                  label: t(`accessibility.${option}`)
                }))}
              />
            </TabPanel> */}
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
