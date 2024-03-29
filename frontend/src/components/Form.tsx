import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@reach/tabs";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { StatisticsRulesets } from "openapi";
import useAuth from "src/hooks/useAuth";
import { AsyncReturnType } from "src/utils/misc";

import { apiClient } from "../utils/apiClient";
import bbcode from "../utils/bbcode";
import getImage from "../utils/getImage";
import { dynamicSort } from "../utils/objectSort";

import Button from "./Button";
import CustomConfirmModal from "./CustomConfirmModal";
import FormHeader from "./FormHeader";
import FormStatistics from "./FormStatistics";
import InputRadio from "./InputRadio";
import Player from "./Player";

interface IFormProps {
  postData: AsyncReturnType<typeof apiClient.posts.postsIdGet>;
  authorUser: AsyncReturnType<typeof apiClient.users.usersIdGet>;
}

export default function Form({ postData, authorUser }: IFormProps) {
  const { description, id, banner, icon, access_key } = postData?.post!;
  const t = useTranslations();
  const router = useRouter();
  const { data: user } = useAuth();
  const [sort, setSort] = useState("rank");
  const [showResponseButton, setShowResponseButton] = useState<boolean>();

  useEffect(() => {
    setShowResponseButton(user !== null);
  }, [user]);

  const { data: usersAndAnswers } = useQuery(
    ["postsIdAnswersGet", id],
    () => apiClient.posts.postsIdAnswersGet({ id: id as string }),
    { enabled: user?.id === postData.post?.author_id }
  );

  const [sortedPlayers, setSortedPlayers] = useState(usersAndAnswers?.users);

  useEffect(() => {
    if (sort === "rank") {
      let sorted = [...(usersAndAnswers?.users || [])];
      dynamicSort(sorted, "-id");
      setSortedPlayers(sorted.reverse());
    } else {
      setSortedPlayers(usersAndAnswers?.users);
    }
  }, [sort, usersAndAnswers?.users]);

  const showResults = postData.post?.author_id === user?.id;
  const showShareButton = access_key && postData.post?.author_id === user?.id;
  const bannerImg = getImage({ id, banner, type: "banner" });
  const iconImg = getImage({ id, icon, type: "icon" });

  const showAdminPanel =
    user?.roles?.includes("Admin") ||
    user?.roles?.includes("SuperAdmin") ||
    user?.roles?.includes("Moderator");

  const handleOnUnpublish = async () => {
    await apiClient.posts.postsIdUnpublishPost({ id: postData.post?.id! });
    router.push("/forms");
  };

  const confirmUnpublishModal = CustomConfirmModal({
    title: "Please confirm your action",
    bodyText: "You will unpublish this post",
    confirmButtonLabel: "Unpublish",
    confirmCallback: handleOnUnpublish
  });

  return (
    <div>
      <div
        className="h-60 w-full rounded-t-70 bg-cover"
        style={{
          backgroundImage: `
            linear-gradient(180deg, rgba(19, 19, 19, 0) -35.06%, #0F0F0F 100%),
            url('${bannerImg}')
          `
        }}
      />

      <FormHeader post={postData?.post} authorUser={authorUser!} iconImg={iconImg || ""} />

      <Tabs className="mt-16 mb-4">
        <TabList>
          <Tab data-testid="infoTab">{t("tabs.info.title")}</Tab>
          {usersAndAnswers?.users && <Tab data-testid="answersTab">{t("tabs.answers.title")}</Tab>}
          {showResults && <Tab>Results</Tab>}
          {showAdminPanel && <Tab>Admin</Tab>}
        </TabList>

        <TabPanels className="rounded-b-3xl bg-black-lightest py-5 px-8">
          <TabPanel>
            <div
              className="bbcode"
              dangerouslySetInnerHTML={{
                __html: bbcode(description || "")
              }}
            />
          </TabPanel>
          {usersAndAnswers?.users && (
            <TabPanel>
              <div
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSort(e.target.value)}
                className="flex flex-col gap-4"
              >
                <InputRadio
                  inputProps={{ name: "sort", value: "rank" }}
                  labelText={t("sort.rank")}
                />
                <InputRadio
                  inputProps={{ name: "sort", value: "date" }}
                  labelText={t("sort.date")}
                />
              </div>

              <div className="mt-11 mb-10 w-full rounded-14 border-4 border-pink py-2 text-center text-pink">
                <p dangerouslySetInnerHTML={{ __html: t.raw("mistakeNotice") }} />
              </div>
              <div className="flex flex-col gap-1">
                {sortedPlayers?.map((player) => {
                  const postGameMode = postData.post?.gamemode?.toLowerCase();
                  let country_rank = 0;
                  let global_rank = 0;
                  if (player?.osu?.statistics_ruleset !== undefined) {
                    country_rank =
                      player?.osu?.statistics_ruleset[postGameMode as keyof StatisticsRulesets]
                        ?.country_rank!;
                    global_rank =
                      player?.osu?.statistics_ruleset[postGameMode as keyof StatisticsRulesets]
                        ?.global_rank!;
                  }

                  return (
                    <Player
                      key={player.id}
                      name={player.osu?.username as string}
                      countryRanking={country_rank}
                      discordTag={player.discord as string}
                      osuId={player.id!}
                      ranking={global_rank}
                      country={player.osu?.country_code!}
                      onClickHandler={() => {
                        router.push(window.location.href + `/${player.id}`);
                      }}
                    />
                  );
                })}
              </div>
            </TabPanel>
          )}
          {showResults && (
            <TabPanel>
              <FormStatistics postData={postData} />
            </TabPanel>
          )}

          {showAdminPanel && (
            <TabPanel>
              <button className="button secondary" onClick={confirmUnpublishModal}>
                Unpublish form
              </button>
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>

      <div className="flex justify-between">
        <Button theme="dark" onClick={router.back}>
          {t("back")}
        </Button>

        <div className="flex gap-8">
          {showShareButton && (
            <Button
              onClick={async () => {
                const sharedUrl = window.location.href + `?access_key=${access_key}`;
                try {
                  await navigator.clipboard.writeText(sharedUrl);
                  toast.success("Link copied to clipboard");
                } catch (err) {
                  console.error("Async: Could not copy text: ", err);
                  toast.error("Couldn't copy link to clipboard");
                }
              }}
            >
              Share link
            </Button>
          )}
          {showResponseButton && (
            <Button
              data-testid="respondButton"
              onClick={() => {
                router.push(`/questions/${id}`);
              }}
              theme="secondary"
            >
              {t("answer")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
