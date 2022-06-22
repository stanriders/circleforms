import { useContext } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useMutation } from "react-query";
// import { DevTool } from "@hookform/devtools";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import UserContext from "src/context/UserContext";
import { AsyncReturnType, sleep } from "src/utils/misc";
import { debounce } from "ts-debounce";

import { PostsIdAnswersPostRequest } from "../../openapi";
import { apiClient } from "../utils/apiClient";
import getImage from "../utils/getImage";

import CustomConfirmModal from "./CustomConfirmModal";
import FormHeader from "./FormHeader";
import { convertDataToAnswers, switchQuestionType } from "./ResponseSubmission.utils";

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

  // Form settings
  const {
    register,
    // control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({ mode: "onBlur", defaultValues: initialUserAnswers });

  const { mutate: submitAnswer } = useMutation((obj: PostsIdAnswersPostRequest) =>
    apiClient.posts.postsIdAnswersPost(obj)
  );
  const { mutate: deleteAnswer } = useMutation((id: string) =>
    apiClient.posts.postsIdAnswersDelete({ id })
  );

  const onSubmit = handleSubmit((data) => {
    const answers = convertDataToAnswers(data, post);

    submitAnswer(
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
          toast.error(t("toast.error"));
        }
      }
    );
  });

  const debouncedHandleDelete = debounce((id: string) => {
    deleteAnswer(id, {
      onSuccess: async () => {
        toast.success("Your submission has been removed");
        await sleep(600);
        router.push(`/answers`);
      },
      onError: () => {
        toast.error("Couldn`t delete your submission");
      }
    });
  }, 500);

  const confirmDeleteModal = CustomConfirmModal({
    title: "Please confirm your action",
    bodyText: "Do you really want to delete your submission?",
    confirmButtonLabel: "Delete",
    confirmCallback: debouncedHandleDelete
  });

  let showSubmitButton = true;
  if (initialUserAnswers) {
    showSubmitButton = Object.keys(initialUserAnswers).length === 0;
  }

  const showEditSubmission = urlOsuId === user?.id && post?.allow_answer_edit;

  const isEditSubmissionDisabled = !showEditSubmission && !showSubmitButton;

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
          {post?.questions?.map((question) =>
            switchQuestionType(question, register, errors, isEditSubmissionDisabled)
          )}
          <div className="flex justify-between mt-9">
            <button type="button" className="button dark" onClick={() => router.back()}>
              Back
            </button>
            {/* dont show submit button when looking at results */}
            {showSubmitButton && (
              <button data-testid="submitResponseButton" type="submit" className="button secondary">
                Submit response
              </button>
            )}

            {showEditSubmission && (
              <button
                type="button"
                className="button primary"
                onClick={() => confirmDeleteModal(post.id)}
              >
                Delete submission
              </button>
            )}

            {showEditSubmission && (
              <button type="submit" className="button secondary">
                Edit submission
              </button>
            )}
          </div>
        </form>
        {/* <DevTool control={control} />  */}
      </section>
    </>
  );
};

export default ResponseSubmission;
