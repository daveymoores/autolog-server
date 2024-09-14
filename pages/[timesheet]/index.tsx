import { ObjectId } from "mongodb";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React, { ReactInstance } from "react";

import Button from "../../components/Button/Button";
import Timesheet from "../../components/Timesheet/Timesheet";
import {
  TimesheetProps,
  TimesheetResponseProps,
} from "../../types/Timesheet.types";
import connect_to_db from "../../utils/connect_to_db";
import getDays from "../../utils/get_days";
import get_env_vars, { ENV_VARS } from "../../utils/get_env_vars";

const Index: React.FC<{ params: TimesheetProps }> = ({
  params: { timesheets, path, ...props },
}) => {
  const router = useRouter();
  const componentRef = React.useRef<ReactInstance>(null);
  const days = getDays(props.month_year);
  const { query } = router;

  const handleGeneratePdf = async () => {
    try {
      const response = await fetch("/api/generate-pdf");
      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "timesheet.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Revoke the object URL after the download
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <Timesheet
      printButton={
        <div className="self-center align-top hidden md:block">
          {!query?.print ? (
            <Button text="Print timesheet" onClick={handleGeneratePdf} />
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
  notFound: boolean;
}

interface Context extends ParsedUrlQuery {
  timesheet: string;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const getServerSideProps: GetServerSideProps<
  TimesheetGenServerResponse<TimesheetResponseProps>,
  Context
> = async (
  context
): Promise<TimesheetGenServerResponse<TimesheetProps> | NotFound> => {
  const env_vars = get_env_vars(ENV_VARS);

  const getRecord = async (
    random_path: string | undefined
  ): Promise<TimesheetResponseProps | null> => {
    try {
      const { mongoCollection } = await connect_to_db(env_vars);
      const query = { random_path };
      return await mongoCollection.findOne(query);
    } catch (error) {
      throw new Error(`Unable to connect to db: ${error}`);
    }
  };

  const data = await getRecord(context?.params?.timesheet);

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
      },
    },
  };
};

export default Index;
