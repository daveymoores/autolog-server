import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Button from "../components/Button/Button";
import toast from "react-hot-toast";

const Documentation = () => {
  const [activeSection, setActiveSection] = useState("introduction");
  const router = useRouter();

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    router.push(`#${sectionId}`, undefined, { shallow: true });
  };

  React.useEffect(() => {
    const handleHashChange = () => {
      const sectionId = window.location.hash.replace("#", "");

      if (sectionId) {
        setActiveSection(sectionId);
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "smooth" });
      }
    };

    // Scroll to the section if there's a hash in the URL on initial load
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <article className="lg:mt-24 mt-12 mx-auto lg:max-w-screen-xl">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Left on desktop, top on mobile */}
          <div className="col-span-12 lg:col-span-3 order-2 lg:order-1">
            <div className="lg:sticky lg:top-4">
              <div className="bg-black rounded-md p-6 text-green-100">
                <h2 className="font-bold text-xl mb-6 text-green-300">
                  Contents
                </h2>
                <nav className="space-y-3">
                  {[
                    { id: "introduction", label: "Introduction" },
                    { id: "installation", label: "Installation" },
                    { id: "commands", label: "Commands" },
                    { id: "init", label: "Init Command" },
                    { id: "make", label: "Make Command" },
                    { id: "edit", label: "Edit Command" },
                    { id: "remove", label: "Remove Command" },
                    { id: "update", label: "Update Command" },
                    { id: "list", label: "List Command" },
                    { id: "approvals", label: "Timesheet Approval" },
                    { id: "examples", label: "Examples" },
                    { id: "troubleshooting", label: "Troubleshooting" },
                    { id: "privacy", label: "Privacy" },
                  ].map((section) => (
                    <a
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`block px-3 py-2 rounded cursor-pointer transition-colors ${
                        activeSection === section.id
                          ? "bg-slate-800 text-green-300 font-medium"
                          : "text-green-100 hover:bg-slate-800 hover:text-green-300"
                      }`}
                    >
                      {section.label}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-9 order-1 lg:order-2">
            <div className="prose max-w-none">
              <section id="introduction" className="mb-12">
                <h1 className="text-3xl font-bold text-green-100 mb-6">
                  Documentation
                </h1>
                <p className="text-green-100 mb-4">
                  A simple utility to{" "}
                  <span className="text-green-300 font-bold">
                    easily generate timesheets
                  </span>{" "}
                  from your git log.
                </p>
                <p className="text-green-100 font-bold mb-4">
                  Autolog is a minimal configuration timesheet tool that
                  leverages your git activity to generate professional
                  timesheets. Simply initialize repositories under a client,
                  continue with your normal git workflow, and Autolog
                  automatically tracks your active days based on commits. When
                  needed, generate a timesheet that allocates hours across your
                  repositories, request manager approval with a click, and share
                  via PDF or secure link.
                </p>
                <p className="text-green-100 mb-4">
                  As a freelance developer, one of my annoyances each month is
                  going back through my git history and calendar events to
                  figure out which days I worked for any particular client. Once
                  you have multiple repositories, this is further compounded.
                  For my use case, existing time tracking tools were too
                  granular - most of the time I was working a day/half day for a
                  client, so I wanted something that would sit in the background
                  and generate a timesheet for me at the end of the month, with
                  some nice design aesthetics and a simple approval workflow.
                </p>
                <p className="text-green-100 mb-4">
                  Autolog tries to achieve this by estimating worked hours from
                  commits in your git log. If you initialise Autolog against 3
                  repositories, assuming an 8 hour day, then it will split your
                  working hours across the three repositories as 3, 3, and 2.
                  Once the month ends you simply generate a timesheet for each
                  client and request approval (if required).
                </p>
                <p className="text-green-100">
                  This workflow is perhaps better explained in a video.
                </p>
              </section>

              <section id="installation" className="mb-12">
                <h2 className="text-2xl font-bold text-green-100 mb-4">
                  Installation
                </h2>
                <div className="bg-slate-800 rounded-md p-4 mb-6">
                  <p className="text-amber-400">
                    Note: Autolog is only compatible with Apple Silicon Macs
                  </p>
                </div>
                <div className="p-6 rounded-md bg-black mb-4 drop-shadow-xl">
                  <div className="text-green-100 font-mono">
                    <span className="text-green-300">$</span> brew tap{" "}
                    <span className="text-rose-500">daveymoores/autolog</span>
                  </div>
                  <div className="text-green-100 font-mono">
                    <span className="text-green-300">$</span> brew install{" "}
                    <span className="text-rose-500">autolog</span>
                  </div>
                </div>
              </section>

              <section id="commands" className="mb-12">
                <h2 className="text-2xl font-bold text-green-100 mb-4">
                  Commands Overview
                </h2>
                <p className="text-green-100 mb-4">
                  Autolog provides several commands to manage your timesheets:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-800 rounded-md p-4">
                    <h3 className="font-medium text-green-300">init</h3>
                    <p className="text-green-100 text-sm">
                      Initialize Autolog for current or specified repository
                    </p>
                  </div>
                  <div className="bg-slate-800 rounded-md p-4">
                    <h3 className="font-medium text-green-300">make</h3>
                    <p className="text-green-100 text-sm">
                      Generate a new timesheet with a unique link
                    </p>
                  </div>
                  <div className="bg-slate-800 rounded-md p-4">
                    <h3 className="font-medium text-green-300">edit</h3>
                    <p className="text-green-100 text-sm">
                      Change the hours worked value for a given day
                    </p>
                  </div>
                  <div className="bg-slate-800 rounded-md p-4">
                    <h3 className="font-medium text-green-300">remove</h3>
                    <p className="text-green-100 text-sm">
                      Remove a client or repository
                    </p>
                  </div>
                  <div className="bg-slate-800 rounded-md p-4">
                    <h3 className="font-medium text-green-300">update</h3>
                    <p className="text-green-100 text-sm">
                      Update details for a client or repository
                    </p>
                  </div>
                  <div className="bg-slate-800 rounded-md p-4">
                    <h3 className="font-medium text-green-300">list</h3>
                    <p className="text-green-100 text-sm">
                      List all clients and associated repositories
                    </p>
                  </div>
                </div>
              </section>

              <section id="init" className="mb-12">
                <h2 className="text-2xl font-bold text-green-100 mb-4">
                  Init Command
                </h2>
                <div className="p-6 rounded-md bg-black mb-4 drop-shadow-xl">
                  <div className="text-green-100 font-mono">
                    <span className="text-green-300">$</span> autolog init
                    [OPTIONS]
                  </div>
                </div>
                <p className="text-green-100 mb-4">
                  Initializes Autolog for the current or specified repository.
                </p>
                <h3 className="text-lg font-semibold text-green-300 mt-6 mb-2">
                  Options:
                </h3>
                <ul className="list-disc pl-6 text-green-100">
                  <li className="mb-2">
                    <code className="bg-slate-800 px-2 py-1 rounded text-green-100">
                      -p, --path &lt;path&gt;
                    </code>
                    : Optional path to git repository. Defaults to current
                    directory.
                  </li>
                </ul>
              </section>

              <section id="make" className="mb-12">
                <h2 className="text-2xl font-bold text-green-100 mb-4">
                  Make Command
                </h2>
                <div className="p-6 rounded-md bg-black mb-4 drop-shadow-xl">
                  <div className="text-green-100 font-mono">
                    <span className="text-green-300">$</span> autolog make
                    [OPTIONS]
                  </div>
                </div>
                <p className="text-green-100 mb-4">
                  Generates a new timesheet on a unique link.
                </p>
                <h3 className="text-lg font-semibold text-green-300 mt-6 mb-2">
                  Options:
                </h3>
                <ul className="list-disc pl-6 text-green-100">
                  <li className="mb-2">
                    <code className="bg-slate-800 px-2 py-1 rounded text-green-100">
                      -c, --client &lt;client&gt;
                    </code>
                    : Optional client name. Defaults to client of current
                    directory.
                  </li>
                  <li className="mb-2">
                    <code className="bg-slate-800 px-2 py-1 rounded text-green-100">
                      -m, --month &lt;xx&gt;
                    </code>
                    : Sets the month value. Defaults to current month.
                  </li>
                  <li className="mb-2">
                    <code className="bg-slate-800 px-2 py-1 rounded text-green-100">
                      -y, --year &lt;xxxx&gt;
                    </code>
                    : Sets the year value. Defaults to current year.
                  </li>
                </ul>
              </section>

              <section id="edit" className="mb-12">
                <h2 className="text-2xl font-bold text-green-100 mb-4">
                  Edit Command
                </h2>
                <div className="p-6 rounded-md bg-black mb-4 drop-shadow-xl">
                  <div className="text-green-100 font-mono">
                    <span className="text-green-300">$</span> autolog edit
                    [OPTIONS]
                  </div>
                </div>
                <p className="text-green-100 mb-4">
                  Changes the hours worked value for a given day.
                </p>
                <h3 className="text-lg font-semibold text-green-300 mt-6 mb-2">
                  Options:
                </h3>
                <ul className="list-disc pl-6 text-green-100">
                  <li className="mb-2">
                    <code className="bg-slate-800 px-2 py-1 rounded text-green-100">
                      -n, --namespace &lt;namespace&gt;
                    </code>
                    : Optional namespace/project name. Defaults to project
                    within current directory.
                  </li>
                  <li className="mb-2">
                    <code className="bg-slate-800 px-2 py-1 rounded text-green-100">
                      -h, --hour &lt;xx&gt;
                    </code>
                    : Sets the hour value. Required.
                  </li>
                  <li className="mb-2">
                    <code className="bg-slate-800 px-2 py-1 rounded text-green-100">
                      -d, --day &lt;xx&gt;
                    </code>
                    : Sets the day value. Defaults to current day.
                  </li>
                  <li className="mb-2">
                    <code className="bg-slate-800 px-2 py-1 rounded text-green-100">
                      -m, --month &lt;xx&gt;
                    </code>
                    : Sets the month value. Defaults to current month.
                  </li>
                  <li className="mb-2">
                    <code className="bg-slate-800 px-2 py-1 rounded text-green-100">
                      -y, --year &lt;xxxx&gt;
                    </code>
                    : Sets the year value. Defaults to current year.
                  </li>
                </ul>
              </section>

              <section id="remove" className="mb-12">
                <h2 className="text-2xl font-bold text-green-100 mb-4">
                  Remove Command
                </h2>
                <div className="p-6 rounded-md bg-black mb-4 drop-shadow-xl">
                  <div className="text-green-100 font-mono">
                    <span className="text-green-300">$</span> autolog remove
                    [OPTIONS]
                  </div>
                </div>
                <p className="text-green-100 mb-4">
                  Removes a client or repository.
                </p>
                <h3 className="text-lg font-semibold text-green-300 mt-6 mb-2">
                  Options:
                </h3>
                <ul className="list-disc pl-6 text-green-100">
                  <li className="mb-2">
                    <code className="bg-slate-800 px-2 py-1 rounded text-green-100">
                      -c, --client &lt;client&gt;
                    </code>
                    : Required client name. If namespace isn't passed, this will
                    remove the client.
                  </li>
                  <li className="mb-2">
                    <code className="bg-slate-800 px-2 py-1 rounded text-green-100">
                      -n, --namespace &lt;namespace&gt;
                    </code>
                    : Optional namespace/project name. If provided, only removes
                    the specific repository.
                  </li>
                </ul>
              </section>

              <section id="update" className="mb-12">
                <h2 className="text-2xl font-bold text-green-100 mb-4">
                  Update Command
                </h2>
                <div className="p-6 rounded-md bg-black mb-4 drop-shadow-xl">
                  <div className="text-green-100 font-mono">
                    <span className="text-green-300">$</span> autolog update
                    [OPTIONS]
                  </div>
                </div>
                <p className="text-green-100 mb-4">
                  Updates details for a client or repository.
                </p>
                <h3 className="text-lg font-semibold text-green-300 mt-6 mb-2">
                  Options:
                </h3>
                <ul className="list-disc pl-6 text-green-100">
                  <li className="mb-2">
                    <code className="bg-slate-800 px-2 py-1 rounded text-green-100">
                      -c, --client &lt;client&gt;
                    </code>
                    : Required client name.
                  </li>
                  <li className="mb-2">
                    <code className="bg-slate-800 px-2 py-1 rounded text-green-100">
                      -n, --namespace &lt;namespace&gt;
                    </code>
                    : Optional namespace/project name of the git repository.
                  </li>
                </ul>
              </section>

              <section id="list" className="mb-12">
                <h2 className="text-2xl font-bold text-green-100 mb-4">
                  List Command
                </h2>
                <div className="p-6 rounded-md bg-black mb-4 drop-shadow-xl">
                  <div className="text-green-100 font-mono">
                    <span className="text-green-300">$</span> autolog list
                  </div>
                </div>
                <p className="text-green-100 mb-4">
                  Lists all clients and their associated repositories.
                </p>
              </section>

              <section id="approvals" className="mb-12">
                <h2 className="text-2xl font-bold text-green-100 mb-4">
                  Timesheet Approval Process
                </h2>

                <div className="bg-amber-900/30 border border-amber-500/40 rounded-md p-4 mb-6">
                  <p className="text-amber-200 text-sm">
                    <span className="font-bold">Note:</span> The approval
                    workflow requires an approver to be configured for your
                    client. Set up an approver after initialization using{" "}
                    <code className="bg-black px-2 py-1 rounded">
                      autolog update --client &lt;client-name&gt;
                    </code>
                    which will prompt you to enter approver details.
                  </p>
                </div>

                <p className="text-green-100 mb-6">
                  Once an approver is configured, your timesheet will render an
                  approval button:
                </p>
                <div className="flex justify-center bg-slate-800 p-8 rounded-md mb-4">
                  <Button
                    text="Request Approval"
                    variant="secondary"
                    onClick={() => {
                      toast.promise(
                        new Promise((resolve) => setTimeout(resolve, 2000)),
                        {
                          loading: "Requesting approval...",
                          success: "Approval requested!",
                          error: "Error requesting approval",
                        }
                      );
                    }}
                  />
                </div>

                <p className="text-green-100 mb-6">
                  Your designated approver will receive an email notification
                  with a link to approve your timesheet. The link has a unique
                  identifier that means only the user with access to the email
                  can approve it.
                </p>
                <div className="flex justify-center bg-slate-800 p-8 rounded-md mb-4">
                  <Button
                    text="Approve Timesheet"
                    variant="secondary"
                    onClick={() => {
                      toast.promise(
                        new Promise((resolve) => setTimeout(resolve, 2000)),
                        {
                          loading: "Approving timesheet...",
                          success: "Timesheet approved!",
                          error: "Failed to approve timesheet",
                        }
                      );
                    }}
                  />
                </div>

                <p className="text-green-100 mb-6">
                  Once approved, you will receive an email notification with a
                  link to your approved timesheet.
                </p>

                <div className="flex justify-center bg-slate-800 p-8 rounded-md mb-4">
                  <div className="flex items-center gap-2 bg-green-100/10 text-green-100 py-2 px-4 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-5 w-5 fill-current"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span className="font-semibold">Approved</span>
                  </div>
                </div>
              </section>

              <section id="examples" className="mb-12">
                <h2 className="text-2xl font-bold text-green-100 mb-4">
                  Examples
                </h2>
                <h3 className="text-xl font-bold text-green-100 mb-4">
                  General Usage
                </h3>

                <p>
                  As a freelance software engineer, you might be working for
                  multiple clients in a month. Keeping track of which days you
                  worked for each client can be challenging. Autolog simplifies
                  this process. Here's an example:
                </p>
                <div className="space-y-3 mt-4 mb-12">
                  <div className="flex items-start space-x-3">
                    <div className="bg-slate-800 p-2 rounded-md mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <p className="text-green-100">
                      <span className="text-green-300 font-medium">
                        Step 1:
                      </span>{" "}
                      Navigate to each of Client A's repositories and run{" "}
                      <code className="bg-black px-2 py-1 rounded">
                        autolog init
                      </code>
                      . You will be prompted to add the repository to an
                      existing client or create a new client.
                    </p>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-slate-800 p-2 rounded-md mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <p className="text-green-100">
                      <span className="text-green-300 font-medium">
                        Step 2:
                      </span>{" "}
                      Repeat the same process for Client B's repositories.
                    </p>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-slate-800 p-2 rounded-md mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <p className="text-green-100">
                      <span className="text-green-300 font-medium">
                        Step 3:
                      </span>{" "}
                      At the end of the month, run{" "}
                      <code className="bg-black px-2 py-1 rounded">
                        autolog make --client "Client A"
                      </code>{" "}
                      to generate a timesheet for Client A.
                    </p>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-slate-800 p-2 rounded-md mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <p className="text-green-100">
                      <span className="text-green-300 font-medium">
                        Step 4:
                      </span>{" "}
                      Similarly, run{" "}
                      <code className="bg-black px-2 py-1 rounded">
                        autolog make --client "Client B"
                      </code>{" "}
                      to generate a timesheet for Client B.
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-green-100 mb-4">
                  Command Usage Examples
                </h3>

                <h4 className="text-lg font-semibold text-green-300 mt-6 mb-2">
                  Initialize for current repository:
                </h4>
                <div className="p-6 rounded-md bg-black mb-4 drop-shadow-xl">
                  <div className="text-green-100 font-mono">
                    <span className="text-green-300">$</span> autolog init
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-green-300 mt-6 mb-2">
                  Generate a timesheet for January:
                </h4>
                <div className="p-6 rounded-md bg-black mb-4 drop-shadow-xl">
                  <div className="text-green-100 font-mono">
                    <span className="text-green-300">$</span> autolog make -m1
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-green-300 mt-6 mb-2">
                  Log 8 hours for today:
                </h4>
                <div className="p-6 rounded-md bg-black mb-4 drop-shadow-xl">
                  <div className="text-green-100 font-mono">
                    <span className="text-green-300">$</span> autolog edit -h8
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-green-300 mt-6 mb-2">
                  Log 6 hours for a specific date:
                </h4>
                <div className="p-6 rounded-md bg-black mb-4 drop-shadow-xl">
                  <div className="text-green-100 font-mono">
                    <span className="text-green-300">$</span> autolog edit -h6
                    -d22 -m11 -y2025
                  </div>
                </div>
              </section>

              <section id="troubleshooting" className="mb-12">
                <h2 className="text-2xl font-bold text-green-100 mb-4">
                  Troubleshooting
                </h2>

                <div className="bg-slate-800 rounded-md p-6 mb-6">
                  <h3 className="text-lg font-semibold text-green-300 mb-2">
                    Git Repository Not Found
                  </h3>
                  <p className="text-green-100">
                    Ensure you're in a valid git repository or specify the path
                    explicitly with the{" "}
                    <code className="bg-black px-2 py-1 rounded">-p</code>{" "}
                    option.
                  </p>
                </div>

                <div className="bg-slate-800 rounded-md p-6 mb-6">
                  <h3 className="text-lg font-semibold text-green-300 mb-2">
                    Required Arguments Missing
                  </h3>
                  <p className="text-green-100">
                    Some commands require specific arguments. For example, the
                    edit command requires at least the hour value. Use{" "}
                    <code className="bg-black px-2 py-1 rounded">
                      autolog [command] --help
                    </code>{" "}
                    to see required options.
                  </p>
                </div>

                <div className="bg-slate-800 rounded-md p-6 mb-6">
                  <h3 className="text-lg font-semibold text-green-300 mb-2">
                    Date Format Issues
                  </h3>
                  <p className="text-green-100">
                    When specifying dates, use numeric values (e.g.,{" "}
                    <code className="bg-black px-2 py-1 rounded">-m3</code> for
                    March).
                  </p>
                </div>
              </section>

              <section id="privacy" className="mb-12">
                <h2 className="text-2xl font-bold text-green-100 mb-4">
                  Data Protection & Privacy
                </h2>

                <p className="text-green-100 mb-6">
                  Autolog follows a privacy-first approach with minimal data
                  storage and transmission:
                </p>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="bg-slate-800 p-2 rounded-md mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <p className="text-green-100">
                      <span className="text-green-300 font-medium">
                        Local Storage:
                      </span>{" "}
                      All primary data (Git history, time records) stays on your
                      machine in a local SQLite database
                    </p>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-slate-800 p-2 rounded-md mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <p className="text-green-100">
                      <span className="text-green-300 font-medium">
                        Temporary Sharing:
                      </span>{" "}
                      Generated timesheets are stored on external servers for 24
                      hours only
                    </p>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-slate-800 p-2 rounded-md mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <p className="text-green-100">
                      <span className="text-green-300 font-medium">
                        Minimal Data:
                      </span>{" "}
                      Only specific timesheet data is transmitted, never your
                      entire database
                    </p>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-slate-800 p-2 rounded-md mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <p className="text-green-100">
                      <span className="text-green-300 font-medium">
                        Auto-Deletion:
                      </span>{" "}
                      Shared timesheet data is automatically deleted after 24
                      hours
                    </p>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-slate-800 p-2 rounded-md mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <p className="text-green-100">
                      <span className="text-green-300 font-medium">
                        No Registration:
                      </span>{" "}
                      No user accounts or personal information collection
                    </p>
                  </div>
                </div>
              </section>

              <div className="mt-12 mb-6 flex justify-center">
                <Link
                  href="/"
                  className="drop-shadow-1xl py-2 px-4 bg-gradient-to-tl from-indigo-500 to-indigo-700 text-white text-md rounded-md shadow focus:outline-none"
                >
                  Go back to home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Documentation;
