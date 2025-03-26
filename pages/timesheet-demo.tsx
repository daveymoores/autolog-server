import { ObjectId } from "mongodb";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React from "react";

import Button from "../components/Button/Button";
import Timesheet from "../components/Timesheet/Timesheet";
import { TimesheetProps } from "../types/Timesheet.types";
import getDays from "../utils/get_days";
import get_env_vars, { ENV_VARS } from "../utils/get_env_vars";
import { getRecord } from "../utils/get_record";
import { generatePdf } from "../utils/generate_pdf";

const Index: React.FC<{ params: TimesheetProps }> = ({
  params: { timesheets, path, ...props },
}) => {
  const router = useRouter();
  const componentRef = React.useRef(null);
  const days = getDays(props.month_year);
  const { query } = router ?? {};

  return (
    <Timesheet
      printButton={
        <div className="self-center align-top hidden md:block">
          {!query?.print ? (
            <Button text="Print timesheet" onClick={() => generatePdf(path)} />
          ) : null}
        </div>
      }
      ref={componentRef}
      {...props}
      path={path}
      timesheets={timesheets}
      days={days}
    />
  );
};

interface TimesheetGenServerResponse<T> {
  props: {
    params: T;
  };
}

interface NotFound {
  notFound: true;
}

interface Context extends ParsedUrlQuery {
  timesheet: string;
}

export const getServerSideProps: GetServerSideProps<
  { params: TimesheetProps },
  Context
> = async (): Promise<
  TimesheetGenServerResponse<TimesheetProps> | NotFound
> => {
  const env_vars = get_env_vars(ENV_VARS);
  const DEMO_TIMESHEET_STRING = "86bczf1oqv";

  const data = await getRecord(DEMO_TIMESHEET_STRING, env_vars, true);

  if (!data) {
    return {
      notFound: true,
    };
  }

  const { timesheets, client, random_path: path, month_year, user, _id } = data;

  const id = new ObjectId(_id).toString();

  return {
    props: {
      params: {
        id,
        path,
        timesheets,
        client,
        user,
        month_year,
        requires_approval: false,
      },
    },
  };
};

export default Index;
