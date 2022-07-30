import React, { useEffect, useMemo } from "react";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@reach/tabs";
import Head from "next/head";
import { useTranslations } from "next-intl";
import { apiClient } from "src/utils/apiClient";

import DefaultLayout from "../../layouts";
import { AsyncReturnType, isEmpty } from "../../utils/misc";
import { useFormData } from "../FormContext";

import TabDesign from "./TabDesign";
import TabOptions from "./TabOptions";
import TabPost from "./TabPost";
import TabQuestions, { QuestionEntry } from "./TabQuestions";

interface ICreateForm {
  postData?: AsyncReturnType<typeof apiClient.posts.postsIdGet>;
}
const CreateForm = ({ postData }: ICreateForm) => {
  const post = postData?.post;

  const t = useTranslations();
  const { data, setValues } = useFormData();

  const convertedQuestions = useMemo(
    () =>
      post?.questions?.map((val) => {
        const formattedQuestions = val.question_info?.map((str) => ({ value: str }));
        return { ...val, question_info: formattedQuestions };
      }),
    [post?.questions]
  );

  // set form data for editing
  useEffect(() => {
    // kind of a hack, but idk how to make isEmpty function work with custom types
    if (!isEmpty(post as Record<any, unknown>) && isEmpty(data)) {
      setValues({
        ...post,
        questions: { questions: convertedQuestions }
      });
    }
  }, [setValues, data, convertedQuestions, postData?.post, post]);

  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - {t("title")}</title>
      </Head>

      <section className="container mb-12 space-y-8 ">
        <Tabs>
          <TabList>
            <Tab>{t("tabs.design")}</Tab>
            <Tab>Post</Tab>
            <Tab>{t("tabs.questions")}</Tab>
            <Tab>{t("tabs.options")}</Tab>
          </TabList>

          <TabPanels className="rounded-b-3xl  bg-black-lightest py-5 px-8">
            <TabPanel>
              <TabDesign post={post} />
            </TabPanel>

            <TabPanel className="relative">
              <TabPost defaultDescription={post?.description as string} />
            </TabPanel>
            {/* Questions */}
            <TabPanel className="relative">
              <TabQuestions
                defaultValues={{
                  questions: convertedQuestions as QuestionEntry[]
                }}
              />
            </TabPanel>
            <TabPanel>
              <TabOptions post={post} isEdit={post?.active_to ? true : false} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </section>
    </DefaultLayout>
  );
};

export default CreateForm;
