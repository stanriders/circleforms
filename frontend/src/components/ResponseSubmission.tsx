import { DevTool } from "@hookform/devtools";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { FieldError, FieldErrors, FieldValues, useForm, UseFormRegister } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useMutation } from "react-query";
import {
  PostsIdAnswersPostRequest,
  PostWithQuestionsContract,
  Question,
  QuestionType,
  SubmissionContract,
  UserContract
} from "../../openapi";
import { apiClient } from "../libs/apiClient";
import getImage from "../utils/getImage";
import CheckboxQuestion from "./CheckboxQuestion";
import ChoiceRadioQuestion from "./ChoiceRadioQuestion";
import FreeformInputQuestion from "./FreeformInputQuestion";
import Tag from "./Tag";

type FormData = {
  [key: string]: string | string[];
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
    showSubmitButton = Object.keys(defaultUserAnswers!).length === 0;
  }

  // Form settings
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({ mode: "onBlur", defaultValues: defaultUserAnswers });

  const { mutate } = useMutation(
    (obj: PostsIdAnswersPostRequest) => apiClient.posts.postsIdAnswersPost(obj),
    {
      onSuccess: () => {
        toast.success(t("toast.success"));
      },
      onError: () => {
        toast.error(t("toast.error"));
      }
    }
  );

  const onSubmit = handleSubmit((data) => {
    const answers: SubmissionContract[] = [];

    Object.entries(data).map((curr) => {
      // delete boolean answers
      let filteredAnswers: string[] | null = null;
      if (Array.isArray(curr[1])) {
        filteredAnswers = curr[1]?.filter((v) => typeof v !== "boolean");
      }

      // @ts-ignore Waiting for backend to support string[]
      answers.push({ questionId: curr[0], answer: filteredAnswers ? filteredAnswers : curr[1] });
    });

    mutate({
      id: post.id as string,
      submissionContract: answers
    });
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
            question={question}
            register={register}
            errors={errors}
            disableEdit={!showSubmitButton}
          />
        );
      case QuestionType.Checkbox:
        return (
          <CheckboxQuestion
            question={question}
            register={register}
            errors={errors}
            disableEdit={!showSubmitButton}
          />
        );
      case QuestionType.Choice:
        return (
          <ChoiceRadioQuestion
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

  const bannerImg = getImage({ banner: post.banner, id: post.id, type: "banner" });
  const iconImg = getImage({ banner: post.icon, id: post.id, type: "icon" });

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
        {/* form header */}
        <div className="bg-black-dark2 p-16 relative rounded-b-70">
          <div className="absolute top-0 left-16 right-16 flex items-start justify-between">
            <div className="flex items-center gap-x-3">
              <div className="relative shrink-0 min-w-fit">
                <img
                  className="h-20 w-20 rounded-full"
                  src={iconImg}
                  alt={`${post.title}'s thumbnail`}
                />
                <img
                  className="h-10 w-10 rounded-full absolute bottom-0 right-0"
                  src={authorUser?.osu?.avatar_url}
                  alt={`${authorUser.osu?.username}'s avatar`}
                />
              </div>
              <div>
                <h1 className="text-4xl font-bold">{post.title}</h1>
                <p className="text-white text-opacity-50 text-2xl">
                  {post.answerCount ?? post.answerCount} {t("answersCount")}
                </p>
              </div>
            </div>
            <div className="p-4 pr-0 mt-[-6px]">
              <Tag
                label={post.isActive ? t("active") : t("inactive")}
                theme={post.isActive ? "success" : "stale"}
              />
            </div>
          </div>
        </div>
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
