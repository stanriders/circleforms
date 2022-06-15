import { Fragment } from "react";
import SVG from "react-inlinesvg";
import VisuallyHidden from "@reach/visually-hidden";
import classNames from "classnames";
import Head from "next/head";
import { useTranslations } from "next-intl";

import Title from "../components/Title";
import { team } from "../constants";
import DefaultLayout from "../layouts";
import { Locales } from "../types/common-types";

export default function OurTeam() {
  const t = useTranslations();

  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - {t("title")}</title>
      </Head>

      <Title title={t("subtitle")} Decoration={Decoration} />

      <div className="grid grid-cols-1 gap-y-4 m-4 lg:grid-cols-4 lg:gap-0 lg:m-0">
        {team.map((member, index) => {
          const MemberImage = () => (
            <a
              href={`https://osu.ppy.sh/users/${member.osuId}`}
              className="relative col-span-2 h-64 text-clip rounded-20 hover:brightness-75 transition lg:col-span-1 lg:h-[211px] lg:rounded-none"
            >
              <img
                className="object-cover w-full h-full"
                src={`/images/${member.name.toLowerCase()}.png`}
                alt={member.name}
              />
              <img
                className="absolute"
                style={{ ...member.avatarStyles }}
                src={`http://s.ppy.sh/a/${member.osuId}`}
                alt={`${member.name} osu avatar`}
              />

              <div
                className={classNames(
                  "bg-black-lightest lg:hidden absolute bottom-0 left-0 right-0 p-4 rounded-t-14",
                  member.name === "StanR"
                    ? "bg-pink text-pink-darker hover:bg-black-lightest hover:text-white"
                    : "bg-black-lightest text-white hover:bg-pink hover:text-pink-darker"
                )}
              >
                <h2 className="text-xl font-bold lg:text-5xl ">{member.name}</h2>
                <p className="font-light lg:text-2xl">{member.role}</p>
              </div>
            </a>
          );

          return (
            <Fragment key={member.name}>
              {index >= 0 && index <= 1 && <MemberImage />}
              {index >= 4 && <MemberImage />}
              <a
                href={`https://osu.ppy.sh/users/${member.osuId}`}
                className={classNames(
                  "hidden flex-col justify-center px-8 transition lg:flex",
                  member.name === "StanR"
                    ? "bg-pink text-pink-darker hover:bg-black-lightest hover:text-white"
                    : "bg-black-lightest text-white hover:bg-pink hover:text-pink-darker",
                  index >= 2 && index <= 3 ? "text-right" : ""
                )}
              >
                <h2 className="text-xl font-bold lg:text-5xl ">{member.name}</h2>
                <p className="font-light lg:text-2xl">{member.role}</p>
              </a>
              {index >= 2 && index <= 3 && <MemberImage />}
            </Fragment>
          );
        })}

        <a
          href="https://discord.gg/rx9RKQsy9H"
          className="flex col-span-2 justify-center items-center py-16 text-white bg-blue-discord rounded-20 hover:brightness-75 focus:brightness-90 transition lg:py-0 lg:rounded-none"
        >
          <VisuallyHidden>Join our Discord</VisuallyHidden>
          <SVG className="w-32" src="/svg/discord.svg" />
        </a>
      </div>
    </DefaultLayout>
  );
}

function Decoration() {
  return <img src="/images/team-decoration.png" className="absolute -ml-32" alt="team" />;
}

export async function getStaticProps({ locale }: { locale: Locales }) {
  const [translations, global] = await Promise.all([
    import(`../messages/our-team/${locale}.json`),
    import(`../messages/global/${locale}.json`)
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
