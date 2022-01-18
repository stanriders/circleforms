import Image from "next/image";
import Link from "next/link";
import { footerLinks, navLinks } from "../constants";

import footerLogoImg from '../public/images/logo-white.png'

export default function Header() {
  return (
    <footer className="bg-grey text-white py w-full py-8 px-16 m:py-14 m:px-32">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
        <div>
          <Image src={footerLogoImg} alt="CircleForms" />
        </div>

        <div>
          <h3 className="mb-6">Information</h3>

          <ul className="flex flex-col gap-y-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} passHref>
                  <a>
                    { link.label }
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-6">Contacts</h3>

          <ul className="flex flex-col gap-y-4">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} passHref>
                  <a>
                    { link.label }
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-center mt-20">
        <span className="text-white opacity-50">
          © 2021 All Rights Reserved
        </span>
      </div>
    </footer>
  )
}