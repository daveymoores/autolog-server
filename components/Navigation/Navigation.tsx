import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navigation: React.FC = () => {
  const [version, setVersion] = React.useState<string>("");

  React.useEffect(() => {
    // Fetch the latest release version from GitHub API
    fetch("https://api.github.com/repos/daveymoores/autolog/releases")
      .then((res) => res.json())
      .then((data) => {
        const latestRelease = data[0];
        const versionText = latestRelease.tag_name || "";
        setVersion(versionText.replace(/^v/, ""));
      })
      .catch(() => {
        // Silently fail if we can't fetch the version
      });
  }, []);

  return (
    <div className="container grid grid-cols-12 mt-8 lg:mt-16 mx-auto lg:max-w-screen-xl font-semibold">
      <div className="col-span-12 md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3">
        <nav className="flex justify-between align-middle">
          <div className="relative">
            <Link href="/" passHref>
              <Image
                alt="Autolog Logo"
                src="/logo.svg"
                width={114}
                height={24}
                priority={true}
              />
            </Link>
            {version && (
              <a
                href="https://github.com/daveymoores/autolog/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-[-10px] ml-auto text-xs text-green-300 rounded-full py-1 flex items-center"
              >
                v{version}
              </a>
            )}
          </div>
          <Link href="/documentation">Documentation</Link>
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
