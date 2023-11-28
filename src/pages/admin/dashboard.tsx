import {
  ControlledGrid,
  UncontrolledCard,
  ControlledBackdrop,
} from "@/components";
import {
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAuthenticationContext } from "@/utils/context/AuthContext/AuthContext";
import { SchedulerCalendar } from "@/components/Calendar/Calendar";
import { useApiCallBack } from "@/utils/hooks/useApi";
import Highcharts, { Chart } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import exportingInit from "highcharts/modules/exporting";
import offlineExporting from "highcharts/modules/offline-exporting";
import { useUserContext } from "@/utils/context/UserContext/UserContext";
import { useQuery } from "react-query";
import moment from "moment";
if (typeof Highcharts === "object") {
  exportingInit(Highcharts);
  offlineExporting(Highcharts);
}
const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [preload, setPreLoad] = useState(false);
  const [strengthInNumbers, setStrengthInNumbers] = useState<any>({
    managers: 0,
    customers: 0,
    branches: 0,
    appointments: 0,
  });
  const { checkAuthentication } = useAuthenticationContext();
  const [options, setOptions] = useState<any>({
    chart: {
      type: "spline",
    },
    tooltip: {
      valueSuffix: " user counts",
      crosshairs: true,
      shared: true,
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
        },
      },
    },
    series: [{ data: [] }],
    subtitle: {
      text: "Line Graph",
    },
    title: {
      text: "Users Overall Count",
    },
  });
  const [feed, setFeed] = useState<
    Array<{
      id: number;
      title: string;
      start: Date;
      end: Date;
      isHoliday?: boolean | undefined;
    }>
  >([]);

  const [radioBranches, setRadioBranches] = useState([]);
  const findAllBranchesList = useApiCallBack((api) =>
    api.abys.findAllBranchesManagement()
  );
  const GetAllSchedulePerBranch = useApiCallBack(
    async (
      api,
      args: {
        branch: number;
        userid?: number;
      }
    ) => await api.abys.findAllSchedulePerBranch(args)
  );
  const countAdminReportCard = useApiCallBack(
    async (api, type: string) => await api.abys.CountAdminReportCard(type)
  );
  const FuncCountReports = async () => {
    const res = await Promise.all([
      countAdminReportCard.execute("managers"),
      countAdminReportCard.execute("customers"),
      countAdminReportCard.execute("branches"),
      countAdminReportCard.execute("appointments"),
    ]);
    const data = await Promise.all(res.map((r) => r.data));
    const newStrengthInNumbers = {
      ...strengthInNumbers,
      managers: data[0],
      customers: data[1],
      branches: data[2],
      appointments: data[3],
    };
    setStrengthInNumbers(newStrengthInNumbers);
  };
  useEffect(() => {
    setTimeout(() => {
      checkAuthentication().then((res) => {
        if (res == "authenticated") {
          setLoading(false);
        }
      });
    }, 3000);
  }, []);
  function FuncGetAllBranchesToBeMapOnRadio() {
    findAllBranchesList.execute().then((res) => {
      setRadioBranches(res.data);
    });
  }
  useEffect(() => {
    FuncGetAllBranchesToBeMapOnRadio();
    FuncCountReports();
  }, []);
  const handleSelectedBranches = (event: any) => {
    const branchId = event.target.value;
    setPreLoad(!preload);
    GetAllSchedulePerBranch.execute({
      branch: branchId,
      userid: 0,
    }).then((response) => {
      if (response?.data?.length > 0) {
        var chk = response?.data?.map((item: any) => {
          return {
            id: item?.id,
            title: item?.title,
            start: moment(item?.start).toDate(),
            end: moment(item?.end).toDate(),
            isHoliday: item?.isHoliday,
          };
        });
        setPreLoad(false);
        setFeed(chk);
      } else {
        setPreLoad(false);
        setFeed([]);
      }
    });
  };
  useEffect(() => {
    calculateReport();
  }, [feed]);
  function calculateReport() {
    if (feed?.length > 0) {
      var init_structuredOne = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (var x = 0; x < feed?.length; x++) {
        var ifExist = 0;
        if (options.series.length > 0) {
          for (var check = 0; check < options.series.length; check++) {
            if (feed[x]?.title == options.series[check]?.name) {
              ifExist = 1;
              check = options.series.length;
              options.series = [];
              for (
                var mockStructure = 0;
                mockStructure < feed?.length;
                mockStructure++
              ) {
                if (feed[mockStructure]?.title == feed[x]?.title) {
                  init_structuredOne[feed[mockStructure]?.id] =
                    feed[mockStructure].id;
                }
              }
              setOptions({ series: [{ data: init_structuredOne }] });
            }
            if (ifExist == 0) {
              for (
                var mockStructureCount = 0;
                mockStructureCount < feed?.length;
                mockStructureCount++
              ) {
                if (feed[mockStructureCount]?.title == feed[x]?.title) {
                  init_structuredOne[mockStructureCount] =
                    feed[mockStructureCount]?.id;
                }
              }
              setOptions({ series: [{ data: init_structuredOne }] });
            }
          }
        }
      }
    } else {
      setOptions({ series: [{ data: [] }] });
    }
  }
  return (
    <div>
      {loading ? (
        <ControlledBackdrop open={loading} />
      ) : (
        <Container maxWidth="xl">
          <ControlledGrid>
            <Grid item xs={3}>
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
                  Managers
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
                  {strengthInNumbers?.managers}
                </Typography>
              </UncontrolledCard>
            </Grid>
            <Grid item xs={3}>
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
                  Customers
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
                  {strengthInNumbers?.customers}
                </Typography>
              </UncontrolledCard>
            </Grid>
            <Grid item xs={3}>
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
                  Branches
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
                  {strengthInNumbers?.branches}
                </Typography>
              </UncontrolledCard>
            </Grid>
            <Grid item xs={3}>
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
                  {strengthInNumbers?.appointments}
                </Typography>
              </UncontrolledCard>
            </Grid>
          </ControlledGrid>
          <UncontrolledCard style={{ margin: "10px" }}>
            <UncontrolledCard>
              <Typography variant="overline">Branches Selection</Typography>{" "}
              <br />
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Select Branches
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  onChange={handleSelectedBranches}
                >
                  {radioBranches?.length > 0 &&
                    radioBranches?.map((item: any) => (
                      <FormControlLabel
                        value={item?.branch_id}
                        control={<Radio />}
                        label={item?.branchName}
                      />
                    ))}
                </RadioGroup>
              </FormControl>
            </UncontrolledCard>
            <ControlledGrid>
              <Grid item xs={6}>
                <UncontrolledCard>
                  <div style={{ marginTop: "20px" }}>
                    <SchedulerCalendar
                      appointments={feed}
                      handleSelectedEvent={() => console.log("")}
                      views={["month"]}
                      handleSelection={() => console.log("")}
                    />
                  </div>
                </UncontrolledCard>
              </Grid>
              <Grid item xs={6}>
                <UncontrolledCard>
                  <Typography variant="caption">
                    Scheduling count per branch chart
                  </Typography>
                  <HighchartsReact highcharts={Highcharts} options={options} />
                </UncontrolledCard>
              </Grid>
            </ControlledGrid>
            <ControlledBackdrop open={preload} />
          </UncontrolledCard>
        </Container>
      )}
    </div>
  );
};

export default Dashboard;
