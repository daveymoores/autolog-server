import { TimesheetResponseProps } from "../../types/Timesheet.types";
import { ObjectId } from "mongodb";

const data: TimesheetResponseProps = {
  _id: new ObjectId("61ea86f9adc80ab30b02a577"),
  creation_date: new Date("2022-01-21T10:12:09.764106Z"),
  random_path: "zewi2w3aj9",
  month_year: "January, 2022",
  client: {
    id: "cN-tS4DDTpdfAqWQzSC0L",
    client_name: "foo",
    client_address: "None",
    client_contact_person: "bar",
  },
  user: {
    id: "1KdWZRYjJgc_dvGfDmIOF",
    name: "Davey Moores",
    email: "daveymoores@gmail.com",
    is_alias: false,
    thumbnail: "https://example.com/thumbnail.jpg",
  },
  timesheets: [
    {
      namespace: "autolog",
      timesheet: [
        {
          weekend: true,
          hours: 0,
          user_edited: false,
        },
        {
          weekend: true,
          hours: 0,
          user_edited: false,
        },
        {
          weekend: false,
          hours: 0,
          user_edited: false,
        },
        {
          weekend: false,
          hours: 0,
          user_edited: false,
        },
        {
          weekend: false,
          hours: 0,
          user_edited: false,
        },
        {
          weekend: false,
          hours: 0,
          user_edited: false,
        },
        {
          weekend: false,
          hours: 0,
          user_edited: false,
        },
        {
          weekend: true,
          hours: 0,
          user_edited: false,
        },
        {
          weekend: true,
          hours: 0,
          user_edited: false,
        },
        {
          weekend: false,
          hours: 0,
          user_edited: false,
        },
        {
          weekend: false,
          hours: 0,
          user_edited: false,
        },
        {
          weekend: false,
          hours: 0,
          user_edited: false,
        },
        {
          weekend: false,
          hours: 0,
          user_edited: false,
        },
        {
          weekend: false,
          hours: 8,
          user_edited: false,
        },
        {
          weekend: true,
          hours: 0,
          user_edited: false,
        },
        {
          weekend: true,
          hours: 0,
          user_edited: false,
        },
        {
          weekend: false,
          hours: 0,
          user_edited: false,
        },
        {
          weekend: false,
          hours: 0,
          user_edited: false,
        },
        {
          weekend: false,
          hours: 8,
          user_edited: false,
        },
        {
          weekend: false,
          hours: 0,
          user_edited: false,
        },
        {
          weekend: false,
          hours: 8,
          user_edited: false,
        },
        {
          weekend: true,
          hours: 0,
          user_edited: false,
        },
        {
          weekend: true,
          hours: 0,
          user_edited: false,
        },
        {
          weekend: false,
          hours: 0,
          user_edited: false,
        },
        {
          weekend: false,
          hours: 0,
          user_edited: false,
        },
        {
          weekend: false,
          hours: 0,
          user_edited: false,
        },
        {
          weekend: false,
          hours: 0,
          user_edited: false,
        },
        {
          weekend: false,
          hours: 0,
          user_edited: false,
        },
        {
          weekend: true,
          hours: 0,
          user_edited: false,
        },
        {
          weekend: true,
          hours: 0,
          user_edited: false,
        },
        {
          weekend: false,
          hours: 0,
          user_edited: false,
        },
      ],
      total_hours: 24,
      project_number: null,
    },
  ],
};

export default data;
