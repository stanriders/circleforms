import { useContext } from "react";
import { FieldError, FieldErrors, FieldValues, useForm, UseFormRegister } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useMutation } from "react-query";
import { DevTool } from "@hookform/devtools";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import UserContext from "src/context/UserContext";
import { AsyncReturnType, sleep } from "src/utils/misc";

import {
  PostsIdAnswersPostRequest,
  Question,
  QuestionType,
  SubmissionContract
} from "../../openapi";
import { apiClient } from "../utils/apiClient";
import getImage from "../utils/getImage";

import CheckboxQuestion from "./Questions/CheckboxQuestion";
import ChoiceRadioQuestion from "./Questions/ChoiceRadioQuestion";
import FreeformInputQuestion from "./Questions/FreeformInputQuestion";
import FormHeader from "./FormHeader";

type FormData = {
  [key: string]: string | string[] | undefined;
};

interface IResponseSubmission {
  post: AsyncReturnType<typeof apiClient.posts.postsIdGet>["post"];
  authorUser: AsyncReturnType<typeof apiClient.users.usersIdGet>;

  // these props are passed if we want to view user`s answers
  initialUserAnswers?: FormData;
  urlOsuId?: string;
}

const ResponseSubmission = ({
  post,
  authorUser,
  initialUserAnswers,
  urlOsuId
}: IResponseSubmission) => {
  const t = useTranslations();
  const router = useRouter();
  const { user } = useContext(UserContext);

  let showSubmitButton = true;
  if (initialUserAnswers) {
    showSubmitButton = Object.keys(initialUserAnswers).length === 0;
  }

  const showEditSubmission = urlOsuId === user?.id && post?.allow_answer_edit;

  // Form settings
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({ mode: "onBlur", defaultValues: initialUserAnswers });

  const { mutate } = useMutation((obj: PostsIdAnswersPostRequest) =>
    apiClient.posts.postsIdAnswersPost(obj)
  );

  const onSubmit = handleSubmit((data) => {
    const answers: SubmissionContract[] = [];
    const postTypes = post?.questions?.map((question) => question.type);
    const postQuestions = post?.questions?.map((question) => question.question_info);

    Object.entries(data).map((curr, index) => {
      const [question_id, question_info] = curr;

      switch (postTypes?.[index]) {
        case "Freeform":
          question_info &&
            answers.push({
              question_id: question_id,
              answers: [question_info as string]
            });
          break;

        case "Choice":
          const questionPosition = postQuestions?.[index]?.indexOf(question_info as string);
          if (questionPosition === -1) break;
          answers.push({
            question_id: question_id,
            answers: [String(questionPosition)]
          });
          break;

        case "Checkbox":
          const questionIndex = (question_info as string[])?.map((q, ind) => {
            const questionPosition = postQuestions?.[index]?.indexOf(q);
            if (questionPosition !== -1) return String(ind);
          });
          answers.push({
            question_id: question_id,
            answers: questionIndex.filter(Boolean) as string[]
          });
          break;

        default:
          console.error("Unknown question type: ", postTypes?.[index]);
          break;
      }
    });

    mutate(
      {
        id: post?.id as string,
        submissionContract: answers
      },
      {
        onSuccess: async () => {
          toast.success(t("toast.success"));
          await sleep(600);
          router.push(`/form/${post?.id}`);
        },
        onError: async () => {
          await sleep(600);
          toast.error(t("toast.error"));
        }
      }
    );
  });

  const switchQuestionType = (
    question: Question,
    register: UseFormRegister<FieldValues>,
    errors: { [x: string]: FieldError | FieldErrors[] }
  ) => {
    switch (question.type) {
      case QuestionType.Freeform:
        return (
          <FreeformInputQuestion
            key={question.question_id}
            question={question}
            register={register}
            errors={errors}
            disableEdit={!showEditSubmission && !showSubmitButton}
          />
        );
      case QuestionType.Checkbox:
        return (
          <CheckboxQuestion
            key={question.question_id}
            question={question}
            register={register}
            errors={errors}
            disableEdit={!showEditSubmission && !showSubmitButton}
          />
        );
      case QuestionType.Choice:
        return (
          <ChoiceRadioQuestion
            key={question.question_id}
            question={question}
            register={register}
            errors={errors}
            disableEdit={!showEditSubmission && !showSubmitButton}
          />
        );
      default:
        console.error("Question type doesnt exist");
        break;
    }
  };

  const bannerImg = getImage({ id: post?.id, banner: post?.banner, type: "banner" });

  const iconImg = getImage({ id: post?.id, icon: post?.icon, type: "icon" });

  return (
    <>
      <Toaster />
      <section className="container mb-12">
        {/* background rounded image */}
        <div
          className="w-full h-60 bg-cover rounded-t-70"
          style={{
            backgroundImage: `
              linear-gradient(180deg, rgba(19, 19, 19, 0) -35.06%, #0F0F0F 100%),
              url('${bannerImg}')
            `
          }}
        />
        <FormHeader post={post} authorUser={authorUser} iconImg={iconImg || ""} />
        {/* questions */}
        <form onSubmit={onSubmit} className="flex flex-col gap-6 p-16 pt-12">
          {post?.questions?.map((question) => switchQuestionType(question, register, errors))}
          <div className="flex justify-between">
            <button type="button" className="button dark" onClick={() => router.back()}>
              Back
            </button>
            {/* dont show submit button when looking at results */}
            {showSubmitButton && (
              <button type="submit" className="button secondary">
                Submit response
              </button>
            )}

            {showEditSubmission && (
              <button type="submit" className="button secondary">
                Edit submission
              </button>
            )}
          </div>
        </form>
        <DevTool control={control} /> {/* set up the dev tool */}
      </section>
    </>
  );
};

export default ResponseSubmission;
