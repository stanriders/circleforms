import { useTranslations } from "next-intl";

export interface IPlayerProps {
  name: string;
  ranking: number;
  countryRanking: number;
  discordTag: string;
  onClickHandler: () => void;
  osuId: string;
}

export default function Player({
  name,
  ranking,
  countryRanking,
  discordTag = "",
  onClickHandler,
  osuId
}: IPlayerProps) {
  const t = useTranslations("Player");

  return (
    <div
      onClick={onClickHandler}
      className="bg-gradient w-full rounded-14 flex justify-between items-center pr-4"
    >
      <div className="flex items-center gap-x-3">
        <img
          className="w-14 h-14 rounded-14"
          src={`http://s.ppy.sh/a/${osuId}`}
          alt="{player name}'s avatar"
        />
        <span className="fi fi-pe"></span>
        <span className="text-2xl font-bold">{name}</span>
      </div>

      <div className="flex">
        {ranking !== 0 && (
          <p className="flex flex-col items-end">
            <span className="text-xs">{t("globalRanking")}</span>
            <span className="text-2xl font-bold">{ranking}</span>
          </p>
        )}
        {countryRanking !== 0 && (
          <p className="flex flex-col items-end lg:ml-6">
            <span className="text-xs">{t("countryRanking")}</span>
            <span className="text-2xl font-bold">{countryRanking}</span>
          </p>
        )}
        <p className="flex flex-col items-end lg:ml-20">
          <span className="text-xs">Discord</span>
          <span className="text-2xl font-bold">{discordTag}</span>
        </p>
      </div>
    </div>
  );
}
