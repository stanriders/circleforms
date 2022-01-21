import Image from "next/image";
import Link from "next/link";

import logoImg from '../public/images/logo.png'

export default function Header() {
  return (
    <header className="flex items-center bg-black h-24 w-full px-16 lg:px-32">
      <Link href="/" passHref>
        <a>
          <Image src={logoImg} alt="CircleForms" />
        </a>
      </Link>
    </header>
  )
}