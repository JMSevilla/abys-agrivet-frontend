import SettingsIcon from "@mui/icons-material/Settings";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import CategoryIcon from "@mui/icons-material/Category";
import { ListItemIcon } from "@mui/material";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";

import EventNoteIcon from "@mui/icons-material/EventNote";
import CreateIcon from "@mui/icons-material/Create";
import PreviewIcon from "@mui/icons-material/Preview";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

type sidebarProps = {
  objectID: number;
  name: string;
  title: string;
  dropDown: boolean;
  uri?: string;
  icon?: React.ReactNode;
  disable?: boolean;
  dropDownChildren?: sidebarExpandProps[];
};

type ChildMenuProps = {
  title: string;
  dropDown: boolean;
  uri: string;
  icon: React.ReactNode;
};

type sidebarExpandProps = {
  parentMenu: string;
  icon: React.ReactNode;
  childMenu: ChildMenuProps[];
  disable?: boolean;
  dropDown?: boolean;
};

type SettingsListOptions = {
  objectID: number;
  text: string;
  uri: string;
  icon: React.ReactNode;
};

export const sidebarSettingsArea: SettingsListOptions[] = [
  {
    objectID: 1,
    text: "Settings",
    uri: "/admin/settings/settings",
    icon: <SettingsIcon className="text-white" />,
  },
];

export const sidebarList: sidebarProps[] = [
  {
    objectID: 1,
    name: "Admin",
    title: "Admin Overview",
    dropDown: false,
    uri: "/admin/dashboard",
    icon: <AssessmentIcon className="text-white" />,
  },
  {
    objectID: 2,
    name: "UAM",
    title: "UAM",
    dropDown: false,
    uri: "/admin/user-management",
    icon: <SupervisedUserCircleIcon className="text-white" />,
  },
  {
    objectID: 3,
    name: "Category Management",
    title: "Category management",
    dropDown: true,
    icon: <CategoryIcon className="text-white" />,
    dropDownChildren: [
      {
        parentMenu: "Categories",
        icon: (
          <>
            <ListItemIcon>
              <CategoryIcon className="text-white" />
            </ListItemIcon>
          </>
        ),
        childMenu: [
          {
            title: "Branch",
            dropDown: true,
            uri: "/admin/categories/branch",
            icon: (
              <>
                <ListItemIcon>
                  <AltRouteIcon className="text-white" />
                </ListItemIcon>
              </>
            ),
          },
          {
            title: "Services",
            dropDown: true,
            uri: "/admin/categories/services",
            icon: (
              <>
                <ListItemIcon>
                  <MiscellaneousServicesIcon className="text-white" />
                </ListItemIcon>
              </>
            ),
          },
        ],
        dropDown: false,
      },
    ],
  },
  {
    objectID: 4,
    name: "Record Management",
    title: "Record",
    uri: "/admin/dashboard",
    dropDown: false,
    icon: <AssessmentIcon className="text-white" />,
    disable: true,
  },
];

export const sidebarExpand: sidebarExpandProps[] = [
  {
    parentMenu: "Category Management",
    icon: (
      <>
        <ListItemIcon>
          <AltRouteIcon className="text-white" />
        </ListItemIcon>
      </>
    ),
    childMenu: [
      {
        title: "Branch",
        dropDown: true,
        uri: "/admin/categories/branch",
        icon: (
          <>
            <ListItemIcon>
              <AltRouteIcon className="text-white" />
            </ListItemIcon>
          </>
        ),
      },
      {
        title: "Services",
        dropDown: true,
        uri: "/admin/categories/services",
        icon: (
          <>
            <ListItemIcon>
              <MiscellaneousServicesIcon className="text-white" />
            </ListItemIcon>
          </>
        ),
      },
    ],
  },
];

export const sidebarCustomerList: sidebarProps[] = [
  {
    objectID: 1,
    name: "Customer",
    title: "Customer Overview",
    dropDown: false,
    uri: "/customer/dashboard",
    icon: <AssessmentIcon className="text-white" />,
  },
  {
    objectID: 2,
    name: "Appointment",
    title: "Appointment",
    dropDown: true,
    icon: <EventNoteIcon className="text-white" />,
    dropDownChildren: [
      {
        parentMenu: "Appointment",
        icon: (
          <>
            <ListItemIcon>
              <EventNoteIcon className="text-white" />
            </ListItemIcon>
          </>
        ),
        childMenu: [
          {
            title: "Create",
            dropDown: true,
            uri: "/customer/appointment/create",
            icon: (
              <>
                <ListItemIcon>
                  <CreateIcon className="text-white" />
                </ListItemIcon>
              </>
            ),
          },
          {
            title: "View",
            dropDown: true,
            uri: "/customer/appointment/view",
            icon: (
              <>
                <ListItemIcon>
                  <PreviewIcon className="text-white" />
                </ListItemIcon>
              </>
            ),
          },
        ],
        dropDown: false,
      },
    ],
  },
];

export const sidebarCustomerExpand: sidebarExpandProps[] = [
  {
    parentMenu: "Appointment",
    icon: (
      <>
        <ListItemIcon>
          <EventNoteIcon className="text-white" />
        </ListItemIcon>
      </>
    ),
    childMenu: [
      {
        title: "Create Appointment",
        dropDown: true,
        uri: "/customer/dashboard",
        icon: (
          <>
            <ListItemIcon>
              <EventNoteIcon className="text-white" />
            </ListItemIcon>
          </>
        ),
      },
      {
        title: "Services",
        dropDown: true,
        uri: "/customer/dashboard",
        icon: (
          <>
            <ListItemIcon>
              <EventNoteIcon className="text-white" />
            </ListItemIcon>
          </>
        ),
      },
    ],
  },
];

export const sidebarManagersList: sidebarProps[] = [
  {
    objectID: 1,
    name: "Managers",
    title: "Manager Overview",
    uri: "/managers/dashboard",
    dropDown: false,
    icon: <AssessmentIcon className="text-white" />,
  },
  {
    objectID: 2,
    name: "Appointments",
    title: "Appointments",
    dropDown: true,
    icon: <CalendarMonthIcon className="text-white" />,
    dropDownChildren: [
      {
        parentMenu: "Appointments",
        icon: (
          <>
            <ListItemIcon>
              <CalendarMonthIcon className="text-white" />
            </ListItemIcon>
          </>
        ),
        childMenu: [
          {
            title: "Walked-In",
            dropDown: true,
            uri: "/managers/appointments/walkin",
            icon: (
              <>
                <ListItemIcon>
                  <DirectionsWalkIcon className="text-white" />
                </ListItemIcon>
              </>
            ),
          },
          {
            title: "List",
            dropDown: true,
            uri: "/managers/appointments/",
            icon: (
              <>
                <ListItemIcon>
                  <MiscellaneousServicesIcon className="text-white" />
                </ListItemIcon>
              </>
            ),
          },
        ],
        dropDown: false,
      },
    ],
  },
  {
    objectID: 3,
    name: "Record Management",
    title: "Record",
    uri: "/managers/record-management",
    dropDown: false,
    icon: <AssessmentIcon className="text-white" />,
  },
];

export const sidebarManagersExpand: sidebarExpandProps[] = [
  {
    parentMenu: "Appointments",
    icon: (
      <>
        <ListItemIcon>
          <EventNoteIcon className="text-white" />
        </ListItemIcon>
      </>
    ),
    childMenu: [
      {
        title: "Create Appointment",
        dropDown: true,
        uri: "/customer/dashboard",
        icon: (
          <>
            <ListItemIcon>
              <EventNoteIcon className="text-white" />
            </ListItemIcon>
          </>
        ),
      },
      {
        title: "Appointment List",
        dropDown: true,
        uri: "/customer/dashboard",
        icon: (
          <>
            <ListItemIcon>
              <EventNoteIcon className="text-white" />
            </ListItemIcon>
          </>
        ),
      },
    ],
  },
];
