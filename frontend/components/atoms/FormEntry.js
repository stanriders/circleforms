import Link from 'next/link'

export default function FormEntry() {
  return (
    <Link href="#">
      <a className="flex rounded-5 overflow-clip bg-black-light z-0 transform transition-transform ease-out-cubic hover:scale-105 hover:z-10">
        <div
          className="flex-1 bg-cover"
          style={{
            backgroundImage: `
              linear-gradient(270deg, #131313 2.39%, rgba(17, 17, 17, 0) 98.16%),
              url('/images/form-entry-test.jpg')
            `
          }}
        />
        <div className="flex-1 flex justify-between py-4">
          <div>
            <h3 className="font-display text-xl font-bold">
              nik's winter cup 2022 Registration Form
            </h3>
            <p className="text-xs text-white text-opacity-50 -mt-1">
              osu!standard, scorev2, 1v1 tournament
            </p>
          </div>
          <div className="flex items-center">
            <div className="flex flex-col text-xs mr-2 text-right">
              <span>posted by <span className="font-bold">nik</span></span>
              <span className="text-green">5 days ago</span>
            </div>
            <img
              className="h-10 w-10 rounded-full"
              src="https://a.ppy.sh/5914915?1639077555.jpeg"
              alt="Profile user {name}" />
          </div>
        </div>
      </a>
    </Link>
  )
}