import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navigation: React.FC = () => {
  return (
    <div className="container grid grid-cols-12 mt-8 lg:mt-16 mx-auto lg:max-w-screen-xl font-semibold">
      <div className="col-span-12 md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3">
        <nav className="flex justify-between align-middle">
          <Link href="/" passHref>
            <Image
              alt="Autolog Logo"
              src="/logo.svg"
              width={114}
              height={24}
              priority={true}
            />
          </Link>
          <Link href="/documentation">Documentation</Link>
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
