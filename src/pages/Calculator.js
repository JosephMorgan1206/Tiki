// material
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Skeleton,
  Slider,
  FormGroup,
  FormControlLabel,
  Switch,
  Alert
} from '@mui/material';
import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import NumberFormat from 'react-number-format';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useTheme } from '@mui/material/styles';
// utils
import calculateEarnings from '../utils/calculateEarnings';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import HeaderBanner from '../components/HeaderBanner';
import CustomBox from '../components/CustomBox';

// ----------------------------------------------------------------------

export default function Calculator({
  holdings,
  tikiVolume,
  tikiPrice,
  bnbPrice,
  tikiEarningSupplyTotal,
  getTikiPrice
}) {
  const { themeStretch, themeMode } = useSettings();
  const [customHoldings, setCustomHoldings] = useState(null);
  const [customVolume, setCustomVolume] = useState(null);
  const [customPrice, setCustomPrice] = useState(null);
  const [dailyRewards, setDailyRewards] = useState(0);
  const [weeklyRewards, setWeeklyRewards] = useState(0);
  const [monthlyRewards, setMonthlyRewards] = useState(0);
  const [yearlyRewards, setYearlyRewards] = useState(0);
  const [earningsData, setEarningsData] = useState([]);
  const [days, setDays] = useState(30);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [roi, setRoi] = useState(0);
  const [reinvesting, setReinvesting] = useState(false);
  const theme = useTheme();

  const CHART_DATA = [
    { name: 'BNB', data: [1, 2, 4, 5, 6, 7] },
    { name: 'HHH', data: [5, 4, 3, 2, 1, 0] }
  ];

  const chartOptions = {
    colors: [theme.palette.primary.main, theme.palette.success.light],
    chart: {
      toolbar: false,
      sparkline: {
        enabled: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '68%',
        borderRadius: 2
      }
    },
    yaxis: [
      {
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: true,
          color: theme.palette.primary.main
        },
        labels: {
          style: {
            colors: theme.palette.primary.main
          }
        },
        title: {
          text: 'Total Rewards (BNB)',
          style: {
            color: theme.palette.primary.main
          }
        }
      },
      {
        opposite: true,
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: true,
          color: theme.palette.success.light
        },
        labels: {
          style: {
            colors: theme.palette.success.light
          }
        },
        title: {
          text: 'Daily Rewards (BNB)',
          style: {
            color: theme.palette.success.light
          }
        }
      }
    ],
    dataLabels: {
      enabled: false
    },
    tooltip: {
      theme: 'dark'
    }
  };

  const daysInputHandler = (e) => {
    const tempDays = parseInt(e.target.value, 10);
    const tempTotalEarnings = dailyRewards * tempDays;
    const tempRoi = (customHoldings * tikiPrice) / (dailyRewards * bnbPrice);
    setDays(tempDays);
    setTotalEarnings(tempTotalEarnings);
    setRoi(tempRoi);
  };

  useEffect(() => {
    const tempTotalRewards = {};
    const tempTotalTokens = {};
    if (tikiEarningSupplyTotal !== null && bnbPrice !== null) {
      // Base Calculations
      setDailyRewards(calculateEarnings(customHoldings, customVolume, 1, tikiEarningSupplyTotal, bnbPrice));
      setWeeklyRewards(calculateEarnings(customHoldings, customVolume, 7, tikiEarningSupplyTotal, bnbPrice));
      setMonthlyRewards(calculateEarnings(customHoldings, customVolume, 30, tikiEarningSupplyTotal, bnbPrice));
      setYearlyRewards(calculateEarnings(customHoldings, customVolume, 365, tikiEarningSupplyTotal, bnbPrice));
      // Variable Calculations
      const tempTotalEarnings = dailyRewards * days;
      const tempRoi = (customHoldings * tikiPrice) / (dailyRewards * bnbPrice);
      setTotalEarnings(tempTotalEarnings);
      setRoi(tempRoi);

      // Earnings Chart Data (SETS: Total Rewards, Daily Rewards)
      const tempRewardData = [];
      const tempDailyData = [];
      tempTotalRewards.totalRewards = dailyRewards;
      tempTotalTokens.totalTokens = customHoldings;

      for (let i = 0; i < days; i += 1) {
        if (!reinvesting) {
          tempDailyData.push(dailyRewards.toFixed(6));
          tempRewardData.push(tempTotalRewards.totalRewards.toFixed(4));
          tempTotalRewards.totalRewards += dailyRewards;
        } else {
          const newTokens = parseFloat((dailyRewards * bnbPrice) / (tikiPrice * 0.15));
          tempTotalTokens.totalTokens += parseFloat(newTokens);
          // calculate new daily reward at interval (i) and push
          const newDailyReward = calculateEarnings(
            tempTotalTokens.totalTokens,
            customVolume,
            1,
            tikiEarningSupplyTotal,
            bnbPrice
          );

          tempDailyData.push(parseFloat(newDailyReward).toFixed(6));

          // add new daily reward total reward sum
          tempTotalRewards.totalRewards += parseFloat(newDailyReward);
          tempRewardData.push(tempTotalRewards.totalRewards.toFixed(4));
        }
      }

      setEarningsData([
        { name: 'Total Rewards (BNB)', data: tempRewardData },
        { name: 'Daily Rewards (BNB)', data: tempDailyData }
      ]);
    }
  }, [customHoldings, customPrice, customVolume, days, reinvesting, holdings, tikiVolume, bnbPrice]);

  useEffect(() => {
    if (customHoldings === null && holdings !== null) {
      setCustomHoldings(holdings);
    } else if (holdings === null && customHoldings === null) {
      setCustomHoldings(10000);
    }

    if (customPrice === null && tikiPrice !== null) {
      setCustomPrice(tikiPrice);
    }
    if (customVolume === null && tikiVolume !== null) {
      setCustomVolume(tikiVolume);
    }

    if (tikiPrice === null || tikiPrice === 0) {
      // getTikiPrice().then(setCustomPrice);
    }
  }, [holdings, tikiPrice, tikiVolume]);

  return (
    <Page title="Calculator | TIKI Dash">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBanner text="Earnings Calculator" />
        <Alert sx={{ marginTop: '16px' }} severity="info">
          <Typography>
            Calculate your current and potential earnings below while holding $TIKI Token! You can edit the fields below
            to see your future earnings with different holdings, trading volume, and token value.
          </Typography>
        </Alert>
        <Grid container mt={0} rowSpacing={2} columnSpacing={3}>
          <Grid item xs={12} lg={4}>
            <CustomBox>
              <Typography>TIKI Holdings</Typography>
              <Box display="flex" mt={1} alignItems="center" gap={2}>
                <img
                  style={{ height: '20px' }}
                  src={themeMode === 'dark' ? '/static/icons/tiki-icon-white.svg' : '/static/brand/logo-dark.svg'}
                  alt=""
                />
                <NumberFormat
                  style={{
                    width: '100%',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: 'white',
                    fontFamily: 'Public Sans,sans-serif',
                    paddingBottom: '4px',
                    borderBottom: '1px solid white'
                  }}
                  thousandSeparator
                  defaultValue={holdings !== null ? holdings : 10000}
                  suffix=" TIKI"
                  onValueChange={(values) => {
                    setCustomHoldings(values.floatValue);
                  }}
                />
              </Box>
            </CustomBox>
          </Grid>
          <Grid item xs={12} lg={4}>
            <CustomBox>
              <Typography>Trading Volume</Typography>
              <Box display="flex" mt={1} alignItems="center" gap={2}>
                <EqualizerIcon />
                <NumberFormat
                  style={{
                    width: '100%',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: 'white',
                    fontFamily: 'Public Sans,sans-serif',
                    paddingBottom: '4px',
                    borderBottom: '1px solid white'
                  }}
                  thousandSeparator
                  defaultValue={0}
                  value={customVolume != null ? customVolume.toFixed(2) : 0}
                  prefix="$"
                  suffix=" USD"
                  onValueChange={(values) => {
                    setCustomVolume(values.floatValue);
                  }}
                />
              </Box>
            </CustomBox>
          </Grid>
          <Grid item xs={12} lg={4}>
            <CustomBox>
              <Typography>Token Price</Typography>
              <Box display="flex" mt={1} alignItems="center" gap={2}>
                <EqualizerIcon />
                <NumberFormat
                  style={{
                    width: '100%',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: 'white',
                    fontFamily: 'Public Sans,sans-serif',
                    paddingBottom: '4px',
                    borderBottom: '1px solid white'
                  }}
                  thousandSeparator
                  defaultValue={0.0}
                  value={customPrice != null ? customPrice.toFixed(4) : 0.0}
                  prefix="$"
                  suffix=" USD"
                  onValueChange={(values) => {
                    setCustomPrice(values.floatValue);
                  }}
                />
              </Box>
            </CustomBox>
          </Grid>
        </Grid>
        <TableContainer sx={{ marginTop: '24px', display: { xs: 'none', sm: 'block' } }} component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Reward</TableCell>
                <TableCell align="right">Daily</TableCell>
                <TableCell align="right">Weekly</TableCell>
                <TableCell align="right">Monthly</TableCell>
                <TableCell align="right">Yearly</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>BNB</TableCell>
                <TableCell align="right">{dailyRewards.toFixed(4)}</TableCell>
                <TableCell align="right">{weeklyRewards.toFixed(4)}</TableCell>
                <TableCell align="right">{monthlyRewards.toFixed(4)}</TableCell>
                <TableCell align="right">{yearlyRewards.toFixed(4)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>BNB/USD</TableCell>
                <TableCell align="right">${(dailyRewards * bnbPrice).toFixed(2)}</TableCell>
                <TableCell align="right">${(weeklyRewards * bnbPrice).toFixed(2)}</TableCell>
                <TableCell align="right">${(monthlyRewards * bnbPrice).toFixed(2)}</TableCell>
                <TableCell align="right">${(yearlyRewards * bnbPrice).toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Grid sx={{ display: { xs: 'block', sm: 'none' } }} container mt={3} spacing={3}>
          <Grid item xs={12}>
            <CustomBox>
              <Typography>Daily Rewards</Typography>
              <Box display="flex" mt={1} alignItems="center" gap={2}>
                <EqualizerIcon />
                <Typography component="p" fontWeight="bold" fontSize={20}>
                  {dailyRewards !== null ? (
                    `${dailyRewards.toFixed(4)} BNB ($${(dailyRewards * bnbPrice).toFixed(2)})`
                  ) : (
                    <Skeleton sx={{ width: '85px', height: '30px' }} animation="wave" />
                  )}
                </Typography>
              </Box>
            </CustomBox>
          </Grid>
          <Grid item xs={12}>
            <CustomBox>
              <Typography>Weekly Rewards</Typography>
              <Box display="flex" mt={1} alignItems="center" gap={2}>
                <EqualizerIcon />
                <Typography component="p" fontWeight="bold" fontSize={20}>
                  {weeklyRewards !== null ? (
                    `${weeklyRewards.toFixed(4)} BNB ($${(weeklyRewards * bnbPrice).toFixed(2)} USD)`
                  ) : (
                    <Skeleton sx={{ width: '85px', height: '30px' }} animation="wave" />
                  )}
                </Typography>
              </Box>
            </CustomBox>
          </Grid>
          <Grid item xs={12}>
            <CustomBox>
              <Typography>Monthly Rewards</Typography>
              <Box display="flex" mt={1} alignItems="center" gap={2}>
                <EqualizerIcon />
                <Typography component="p" fontWeight="bold" fontSize={20}>
                  {monthlyRewards !== null ? (
                    `${monthlyRewards.toFixed(4)} BNB ($${(monthlyRewards * bnbPrice).toFixed(2)} USD)`
                  ) : (
                    <Skeleton sx={{ width: '85px', height: '30px' }} animation="wave" />
                  )}
                </Typography>
              </Box>
            </CustomBox>
          </Grid>
          <Grid item xs={12}>
            <CustomBox>
              <Typography>Yearly Rewards</Typography>
              <Box display="flex" mt={1} alignItems="center" gap={2}>
                <EqualizerIcon />
                <Typography component="p" fontWeight="bold" fontSize={20}>
                  {yearlyRewards !== null ? (
                    `${yearlyRewards.toFixed(4)} BNB ($${(yearlyRewards * bnbPrice).toFixed(2)} USD)`
                  ) : (
                    <Skeleton sx={{ width: '85px', height: '30px' }} animation="wave" />
                  )}
                </Typography>
              </Box>
            </CustomBox>
          </Grid>
        </Grid>
        <Box padding={2}>
          <Box display="flex" alignItems="center" justifyContent="center" flexDirection="row">
            <Typography sx={{ paddingRight: '24px' }}>Days:</Typography>
            <Slider
              aria-label="Time"
              defaultValue={30}
              valueLabelDisplay="auto"
              size="large"
              step={30}
              marks
              min={30}
              max={365}
              onChange={daysInputHandler}
            />
            <FormGroup sx={{ paddingLeft: '16px' }}>
              <FormControlLabel
                control={
                  <Switch
                    onChange={() => {
                      setReinvesting(!reinvesting);
                    }}
                  />
                }
                label="Reinvesting"
              />
            </FormGroup>
          </Box>
        </Box>
        <Box width="100%">
          <ReactApexChart
            type="area"
            sx={{ padding: '5px' }}
            series={earningsData}
            options={chartOptions}
            width="100%"
            height={450}
          />
        </Box>
      </Container>
    </Page>
  );
}
