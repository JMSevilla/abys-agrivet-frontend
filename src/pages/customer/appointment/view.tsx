import { ControlledBackdrop, ControlledGrid, NormalButton, UncontrolledCard } from "@/components"
import ControlledModal from "@/components/Modal/Modal"
import { FollowUpCollapsibleTable } from "@/components/Table/FollowUpCollapsibleTable"
import { ProjectTable } from "@/components/Table/ProjectTable"
import { useAuthenticationContext } from "@/utils/context/AuthContext/AuthContext"
import { useApiCallBack } from "@/utils/hooks/useApi"
import { useReferences } from "@/utils/hooks/useToken"
import { Chip, Container, Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"


const View: React.FC = () => {
    const [loading, setLoading] = useState(true)
    const [preload, setPreload] = useState(false)
    const { checkAuthentication } = useAuthenticationContext()
    const [references, setReferences] = useReferences()
    const [feed, setFeed] = useState([])
    const [followupFeed, setFollowUpFeed] = useState([])
    const [viewMoreModal, setViewMoreModal] = useState(false)
    const [pg, setpg] = useState(0)
    const [rpg, setrpg] = useState(5)
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
    const findAppointmentsByEmail = useApiCallBack(
        async (api, email: string) => 
        await api.abys.FindAppointmentsByEmail(email)
    )
    const findByUserByManagerId = useApiCallBack(
        async (api, manager_id: number) => await api.abys.FindUserByManagerId(manager_id)
    )
    const findFollowUpsByAPId = useApiCallBack(
        async(api, id: number) => await api.abys.FindFollowUpsByAPId(id)
    )
    function FuncFindAllAppointmentsByEmail() {
        findAppointmentsByEmail.execute(
            references?.email
        ).then((res) => {
            setFeed(res.data)
        })
    }
    const handleViewAllFollowUpsByApId = () => {
        findFollowUpsByAPId.execute(savedReferences?.id)
        .then((response) => {
            setFollowUpFeed(response?.data)
        })
    }
    useEffect(() => {
        setTimeout(() => {
            checkAuthentication().then((res) => {
                if(res == 'authenticated'){
                    setLoading(false)
                }
            })
        }, 3000)
    }, [])
    useEffect(() => {
        FuncFindAllAppointmentsByEmail()
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
                            />
                        </div>
                    </>
                )
            }
        }
    ]
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
    const handleChangePage = (event: any, newpage: any) => {
        setpg(newpage)
    }
    const handleChangeRowsPerPage = (event: any) => {
        setrpg(parseInt(event.target.value, 10))
        setpg(0)
    }
    const handleViewMore = (
        id: number, services: any, fullName: string, branch_id: number, petInfo: any, session: number,
        managersId: number
    ) => {
        setPreload(!preload)
        findByUserByManagerId.execute(managersId)
        .then((res) => {
            console.log(res.data)
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
                managersData: res.data
            }
            setSavedReferences(newSavedReferences)
            setViewMoreModal(!viewMoreModal)
        })
    }
    return (
        <>
        {
            loading ?
            <ControlledBackdrop open={loading} />
            :
            <Container>
                <UncontrolledCard style={{
                    marginTop: '10px'
                }}>
                    <Typography variant='button'>
                        Appointments
                    </Typography>
                    <ProjectTable 
                    pageSize={5}
                    columns={columns}
                    data={feed}
                    sx={{ mt: 2 }}
                    />
                </UncontrolledCard>
                <ControlledModal
                open={viewMoreModal}
                title="View more details"
                hideAgreeButton
                buttonTextDecline="CLOSE"
                maxWidth="lg"
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
        }
        </>
    )
}

export default View