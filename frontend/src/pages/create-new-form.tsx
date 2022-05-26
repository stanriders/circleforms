import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@reach/tabs";
import { useTranslations } from "next-intl";
import Head from "next/head";
import React from "react";
import { Toaster } from "react-hot-toast";
import Button from "../components/Button";
import DesignTab from "../components/DesignTab";
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

      <section className="container space-y-8 mb-12">
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
            {/* Questions */}
            {/* <TabPanel className="relative">
              <div
                className="
                absolute -right-28 top-0
                rounded-35 bg-black-lightest py-8 px-2
                flex flex-col items-center
              "
              >
                <button className="button--icon">
                  <MdAddCircleOutline className="w-10 h-10" />
                </button>

                {QUESTIONS_TYPES.map((type) => {
                  const Icon = QUESTIONS_ICONS[type];

                  return (
                    <button key={type} className="button--icon">
                      <span className="sr-only">
                        {t("add")} {t(`inputs.${type}`)}
                      </span>
                      <Icon className="w-10 h-10" />
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-4 rounded-35 bg-black-lighter pt-5 pb-8 px-14 relative overflow-clip">
                  <div className="absolute left-0 top-0 bg-pink h-2 w-full" />
                  <input
                    className="input--inline input--title"
                    type="text"
                    placeholder={t("placeholders.title")}
                    defaultValue={t("placeholders.titleValue")}
                  />
                  <input
                    className="input--inline"
                    type="text"
                    placeholder={t("placeholders.excerpt")}
                  />
                  <Wysiwyg value={state.description} placeholder={t("placeholders.description")} />
                </div>

                {state.questions.map((question, index) => {
                  const Component = COMPONENTS_TYPES[question.type];

                  return <Component key={index} {...question} />;
                })}
              </div>
            </TabPanel> */}
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
