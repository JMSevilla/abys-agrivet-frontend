import {
    ControlledBackdrop,
    ControlledGrid,
    NormalButton,
    UncontrolledCard
} from '@/components'
import ControlledModal from '@/components/Modal/Modal'
import { FollowUpCollapsibleTable } from '@/components/Table/FollowUpCollapsibleTable'
import { ProjectTable } from '@/components/Table/ProjectTable'
import { useAuthenticationContext } from '@/utils/context/AuthContext/AuthContext'
import { useToastContext } from '@/utils/context/Toast/ToastContext'
import { useApiCallBack } from '@/utils/hooks/useApi'
import { useReferences } from '@/utils/hooks/useToken'
import { Chip, Container, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

const RecordManagement: React.FC = () => {
    const [loading, setLoading] = useState(true)
    const [preload, setPreLoad] = useState(false)
    const { checkAuthentication } = useAuthenticationContext()
    const [feed, setFeed] = useState([])
    const [references, setReferences] = useReferences()
    const [viewMoreModal, setViewMoreModal] = useState(false)
    const [load, setLoad] = useState(false)
    const [searched, setSearched] = useState<string>("")
    const [followupFeed, setFollowUpFeed] = useState([])
    const [pg, setpg] = useState(0)
    const [rpg, setrpg] = useState(5)
    const [radioBranches, setRadioBranches] = useState([])
    const [savedReferences, setSavedReferences] = useState<any>({
        id: null,
        service: null,
        customerName: '',
        branchName: '',
        petInfo: null,
        branch_id: 0,
        session: 0,
        managersId: 0,
        managersData: {}
    })
    const findAllRecordPerBranch = useApiCallBack(
        async (api, branch_id: number) => await api.abys.FindAllRecordPerBranch(branch_id)
    )
    const findByUserByManagerId = useApiCallBack(
        async (api, manager_id: number) => await api.abys.FindUserByManagerId(manager_id)
    )
    const findFollowUpsByAPId = useApiCallBack(
        async(api, id: number) => await api.abys.FindFollowUpsByAPId(id)
    )
    const findAllBranchesList = useApiCallBack((api) =>
        api.abys.findAllBranchesManagement()
    );
    const filterRecordsByBranch = useApiCallBack(
        async (api, branch_id: number) => await api.abys.FilterRecordsByBranch(branch_id)
    )
    const pushToArchive = useApiCallBack(
        async (api, id: number) => await api.abys.PushToArchive(id)
    )
    const { handleOnToast } = useToastContext()
    function FuncGetAllBranchesToBeMapOnRadio() {
        findAllBranchesList.execute()
        .then((res) => {
          setRadioBranches(res.data)
        })
    }
    const globalSearch = (): Array<{id: number, customerName: string}> => {
        const filteredFollowUps = feed?.filter((value: any) => {
            return (
                value?.fullName?.toLowerCase().includes(searched?.toLowerCase())
                || value?.id
                ?.toString()
                .toLowerCase().includes(searched?.toLowerCase())
            )
        })
        return filteredFollowUps
    }
    const filteredDistributedFollowUps: Array<{id: number, customerName: string}> | [] = 
    searched ? globalSearch() : feed

    useEffect(() => {
        setTimeout(() => {
            checkAuthentication().then((res) => {
                if(res === 'authenticated') {
                    setLoading(false)
                }
            })
        }, 3000)
    }, [])
    const handleViewAllFollowUpsByApId = () => {
        setLoad(!load)
        findFollowUpsByAPId.execute(savedReferences?.id)
        .then((response) => {
            setFollowUpFeed(response?.data)
        })
    }
    function FuncFindAllRecordsPerBranch() {
        findAllRecordPerBranch.execute(references?.branch)
        .then((response) => {
            setFeed(response?.data)
        })
    }
    useEffect(() => {
        FuncFindAllRecordsPerBranch()
        FuncGetAllBranchesToBeMapOnRadio()
    }, [])
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
                            />&nbsp;
                            <NormalButton 
                            variant='outlined'
                            size='small'
                            children='Delete'
                            color='error'
                            onClick={() => handleDelete(params.row.id)}
                            />
                        </div>
                    </>
                )
            }
        }
    ]
    const handleDelete = (id: number) => {
        setPreLoad(!preload)
        pushToArchive.execute(id)
        .then(res => {
            if(res.data == 200) {
                handleOnToast(
                    "Successfully moved to archive.",
                    "top-right",
                    false,
                    true,
                    true,
                    true,
                    undefined,
                    "dark",
                    "success"
                );
                FuncFindAllRecordsPerBranch()
                setPreLoad(false)
            }
        })
    }
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
            findByUserByManagerId.execute(managersId)
            .then((response) => {
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
                    managersData: response.data
                }
                setSavedReferences(newSavedReferences)
                setViewMoreModal(!viewMoreModal)
            })
    }
    const handleChangePage = (event: any, newpage: any) => {
        setpg(newpage)
    }
    const handleChangeRowsPerPage = (event: any) => {
        setrpg(parseInt(event.target.value, 10))
        setpg(0)
    }
    const handleChange = (event: any) => {
        const value = event.currentTarget.value
        setSearched(value)
    }
    const handleSelectedBranches = (event: any) => {
        const branchId = event.target.value;
        setPreLoad(!preload)
        if(branchId == 6) {
            setPreLoad(false)
            FuncFindAllRecordsPerBranch()
        } else {
            filterRecordsByBranch.execute(branchId)
            .then((response) => {
                setPreLoad(false)
                setFeed(response.data)
            })
        }
    }
    return (
        <>
            {loading ? (
                <ControlledBackdrop open={loading} />
            ) : (
                <Container maxWidth="xl">
                    <UncontrolledCard>
                    <Typography variant='overline'>Record Management</Typography>
                    <UncontrolledCard style={{ marginTop: '10px' }}>
                        <ControlledGrid>
                            <Grid item xs={6}>
                                <UncontrolledCard>
                                <FormControl>
                                    <FormLabel id="demo-row-radio-buttons-group-label">Select Branches</FormLabel>
                                    <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    onChange={handleSelectedBranches}
                                    >
                                    {
                                        radioBranches?.length > 0 && radioBranches?.map((item: any) => (
                                        <FormControlLabel 
                                        value={item?.branch_id}
                                        control={<Radio />}
                                        label={item?.branchName}
                                        />
                                        ))
                                    }
                                    </RadioGroup>
                                </FormControl>
                                </UncontrolledCard>
                            </Grid>
                            <Grid item xs={6}>
                                    <UncontrolledCard>
                                    <TextField
                    placeholder='Search'
                    variant='filled'
                    onChange={handleChange}
                    fullWidth
                    ></TextField>
                                    </UncontrolledCard>
                            </Grid>
                        </ControlledGrid>
                    </UncontrolledCard>
                    <ProjectTable pageSize={5} columns={columns} data={filteredDistributedFollowUps ?? feed} sx={{ mt: 3 }} />
                    </UncontrolledCard>
                    <ControlledModal
                    open={viewMoreModal}
                    title='View more details'
                    hideAgreeButton
                    buttonTextDecline='CLOSE'
                    maxWidth='lg'
                    handleClose={() => {setViewMoreModal(false), setFollowUpFeed([])}}
                    handleDecline={() => {setViewMoreModal(false), setFollowUpFeed([])}}
                    >
                        <Typography variant='overline'>
                            This appointment handled by : {savedReferences?.managersData?.firstname}
                        </Typography>
                        <ControlledGrid>
                            <Grid item xs={6}>
                                <UncontrolledCard>
                                    <Typography variant='button'>Services</Typography>
                                    {
                                        savedReferences?.service?.length > 0 && savedReferences.service.map((item: any, index: any) => (
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
                        <UncontrolledCard
                         style={{ marginTop: '10px' }}
                        >
                            <Typography variant='caption'>
                                All follow-ups appointments
                            </Typography>
                            <NormalButton 
                            sx={{
                                float: 'right',
                                mt: 2,
                                mb: 2
                            }}
                            variant='text'
                            size='small'
                            children='View all follow-ups'
                            onClick={handleViewAllFollowUpsByApId}
                            />
                            <FollowUpCollapsibleTable 
                            data={followupFeed}
                            columns={columns}
                            pg={pg}
                            rpg={rpg}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            handleFollowUpSessions={() => {}}
                            />
                        </UncontrolledCard>
                    </ControlledModal>
                </Container>
            )}
        </>
    )
}

export default RecordManagement