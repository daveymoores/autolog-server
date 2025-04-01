import type { NextPage } from "next";
import { FaArrowDown, FaGithub } from "react-icons/fa";
import React from "react";

import Button from "../components/Button/Button";
import CodeLine from "../components/Code/CodeLine/CodeLine";

const Home: NextPage = () => {
  return (
    <article className="mx-auto lg:max-w-screen-xl">
      <div className="container mx-auto">
        <div className="grid grid-cols-12 mt-24 lg:mt-32">
          <div className="col-span-12 lg:col-span-6 lg:col-start-1 order-2 lg:order-none">
            <code className="p-10 sm:p-14 rounded-md bg-black flex flex-col gap-6 sm:gap-8 drop-shadow-2xl">
              <span className="flex flex-col gap-y-2">
                <span className="text-slate-600 font-mono">
                  Install with homebrew (requires Apple Silicon Mac)
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

          <div className="mb-10 lg:mb-0 col-span-12 sm:col-span-10 sm:col-start-2 lg:col-span-5 lg:col-start-8 order-1 lg:order-none">
            <h1 className="mb-6 lg:text-4xl text-3xl font-medium text-green-100 lg:my-8">
              A simple tool to{" "}
              <span className="text-green-300 font-bold">
                generate timesheets
              </span>{" "}
              from your Git history
            </h1>
            <Button href="/timesheet-demo" text="See sample timesheet" />
          </div>

          <section className="mt-12 lg:mt-32 col-span-12 lg:col-span-5 lg:col-start-2 order-3 lg:order-none">
            <h2 className="text-3xl font-semibold text-green-100">
              Built for{" "}
              <span className="text-green-300 font-bold">freelance</span>{" "}
              engineers
            </h2>
            <p className="text-green-100 mt-4 text-lg mb-8">
              Autolog scans your Git commits to identify days you've worked,
              helping you track client projects without manual time logging.
              Just initialize once per repository, and at the end of the month,
              generate a timesheet collating all worked days across multiple
              projects.
            </p>
            <Button href="/documentation#examples" text={"See an example"} />
          </section>

          <section className="mt-12 lg:mt-32 mb-10 lg:mb-0 col-span-12 sm:col-span-10 sm:col-start-2 lg:col-span-5 lg:col-start-8 lg:order-none order-4">
            <div>
              <div className="flex justify-between mb-8">
                <div className="w-[28%] flex flex-col items-center">
                  <div className="w-full h-16 flex items-center justify-center bg-slate-800 border-2 border-green-300 rounded-md">
                    <FaGithub className="text-green-300 text-2xl mb-1" />
                  </div>
                  <div className="bg-black rounded-md py-1 px-2 mt-2 flex items-center text-[10px] sm:text-xs">
                    <div className="font-mono">
                      <span className="hidden sm:inline text-green-300">$</span>{" "}
                      <span className="text-slate-200">
                        <span className="text-rose-500">autolog</span> init
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-[28%] flex flex-col items-center">
                  <div className="w-full h-16 flex items-center justify-center bg-slate-800 border-2 border-green-300 rounded-md">
                    <FaGithub className="text-green-300 text-2xl mb-1" />
                  </div>
                  <div className="bg-black rounded-md py-1 px-2 mt-2 flex items-center text-[10px] sm:text-xs">
                    <div className="font-mono">
                      <span className="hidden sm:inline text-green-300">$</span>{" "}
                      <span className="text-slate-200">
                        <span className="text-rose-500">autolog</span> init
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-[28%] flex flex-col items-center">
                  <div className="w-full h-16 flex items-center justify-center bg-slate-800 border-2 border-green-300 rounded-md">
                    <FaGithub className="text-green-300 text-2xl mb-1" />
                  </div>
                  <div className="bg-black rounded-md py-1 px-2 mt-2 flex items-center text-[10px] sm:text-xs">
                    <div className="font-mono">
                      <span className="hidden sm:inline text-green-300">$</span>{" "}
                      <span className="text-slate-200">
                        <span className="text-rose-500">autolog</span> init
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connecting arrows visualization */}
              <div className="relative h-10 mb-4">
                {/* Left arrow */}
                <div className="absolute left-[14%] top-0 w-0.5 h-5 bg-green-300"></div>
                {/* Center arrow */}
                <div className="absolute left-[50%] top-0 w-0.5 h-5 bg-green-300"></div>
                {/* Right arrow */}
                <div className="absolute right-[14%] top-0 w-0.5 h-5 bg-green-300"></div>
                {/* Horizontal connecting line */}
                <div className="absolute left-[14%] right-[14%] top-5 h-0.5 bg-green-300"></div>
              </div>

              {/* Make command in terminal style */}
              <div className="flex justify-center mb-4">
                <div className="bg-black rounded-md py-2 px-4 flex items-center">
                  <div className="font-mono">
                    <span className="text-green-300">$</span>{" "}
                    <span className="text-slate-200">
                      <span className="text-rose-500">autolog</span> make
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mb-4">
                <FaArrowDown className="text-green-300 text-xl" />
              </div>

              {/* Timesheet output */}
              <div className="mx-auto w-3/4 h-16 bg-slate-800 border-2 border-green-300 rounded-md flex flex-col items-center justify-center">
                <span className="font-mono text-green-300 font-bold">
                  Timesheet
                </span>
                <span className="font-mono text-slate-200 text-sm">
                  31 hours
                </span>
              </div>
            </div>
          </section>

          <section className="col-span-12 sm:col-span-10 sm:col-start-2 lg:col-start-4 lg:col-span-6 mt-12 lg:mt-32 order-4 lg:order-none">
            <h2 className="text-3xl font-semibold text-green-100">
              Simple <span className="text-green-300 font-bold">Approvals</span>
            </h2>
            <p className="text-green-100 mt-4 mb-8 text-lg">
              Optionally request approval from clients or managers with a click.
              Your designated approver will receive an email notification with a
              tokenized link to approve. Download the approved timesheet as a
              PDF for your records.
            </p>

            <Button
              href="/documentation#approvals"
              text={"Read about approvals"}
            />
          </section>

          <section className="col-span-12 md:col-start-3 md:col-end-10 lg:col-start-4 lg:col-end-10 xl:col-start-4 xl:col-end-10 flex flex-col items-center order-4 lg:order-none">
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
                ✅ <b>Timesheet Approval</b> – Request and receive client
                approval through secure, tokenized links for official
                verification of work hours.
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

            <Button href="/documentation" text={"Read the docs"} />
          </section>
        </div>
      </div>
    </article>
  );
};

export default Home;
