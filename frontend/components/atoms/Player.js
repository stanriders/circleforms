export default function Player() {
  return (
    <div className="bg-gradient w-full rounded-14 flex justify-between items-center pr-4">
      <div className="flex items-center gap-x-3">
        <img
          className="w-14 h-14 rounded-14"
          src={`http://s.ppy.sh/a/2291265`}
          alt="{player name}'s avatar" />
        <div className="bg-red-500">
          PERU
        </div>
        <span className="text-2xl font-bold">Arnold24x24</span>
      </div>

      <div className="flex">
        <p className="flex flex-col items-end">
          <span className="text-xs">Global Ranking</span>
          <span className="text-2xl font-bold">#6</span>
        </p>
        <p className="flex flex-col items-end lg:ml-6">
          <span className="text-xs">Country Ranking</span>
          <span className="text-2xl font-bold">#1</span>
        </p>
        <p className="flex flex-col items-end lg:ml-20">
          <span className="text-xs">Discord</span>
          <span className="text-2xl font-bold">Arnold#0000</span>
        </p>
      </div>
    </div>
  )
}