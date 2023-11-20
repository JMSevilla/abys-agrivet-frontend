
import { ControlledGrid, UncontrolledCard, ControlledBackdrop } from "@/components"
import { Container, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Typography } from '@mui/material'
import { useEffect, useState } from "react"
import { useAuthenticationContext } from "@/utils/context/AuthContext/AuthContext"
import { SchedulerCalendar } from "@/components/Calendar/Calendar"
import { useApiCallBack } from "@/utils/hooks/useApi"
import { useReferences } from "@/utils/hooks/useToken"
import moment from "moment"

const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState(true)
    const [preload, setPreload] = useState(false)
    const { checkAuthentication } = useAuthenticationContext()
    const [references, setReferences] = useReferences()
    const [radioBranches, setRadioBranches] = useState([])
    const [stored, setStored] = useState<any>({
      appointment: 0,
      inprogressAppointment: 0,
      doneAppointment: 0
    })
    const [feed, setFeed] = useState<Array<{
      id: number
      title: string
      start: Date
      end: Date
      isHoliday?: boolean | undefined
    }>>([])
    const countCustomerCard = useApiCallBack(
      async (api, args: { type: string, email: string }) =>
      await api.abys.CountCustomerReportCard(args)
    )
    const findAllBranchesList = useApiCallBack((api) =>
    api.abys.findAllBranchesManagement()
  );
    const GetAllSchedulePerBranch = useApiCallBack(
      async (api, args: {
        branch: number,
        userid?: number
      }) =>
      await api.abys.findAllSchedulePerBranch(args)
    )
    function FuncGetAllBranchesToBeMapOnRadio() {
      findAllBranchesList.execute()
      .then((res) => {
        setRadioBranches(res.data)
      })
    }
    const FuncCountCustomerAppointments = async () => {
      const res = await Promise.all([
        countCustomerCard.execute({ type: 'appointments', email: references?.email }),
        countCustomerCard.execute({ type: 'inprogress-appointments', email: references?.email }),
        countCustomerCard.execute({ type: 'done-appointments', email: references?.email })
      ])
      const data = await Promise.all(res.map(r => r.data))
      const newStored = {
        ...stored,
        appointment: data[0],
        inprogressAppointment: data[1],
        doneAppointment: data[2]
      }
      setStored(newStored)
    }
    useEffect(() => {
      FuncCountCustomerAppointments()
      FuncGetAllBranchesToBeMapOnRadio()
    }, [])
    useEffect(() => {
        setTimeout(() => {
            checkAuthentication().then((res) => {
              if (res == "authenticated") {
                setLoading(false);
              }
            });
          }, 3000);
    }, [])
    const handleSelectedBranches = (event: any) => {
      const branchId = event.target.value
      setPreload(!preload)
      GetAllSchedulePerBranch.execute({
        branch: branchId,
        userid: references?.id
      }).then((response) => {
        if(response?.data?.length > 0){
              var chk = response?.data?.map((item:any) => {
                  return {
                      id: item?.id,
                      title: item?.title,
                      start: moment(item?.start).toDate(),
                      end: moment(item?.end).toDate(),
                      isHoliday: item?.isHoliday
                  }
              })
              setPreload(false)
              setFeed(chk)
          } else {
              setPreload(false)
              setFeed([])
          }
      })
    }
    return (
        <>
           {loading ? (
            <ControlledBackdrop open={loading} />
           ) : (
            <Container>
                <ControlledGrid>
                    <Grid item xs={4}>
                    <UncontrolledCard
                style={{
                  background: "#153D77",
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  style={{
                    color: "white",
                  }}
                >
                  Appointments
                </Typography>
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{
                    float: "right",
                    marginBottom: "10px",
                    color: "white",
                  }}
                >
                  {stored?.appointment}
                </Typography>
              </UncontrolledCard>
                    </Grid>
                    <Grid item xs={4}>
                    <UncontrolledCard
                style={{
                  background: "#153D77",
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  style={{
                    color: "white",
                  }}
                >
                    Inprogress Appointments
                </Typography>
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{
                    float: "right",
                    marginBottom: "10px",
                    color: "white",
                  }}
                >
                  {stored?.inprogressAppointment}
                </Typography>
              </UncontrolledCard>
                    </Grid>
                    <Grid item xs={4}>
                    <UncontrolledCard
                style={{
                  background: "#153D77",
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  style={{
                    color: "white",
                  }}
                >
                    Done Appointments
                </Typography>
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{
                    float: "right",
                    marginBottom: "10px",
                    color: "white",
                  }}
                >
                  {stored?.doneAppointment}
                </Typography>
              </UncontrolledCard>
                    </Grid>
                </ControlledGrid>
                <UncontrolledCard style={{ margin: '10px'}}>
                  <UncontrolledCard style={{
                    marginTop:'10px',
                    marginBottom: '10px'
                  }}>
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
                  <SchedulerCalendar 
                  appointments={feed}
                  views={["month"]} 
                  handleSelectedEvent={() => console.log()}
                  handleSelection={() => console.log()}
                  />
                </UncontrolledCard>
                <ControlledBackdrop open={preload} />
            </Container>
           )}
        </>
    )
}

export default Dashboard