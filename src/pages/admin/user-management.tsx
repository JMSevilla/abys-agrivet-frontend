import { UAMFormAdditionalDetails } from "@/components/Forms/UserManagement";
import { useState, useEffect } from "react";
import { useAuthenticationContext } from "@/utils/context/AuthContext/AuthContext";
import { Chip, Container, Typography } from "@mui/material";
import { ControlledBackdrop, UncontrolledCard } from "@/components";
import { ProjectTable } from "@/components/Table/ProjectTable";
import { useUserContext } from "@/utils/context/UserContext/UserContext";

const UserManagement: React.FC = () => {
    const columns: any[] = [
        { field: "id", headerName: "ID", width: 70 },
        {
            field: "fullName",
            headerName: "Full name",
            description: "This column has a value getter and is not sortable",
            sortable: false,
            width: 160,
            valueGetter: (params: any) => 
            `${params.row.firstname || ""} ${params.row.middlename || ""} ${params.row.lastname || ""}`
        },
        {
            field: "email",
            headerName: "Email",
            sortable: false,
            width: 130
        },
        {
            field: 'branch',
            headerName: 'Branch',
            width: 130,
            renderCell: (params: any) => {
                if(params.row.branch == 6) {
                    return "All Branch"
                }
            }
        },
        {
            field: 'access_level',
            headerName: 'AccessLevel',
            width: 130,
            renderCell: (params: any) => {
                if(params.row.access_level == 1) {
                    return (
                        <>
                            <Chip 
                            variant="outlined"
                            size="small"
                            label="Administrator"
                            color="primary"
                            />
                        </>
                    )
                }
            }
        }
    ]
    const [loading, setLoading] = useState(true)
    const { checkAuthentication } = useAuthenticationContext()
    const { users, lookAllUsersFromUAM } = useUserContext()
    useEffect(() => {
        setTimeout(() => {
            checkAuthentication().then((res) => {
                if(res == 'authenticated'){
                    setLoading(false)
                }
            })
        }, 3000)
        lookAllUsersFromUAM()
    }, [])

    return (
        <>
            {
                loading ? 
                <ControlledBackdrop open={loading} />
                :
                <Container>
                    <UncontrolledCard>
                        <Typography variant='h6' gutterBottom>
                            User Management
                        </Typography>
                        <UAMFormAdditionalDetails />
                    </UncontrolledCard>
                    <UncontrolledCard style={{ marginTop: '10px'}}>
                    <Typography variant='caption' gutterBottom>
                            User Management List
                        </Typography>
                        <ProjectTable data={users} columns={columns} />
                    </UncontrolledCard>
                </Container>
            }
        </>
    )
}

export default UserManagement