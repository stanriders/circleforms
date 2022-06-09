import { FieldError, FieldErrors, FieldValues, useForm, UseFormRegister } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useMutation } from "react-query";
import { DevTool } from "@hookform/devtools";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { sleep } from "src/utils/misc";

import {
  PostsIdAnswersPostRequest,
  PostWithQuestionsContract,
  Question,
  QuestionType,
  SubmissionContract,
  UserContract
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
  post: PostWithQuestionsContract;
  authorUser: UserContract;

  // these props are passed if we want to view user`s answers
  defaultUserAnswers?: FormData;
}

const ResponseSubmission = ({ post, authorUser, defaultUserAnswers }: IResponseSubmission) => {
  const t = useTranslations();
  const router = useRouter();

  let showSubmitButton = true;
  if (defaultUserAnswers) {
    showSubmitButton = Object.keys(defaultUserAnswers).length === 0;
  }

  // Form settings
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({ mode: "onBlur", defaultValues: defaultUserAnswers });

  const { mutate } = useMutation((obj: PostsIdAnswersPostRequest) =>
    apiClient.posts.postsIdAnswersPost(obj)
  );

  const onSubmit = handleSubmit((data) => {
    const answers: SubmissionContract[] = [];
    const postTypes = post?.questions?.map((question) => question.type);
    const postQuestions = post?.questions?.map((question) => question.questionInfo);

    Object.entries(data).map((curr, index) => {
      const [questionId, questionInfo] = curr;

      switch (postTypes?.[index]) {
        case "Freeform":
          questionInfo &&
            answers.push({
              questionId: questionId,
              answers: [questionInfo as string]
            });
          break;

        case "Choice":
          const questionPosition = postQuestions?.[index]?.indexOf(questionInfo as string);
          if (questionPosition === -1) break;
          answers.push({
            questionId: questionId,
            answers: [String(questionPosition)]
          });
          break;

        case "Checkbox":
          const questionIndex = (questionInfo as string[])?.map((q, ind) => {
            const questionPosition = postQuestions?.[index]?.indexOf(q);
            if (questionPosition !== -1) return String(ind);
          });
          answers.push({
            questionId: questionId,
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
        id: post.id as string,
        submissionContract: answers
      },
      {
        onSuccess: async () => {
          toast.success(t("toast.success"));
          await sleep(600);
          router.push(`/form/${post.id}`);
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
            key={question.questionId}
            question={question}
            register={register}
            errors={errors}
            disableEdit={!showSubmitButton}
          />
        );
      case QuestionType.Checkbox:
        return (
          <CheckboxQuestion
            key={question.questionId}
            question={question}
            register={register}
            errors={errors}
            disableEdit={!showSubmitButton}
          />
        );
      case QuestionType.Choice:
        return (
          <ChoiceRadioQuestion
            key={question.questionId}
            question={question}
            register={register}
            errors={errors}
            disableEdit={!showSubmitButton}
          />
        );
      default:
        console.error("Question type doesnt exist");
        break;
    }
  };

  const bannerImg = getImage({ id: post.id, banner: post.banner, type: "banner" });

  const iconImg = getImage({ id: post.id, icon: post.icon, type: "icon" });

  return (
    <>
      <Toaster />
      <section className="container mb-12">
        {/* background rounded image */}
        <div
          className="bg-cover h-60 w-full rounded-t-70"
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
          {post.questions?.map((question) => switchQuestionType(question, register, errors))}
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
          </div>
        </form>
        <DevTool control={control} /> {/* set up the dev tool */}
      </section>
    </>
  );
};

export default ResponseSubmission;
