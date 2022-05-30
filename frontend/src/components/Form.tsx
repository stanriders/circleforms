import { ChangeEvent, useContext,useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Tab, TabList, TabPanel,TabPanels, Tabs } from "@reach/tabs";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import {
  OsuAnswerContract,
  PostWithQuestionsContract,
  UserContract,
  UserInAnswerContract
} from "../../openapi";
import UserContext from "../context/UserContext";
import { apiClient } from "../libs/apiClient";
import bbcode from "../libs/bbcode";
import getImage from "../utils/getImage";
import { dynamicSort } from "../utils/objectSort";

import Button from "./Button";
import InputRadio from "./InputRadio";
import Player from "./Player";
import Tag from "./Tag";

interface IFormProps {
  post: PostWithQuestionsContract;
  authorUser: UserContract | null | undefined;
}

interface FullUserInAnswerContract extends UserInAnswerContract {
  taiko?: OsuAnswerContract;
  fruits?: OsuAnswerContract;
  mania?: OsuAnswerContract;
  none?: null;
}

export default function Form({ post, authorUser }: IFormProps) {
  const { user } = useContext(UserContext);
  const { banner, description, icon, id, isActive, title } = post;

  const [showResponseButton, setShowResponseButton] = useState<boolean>();

  useEffect(() => {
    setShowResponseButton(user !== null);
  }, [user]);

  const { data: usersAndAnswers } = useQuery(
    ["postsIdAnswersGet", id],
    () => apiClient.posts.postsIdAnswersGet({ id: id as string }),
    { retry: 0 }
  );

  const [sort, setSort] = useState("rank");
  const [sortedPlayers, setSortedPlayers] = useState(usersAndAnswers?.users);

  const t = useTranslations();
  const router = useRouter();

  const bannerImg = getImage({ id, banner, type: "banner" });
  const iconImg = getImage({ id, icon, type: "icon" });

  useEffect(() => {}, []);

  useEffect(() => {
    if (sort === "rank") {
      let sorted = [...(usersAndAnswers?.users || [])];
      dynamicSort(sorted, "-id");
      setSortedPlayers(sorted.reverse());
    } else {
      setSortedPlayers(usersAndAnswers?.users);
    }
  }, [sort, usersAndAnswers?.users]);

  return (
    <div>
      <div
        className="bg-cover h-60 w-full rounded-t-70"
        style={{
          backgroundImage: `
            linear-gradient(180deg, rgba(19, 19, 19, 0) -35.06%, #0F0F0F 100%),
            url('${bannerImg}')
          `
        }}
      />
      <div className="bg-black-dark2 p-16 relative rounded-b-70">
        <div className="absolute top-0 left-16 right-16 flex items-center justify-between">
          <div className="flex items-center gap-x-3">
            <div className="relative">
              <img className="h-20 w-20 rounded-full" src={iconImg} alt={`${title}'s thumbnail`} />
              <img
                className="h-10 w-10 rounded-full absolute bottom-0 right-0"
                src={authorUser?.osu?.avatar_url}
                alt={`${authorUser?.osu?.username}'s avatar`}
              />
            </div>

            <div>
              <h1 className="text-4xl font-bold">{title}</h1>
              <p className="text-white text-opacity-50 text-2xl">
                {post.answerCount} {t("answersCount")}
              </p>
            </div>
          </div>

          <div className="p-4 bg-black-lightest rounded-14">
            <span className="text-4xl font-bold leading-5">{t("status")}:</span>
            <Tag
              label={isActive ? t("active") : t("inactive")}
              theme={isActive ? "success" : "stale"}
            />
          </div>
        </div>

        <Tabs className="mt-16 mb-4">
          <TabList>
            <Tab>{t("tabs.info.title")}</Tab>
            {usersAndAnswers?.users && <Tab>{t("tabs.answers.title")}</Tab>}
          </TabList>

          <TabPanels className="bg-black-lightest px-8 py-5 rounded-b-3xl">
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

                <div className="text-center text-pink w-full border-4 border-pink rounded-14 py-2 mt-11 mb-10">
                  <p dangerouslySetInnerHTML={{ __html: t.raw("mistakeNotice") }} />
                </div>
                <div className="flex flex-col gap-1">
                  {sortedPlayers?.map((player: FullUserInAnswerContract) => {
                    const postGameMode = post.gamemode?.toLowerCase();
                    let country_rank = 0;
                    let global_rank = 0;
                    if (player?.osu?.statistics !== undefined) {
                      country_rank = player?.osu?.statistics[postGameMode!]?.country_rank;
                      global_rank = player?.osu?.statistics[postGameMode!]?.global_rank;
                    }

                    return (
                      <Player
                        key={player.id}
                        name={player.osu?.username as string}
                        countryRanking={country_rank}
                        discordTag={player.discord as string}
                        ranking={global_rank}
                        onClickHandler={() => {
                          router.push(window.location.href + `/${player.id}`);
                        }}
                      />
                    );
                  })}
                </div>
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>

        <div className="flex justify-between">
          <Button theme="dark" onClick={router.back}>
            {t("back")}
          </Button>

          {showResponseButton && (
            <Button
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
