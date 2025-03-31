import Image from "next/image";
import React, { ReactNode, useState } from "react";

import { TimesheetProps } from "../../types/Timesheet.types";
import Table from "../Table/Table";
import Button from "../Button/Button";
import toast from "react-hot-toast";

interface Props extends Omit<TimesheetProps, "timesheet"> {
  days: number;
  printButton: ReactNode;
}

let isGenerating = false;

const Timesheet = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      timesheets,
      client,
      user,
      month_year,
      printButton,
      signed_token,
      path,
      requires_approval,
      approved: initialApproved,
      approvers_name,
      approvers_email,
    },
    ref
  ) => {
    // Add local state to track approval status
    const [isApproved, setIsApproved] = useState(initialApproved);

    const has_approvers_details = !!(approvers_name && approvers_email);
    const in_approval_workflow = !!(
      (has_approvers_details && requires_approval && !isApproved) // Use local state instead of prop
    );

    const approveTimesheet = (path: string, signed_token: string) => {
      if (isGenerating) return;
      isGenerating = true;

      toast.promise(
        fetch(
          `/api/approve?timesheet_id=${encodeURIComponent(
            path
          )}&signed_token=${encodeURIComponent(signed_token)}`
        )
          .then(async (response) => {
            if (response.ok) {
              console.info(`Timesheet ${path} approved`);
              setIsApproved(true); // Update local state immediately on success

              return true;
            } else {
              // Check content type to determine how to parse the error
              const contentType = response.headers.get("content-type");

              if (contentType && contentType.includes("application/json")) {
                // Parse JSON error
                const errorData = await response.json();
                throw new Error(
                  errorData.message ||
                    errorData.error ||
                    `Approval failed (${response.status})`
                );
              } else {
                // Parse text error
                const errorText = await response.text();
                throw new Error(
                  errorText ||
                    `Approval failed (${response.status}: ${response.statusText})`
                );
              }
            }
          })
          .catch((error) => {
            // Log the full error for debugging
            console.error("Approval error:", error);
            // Re-throw so toast can catch it
            throw error;
          })
          .finally(() => {
            isGenerating = false;
          }),
        {
          loading: "Approving timesheet...",
          success: "Timesheet approved!",
          error: (err) => `${err.message || "Failed to approve timesheet"}`,
        }
      );
    };

    const requestApproval = (path: string) => {
      if (isGenerating) return;
      isGenerating = true;

      toast.promise(
        fetch(`/api/request?timesheet_id=${encodeURIComponent(path)}`)
          .then(async (response) => {
            if (response.ok) {
              console.info(`Timesheet ${path} approval requested`);

              return true;
            } else {
              // Check content type to determine how to parse the error
              const contentType = response.headers.get("content-type");

              if (contentType && contentType.includes("application/json")) {
                // Parse JSON error
                const errorData = await response.json();
                throw new Error(
                  errorData.message ||
                    errorData.error ||
                    `Request failed (${response.status})`
                );
              } else {
                // Parse text error
                const errorText = await response.text();
                throw new Error(
                  errorText ||
                    `Request failed (${response.status}: ${response.statusText})`
                );
              }
            }
          })
          .catch((error) => {
            // Log the full error for debugging
            console.error("Request approval error:", error);
            // Re-throw so toast can catch it
            throw error;
          })
          .finally(() => {
            isGenerating = false;
          }),
        {
          loading: "Requesting approval...",
          success: "Approval requested!",
          error: (err) => `${err.message || "Failed to request approval"}`,
        }
      );
    };

    return (
      <div ref={ref}>
        <div className="container mt-10 grid grid-cols-12">
          <div className="col-span-12 lg:col-span-10 lg:col-start-2">
            <header className="mt-4 md:mt-10 flex flex-col md:flex-row gap-3 justify-between">
              <>
                <div className="mb-4 md:mb-none">
                  <h2 className="font-semibold text-slate-500 text-lg">
                    Timesheet
                  </h2>
                  <h1 className="font-bold text-green-100 text-4xl lg:text-5xl">
                    {month_year}
                  </h1>
                </div>
                <div className="self-center align-top flex flex-row gap-4">
                  {in_approval_workflow && !signed_token && (
                    <Button
                      onClick={() => requestApproval(path)}
                      text="Request Approval"
                      variant="secondary"
                    />
                  )}
                  {in_approval_workflow && signed_token && (
                    <Button
                      onClick={() => approveTimesheet(path, signed_token)}
                      text="Approve Timesheet"
                      variant="secondary"
                    />
                  )}
                  {isApproved && (
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
                  )}
                  {printButton}
                </div>
              </>
            </header>

            <div className="sm:mt-10 flex flex-col sm:flex-row gap-6 sm:gap-14 md:gap-20">
              <div className="mt-0 md:mt-10 flex flex-col md:gap-2 order-2 sm:order-none">
                <h3 className="font-semibold text-slate-500 text-lg">Client</h3>
                <p className="font-bold text-lg md:text-2xl">
                  {client.client_name}
                </p>
                <p className="font-semibold text-md md:text-lg mb-2 text-green-100/80">
                  {client.client_contact_person}
                </p>
                <p className="font-semibold text-md md:text-md flex flex-col text-green-100/80">
                  {client.client_address.split(/\n/).map((text, index) => (
                    <span key={index}>{text}</span>
                  ))}
                </p>
              </div>

              <div className="mt-2 sm:mt-0 md:mt-10 flex flex-col md:gap-2 order-1 sm:order-none">
                <h3 className="font-semibold text-slate-500 text-lg">
                  Contractor
                </h3>
                <div className="flex flex-row gap-2 mb:gap-4">
                  <Image
                    alt={user.name}
                    src={user.thumbnail}
                    width="100"
                    height="100"
                    className="rounded-full bg-slate-500 h-10 w-10 m-1"
                  />
                  <div className="flex flex-col">
                    <p className="font-bold text-lg md:text-2xl mb:mb-2">
                      {user.name}
                    </p>
                    <p className="font-semibold text-md md:text-lg text-green-100/80">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full">
          {timesheets.map((timesheet, index) => (
            <React.Fragment key={index}>
              <div className="container">
                <div className="mt-10 md:mt-12 lg:mt-16 flex flex-col md:gap-2 mb-6">
                  <h3 className="font-semibold text-slate-500 text-lg">
                    Project
                  </h3>
                  <p className="font-bold text-xl md:text-2xl">
                    {timesheet.namespace}
                  </p>
                  <p className="font-bold text-md md:text-md opacity-70">
                    {timesheet.project_number}
                  </p>
                </div>
              </div>
              <Table
                namespace={timesheet.namespace}
                timesheet={timesheet.timesheet}
                total_hours={timesheet.total_hours}
              />
            </React.Fragment>
          ))}
        </div>
        <div className="flex text-center w-full justify-center mt-16">
          <h3 className="flex flex-col">
            <span className="font-semibold text-slate-500 text-xl mb-1">
              Total hours
            </span>
            <span className="text-green-100 font-bold text-6xl">
              {timesheets.reduce(
                (partialSum, { total_hours }) => partialSum + total_hours,
                0
              )}
            </span>
          </h3>
        </div>
      </div>
    );
  }
);

Timesheet.displayName = "Timesheet";

export default Timesheet;
