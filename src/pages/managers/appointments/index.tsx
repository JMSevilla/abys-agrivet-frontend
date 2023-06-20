import { ControlledBackdrop, ControlledGrid, ControlledMultipleSelectField, ControlledTabs, ControlledTextField, NormalButton, UncontrolledCard } from "@/components";
import { Chip, Container, Grid, IconButton, Popover, TextField, Typography } from "@mui/material";
import { ProjectTable } from "@/components/Table/ProjectTable";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { useEffect, useState } from "react";
import { useReferences } from "@/utils/hooks/useToken";
import { useAuthenticationContext } from "@/utils/context/AuthContext/AuthContext";
import ControlledModal from "@/components/Modal/Modal";
import { baseRecommendationsSchema, RecommendationsType } from "@/utils/schema/Appointment/RecommendationsAppointment";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { RecommendationsAtom } from "@/utils/hooks/useAtomic";
import { ControlledRichTextField } from "@/components/TextField/RichTextField";
import { DateRangePicker } from 'react-date-range'
import RadioGroupForm from "@/components/GroupRadio/RadioGroupButton";
import { CreateNewFollowUpAppointment } from "@/utils/types";
import { useMutation } from "react-query";
import { useToastContext } from "@/utils/context/Toast/ToastContext";

import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import StopIcon from '@mui/icons-material/Stop';
import FollowTheSignsIcon from '@mui/icons-material/FollowTheSigns';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import moment from "moment";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
/**@author JM Sevilla 
 * @access There is no current validation on save submission so be aware.
 */
const Appointments: React.FC = () => {
    const [references, setReferences] = useReferences()
    const [loading, setLoading] = useState(true)
    const [viewMoreModal, setViewMoreModal] = useState(false)
    const [viewMoreFollowUpModal, setViewMoreFollowUpModal] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const GetAppointmentBasedOnBranch = useApiCallBack(async (api, branch_id: number) => await api.abys.getAllAppointmentPerBranch(branch_id))
    const [feed, setFeed] = useState([])
    const [followupFeed, setFollowUpFeed] = useState([])
    const [preload, setPreload] = useState(false)
    const [tabsValue, setTabsValue] = useState(1)
    const [followup, setFollowUp] = useState(false)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    const GetFollowUpAppointmentOnBranch = useApiCallBack(async (api, branch_id : number) => await api.abys.FollowUpAppointmentList(branch_id))
    const appointmentSessionActions = useApiCallBack(async (api, args : { actions: string|undefined, id: number, managerUid: number }) => 
    await api.abys.appointmentSessionActions(args))
    const getSessionUser = useApiCallBack(async (api, manageruid: number) => await api.abys.GetSessionUser(manageruid))
    const makeAppointmentDone = useApiCallBack(async (api, id: number) => await api.abys.MakeAppointmentDone(id))
    const searchEngineFollowUpAppointment = useApiCallBack(async (api, args: {
        start: any,
        end: any,
        customerName: string | undefined
    }) => await api.abys.SearchEngineFollowUpAppointment(args))
    const [searchPreLoad, setSearchPreLoad] = useState(false)
    const [savedReferences, setSavedReferences] = useState<any>({
        id: null,
        service: null,
        customerName: '',
        branchName: '',
        petInfo: null,
        branch_id: 0,
        session: 0,
        managersId: 0,
        vetName: null
    })
    const [savedForSearch, setSavedForSearch] = useState<any>({
        dateFilterStart: null, dateFilterEnd: null, customerName: null
    })
    const { handleOnToast } = useToastContext()
    const createFollowUpCheckup = useApiCallBack(async (api, args: CreateNewFollowUpAppointment) => await api.abys.createNewFollowAppointment(args))
    const handleCalendarPopOver = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleCalendarClose = () => {
        setAnchorEl(null)
    }
    const open = Boolean(anchorEl)
    const id = open ? 'simple-popover' : undefined
    const useCreateFollowUpCheckUp = () => {
        return useMutation((data: CreateNewFollowUpAppointment) => 
            createFollowUpCheckup.execute(data)
        );
    }
    const { mutate } = useCreateFollowUpCheckUp()
    
    const [services, setServices] = useState<any>([])
    function FuncGetAppointmentPerBranch() {
        GetAppointmentBasedOnBranch.execute(references?.branch)
        .then((response) => {
            setFeed(response?.data)
        })
    }
    function FuncGetFollowUpAppointmentPerBranch() {
        GetFollowUpAppointmentOnBranch.execute(references?.branch)
        .then((response) => {
            setFollowUpFeed(response?.data)
        })
    }
    const [state, setState] = useState<Array<{
        startDate: Date,
        endDate: Date,
        key: string
    }>>([ {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    }]);
    const [filterDate, setFilterDate] = useState<Array<{
        startDate: Date,
        endDate: Date,
        key: string
    }>>([ {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    }]);
    const getAllServices = useApiCallBack(api => api.abys.getAllServices())
    const [recommendations, setRecommendations] = useAtom(RecommendationsAtom)
    const {
        control, setValue, getValues, formState : { isValid }
    } = useForm<RecommendationsType>({
        mode: 'all',
        resolver: zodResolver(baseRecommendationsSchema),
        defaultValues: recommendations
    })
    const handleSave = () => {
        const values = getValues()
        const obj = {
            title: values.title,
            id: savedReferences.id,
            petInformation: JSON.stringify(savedReferences.petInfo),
            branch_id: savedReferences.branch_id,
            customerName: savedReferences.customerName,
            followupServices: JSON.stringify(savedReferences.service),
            followupDescription: values.description,
            notificationType: values.value,
            diagnosis: values.diagnosis,
            treatment: values.treatment,
            status: 1,
            isHoliday: 0, // fix holiday value
            start: values.start,
            end: values.end,
            managersId: savedReferences?.managersId
        } ?? recommendations
        setRecommendations(values)
        setLoading(!loading)
        mutate(obj, {
            onSuccess: (response) => {
                if(response.data == 200) {
                    handleOnToast(
                        "Successfully created a follow-up appointment.",
                        "top-right",
                        false,
                        true,
                        true,
                        true,
                        undefined,
                        "dark",
                        "success"
                    );
                    setLoading(false)
                    setViewMoreModal(false)
                    FuncGetAppointmentPerBranch()
                } else if(response.data == 401){
                    handleOnToast(
                        "Invalid follow up date schedule.",
                        "top-right",
                        false,
                        true,
                        true,
                        true,
                        undefined,
                        "dark",
                        "error"
                    );
                    setLoading(false)
                }
            }
        })
    }
    useEffect(() => {
        if(savedReferences) {
            setPreload(false)
            setValue('customerName', savedReferences.customerName)
            setValue('branchName', savedReferences.branchName)
            setValue('branch_id', savedReferences.branch_id)
            setValue('service', JSON.stringify(savedReferences.service))
        }
        getAllServices.execute().then((response) => {
            const filtered = response?.data?.length > 0 && response?.data?.filter((o: any) => {
                let preFiltered = JSON.parse(o?.serviceBranch)
                return preFiltered.some((nested: any) => nested.branch_id == savedReferences.branch_id)
            })
            setServices(filtered)
        })
    }, [savedReferences])
    const { checkAuthentication } = useAuthenticationContext()
    useEffect(() => {
        FuncGetAppointmentPerBranch()
        FuncGetFollowUpAppointmentPerBranch()
    }, [])
    useEffect(() => {
        setTimeout(() => {
          checkAuthentication().then((res) => {
            if (res == "authenticated") {
              setLoading(false);
            }
          });
        }, 3000);
      }, []);
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
    const handleViewMore = (id: number, services: any, fullName: string, branch_id: number, petInfo: any, session: number,
        managersId: number) => {
        setPreload(!preload)
        getSessionUser.execute(managersId).then((response) => 
        {
            const newSavedReferences = {
                ...savedReferences,
                id: id,
                service: JSON.parse(services),
                customerName: fullName,
                branchName: branchIdentifier(branch_id),
                petInfo: JSON.parse(petInfo),
                branch_id: branch_id,
                session: session,
                managersId: managersId,
                vetName: response?.data == undefined || !response.data ? "None" : response?.data?.firstname + " " + response?.data?.lastname
            }
            setSavedReferences(newSavedReferences)
            setViewMoreModal(!viewMoreModal)
        })
    }
    const followupColumns: any[] = [
        {
            field: 'id', headerName: 'ID', width: 80
        },
        {
            field: 'branch_id', headerName: 'Branch ID',
            sortable: false, 
            width: 250,
            renderCell: (params: any) => {
                switch(params.row.branch_id) {
                    case 1:
                        return 'Palo Alto Calamba City, Laguna'
                    case 2:
                        return 'Halang Calamba City, Laguna'
                    case 3:
                        return 'Tambo Lipa City, Batangas'
                    case 4:
                        return 'Sabang Lipa City, Batangas'
                    case 5:
                        return 'Batangas City'
                    case 6:
                        return 'All Branch'
                }
            }
        },
        {
            field: 'customerName',
            headerName: 'CUSTOMER NAME',
            sortable: false,
            width: 150
        },
        {
            field: 'notificationType',
            headerName: 'REMINDER',
            width: 150,
            renderCell: (params: any) => {
                switch(params.row.notificationType){
                    case "email":
                        return <Chip variant="filled" size="small" label="EMAIL" color="success" />
                    case "sms":
                        return <Chip variant="filled" size="small" label="SMS" color="warning" />
                }
            }
        },
        {
            field: 'isSessionStarted',
            headerName: 'SESSION STATUS',
            width: 100,
            sortable: false,
            renderCell: (params: any) => {
                switch(params.row.isSessionStarted){
                    case 0 || null:
                        return <Chip variant="filled" size="small" label="OPEN" color="primary" />
                    case 1:
                        return <Chip variant="filled" size="small" label="ONGOING SESSION" color="info" />
                    case 2:
                        return <Chip variant="filled" size="small" label="PENDING" color="warning" />
                }
            }
        },
        {
            field: 'start',
            headerName: 'Appointment Date',
            width: 150,
            sortable: false,
            renderCell: (params: any) => {
                return (
                    <Chip variant='filled' size='small' label={moment(new Date(params.row.start)).format('MMMM Do YYYY')} color='info' />
                )
            }
        },
        {
            headerName: 'ACTIONS',
            width: 150,
            renderCell: (params: any) => {
                return (
                    <>
                        <div style={{display: 'flex'}}>
                            <NormalButton 
                            size='small'
                            variant="outlined"
                            children='View more'
                            onClick={() => console.log("follow-up view more")}
                            />
                        </div>
                    </>
                )
            }
        }
    ]
    const columns: any[] = [
        {field: 'id', headerName: 'ID', width: 80},
        {
            field: 'branch_id', headerName: 'Branch ID',
            sortable: false, 
            width: 250,
            renderCell: (params: any) => {
                switch(params.row.branch_id) {
                    case 1:
                        return 'Palo Alto Calamba City, Laguna'
                    case 2:
                        return 'Halang Calamba City, Laguna'
                    case 3:
                        return 'Tambo Lipa City, Batangas'
                    case 4:
                        return 'Sabang Lipa City, Batangas'
                    case 5:
                        return 'Batangas City'
                    case 6:
                        return 'All Branch'
                }
            }
        },
        {
            field: 'fullName',
            headerName: 'CUSTOMER NAME',
            sortable: false,
            width: 150
        },
        {
            field: 'reminderType',
            headerName: 'REMINDER',
            width: 150,
            renderCell: (params: any) => {
                switch(params.row.reminderType){
                    case 1:
                        return <Chip variant="filled" size="small" label="EMAIL" color="success" />
                    case 0:
                        return <Chip variant="filled" size="small" label="SMS" color="warning" />
                }
            }
        },
        {
            field: 'isSessionStarted',
            headerName: 'SESSION STATUS',
            width: 150,
            sortable: false,
            renderCell: (params: any) => {
                switch(params.row.isSessionStarted){
                    case 0:
                        return <Chip variant="filled" size="small" label="OPEN" color="primary" />
                    case 1:
                        return <Chip variant="filled" size="small" label="ONGOING" color="warning" />
                    case 2:
                        return <Chip variant="filled" size="small" label="PENDING" color="error" />
                }
            }
        },
        {
            field: 'start',
            headerName: 'Appointment Date',
            width: 150,
            sortable: false,
            renderCell: (params: any) => {
                return (
                    <Chip variant='filled' size='small' label={moment().format('LL')} color='info' />
                )
            }
        },
        {
            headerName: 'ACTIONS',
            width: 450,
            renderCell: (params: any) => {
                return (
                    <>
                        <div style={{display: 'flex'}}>
                            <NormalButton 
                            size='small'
                            variant="outlined"
                            children='View more'
                            onClick={() => handleViewMore(
                                params.row.id,
                                params.row.service_id,
                                params.row.fullName,
                                params.row.branch_id,
                                params.row.petInfo,
                                params.row.isSessionStarted,
                                params.row.managersId
                            )}
                            />
                        </div>
                    </>
                )
            }
        }
    ]
    const handleSelectionRange = (item: any) => {
        setState([item.selection])
        setValue('start', new Date(item.selection?.startDate))
        setValue('end', new Date(item.selection?.endDate))
    }
    const handleSelectionFilterRange = (item: any) => {
        setFilterDate([item.selection])
        const newObj = {
            ...savedForSearch,
            dateFilterStart: item.selection?.startDate,
            dateFilterEnd: item.selection?.endDate,
            customerName: savedForSearch?.customerName
        }
        setSavedForSearch(newObj)
    }
    const handleChangeSearchTextField = (event: any) => {
        const values = event.currentTarget.value
        const newObj = {
            ...savedForSearch,
            customerName: values
        }
        setSavedForSearch(newObj)
    }
    const handleSearchTrigger = () => {
        setSearchPreLoad(!searchPreLoad)
        const obj = {
            start: savedForSearch?.dateFilterStart,
            end: savedForSearch?.dateFilterEnd,
            customerName: savedForSearch?.customerName
        }
        searchEngineFollowUpAppointment.execute(obj)
            .then((response) => {
                setTimeout(() => {
                    setSearchPreLoad(false)
                    obj.customerName = null
                    obj.start = null
                    obj.end = null
                setFollowUpFeed(response.data)
                }, 3000)
            })
    }
    const handleSessions = (actions: string | undefined, id: number) => {
        const obj = {
            actions: actions,
            id: id,
            managerUid: references.id
        }
        setLoading(!loading)
        switch(actions) {
            case "start":
                appointmentSessionActions.execute(obj).then((response) => {
                    const { data } = response;
                    if(data == 201) {
                        handleOnToast(
                            "Successfully started the session.",
                            "top-right",
                            false,
                            true,
                            true,
                            true,
                            undefined,
                            "dark",
                            "success"
                        );
                        setLoading(false)
                        setViewMoreModal(false)
                        FuncGetAppointmentPerBranch()
                    }
                })
                break;
            case "end":
                appointmentSessionActions.execute(obj).then((response) => {
                    const { data } = response;
                    if(data == 202) {
                        handleOnToast(
                            "Successfully end the session.",
                            "top-right",
                            false,
                            true,
                            true,
                            true,
                            undefined,
                            "dark",
                            "success"
                        );
                        setLoading(false)
                        setViewMoreModal(false)
                        FuncGetAppointmentPerBranch()
                    }
                })
                break;
        }
    }
    const handleDone = () => {
        setLoading(!loading)
        makeAppointmentDone.execute(savedReferences?.id)
        .then((response) => {
            const { data } = response
            if(data == 200){
                handleOnToast(
                    "This appointment is mark as done.",
                    "top-right",
                    false,
                    true,
                    true,
                    true,
                    undefined,
                    "dark",
                    "success"
                );
                setLoading(false)
                setViewMoreModal(false)
                FuncGetAppointmentPerBranch()
            }
        })
    }
    const handleClose = () => {
        setViewMoreModal(false)
        setFollowUp(false)
    }
    return (
        <>
            {
                loading ?
                <ControlledBackdrop open={loading} />
                :
                <Container maxWidth='xl'>
                    <ControlledTabs
                    value={tabsValue}
                    handleChange={(event: React.SyntheticEvent, newValue: number) => setTabsValue(newValue)}
                    style={{
                        marginTop: '10px',
                        padding: '10px'
                    }}
                    tabsinject={
                        [
                            {
                                label: 'Appointment / Follow-Up / Sessions'
                            },
                            {
                                label: "Follow-up Appointments"
                            }
                        ]
                    }
                    >
                        {
                            tabsValue == 0 ? 
                            <>
                            <UncontrolledCard style={{ marginTop: '10px' }}>
                    <Typography variant='button'>Appointments</Typography>
                    <ProjectTable columns={columns} data={feed} sx={{ mt: 2 }} />
                </UncontrolledCard>
                <ControlledModal
                maxWidth='xl'
                disabled
                open={viewMoreModal}
                handleClose={handleClose}
                handleDecline={handleClose}
                title="View more | Appointment"
                buttonTextDecline="CANCEL"
                hideAgreeButton
                >
                   {preload ? <ControlledBackdrop open={preload} /> :
                   <>
                    <Typography variant='button'>View more appointment : </Typography>
                    {
                        savedReferences?.session == 0 ?
                        <Chip variant="filled" color='primary' size='small' label='OPEN' />
                        : savedReferences?.session == 1 ?
                        <Chip variant="filled" color='error' size='small' label='ONGOING' /> :
                        savedReferences?.session == 2 && 
                        <Chip variant="filled" color='warning' size='small' label='PENDING' />
                    } <br />
                    <Typography sx={{mt:3}} variant='button'>Session acknowledged by veterinarian : </Typography>
                    {
                        !savedReferences?.vetName ? 
                        <Chip variant="filled" color='info' size='small' label="None" />
                        : <Chip variant="filled" color='info' size='small' label={savedReferences?.vetName} />
                    }
                    {
                        savedReferences?.session == 0 ?
                        <NormalButton 
                            sx={{float: 'right', mt: 3, mb: 3}}
                            variant='outlined'
                            color='primary'
                            size='small'
                            children='START SESSION'
                            startIcon={<PlayCircleFilledIcon />}
                            onClick={() => handleSessions("start", savedReferences.id)}
                        />
                        : savedReferences?.session == 1 ?
                        <NormalButton 
                            sx={{float: 'right', mt: 3, mb: 3}}
                            variant='outlined'
                            color='error'
                            size='small'
                            children='END SESSION'
                            startIcon={<StopIcon />}
                            onClick={() => handleSessions("end", savedReferences.id)}
                        />
                        : savedReferences?.session == 2 &&
                        <div style={{ display: 'inline' }}>
                            {
                                !followup &&
                                <NormalButton 
                            sx={{float: 'right', mt: 3, mb: 3}}
                            variant='outlined'
                            color='success'
                            size='small'
                            onClick={handleDone}
                            children='DONE'
                            startIcon={<CheckCircleIcon />}
                        />
                            }
                            <NormalButton 
                            sx={{float: 'right', mt: 3, mb: 3, mr: 2}}
                            variant='outlined'
                            color={
                                followup ? 'error' : 'primary'
                            }
                            size='small'
                            onClick={() => setFollowUp(!followup)}
                            children={
                                followup ? 'CANCEL FOLLOW-UP APPOINTMENT' : 'CREATE FOLLOW-UP APPOINTMENT'
                            }
                            startIcon={<FollowTheSignsIcon />}
                        />
                        </div>
                    }
                    <ControlledGrid>
                        <Grid item xs={6}>
                            <UncontrolledCard>
                                <Typography variant='button'>Services</Typography>
                                {
                                   savedReferences.service?.length > 0 && savedReferences.service.map((item: any, index: any) => (
                                    <Typography key={index} variant='body1' sx={{mb: 2}}>
                                        <span style={{marginRight:'8px'}}>&bull;</span>
                                        {item.serviceName}
                                    </Typography>
                                   ))
                                }
                            </UncontrolledCard>
                        </Grid>
                        <Grid item xs={6}>
                            <UncontrolledCard>
                                <Typography variant='button'>Pet Information</Typography>
                                {
                                   savedReferences.petInfo?.length > 0 && savedReferences.petInfo.map((item: any, index: any) => (
                                    <>
                                    <ControlledGrid>
                                        <Grid item xs={6}>
                                        <Typography key={index} variant='body1' sx={{mb: 2}}>
                                        <span style={{marginRight:'8px'}}>&bull;</span>
                                        Type: {item.petType}
                                    </Typography>
                                    
                                        </Grid>
                                        <Grid item xs={6}>
                                        <Typography key={index} variant='body1' sx={{mb: 2}}>
                                        <span style={{marginRight:'8px'}}>&bull;</span>
                                        Name : {item.petName}
                                    </Typography>
                                        </Grid>
                                    </ControlledGrid>
                                    <Typography variant="button">Other concerns</Typography>
                                    <Typography key={index} variant='body1' sx={{mb: 2}}>
                                        <span style={{marginRight:'8px'}}>&bull;</span>
                                        {
                                            item.otherConcerns == "" || item.otherConcerns == null ? 'Nothing' : item.otherConcerns
                                        }
                                    </Typography>
                                    </>
                                   ))
                                }
                            </UncontrolledCard>
                        </Grid>
                    </ControlledGrid>
                    {followup && <div style={{marginTop: '8px'}}>
                        <Typography variant='button'>Recommendations and proceed for follow up appointment</Typography>
                    <hr />
                    <UncontrolledCard style={{ marginTop: '10px'}}>
                        <Typography variant='caption'>Basic information</Typography>
                        <ControlledGrid>
                            <Grid item xs={4}>
                                <ControlledTextField 
                                    control={control}
                                    name='title'
                                    required
                                    shouldUnregister
                                    label='Appointment Title'
                                />
                            </Grid>
                            <Grid item xs={4}>
                            <ControlledTextField 
                                    control={control}
                                    name='branchName'
                                    required
                                    shouldUnregister
                                    label='Branch name'
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={4}>
                            <ControlledTextField 
                                    control={control}
                                    name='customerName'
                                    required
                                    shouldUnregister
                                    label='Customer name'
                                    disabled
                                />
                            </Grid>
                        </ControlledGrid>
                    </UncontrolledCard>
                    <UncontrolledCard style={{marginTop: '20px'}}>
                    <Typography variant='caption'>Follow-up appointment information</Typography>
                    <ControlledGrid>
                        <Grid item xs={6}>
                            <ControlledMultipleSelectField 
                            control={control}
                            name='service'
                            options={services}
                            label='Follow-up services'
                            shouldUnregister
                            required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant='caption'>Follow-up description</Typography>
                            <ControlledRichTextField 
                                handleChange={(e) => setValue('description', e)}
                            />
                        </Grid>
                    </ControlledGrid>
                    <ControlledGrid>
                        <Grid item xs={6}>
                            <UncontrolledCard>
                                <Typography sx={{mb: 3}} variant='caption'>Follow-up schedule</Typography> <br/>
                                <hr />
                                <div style={{marginTop:'8px'}}>
                                <DateRangePicker
                                
                                onChange={(item: any) => handleSelectionRange(item)} 
                                ranges={state}
                                direction="horizontal"
                                moveRangeOnFirstSelection={false}
                                months={1}
                            />
                                </div>
                            </UncontrolledCard>
                        </Grid>
                        <Grid item xs={6}>
                            <UncontrolledCard>
                                <Typography variant='caption'>Notification Type</Typography>
                                <UncontrolledCard>
                                       <RadioGroupForm 
                                        control={control}
                                        name='value'
                                        label='Select notification type'
                                        options={[
                                            {
                                                value: 'sms', label: 'SMS Notification'
                                            },
                                            {
                                                value:'email', label: 'Email Notification'
                                            }
                                        ]}
                                        shouldUnregister
                                        />
                                       </UncontrolledCard>
                            </UncontrolledCard>
                            <UncontrolledCard style={{ marginTop: '10px'}}>
                                <Typography variant='caption'>To be filled by veterinarian</Typography>
                                <ControlledGrid>
                                    <Grid item xs={6}>
                                        <Typography variant='caption'>Chief complain / History and diagnosis</Typography>
                                    <ControlledRichTextField 
                                            handleChange={(e) => setValue('diagnosis', e)}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                    <Typography variant='caption'>Resolution/treatment and remarks</Typography>
                                    <ControlledRichTextField 
                                handleChange={(e) => setValue('treatment', e)}
                            />
                                    </Grid>
                                </ControlledGrid>
                            </UncontrolledCard>
                        </Grid>
                    </ControlledGrid>
                    <NormalButton 
                        size='small'
                        variant='outlined'
                        children='SAVE'
                        sx={{
                            float: 'right',
                            mt: 2,
                            mb: 2
                        }}
                        onClick={handleSave}
                    />
                    </UncontrolledCard>
                    </div>}
                   </>}
                </ControlledModal>
                            </>
                            : tabsValue == 1 && 
                            <>
                                <UncontrolledCard style={{marginTop: '10px'}}>
                                    <div style={{display: 'inline'}}>
                                    <Typography variant='button' sx={{mr: 1}}>Follow-up Appointments |</Typography> &nbsp; 
                                    <Typography variant='caption'>Filter</Typography>
                                    <IconButton aria-label="calendar" onClick={handleCalendarPopOver}>
                                        <CalendarMonthIcon />
                                    </IconButton>
                                    <Popover
                                    id={id}
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handleCalendarClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left'
                                    }}
                                    >
                                        <UncontrolledCard>
                                            <Typography variant='caption'>Select date</Typography> <br />
                                            <div style={{ width: '100%'}}>
                                            <DateRangePicker
                                                onChange={(item: any) => handleSelectionFilterRange(item)} 
                                                ranges={filterDate}
                                                direction="horizontal"
                                                moveRangeOnFirstSelection={false}
                                                months={1}
                                            />
                                            </div>
                                            <NormalButton 
                                            sx={{float: 'right', mt: 2, mb: 2}}
                                            variant="outlined"
                                            size="small"
                                            children="CONFIRM"
                                            onClick={handleCalendarClose}
                                            />
                                        </UncontrolledCard>
                                    </Popover>
                                    <TextField 
                                    placeholder="Search customer name (e.g) John Doe"
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        width: '350px'
                                    }}
                                    value={savedForSearch?.customerName}
                                    onChange={(e: any) => handleChangeSearchTextField(e)}
                                    /> &nbsp;
                                    <NormalButton 
                                    variant="outlined"
                                    size="small"
                                    children="SEARCH"
                                    onClick={handleSearchTrigger}
                                    />
                                    &nbsp;
                                    <NormalButton 
                                    variant="outlined"
                                    size="small"
                                    children="FETCH ALL"
                                    onClick={FuncGetFollowUpAppointmentPerBranch}
                                    />
                                    </div>
                                    <ProjectTable columns={followupColumns} loading={searchPreLoad} data={followupFeed} sx={{ mt: 2 }} />
                                </UncontrolledCard>
                                <ControlledModal
                                
                                ></ControlledModal>
                            </>
                        }
                    </ControlledTabs>
                </Container>
            }
        </>
    )
}


export default Appointments