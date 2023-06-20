import { useEffect, useState } from "react";
import { AdminSidebarProps } from "@/utils/types";
import {
  Box,
  List,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import StarBorder from "@mui/icons-material/StarBorder";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useRouter } from "next/router";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { useQuery } from "react-query";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { sidebarSettingsArea } from "./SidebarConfig";
import { useBranchPath } from "@/utils/hooks/useToken";
import { encrypt } from "@/utils/config/encryptor";

const DashboardSidebar: React.FC<AdminSidebarProps> = (props) => {
  const {
    open,
    handleDrawerClose,
    theme,
    handleClick,
    dropDown,
    Drawer,
    DrawerHeader,
    sidebarConfig,
    subsidebarConfig,
    globals
  } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [branchPath, setBranchPath] = useBranchPath();
  const router = useRouter();
  const handleSelectedIndex = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
  };
  const handlePushOnParent = (
    uri: string,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    outerIndex: any
  ) => {
    router.push(uri);
    handleSelectedIndex(event, outerIndex);
    setBranchPath(encrypt(uri));
  };
  const handlePushOnChild = (
    uri: string,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    innerIndex: any
  ) => {
    router.push(uri);
    handleSelectedIndex(event, innerIndex);
    setBranchPath(encrypt(uri));
  };
  const handlePushOnSettings = (
    uri: string
  ) => {
    router.push(uri)
    setBranchPath(encrypt(uri))
  }
  return (
    <>
      <Drawer
        open={open}
        variant="permanent"
        PaperProps={{
          sx: {
            backgroundColor: "#051e34",
            color: "white",
          },
        }}
      >
        <Box className="flex flex-col justify-between h-full">
          <Box className="flex flex-col">
            <DrawerHeader>
              <Box className="flex gap-2 items-center">
                <img
                  src="/agrivet.png"
                  style={{
                    width: "100%",
                  }}
                />
              </Box>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon style={{ color: "white" }} />
                ) : (
                  <ChevronLeftIcon style={{ color: "white" }} />
                )}
              </IconButton>
            </DrawerHeader>
            <Divider className="bg-sideBarTabHover" />
            <List style={{ marginTop: "5px" }}>
              {sidebarConfig?.length > 0 &&
                sidebarConfig?.map((text: any, outerIndex: any) => (
                  <Box key={outerIndex} className="flex flex-col items-center">
                    <ListItem
                      key={text}
                      disablePadding
                      sx={{
                        display: "block",
                        background: "#122c44",
                        margin: "4px 0px",
                        borderRadius: "10px",
                        width: "90%",
                        "&:hover": {
                          backgroundColor: "#253d53",
                        },
                      }}
                    >
                      {text.dropDown ? (
                        <>
                          {text.dropDownChildren?.length > 0 &&
                            text.dropDownChildren.map(
                              (item: any, innerIndex: any) => (
                                <>
                                  <ListItemButton
                                    selected={selectedIndex == innerIndex}
                                    key={innerIndex}
                                    disabled={item.disable}
                                    onClick={(event) => {
                                      handleClick(outerIndex, innerIndex),
                                        handleSelectedIndex(event, innerIndex);
                                    }}
                                  >
                                    {item.icon}
                                    <ListItemText primary={item.parentMenu} />
                                    {item.dropDown ? (
                                      <ExpandLess />
                                    ) : (
                                      <ExpandMore />
                                    )}
                                  </ListItemButton>
                                  {item.childMenu?.length > 0 &&
                                    item.childMenu?.map((child: any) => (
                                      <>
                                        <Collapse
                                          in={item.dropDown}
                                          key={innerIndex}
                                          timeout="auto"
                                          unmountOnExit
                                        >
                                          <List
                                            component={"div"}
                                            disablePadding
                                          >
                                            <ListItemButton
                                              sx={{ pl: 4 }}
                                              onClick={(event) =>
                                                handlePushOnChild(
                                                  child.uri,
                                                  event,
                                                  innerIndex
                                                )
                                              }
                                            >
                                              {child.icon}
                                              <ListItemText
                                                primary={child.title}
                                              />
                                            </ListItemButton>
                                          </List>
                                        </Collapse>
                                      </>
                                    ))}
                                </>
                              )
                            )}
                        </>
                      ) : (
                        <>
                          <ListItemButton
                            selected={selectedIndex == outerIndex}
                            sx={{
                              minHeight: 48,
                              justifyContent: open ? "initial" : "center",
                              px: 2.5,
                            }}
                            onClick={(event) =>
                              handlePushOnParent(text.uri, event, outerIndex)
                            }
                            disabled={text.disable}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 0,
                                mr: open ? 3 : "auto",
                                justifyContent: "center",
                                color: "white",
                              }}
                            >
                              {text.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={text.title}
                              sx={{ opacity: open ? 1 : 0 }}
                            />
                            {text.disable && (
                              <EngineeringIcon className="text-white" />
                            )}
                          </ListItemButton>
                        </>
                      )}
                    </ListItem>
                  </Box>
                ))}
            </List>
            <Divider className="bg-sideBarTabHover" />
            <List>
              {
                globals?.storedType == 1 && 
                sidebarSettingsArea?.length > 0 &&
                sidebarSettingsArea.map((item, index) => (
                  <Box className="flex flex-col items-center">
                    <ListItem
                      key={item.text}
                      disablePadding
                      sx={{
                        display: "block",
                        background: "#122c44",
                        margin: "4px 0px",
                        borderRadius: "10px",
                        width: "90%",
                        "&:hover": {
                          backgroundColor: "#253d53",
                        },
                      }}
                    >
                      <ListItemButton
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? "initial" : "center",
                          px: 2.5,
                        }}
                        onClick={() => handlePushOnSettings(item.uri)}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                            color: "white",
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.text}
                          sx={{ opacity: open ? 1 : 0 }}
                        />
                      </ListItemButton>
                    </ListItem>
                  </Box>
                ))
              }
            </List>
          </Box>
          <Box className="flex flex-col py-2 gap-2">
            <Divider className="bg-sideBarTabHover" />
            <h3
              className={
                open ? "block font-serif text-white text-center" : "hidden"
              }
            >
              All rights reserved Abys Agrivet
            </h3>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default DashboardSidebar;
