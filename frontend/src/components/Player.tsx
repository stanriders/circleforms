import { useTranslations } from "next-intl";

export interface IPlayerProps {
  name: string;
  ranking: number;
  countryRanking: number;
  discordTag: string;
  onClickHandler: () => void;
  osuId: string;
  country: string;
}

export default function Player({
  name,
  ranking,
  countryRanking,
  discordTag = "",
  onClickHandler,
  osuId,
  country
}: IPlayerProps) {
  const t = useTranslations("Player");

  const showRanking = Boolean(ranking);
  const showCountryRanking = Boolean(countryRanking);

  return (
    <div
      onClick={onClickHandler}
      className="bg-gradient flex w-full items-center justify-between rounded-14 pr-4"
    >
      <div className="flex items-center gap-x-3">
        <img
          className="h-14 w-14 rounded-14"
          src={`http://s.ppy.sh/a/${osuId}`}
          alt="{player name}'s avatar"
        />
        <span className={`fi fi-${country.toLowerCase()}`}></span>
        <span className="text-2xl font-bold">{name}</span>
      </div>

      <div className="flex">
        {showRanking && (
          <p className="flex flex-col items-end">
            <span className="text-xs">{t("globalRanking")}</span>
            <span className="text-2xl font-bold">{ranking}</span>
          </p>
        )}
        {showCountryRanking && (
          <p className="flex flex-col items-end lg:ml-6">
            <span className="text-xs">{t("countryRanking")}</span>
            <span className="text-2xl font-bold">{countryRanking}</span>
          </p>
        )}
        {discordTag && (
          <p className="flex flex-col items-end lg:ml-20">
            <span className="text-xs">Discord</span>
            <span className="text-2xl font-bold">{discordTag}</span>
          </p>
        )}
      </div>
    </div>
  );
}
