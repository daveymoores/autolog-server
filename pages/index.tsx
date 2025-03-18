import type { NextPage } from "next";
import Link from "next/link";
import React from "react";

import Button from "../components/Button/Button";
import CodeLine from "../components/Code/CodeLine/CodeLine";

const Home: NextPage = () => {
  return (
    <article className="mx-auto lg:max-w-screen-xl">
      <div className="container mx-auto">
        <div className="grid grid-cols-12 mt-24 lg:mt-32">
          <div className="col-span-12 lg:col-span-6 lg:col-start-2 order-2 lg:order-none">
            <code className="p-10 sm:p-14 rounded-md bg-black flex flex-col gap-6 sm:gap-8 drop-shadow-2xl">
              <span className="flex flex-col gap-y-2">
                <span className="text-slate-600 font-mono">
                  Install with homebrew (only on MacOS)
                </span>
                <span className="text-green-100 font-mono">
                  <span className="text-green-300">$</span> brew tap{" "}
                  <span className="text-rose-500">daveymoores/autolog</span>
                </span>
                <span className="text-green-100 font-mono">
                  <span className="text-green-300">$</span> brew install{" "}
                  <span className="text-rose-500">autolog</span>
                </span>
              </span>

              <span className="flex flex-col gap-y-2">
                <span className="text-slate-700 font-mono">
                  Initialise autolog for a repository
                </span>
                <CodeLine command="autolog init" />
              </span>

              <span className="flex flex-col gap-y-2">
                <span className="text-slate-700 font-mono">
                  Generate a timesheet for January
                </span>
                <CodeLine command="autolog make -m1" />
              </span>

              <span className="flex flex-col gap-y-2">
                <span className="text-slate-700 font-mono">
                  Modify an entry
                </span>
                <CodeLine command="autolog edit -d22 -m11 -y2020 -h6" />
              </span>
            </code>
          </div>

          <div className="mb-10 lg:mb-0 col-span-12 col-start-2 lg:col-span-4 lg:col-start-9 order-1 lg:order-none">
            <h1 className="mb-6 text-3xl font-medium text-green-100 lg:my-8">
              A simple tool to{" "}
              <span className="text-green-300 font-bold">
                generate timesheets
              </span>{" "}
              from your Git history
            </h1>
            <Button text="See sample timesheet" />
          </div>

          <div className="col-span-10 col-start-2 lg:col-start-4 lg:col-span-6 mt-12 lg:mt-32 order-3 lg:order-none">
            <h2 className="text-3xl font-semibold text-green-100">
              Built for{" "}
              <span className="text-green-300 font-bold">freelance</span>{" "}
              engineers
            </h2>
            <p className="text-green-100 mt-4">
              Autolog scans your Git commits to identify worked days, helping
              you track client projects without manual time logging. Just
              initialize once per repository, and at the end of the month,
              generate a timesheet in seconds—collating all worked days across
              multiple projects. A simple way to turn your commits into a
              shareable timesheet.
            </p>
          </div>

          <div className="col-span-10 col-start-2 md:col-start-3 md:col-end-10 lg:col-start-4 lg:col-end-10 xl:col-start-4 xl:col-end-10 flex flex-col items-center order-4 lg:order-none">
            <div className="max-w-[450px] mt-10 lg:mt-20 mb-10 lg:mb-20 p-10 rounded-md bg-green-100 text-slate-800 flex flex-col gap-6 drop-shadow-2xl">
              <p>
                📌 <b>Automated Timesheets</b> – Instantly generate timesheets
                by pulling commit history from your Git repositories.
              </p>
              <p>
                🔗 <b>Private, Temporary Links</b> – Generate a <b>one-time</b>{" "}
                link (valid for 24 hours) to share timesheets, without storing
                data online long-term.
              </p>
              <p>
                🗂 <b>Multi-Client & Multi-Repo Support</b> – Track hours across
                multiple repositories and clients with ease.
              </p>
              <p>
                💾 <b>Local-First Data Storage</b> – Keep all your data stored{" "}
                <b>locally</b> with no sign-up required.
              </p>
              <p>
                ⚡ <b>Minimal Setup</b> – Just initialize your repositories
                once, then generate monthly timesheets in seconds.
              </p>
            </div>

            <Link
              href="/documentation"
              className="drop-shadow-1xl py-2 px-4 bg-gradient-to-tl from-indigo-500 to-indigo-700 text-white text-md rounded-md shadow focus:outline-none"
            >
              See the docs
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Home;
