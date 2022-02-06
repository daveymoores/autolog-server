import React from "react";

import { TimesheetDayLog } from "../../types/Timesheet.types";
import HourInput from "../HourInput/HourInput";
import HourSymbol from "../HourSymbol/HourSymbol";

interface TableRow {
  timesheet: TimesheetDayLog[];
}

const TableContainer: React.FC<TableRow> = ({ timesheet }) => {
  const className =
    (length: 31 | 30 | 29 | 28) =>
    (classes: string): string => {
      switch (length) {
        case 31:
          return `${classes} grid-cols-[repeat(31,_minmax(0,_1fr))]`;
        case 30:
          return `${classes} grid-cols-[repeat(30,_minmax(0,_1fr))]`;
        case 29:
          return `${classes} grid-cols-[repeat(29,_minmax(0,_1fr))]`;
        case 28:
          return `${classes} grid-cols-[repeat(28,_minmax(0,_1fr))]`;
      }
    };

  const gridClass = className(timesheet.length as 31 | 30 | 29 | 28);

  return (
    <div className="lg:w-full overflow-scroll lg:overflow-auto bg-slate-900 py-4 lg:bg-transparent lg:py-0">
      <div className="w-[1200px] container max-w-none lg:w-full lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <div className={gridClass("align-middle p-1 grid")}>
          {timesheet.map(({ hours }, index: number) => {
            return (
              <>{hours ? <HourInput hours={hours} index={index} /> : <div />}</>
            );
          })}
        </div>
        <div className={gridClass("align-middle p-1 bg-black rounded-md grid")}>
          {timesheet.map(({ weekend }, index: number) => (
            <div
              key={index}
              className={`text-sm lg:text-md text-center font-semibold${
                weekend ? " text-slate-700" : ""
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <div className={gridClass("align-middle p-1 grid")}>
          {timesheet.map(({ hours }, index: number) => {
            return (
              <>
                {hours ? <HourSymbol hours={hours} index={index} /> : <div />}
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TableContainer;
