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
                  Install with homebrew (Mac OS)
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
              A simple utility to{" "}
              <span className="text-green-300 font-bold">
                easily generate timesheets
              </span>{" "}
              from your git log
            </h1>
            <Button text="See sample timesheet" />
          </div>

          <div className="col-span-10 col-start-2 lg:col-start-4 lg:col-span-6 mt-12 lg:mt-32 order-3 lg:order-none">
            <h2 className="text-3xl font-semibold text-green-100">
              For <span className="text-green-300 font-bold">freelance</span>{" "}
              engineers
            </h2>
            <p className="text-green-100 mt-4">
              Initialise autolog against all your clients repositories.{" "}
              <a href="">Commit granularly</a> and automatically generate a
              timesheet at the end of the working month.
            </p>
          </div>

          <div className="col-span-10 col-start-2 md:col-start-3 md:col-end-10 lg:col-start-4 lg:col-end-10 xl:col-start-5 xl:col-end-9 flex flex-col items-center order-4 lg:order-none">
            <div className="max-w-[370px] mt-10 lg:mt-20 mb-10 lg:mb-20 p-10 rounded-md bg-green-100 text-slate-800 flex flex-col gap-6 drop-shadow-2xl">
              <h3 className="text-3xl font-bold text-center">Free.</h3>
              <p>
                Generate timesheets and have them <b>signed for approval.</b>
              </p>
              <p>
                Split your time between <b>multiple repositories</b>{" "}
                automatically
              </p>
              <p>
                Choose to store all your data <b>locally</b> (no sign-up
                required)
              </p>
              <p>
                Sign up to store your timesheets in the cloud and{" "}
                <b>enable edits</b> in your web browser
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
