import { TimesheetResponseProps } from "../types/Timesheet.types";
import connect_to_db from "./connect_to_db";
import { ENV_VARS } from "./get_env_vars";

export const getRecord = async (
  random_path: string | undefined,
  env_vars: typeof ENV_VARS,
  useDemoCollection: boolean = false
): Promise<TimesheetResponseProps | null> => {
  const { mongoCollection, client } = await connect_to_db(
    env_vars,
    useDemoCollection
  );

  try {
    const query = { random_path };

    return await mongoCollection.findOne(query);
  } catch (error) {
    throw new Error(`Unable to connect to db: ${error}`);
  } finally {
    await client.close();
  }
};
