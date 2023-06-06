import SettingsIcon from "@mui/icons-material/Settings";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import CategoryIcon from "@mui/icons-material/Category";
import { ListItemIcon } from "@mui/material";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
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
    uri: "/admin/dashboard",
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
