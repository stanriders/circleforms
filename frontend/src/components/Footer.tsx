import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-black-darker py-1 text-white">
      <div className="flex flex-col items-center">
        <ul className="flex gap-x-11 text-sm lg:text-xl">
          <li>
            <Link href="/terms" passHref>
              <a>Terms</a>
            </Link>
          </li>
          <li>
            <Link href="/privacy" passHref>
              <a>Privacy</a>
            </Link>
          </li>
          <li>
            <a href="https://github.com/stanriders/circleforms">Source code</a>
          </li>
        </ul>
        <span className="mt-1 text-xs text-white opacity-50">© 2022 All Rights Reserved</span>
      </div>
    </footer>
  );
}
