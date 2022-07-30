import { useMemo } from "react";
import toast from "react-hot-toast";
import SVG from "react-inlinesvg";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Head from "next/head";
import Link from "next/link";
import { useTranslations } from "next-intl";
import CustomConfirmModal from "src/components/CustomConfirmModal";
import useAuth from "src/hooks/useAuth";
import { AsyncReturnType } from "src/utils/misc";
import { debounce } from "ts-debounce";

import FormCard from "../../components/FormCard";
import FormEntry from "../../components/FormEntry";
import FormEntrySkeletonList from "../../components/FormEntrySkeletonList";
import Title from "../../components/Title";
import Unauthorized from "../../components/Unauthorized";
import DefaultLayout from "../../layouts";
import { Locales } from "../../types/common-types";
import { apiClient } from "../../utils/apiClient";

const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: string) => {
      await apiClient.posts.postsIdDelete({ id });
      return id;
    },
    {
      onSuccess: (id) => {
        type MyPosts = AsyncReturnType<typeof apiClient.users.mePostsGet>;
        // Snapshot the previous value
        const previousPosts = queryClient.getQueryData<MyPosts>("mePostsGet");

        // update query data
        if (previousPosts) {
          queryClient.setQueryData<MyPosts>("mePostsGet", () =>
            previousPosts.filter((post) => post.id !== id)
          );
        }
        toast.success("Post has been deleted");
      }
    }
  );
};

const Dashboard = () => {
  const t = useTranslations();
  const { data: user } = useAuth();
  const { error, data, isLoading } = useQuery("mePostsGet", () => apiClient.users.mePostsGet());
  const { mutate: deletePost } = useDeletePost();

  const unpublishedPosts = useMemo(
    () => data?.filter((val) => val.published === false).reverse(),
    [data]
  );
  const publishedPosts = useMemo(
    () => data?.filter((val) => val.published === true).reverse(),
    [data]
  );

  const debouncedHandleDelete = debounce((id: string) => {
    deletePost(id);
  }, 500);

  const confirmDeleteModal = CustomConfirmModal({
    title: "Please confirm your action",
    bodyText: "Do you really want to delete this form?",
    confirmButtonLabel: "Delete",
    confirmCallback: debouncedHandleDelete
  });

  if (error instanceof Error) return <p>{"An error has occurred: " + error.message}</p>;

  if (!user) {
    return <Unauthorized />;
  }

  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - {t("title")}</title>
      </Head>

      <Title title={t("subtitle")} description={t("description")} />

      <div className="container flex flex-col gap-8 rounded-40 bg-black-dark2 py-5 px-8">
        <p className="text-center text-xl">Unpublished</p>
        <section>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <Link href="/create-new-form" passHref>
              <a
                data-testid="createNewFormButton"
                className="flex h-[88px] items-center justify-center rounded-20 bg-pink  transition-transform ease-out-cubic hover:scale-99"
                title="Create your form"
              >
                <SVG src="/svg/plus.svg" />
              </a>
            </Link>
            {unpublishedPosts?.map((form, index) => (
              <FormCard
                onDelete={() => confirmDeleteModal(form.id!)}
                key={form?.id ? form.id : index}
                post={form}
              />
            ))}
          </div>
        </section>
        {publishedPosts?.length !== 0 && <p className="text-center text-xl">Published</p>}
        <section className="relative flex flex-col gap-y-3">
          {!data && isLoading && <FormEntrySkeletonList length={10} />}
          {publishedPosts &&
            publishedPosts?.map((form) => {
              return (
                <FormEntry
                  href={`/form/${form.id}`}
                  key={form.id}
                  user={{
                    username: user?.osu?.username,
                    avatar_url: "/images/avatar-guest.png",
                    id: user?.id
                  }}
                  id={form.id}
                  banner={form.banner}
                  title={form.title}
                  excerpt={form.excerpt}
                  publish_time={form.publish_time}
                />
              );
            })}
        </section>
      </div>
    </DefaultLayout>
  );
};

export async function getStaticProps({ locale }: { locale: Locales }) {
  const [translations, global] = await Promise.all([
    import(`../../messages/dashboard/${locale}.json`),
    import(`../../messages/global/${locale}.json`)
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

export default Dashboard;
