import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import React from "react";

import { TimesheetDayLog } from "../../../types/Timesheet.types";
import Timesheet from "../Timesheet";

describe("Timesheet Component", () => {
  // Set up test data that matches the types
  const mockData = {
    id: "789",
    path: "/timesheet/789",
    days: 31,
    printButton: <button>Print</button>,
    signed_token: "12345",
    approvers_name: "John Doe",
    approvers_email: "john@example.com",
    requires_approval: true,
    approved: false,
    client: {
      id: "123",
      client_name: "Test Client",
      client_contact_person: "John Doe",
      client_address: "123 Test Street\nTest City\nTest Country",
    },
    user: {
      id: "456",
      name: "Jane Smith",
      email: "jane@example.com",
      is_alias: false,
      thumbnail: "https://example.com/thumbnail.jpg",
    },
    month_year: "October 2023",
    timesheets: [
      {
        namespace: "Project A",
        project_number: "PROJ-001",
        timesheet: [
          { hours: 8, user_edited: false, weekend: false },
          { hours: 8, user_edited: true, weekend: false },
        ] as TimesheetDayLog[],
        total_hours: 16,
      },
      {
        namespace: "Project B",
        project_number: "PROJ-002",
        timesheet: [
          { hours: 6, user_edited: false, weekend: false },
          { hours: 7, user_edited: true, weekend: false },
        ] as TimesheetDayLog[],
        total_hours: 13,
      },
    ],
  };

  it("renders the timesheet header with month/year", () => {
    render(<Timesheet {...mockData} ref={null} />);

    expect(screen.getByText("Timesheet")).toBeInTheDocument();
    expect(screen.getByText("October 2023")).toBeInTheDocument();
  });

  it("renders client information correctly", () => {
    render(<Timesheet {...mockData} ref={null} />);

    expect(screen.getByText("Client")).toBeInTheDocument();
    expect(screen.getByText("Test Client")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();

    // Check each line of address
    expect(screen.getByText("123 Test Street")).toBeInTheDocument();
    expect(screen.getByText("Test City")).toBeInTheDocument();
    expect(screen.getByText("Test Country")).toBeInTheDocument();
  });

  it("renders contractor information correctly", () => {
    render(<Timesheet {...mockData} ref={null} />);

    expect(screen.getByText("Contractor")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  it("renders multiple projects with tables", () => {
    render(<Timesheet {...mockData} ref={null} />);

    // Check project headers
    expect(screen.getAllByText("Project").length).toBe(2);
    expect(screen.getByText("Project A")).toBeInTheDocument();
    expect(screen.getByText("Project B")).toBeInTheDocument();
    expect(screen.getByText("PROJ-001")).toBeInTheDocument();
    expect(screen.getByText("PROJ-002")).toBeInTheDocument();
  });

  it("calculates and displays the total hours correctly", () => {
    render(<Timesheet {...mockData} ref={null} />);

    expect(screen.getByText("Total hours")).toBeInTheDocument();
    expect(screen.getByText("29")).toBeInTheDocument(); // 16 + 13 = 29
  });

  it("passes ref to the outer div", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Timesheet {...mockData} ref={ref} />);

    // Check that the ref is assigned
    expect(ref.current).not.toBeNull();
  });

  it("renders the print button", () => {
    render(<Timesheet {...mockData} ref={null} />);

    // The button is passed as a prop, so it should be in the document
    expect(screen.findByText("Print")).toBeTruthy();
  });
});
