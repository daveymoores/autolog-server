import { ObjectId } from "mongodb";

export interface TimesheetDayLog {
  hours: number;
  user_edited: boolean;
  weekend: boolean;
}

export interface Timesheet {
  namespace: string;
  timesheet: TimesheetDayLog[];
  total_hours: number;
  project_number: string | null;
}

export interface Client {
  id: string;
  client_name: string;
  client_address: string;
  client_contact_person: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  is_alias: boolean;
  thumbnail: string;
}

export interface Approver {
  approvers_name: string;
  approvers_email: string;
}

export interface TimesheetProps {
  id: string;
  path: string;
  timesheets: Timesheet[];
  client: Client;
  user: User;
  month_year: string;
  signed_token: string | null;
  requires_approval?: boolean | null;
  approved: boolean;
  approvers_name?: string | null;
  approvers_email?: string | null;
}

export interface TimesheetResponseProps {
  _id: ObjectId;
  requires_approval: boolean;
  approved: boolean;
  creation_date: Date;
  month_year: string;
  random_path: string;
  client: Client;
  user: User;
  timesheets: Timesheet[];
  approver: Approver | null;
}
