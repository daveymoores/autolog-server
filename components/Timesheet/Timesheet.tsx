import React, { ReactNode } from "react";

import { TimesheetProps } from "../../types/Timesheet.types";
import Table from "../Table/Table";

interface Props extends Omit<TimesheetProps, "timesheet"> {
  days: number;
  printButton: ReactNode;
}

 
const Timesheet = React.forwardRef<HTMLDivElement, Props>(
  ({ timesheets, client, user, month_year, printButton }, ref) => {
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
                <div className="self-center align-top hidden md:block">
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
                <p className="font-semibold text-md md:text-lg flex flex-col text-green-100/80">
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
                  <div className="rounded-full bg-slate-500 h-10 w-10 m-1" />
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
                  <p className="font-bold text-xl md:text-2xl">
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

export default Timesheet;
