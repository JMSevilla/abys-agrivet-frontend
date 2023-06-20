import DashboardNavigation from "./Navbar/Navbar";
import DashboardSidebar from "./Sidebar/Sidebar";
import { Box } from "@mui/material";
import { CssBaseline,Typography } from "@mui/material";
import { styled, useTheme } from '@mui/material/styles'
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import { useState, useEffect } from 'react'
import { useApiCallBack } from "@/utils/hooks/useApi";
import { useRouter } from "next/router";
import { useAccessToken, useBranchPath, usePlatform, useReferences, useRefreshToken, useUserId, useUserType } from "@/utils/hooks/useToken";
import { useToastContext } from "@/utils/context/Toast/ToastContext";
import { SidebarTypes, SubSidebarTypes } from "@/utils/types";
import { sidebarCustomerList, sidebarList, sidebarManagersList } from "./Sidebar/SidebarConfig";
import ControlledModal from "../Modal/Modal";
import { useGlobalsContext } from "@/utils/context/HelperContext/HelperContext";

type DashboardLayoutProps = {
    children: React.ReactNode
    sidebarConfig: SidebarTypes[]
    subsidebarConfig?: SubSidebarTypes[]
}

const drawerWidth = 240;
const openedMixin = (theme : any) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
    }),
    overflowX: "hidden"
})

const closedMixin = (theme: any) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')] : {
        width: `calc(${theme.spacing(8)} + 1px)`
    }
})

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar
}))

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }: any) => ({
    zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  background: '#153D77',
  color: 'black',
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open } : any) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  }));

  export default function DashboardLayout({children, sidebarConfig, subsidebarConfig} : DashboardLayoutProps){
    const theme = useTheme()
    const [open, setOpen] = useState(true)
    const [dropDown, setDropDown] = useState(false);
    const router = useRouter()
    const [sidebarStateConfig , setSidebarStateConfig] = useState<any>(sidebarList)
    const [sidebarManagersStateConfig, setSidebarManagersStateConfig] = useState<any>(sidebarManagersList)
    const [sidebarCustomerConfig, setSidebarCustomerConfig] = useState<any>(sidebarCustomerList)
    const [modalOpen, setModalOpen] = useState(false)
    const { globals } = useGlobalsContext()
    const [accessToken, setAccessToken, clearAccessToken] = useAccessToken()
    const [refreshToken, setRefreshToken, clearRefreshToken] = useRefreshToken()
    const [branchPath, setBranchPath, clearBranchPath] = useBranchPath()
    const [platform, setPlatform, clearPlatform] = usePlatform()
    const [userType, setUserType, clearUserType] = useUserType()
    const [ref, setRef, clearRef] = useReferences()
    const [uid, setuid, clearuid] = useUserId()
    useEffect(() => {
        window.addEventListener('resize', () => {
            return window.innerWidth < 1024 ? setOpen(false) : setOpen(!open)
        })
    })
    const handleClick = (outerIndex: any, innerIndex: any) => {
    let newArray = globals?.storedType == 1 ? sidebarStateConfig : globals?.storedType == 2 ? sidebarManagersStateConfig : sidebarCustomerConfig
    const outerArray = [...newArray]
    const innerArray = outerArray[outerIndex]
    innerArray.dropDownChildren[innerIndex] = {...innerArray?.dropDownChildren[innerIndex], dropDown: !innerArray.dropDownChildren[innerIndex].dropDown}
    outerArray[outerIndex] = innerArray
    if(globals?.storedType == 1){
      setSidebarStateConfig([...newArray, ...outerArray])
    } else if(globals?.storedType == 2) {
      setSidebarManagersStateConfig([...newArray, ...outerArray])
    } else {
      setSidebarCustomerConfig([...newArray, ...outerArray])
    }
    }
    const handleDrawerOpen = () => {
        setOpen(!open)
    }
    const handleDrawerClose = () => {
        setOpen(false)
    }
    const handleSignout = () => {
      clearAccessToken()
      clearBranchPath()
      clearPlatform()
      clearRefreshToken()
      clearUserType()
      clearRef()
      clearuid()
      router.push('/')
    }
    const handleSignoutModal = () => {
      setModalOpen(!modalOpen)
    }
    return (
        <Box className='flex'>
            <CssBaseline />
            <DashboardNavigation 
            open={open}
            handleDrawerOpen={handleDrawerOpen}
            ApplicationBar={AppBar}
            signoutModal={handleSignoutModal}
            globals={globals}
            />
            <DashboardSidebar 
            globals={globals}
            open={open}
            handleDrawerClose={handleDrawerClose}
            theme={theme}
            handleClick={handleClick}
            dropDown={dropDown}
            Drawer={Drawer}
            DrawerHeader={DrawerHeader}
            sidebarConfig={sidebarConfig}
            subsidebarConfig={subsidebarConfig}
            />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }} className='items-center'>
                <DrawerHeader />
                {children}
            </Box>
            <ControlledModal
            open={modalOpen}
            handleClose={() => setModalOpen(false)}
            handleSubmit={handleSignout}
            title="Account signout"
            buttonTextAccept="SIGNOUT"
            buttonTextDecline="CANCEL"
            handleDecline={() => setModalOpen(false)}
            color={'error'}
            >
              <Typography variant='caption' gutterBottom>
                Are you sure you want to sign out?
              </Typography>
            </ControlledModal>
        </Box>
    )
  }