import React, { useState } from "react";
import { UncontrolledCard } from "../Card/Card";
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import StopIcon from '@mui/icons-material/Stop';
import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  TablePagination,
  Grid,
} from "@mui/material";

import { NormalButton } from "@/components/Button/NormalButton";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import StarIcon from "@mui/icons-material/Star";
import { ControlledGrid } from "../Grid/Grid";
import moment from "moment";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
type PetInformationType = {
    petType : string
    petName: string
    otherConcerns: string
}
type ServiceBranch = {
    branchName: string,
    branch_id: number
}
type ServiceType = {
    id: number
    serviceName: string
    serviceBranch: ServiceBranch[]
    serviceStatus: number
    createdAt: Date
    updatedAt: Date
}
type CreateDataProps = {
  followupId: number;
  id: number;
  petInformation: string ;
  title: string | undefined;
  branch_id: number,
  customerName: string | undefined;
  followupServices: string;
  followupDescription: string | undefined;
  notificationType: string | undefined;
  diagnosis: string;
  treatment: string;
  status: number;
  start: Date,
  end: Date,
  isHoliday: number,
  isSessionStarted: number,
  managersId: number
};
const createData = (
  props: CreateDataProps 
) => {
  const {
    followupId,
    id,
    petInformation,
    title,
    branch_id,
    customerName,
    followupServices,
    followupDescription,
    notificationType,
    diagnosis,
    treatment,
    status,
    start,
    end,
    isHoliday,
    isSessionStarted,
    managersId
  } = props;
  return {
    followupId,
    id,
    petInformation,
    title,
    branch_id,
    customerName,
    followupServices,
    followupDescription,
    notificationType,
    diagnosis,
    treatment,
    status,
    start,
    end,
    isHoliday,
    isSessionStarted,
    managersId
  };
};
const Row = (props: {
  row: ReturnType<typeof createData>;
  handleChangeEdit: any;
  handleChangeDelete: any;
  handleFollowUpSessions: (actions: string, id: number, appointmentId: number) => void | undefined,
  hideActionsButtons: boolean | undefined
}) => {
  const { row, handleChangeEdit, handleChangeDelete, handleFollowUpSessions, hideActionsButtons = false } = props;
  const [open, setOpen] = useState(false);
  const parsedPetInformation: PetInformationType[] = JSON.parse(row.petInformation)
  const parsedServices: ServiceType[] = JSON.parse(row.followupServices)
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
  
  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.followupId}
        </TableCell>
        <TableCell>{row.id}</TableCell>
        <TableCell >{moment(row.start).format('LL')}</TableCell>
        
        <TableCell >
          {row.isSessionStarted == 0 || row.isSessionStarted == null ? (
            <>
              <Chip label="OPEN" size="small" color="info" variant="filled" />
            </>
          ) : row.isSessionStarted == 1 ? (
            <>
              <Chip label="ONGOING" size="small" variant="filled" color="warning" />
            </>
          ) : row.isSessionStarted == 2 ? (
            <>
              <Chip label="PENDING" size="small" color="error" variant="filled" />
            </>
          ): row.isSessionStarted == 3 && (
            <>
            <Chip label="DONE" size="small" color="success" variant="filled" />
          </>
        )}
        </TableCell>
        
        <TableCell >
          <div style={{ display: "flex", justifyContent: "right" }}>
            {/* <NormalButton onClick={() => handleChangeEdit(row)} children={<>EDIT</>} variant='outlined' size='small' />&nbsp; */}
            {/* <NormalButton onClick={() => handleChangeDelete(row.id)} children={<>DELETE</>} color='error' variant='outlined' size='small' /> */}
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit sx={{ width: '100%'}}>
            <Box sx={{ margin: 1 }}>
              <UncontrolledCard>
                <ControlledGrid>
                    <Grid item xs={row.isSessionStarted != 3 ? 4 : 6}></Grid>
                    <Grid item xs={row.isSessionStarted != 3 ? 4 : 6}></Grid>
                    {
                      !hideActionsButtons && (
                        <>
                        {
                        row.isSessionStarted != 3 && 
                        <Grid item xs={4}>
                        <UncontrolledCard>
                            <Typography variant='button'>Actions</Typography> 
                            <div style={{ display: 'inline', marginTop: '10px'}}>
                                {
                                    row.isSessionStarted == 0
                                    || row.isSessionStarted == null
                                    || row.isSessionStarted == 1 ?
                                    <>
                                    <NormalButton 
                                variant='outlined'
                                size='small'
                                color='primary'
                                children='START SESSION' fullWidth
                                disabled={
                                    row.isSessionStarted == 1 ? true : false
                                }
                                startIcon={<PlayCircleFilledIcon />}
                                onClick={() => handleFollowUpSessions("start", row.followupId, row.id)}
                                /> &nbsp;
                                <NormalButton 
                                variant='outlined'
                                size='small'
                                color='error'
                                disabled={
                                    row.isSessionStarted == null || row.isSessionStarted == 0 ? true : false
                                }
                                children='END SESSION' fullWidth
                                startIcon={<StopIcon />}
                                onClick={() => handleFollowUpSessions("end", row.followupId, row.id)}
                                />
                                    </>
                                     : row.isSessionStarted == 2 ?
                                     <>
                                     <NormalButton 
                                variant='outlined'
                                size='small'
                                color='success'
                                children='DONE SESSION' fullWidth
                                startIcon={<CheckCircleIcon />}
                                onClick={() => handleFollowUpSessions("done", row.followupId, row.id)}
                                />
                                     </>
                                     :
                                     <></>
                                }
                            </div>
                        </UncontrolledCard>
                    </Grid>
                    }
                        </>
                      )
                    }
                </ControlledGrid>
                <Typography variant='button'>More options & informations</Typography>
                <ControlledGrid>
                    <Grid item xs={6}>
                        <UncontrolledCard>
                            <Typography variant='overline'>Basic Information</Typography>
                            <hr />
                            <br />
                            <Typography variant='caption'>
                                Title:
                            </Typography>
                            <br />
                            <Typography variant='caption'>
                                <span style={{marginRight: '8px'}}>&bull;</span>
                                {row.title}
                            </Typography> <br />
                            <Typography variant='caption'>
                                Branch:
                            </Typography>
                            <br />
                            <Typography variant='caption'>
                                <span style={{marginRight: '8px'}}>&bull;</span>
                                {branchIdentifier(row.branch_id)}
                            </Typography>
                        </UncontrolledCard>
                    </Grid>
                    <Grid item xs={6}>
                    <UncontrolledCard>
                            <Typography variant='overline'>Other Informations</Typography>
                            <hr />
                            <br />
                            <Typography variant='caption'>
                                Notification Type:
                            </Typography> &nbsp;
                            {
                                row.notificationType == 'email' ?
                                <>
                                <Chip label='EMAIL' variant='filled' size='small' color='info' />
                                </>
                                :
                                <>
                                <Chip label='SMS' variant='filled' size='small' color='warning' />
                                </>
                            }
                            <br />
                            <Typography variant='caption'>
                                Appointment Date:
                            </Typography>
                            <br />
                            <Typography variant='caption'>
                                <span style={{marginRight: '8px'}}>&bull;</span>
                                {moment(row.start).format('LL')}
                            </Typography>
                        </UncontrolledCard>
                    </Grid>
                </ControlledGrid>
              </UncontrolledCard>
              <ControlledGrid>
                <Grid item xs={6}>
                <UncontrolledCard>
                <Typography variant='button'>
                    Pet Information
                </Typography>
                {
                    parsedPetInformation?.length > 0 && parsedPetInformation.map((item, index) => (
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
                            Name: {item.petName}
                        </Typography>
                            </Grid>
                        </ControlledGrid>
                        </>
                    ))
                }
              </UncontrolledCard>
                </Grid>
                <Grid item xs={6}>
                <UncontrolledCard>
                <Typography variant='button'>
                    Follow-up services
                </Typography> <br />
                <Typography variant='caption'>
                Services: 
                            </Typography> <br />
                {
                    parsedServices?.length > 0 && parsedServices.map((item, index) => (
                        <>
                        <Typography key={index} variant='caption' sx={{mb: 2}}>
                            <span style={{marginRight:'8px'}}>&bull;</span>
                            {item.serviceName}
                        </Typography>
                        </>
                    ))
                }
              </UncontrolledCard>
                </Grid>
              </ControlledGrid>
              <ControlledGrid>
                <Grid item xs={6}>
                <UncontrolledCard>
                <Typography variant='button'>
                    Diagnosis
                </Typography>
                <div dangerouslySetInnerHTML={{__html: JSON.parse(row.diagnosis)}}></div>
              </UncontrolledCard>
                </Grid>
                <Grid item xs={6}>
                <UncontrolledCard>
                <Typography variant='button'>
                    Treatment
                </Typography>
                <div dangerouslySetInnerHTML={{__html: JSON.parse(row.treatment)}}></div>
              </UncontrolledCard>
                </Grid>
              </ControlledGrid>
              {/* <Table size="small" aria-label="dev tickets">
                <TableHead>
                  <TableRow>
                    <TableCell>Branch ID</TableCell>
                    <TableCell>Branch availability</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  
                </TableBody>
              </Table> */}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

type CollapsibleTableProps = {
  data: any;
  pg?: any;
  rpg?: any;
  onPageChange?: any;
  onRowsPerPageChange?: any;
  handleChangeEdit?: any;
  handleChangeDeletion?: any;
  columns?: Array<{ field: string; align: boolean }>;
  handleFollowUpSessions: (actions: string, id: number, appointmentId: number) => void
  hideActionsButtons?: boolean | undefined
};

export const FollowUpCollapsibleTable: React.FC<CollapsibleTableProps> = (props) => {
  const {
    data,
    pg,
    rpg,
    onPageChange,
    onRowsPerPageChange,
    handleChangeEdit,
    handleChangeDeletion,
    columns,
    handleFollowUpSessions,
    hideActionsButtons
  } = props;
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>ID</TableCell>
            <TableCell>Connected Appointment ID</TableCell> 
            <TableCell >Appointment Date</TableCell>
            <TableCell >Session Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.slice(pg * rpg, pg * rpg + rpg).map((row: any) => (
            <Row
              key={row.id}
              row={row}
              handleChangeEdit={handleChangeEdit}
              handleChangeDelete={handleChangeDeletion}
              handleFollowUpSessions={handleFollowUpSessions}
              hideActionsButtons={hideActionsButtons}
            />
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data?.length}
        rowsPerPage={rpg}
        page={pg}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </TableContainer>
  );
};
