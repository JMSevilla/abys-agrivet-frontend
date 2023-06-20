import React from "react";
import { Tenant } from "../context/HelperContext/HelperContext";

export type ToastContextSetup = {
  handleOnToast: (
    message: string,
    position: any,
    hideProgressBar: boolean,
    closeOnClick: boolean,
    pauseOnHover: boolean,
    draggable: boolean,
    progress?: any,
    theme?: any,
    type?: any
  ) => void;
};

/**
 * Account Application Setup Props
 */

export type AccountSetup = {
  firstname: string | undefined;
  middlename: string | undefined;
  lastname: string | undefined;
  email: string | undefined;
  username: string | undefined;
  password: string | undefined;
  branch: number | undefined;
  phoneNumber: string | undefined;
};

/**
 * JWT Auth
 */

export type JWTAccountCreationProps = {
  jwtusername: string | undefined;
  jwtpassword: string | undefined;
};

export type AccountLoginWithJWT = {
  email: string | undefined;
  password: string | undefined;
  branch?: number | undefined;
  accountType?: string | undefined;
};

export type AuthenticationProps = {
  AccessToken: string | undefined;
  RefreshToken: string | undefined;
};

/**
 * Dashboard Development
 */

export type NavigationProps = {
  open: boolean;
  handleDrawerOpen: any;
  ApplicationBar: any;
  token?: string;
  signout?: any;
  signoutModal: any;
  globals: Tenant | null
};

export type DashboardLayoutProps = {
  children: React.ReactNode;
};

export type SidebarTypes = {
  title: string;
  dropDown: boolean;
  uri?: string;
};

type childMenuProps = {
  title: string;
  dropDown: boolean;
  uri: string;
  icon: React.ReactNode;
};

export type SubSidebarTypes = {
  parentMenu: string;
  icon: React.ReactNode;
  childMenu: childMenuProps[];
};

export type AdminSidebarProps = {
  open: any;
  handleDrawerClose: any;
  theme: any;
  handleClick: any;
  dropDown: any;
  Drawer: any;
  DrawerHeader: any;
  sidebarConfig: SidebarTypes[];
  subsidebarConfig?: SubSidebarTypes[] | undefined;
  globals: Tenant | null
};

/**
 * Project Table Data Grid
 */
export type ProjectTableProps = {
  data?: any;
  openEdit?: any;
  sx?: any;
  columns: any;
  rowIsCreativeDesign?: boolean;
  loading?: boolean
};

/**
 * Account UAM
 */

export type UAMProps = {
  firstname: string | undefined;
  middlename: string | undefined;
  lastname: string | undefined;
  email: string | undefined;
  username: string | undefined;
  password: string | undefined;
  branch: number | undefined;
};

/**
 * SMS Account Verification
 */

type SMSVerificationCredentialsProps = {
  email?: string | undefined;
  phoneNumber?: string | undefined;
};

export type SMSVerificationProps = {
  email: string | undefined;
  code: string | undefined;
  resendCount: number | undefined;
  isValid: number | undefined;
  type: string | undefined;
  verificationCredentials: SMSVerificationCredentialsProps;
};

export type BranchProps = {
  branch_id: number;
  branchName: string | undefined;
  branchKey: string | undefined;
  branchPath: string | undefined;
  branchStatus: string | undefined;
};

// Table Search Collapsible

export type TableSearchProps = {
  id: any;
  serviceName: string | undefined;
};


// create new schedule

export type CreateNewScheduleProps = {
  userid: number
  branch: number
  mockSchedule: string | undefined
  status: number
  isHoliday: any
  start: Date
  title: string | undefined
}

// create new appointment

export type CreateNewAppointment = {
  email: string | undefined
  phoneNumber: string | undefined
  fullName: string | undefined
  branch_id: number
  service_id: string | undefined
  petInfo: string | undefined
  appointmentSchedule: string | undefined
  status: number
  isWalkedIn: number
  notify?: number
  reminderType: number
}

// type for create new follow up appointment

export type CreateNewFollowUpAppointment = {
  title: string | undefined
  customerName: string | undefined
  branch_id: number
  followupServices: any
  followupDescription: string | undefined
  start: Date
  end: Date
  notificationType: string | undefined
  diagnosis: string | undefined
  treatment: string | undefined
  isHoliday: number
}