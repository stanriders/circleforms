import Head from "next/head";
import Image from "next/image";

import DefaultLayout from "../layouts";

import SVG from "react-inlinesvg";
import { Fragment } from "react";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { team } from "../constants";
import Title from "../components/Title";

export default function OurTeam() {
  const t = useTranslations();

  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - {t("title")}</title>
      </Head>

      <Title title={t("subtitle")} Decoration={Decoration} />

      <div className="grid grid-cols-1 mt-4 gap-y-4 mx-4 mb-4 lg:grid-cols-4 lg:gap-0 lg:m-0">
        {team.map((member, index) => {
          const MemberImage = () => (
            <a
              href={`https://osu.ppy.sh/users/${member.osuId}`}
              className="col-span-2 relative h-64 lg:h-[211px] transition hover:brightness-75 rounded-20 overflow-clip lg:rounded-none lg:col-span-1"
            >
              <img
                className="w-full h-full object-cover"
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
                <h2 className="font-bold text-xl lg:text-5xl ">{member.name}</h2>
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
                <h2 className="font-bold text-xl lg:text-5xl ">{member.name}</h2>
                <p className="font-light lg:text-2xl">{member.role}</p>
              </a>
              {index >= 2 && index <= 3 && <MemberImage />}
            </Fragment>
          );
        })}

        <a
          href="https://discord.gg/rx9RKQsy9H"
          className="flex justify-center items-center bg-blue-discord col-span-2 text-white focus:brightness-90 hover:brightness-75 transition py-16 rounded-20 lg:py-0 lg:rounded-none"
        >
          <SVG className="w-32" src="/svg/discord.svg" alt="Join our Discord" />
        </a>
      </div>
    </DefaultLayout>
  );
}

function Decoration() {
  return <img src="/images/team-decoration.png" className="absolute -ml-32" alt="team" />;
}

export async function getStaticProps({ locale }) {
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
