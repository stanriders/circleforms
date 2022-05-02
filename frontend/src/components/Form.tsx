import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import { useRouter } from "next/router";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import getImage from "../utils/getImage";
import Tag from "./Tag";
import InputRadio from "./InputRadio";
import Player from "./Player";
import Button from "./Button";
import bbcode from "../libs/bbcode";
import UserContext from "../context/UserContext";
import { Answers, PostsId, UserInAnswer } from "../types/common-types";
import { dynamicSort } from "../utils/objectSort";

const TempPlayers = [
  { name: "Varvalian", ranking: 14, countryRanking: 1, discordTag: "Varvalian#948" },
  { name: "Alumetri", ranking: 47, countryRanking: 3, discordTag: "Alumetri#836" },
  { name: "sakamata1", ranking: 1, countryRanking: 1, discordTag: "sakamata1#1337" },
  { name: "badeu", ranking: 38, countryRanking: 1, discordTag: "badeu#1114" },
  { name: "WhiteCat", ranking: 4, countryRanking: 1, discordTag: "WhiteCat#1076" }
];

interface IFromProps {
  posts: PostsId;
  users: UserInAnswer[] | null | undefined;
  answers: Answers;
}

export default function Form({ posts, users, answers }: IFromProps) {
  const { banner, description, icon, id, is_active, title } = posts;
  const { user } = useContext(UserContext);
  const osuUser = user?.osu;

  const [sort, setSort] = useState("rank");
  const [sortedPlayers, setSortedPlayers] = useState(TempPlayers);

  const [primaryAuthor, setPrimaryAuthor] = useState<UserInAnswer | null | undefined>(null);
  useEffect(() => {
    if (users && users[0]) {
      setPrimaryAuthor(users[0]);
    }
  }, [users]);

  const t = useTranslations();
  const router = useRouter();

  const bannerImg = getImage({ id, banner, type: "banner" });
  const iconImg = getImage({ id, icon, type: "icon" });

  const answerCount = answers?.length;

  useEffect(() => {
    if (sort === "rank") {
      let sorted = [...TempPlayers];
      dynamicSort(sorted, "-ranking", "-countryRanking");
      setSortedPlayers(sorted.reverse());
    } else {
      setSortedPlayers(TempPlayers);
    }
  }, [sort]);

  useEffect(() => {
    if (!primaryAuthor) {
      setPrimaryAuthor(osuUser as UserInAnswer);
    }
  }, [primaryAuthor, osuUser]);

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
                src={primaryAuthor?.osu?.avatar_url as string}
                alt={`${primaryAuthor?.osu?.username}'s avatar`}
              />
            </div>

            <div>
              <h1 className="text-4xl font-bold">{title}</h1>
              <p className="text-white text-opacity-50 text-2xl">
                {answerCount ?? answers?.length} {t("answersCount")}
              </p>
            </div>
          </div>

          <div className="p-4 bg-black-lightest rounded-14">
            <span className="text-4xl font-bold leading-5">{t("status")}:</span>
            <Tag
              label={is_active ? t("active") : t("inactive")}
              theme={is_active ? "success" : "stale"}
            />
          </div>
        </div>

        <Tabs className="mt-16 mb-4">
          <TabList>
            <Tab>{t("tabs.info.title")}</Tab>
            <Tab>{t("tabs.answers.title")}</Tab>
          </TabList>

          <TabPanels className="bg-black-lightest px-8 py-5 rounded-b-3xl">
            <TabPanel>
              <div
                className="bbcode"
                dangerouslySetInnerHTML={{
                  __html: bbcode(description)
                }}
              />
            </TabPanel>
            <TabPanel>
              <div
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSort(e.target.value)}
                className="flex flex-col"
              >
                <InputRadio name="sort" value="rank" label={t("sort.rank")} />
                <InputRadio name="sort" value="date" label={t("sort.date")} />
              </div>

              <div className="text-center text-pink w-full border-4 border-pink rounded-14 py-2 mt-11 mb-10">
                <p dangerouslySetInnerHTML={{ __html: t.raw("mistakeNotice") }} />
              </div>
              {sortedPlayers.map((player) => (
                <Player
                  key={player.name}
                  name={player.name}
                  countryRanking={player.countryRanking}
                  discordTag={player.discordTag}
                  ranking={player.ranking}
                />
              ))}
            </TabPanel>
          </TabPanels>
        </Tabs>

        <div className="flex justify-between">
          <Button theme="dark" onClick={router.back}>
            {t("back")}
          </Button>

          <Button onClick={() => {}} theme="secondary">
            {t("answer")}
          </Button>
        </div>
      </div>
    </div>
  );
}
