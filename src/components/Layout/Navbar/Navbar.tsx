import { NavigationProps, ProfileManagement } from "@/utils/types";
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import {
    Box,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Autocomplete,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  ListItem,
  Divider,
  AppBar,
  Typography,
  Grid,
} from '@mui/material'
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useReferences } from "@/utils/hooks/useToken";
import ControlledModal from "@/components/Modal/Modal";
import { UncontrolledCard } from "@/components/Card/Card";
import { ControlledGrid } from "@/components/Grid/Grid";
import { NormalButton } from "@/components/Button/NormalButton";
import { useForm } from "react-hook-form";
import { BaseUAMCredSchema, ProfileType, UAMAccountCredType, UAMAccountType, uam_schema } from "@/utils/schema/Account/UAMSchema";
import { useAtom } from "jotai";
import { ProfileAtom, UAMAccountCreationAtom, UAMAccountCredentialsAtom } from "@/utils/hooks/useAtomic";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePreviousValue } from "@/utils/hooks/usePreviousValue";
import { ControlledTextField } from "@/components/TextField/TextField";
import { ControlledCheckbox } from "@/components/Checkbox/Checkbox";
import { ControlledMobileNumberField } from "@/components/TextField/MobileNumberField";
import storage from '../../../../firebaseConfig'
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import { useToastContext } from "@/utils/context/Toast/ToastContext";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { ControlledBackdrop } from "@/components/Backdrop/Backdrop";

const DashboardNavigation: React.FC<NavigationProps> = (props) => {
    const {
        open,
        handleDrawerOpen,
        ApplicationBar,
        token,
        signout,
        signoutModal,
        globals
      } = props;
      const [anchorEl, setAnchorEl] = useState(null)
      const [profileatom, setprofileAtom] = useAtom(ProfileAtom)
      const logout = Boolean(anchorEl);
      const [isProfile, setIsProfile] = useState(false)
      const [profileImage, setProfileImage] = useState<string | null>(null)
      const [willChangePassword, setWillChangePassword] = useState(true)
      const [savedPass, setSavedPass] = useState("")
      const [files, setFiles] = useState<any>(null)
      const fileInputRef = useRef<HTMLInputElement>(null)
      const [chooseToUpload, setChooseToUpload] = useState(false)
      const [progress, setProgress] = useState(0)
      const [load, setLoad] = useState(false)
      const [downloadedImage, setDownloadedImage] = useState<string | null>(null)
      const updateProfile = useApiCallBack(
        async (api, args: ProfileManagement) => await api.users.UpdateProfile(args)
      )
      function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
              <Typography variant="body2" color="text.secondary">{`${Math.round(
                props.value,
              )}%`}</Typography>
            </Box>
          </Box>
        );
      }
      const handleClose = () => {
        setAnchorEl(null);
      };
      const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
      };
      const { handleOnToast } = useToastContext()
      const [references, setReferences] = useReferences()
      const form = useForm<ProfileType>({
        mode: 'all',
        resolver : zodResolver(uam_schema && BaseUAMCredSchema),
        defaultValues: profileatom ?? { hasNoMiddleName : false }
      })
      const {
        control, getValues, watch, trigger, resetField, setValue, handleSubmit,
        formState : { isValid }
      } = form;
      useEffect(() => {
        setValue('firstname', references.firstname)
        if(references.middlename != null) {
          setValue('middlename', references.middlename)
          setValue('hasNoMiddleName', true)
        }
        setValue('lastname', references.lastname)
        setValue('phoneNumber', references.phoneNumber)
        setValue('username', references.username)
        setValue('email', references.email)
        setValue('profileImage', references.imgurl)
      }, [])
      useEffect(() => {
        setProfileImage(references.imgurl)
      }, [])
      const image = watch('profileImage')
      useEffect(() => {}, [image])
      const hasNoMiddleName = watch('hasNoMiddleName')
      const hasNoMiddleNamePrevValue = usePreviousValue(hasNoMiddleName)
      useEffect(() => {
        resetField('middlename')
        if(hasNoMiddleNamePrevValue){
          trigger('middlename')
        }
      }, [
        hasNoMiddleName,
        hasNoMiddleNamePrevValue,
        trigger,
        resetField
      ])
      const branchIdentifier = (branch_id: number) => {
        switch(branch_id){
            case 1:
                return 'Palo-Alto Calamba City, Laguna'
            case 2: return 'Halang Calamba City, Laguna'
            case 3: return 'Tambo Lipa City, Batangas'
            case 4: return 'Sabang Lipa City, Batangas'
            case 5: return 'Batangas City'
        }
    }
    const handleUpload = () => {
      return new Promise((resolve) => {
        if(!files) {
          handleOnToast(
            "Please select image first.",
            "top-right",
            false,
            true,
            true,
            true,
            undefined,
            "dark",
            "error"
          );
        } else {
          const checkFireStorage = ref(storage, `/profiles/${files.name}`)
          const fireUploadTask = uploadBytesResumable(checkFireStorage, files)
          fireUploadTask.on("state_changed", (snapshot) => {
            const percent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            )
            setProgress(percent)
          }, (error) => console.log(error), () => {
            getDownloadURL(fireUploadTask.snapshot.ref).then((url) => {
              resolve(url)
              setValue('profileImage', url)
              handleOnToast(
                "Successfully Uploaded.",
                "top-right",
                false,
                true,
                true,
                true,
                undefined,
                "dark",
                "success"
              );
            })
          })
        }
      })
    }
    const handleChangeImage = (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if(files && files.length > 0){
        setFiles(files[0])
        const reader = new FileReader()
        reader.onload = () => {
          const fileUrl = reader.result as string
          setProfileImage(fileUrl)
        }
        reader.readAsDataURL(files[0])
      } else {
        setChooseToUpload(false)
        setProfileImage(null)
      }
    }
    const handleChooseImage = () => {
      if(fileInputRef.current){
        fileInputRef.current.click()
      }
    }
    const handleSaveUpdate = () => {
      setLoad(!load)
      handleUpload().then((downloadedUrl: any) => {
        const values = getValues()
        // make ea condition for will change password
          const obj = {
            id: references.id,
            firstname: values.firstname,
            middlename: values.middlename,
            lastname: values.lastname,
            username: values.username,
            phoneNumber: values.phoneNumber,
            email: values.email,
            password: values.currentPassword,
            newPassword: willChangePassword ? values.password : null,
            branch: references.branch,
            imgurl: downloadedUrl == null ? 'no-image' : downloadedUrl
          }
          updateProfile.execute(obj)
          .then((response) => {
            if(response.data?.status == 200) {
              handleOnToast(
                "Successfully Updated",
                "top-right",
                false,
                true,
                true,
                true,
                undefined,
                "dark",
                "success"
              );
              setProgress(0)
              setLoad(false)
              setReferences(response.data?.forReferences)
              setIsProfile(false)
            } else if (response.data == 400) {
              handleOnToast(
                "Current password is invalid. Please try again",
                "top-right",
                false,
                true,
                true,
                true,
                undefined,
                "dark",
                "error"
              );
              setLoad(false)
            } else if(response.data == 409) {
              handleOnToast(
                "The email is already taken. Please try different email.",
                "top-right",
                false,
                true,
                true,
                true,
                undefined,
                "dark",
                "error"
              );
              setLoad(false)
            } else if(response.data?.status == 201) {
              handleOnToast(
                "Successfully Updated. Your account is going to logout because of email changes.",
                "top-right",
                false,
                true,
                true,
                true,
                undefined,
                "dark",
                "warning"
              );
              setLoad(false)
              setReferences(response.data?.forReferences)
              setIsProfile(false)
            }
          }).catch(error => {
            console.log(error)
          })
      })
    }
    return (
        <>
            <ApplicationBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{
                      marginRight: 5,
                      ...(open && { display: "none" }),
                    }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box className="flex items-center justify-between w-full">
                        <h3 className="text-2xl font-medium font-body text-white">
                            {
                              globals?.storedType == 1 ? 'Administrator' : globals?.storedType == 2 ? 'Manager' + " / Branch : " + " " + branchIdentifier(references?.branch) : 'Customer' 
                            }
                        </h3>
                        <Box className="flex item-center gap-3">
                        <Avatar
                alt="Remy Sharp"
                src={
                  getValues().profileImage == null ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' :
                  getValues().profileImage
                }
              />
              <IconButton
                aria-controls={logout ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={logout ? "true" : undefined}
                onClick={handleClick}
              >
                <ArrowDropDownIcon />
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={logout}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={() => setIsProfile(!isProfile)}>Profile</MenuItem>
                <Divider>Others</Divider>
                <MenuItem onClick={signoutModal} data-testid={"btnsignouttest"}>
                  Log out
                </MenuItem>
              </Menu>
                        </Box>
                    </Box>
                </Toolbar>
                <ControlledModal
                open={isProfile}
                title="Profile Management"
                buttonTextAccept="SAVE"
                buttonTextDecline="CLOSE"
                handleClose={() => setIsProfile(false)}
                handleDecline={() => setIsProfile(false)}
                maxWidth="lg"
                handleSubmit={handleSaveUpdate}
                >
                  <Typography variant='button'>Manage your profile</Typography>
                  <UncontrolledCard style={{
                    marginTop: '10px'
                  }}>
                    <UncontrolledCard>
                    <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                    >
                      <img 
                          src={
                            profileImage == null ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' : 
                            profileImage 
                          }
                          style={{
                            width: '200px',
                            height: '200px',
                            borderRadius: '50%'
                          }}
                        />
                        
                    </div>
                    <div style={{
                       display: 'flex',
                       justifyContent: 'center',
                       marginTop: '10px'
                    }}>
                    <input
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleChangeImage}
                    type="file"
                    accept="/image/*"
                    />
                    <NormalButton 
                        variant='outlined'
                        size='small'
                        children='Choose an Image'
                        color='primary'
                        onClick={handleChooseImage}
                      /> 
                    </div>
                    <Box sx={{ width: '100%' }}>
                            <LinearProgressWithLabel variant="determinate" value={progress} />
                          </Box>
                    </UncontrolledCard>
                    <ControlledGrid>
                      <Grid item xs={6}>
                        <UncontrolledCard>
                          <Typography variant='button'>
                            Basic Information
                          </Typography>
                          <ControlledGrid>
                            <Grid item xs={4}>
                              <ControlledTextField 
                              control={control}
                              name='firstname'
                              required
                              shouldUnregister
                              label='Firstname'
                              />
                            </Grid>
                            <Grid item xs={4}>
                                <ControlledTextField 
                                control={control}
                                name='middlename'
                                required={!hasNoMiddleName}
                                disabled={hasNoMiddleName}
                                shouldUnregister
                                label='Middlename'
                                />
                                <ControlledCheckbox 
                                control={control}
                                name='hasNoMiddleName'
                                label='I do not have a middlename'
                                />
                            </Grid>
                            <Grid item xs={4}>
                              <ControlledTextField 
                                control={control}
                                name='lastname'
                                required
                                shouldUnregister
                                label='Lastname'
                              />
                            </Grid>
                          </ControlledGrid>
                          <ControlledGrid>
                            <Grid item xs={6}>
                              <ControlledMobileNumberField 
                              control={control}
                              name='phoneNumber'
                              required
                              shouldUnregister
                              label='Mobile number'
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <ControlledTextField 
                              control={control}
                              name='username'
                              required
                              shouldUnregister
                              label='Username'
                              />
                            </Grid>
                          </ControlledGrid>
                        </UncontrolledCard>
                      </Grid>
                      <Grid item xs={6}>
                      <UncontrolledCard>
                          <Typography variant='button'>
                            Credentials Information
                          </Typography>
                          <ControlledTextField 
                          control={control}
                          name='email'
                          required
                          shouldUnregister
                          label='Email'
                          />
                          <ControlledTextField 
                          control={control}
                          name='currentPassword'
                          required
                          shouldUnregister
                          type="password"
                          label='Current Password'
                          />
                          <NormalButton
                          variant='text'
                          size='small'
                          color={
                            willChangePassword ? 'primary' : 'error'
                          }
                          children={
                            willChangePassword ? 'Change Password' : 'Cancel'
                          }
                          onClick={() => {
                            if(!willChangePassword) {
                              setWillChangePassword(!willChangePassword)
                              setSavedPass(getValues().currentPassword)
                              resetField('currentPassword')
                            } else {
                              setWillChangePassword(!willChangePassword)
                              setValue('currentPassword', savedPass)
                            }
                          }}
                          />
                          
                          {
                            !willChangePassword && 
                            <>
                            
                            <ControlledTextField 
                              control={control}
                              name='password'
                              required
                              shouldUnregister
                              type="password"
                              label={
                                !willChangePassword ? 'New Password' : 'Password'
                              }
                              disabled={willChangePassword}
                              />
                            <ControlledTextField 
                              control={control}
                              name='conpassword'
                              required
                              shouldUnregister
                              type='password'
                              label='Confirm password'
                              fullWidth
                            />
                            </>
                          }
                          
                        </UncontrolledCard>
                      </Grid>
                    </ControlledGrid>
                  </UncontrolledCard>
                  <ControlledBackdrop open={load} />
                </ControlledModal>
            </ApplicationBar>
        </>
    )
}

export default DashboardNavigation