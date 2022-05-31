import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@reach/tabs";
import Head from "next/head";
import { useTranslations } from "next-intl";

import { MinimalPostContract } from "../../../openapi";
import DefaultLayout from "../../layouts";
import { isEmpty } from "../../utils/misc";
import { useFormData } from "../FormContext";

import TabDesign from "./TabDesign";
import TabOptions from "./TabOptions";
import TabPost from "./TabPost";
import TabQuestions from "./TabQuestions";

interface ICreateForm {
  post?: MinimalPostContract;
}
const CreateForm = ({ post }: ICreateForm) => {
  const t = useTranslations();
  const { data, setValues } = useFormData();

  useEffect(() => {
    // @ts-ignore
    if (!isEmpty(post) && isEmpty(data)) {
      setValues(post);
    }
  }, [post, setValues, data]);

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
              <TabDesign
                initialTitle={post?.title as string}
                initialDescription={post?.excerpt as string}
                initialPostid={post?.id as string}
                initialBanner={post?.banner as string}
                initialIcon={post?.icon as string}
              />
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
      </section>
    </DefaultLayout>
  );
};

export default CreateForm;
