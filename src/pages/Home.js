// material
import { Container, Typography, Grid, Box, Link, Skeleton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DiamondIcon from '@mui/icons-material/Diamond';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import ReactApexChart from 'react-apexcharts';
import Alert from '@mui/material/Alert';
import { Link as RouterLink } from 'react-router-dom';
import ScrollAnimation from 'react-animate-on-scroll';
import NumberFormat from 'react-number-format';
import HeaderBanner from '../components/HeaderBanner';
import CustomBox from '../components/CustomBox';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';

// ----------------------------------------------------------------------

export default function Home({ wallet, address, tikiPrice, bnbPrice, tikiHolders, totalPaid }) {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const PRIMARY_TEXT = theme.palette.grey[800];
  const PRIMARY_ACCENT = theme.palette.grey[800];
  const CHART_DATA = [{ data: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26] }];
  const CHART_DATA_2 = [{ data: [41, 20, 63, 33, 28, 35, 50, 46, 11, 26] }];
  const CHART_DATA_3 = [{ data: [11, 20, 41, 63, 33, 28, 35, 50, 46, 26] }];

  const chartOptions = {
    colors: [theme.palette.primary.main],
    chart: { sparkline: { enabled: true } },
    plotOptions: { bar: { columnWidth: '50%', borderRadius: 1 } },
    labels: ['1', '2', '3', '4', '5', '6', '7', '8'],
    tooltip: {
      enabled: false
    }
  };

  return (
    <Page title="TIKI Dash | Earnings Manager">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBanner text="Welcome to TIKI Dash!" />
        <Box mt={3}>
          <Alert variant="outlined" severity={wallet === null ? 'info' : 'success'}>
            {wallet !== null
              ? `Connected: ${address}`
              : 'Please connnect your wallet to access all features of the TIKI Dash.'}
          </Alert>
        </Box>
        <Grid container mt={2} columnSpacing={3} rowSpacing={2}>
          <Grid item xs={12} lg={4}>
            <CustomBox>
              <Typography>Token Price</Typography>
              <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                <Box display="flex" gap={2} alignItems="center">
                  <LocalOfferIcon />
                  <Typography component="p" fontWeight="bold" fontSize={20}>
                    {tikiPrice === null ? (
                      <Skeleton sx={{ width: '85px', height: '30px' }} animation="wave" />
                    ) : (
                      `$${tikiPrice.toFixed(5)}`
                    )}
                  </Typography>
                </Box>
                <ReactApexChart
                  type="area"
                  sx={{ padding: '5px' }}
                  series={CHART_DATA}
                  options={chartOptions}
                  width={65}
                  height={36}
                />
              </Box>
            </CustomBox>
          </Grid>
          <Grid item xs={12} lg={4}>
            <CustomBox>
              <Typography>Rewards Distributed</Typography>
              <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <DiamondIcon />
                  <Typography component="p" fontWeight="bold" fontSize={20}>
                    {totalPaid === null ? (
                      <Skeleton sx={{ width: '85px', height: '30px' }} animation="wave" />
                    ) : (
                      <NumberFormat value={totalPaid} displayType="text" thousandSeparator suffix=" BNB" />
                    )}
                  </Typography>
                </Box>
                <ReactApexChart
                  type="area"
                  sx={{ padding: '5px' }}
                  series={CHART_DATA_2}
                  options={chartOptions}
                  width={65}
                  height={36}
                />
              </Box>
            </CustomBox>
          </Grid>
          <Grid item xs={12} lg={4}>
            <CustomBox>
              <Typography>Dividend Holders</Typography>
              <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <VolunteerActivismIcon />
                  <Typography component="p" fontWeight="bold" fontSize={20}>
                    {tikiHolders === null ? (
                      <Skeleton sx={{ width: '85px', height: '30px' }} animation="wave" />
                    ) : (
                      <NumberFormat value={tikiHolders} displayType="text" thousandSeparator />
                    )}
                  </Typography>
                </Box>
                <ReactApexChart
                  type="area"
                  sx={{ padding: '5px' }}
                  series={CHART_DATA_3}
                  options={chartOptions}
                  width={65}
                  height={36}
                />
              </Box>
            </CustomBox>
          </Grid>
        </Grid>
        <ScrollAnimation animateIn="animate__fadeIn" duration={2}>
          <Grid container mt={1} spacing={3}>
            <Grid item xs={12} sm={6} lg={3}>
              <Link to="/rewards" underline="none" variant="body2" component={RouterLink}>
                <Box sx={{ boxShadow: '0 4px 0px 0 rgb(253 169 45)' }} borderRadius={2}>
                  <img
                    style={{ overflow: 'hidden', borderRadius: '16px 16px 0 0', objectFit: 'cover', width: '100%' }}
                    src="static/home/earn-bnb-image.jpg"
                    alt="earn-bnb"
                  />
                  <Box padding={2} borderTop={4} borderColor="#fda92d">
                    <Typography sx={{ textAlign: 'center' }} variant="h6">
                      BNB Rewards
                    </Typography>
                  </Box>
                </Box>
              </Link>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <Link to="/staking" underline="none" variant="body2" component={RouterLink}>
                <Box sx={{ boxShadow: '0 4px 0px 0 rgb(253 169 45)' }} borderRadius={2}>
                  <img
                    style={{ overflow: 'hidden', borderRadius: '16px 16px 0 0', objectFit: 'cover', width: '100%' }}
                    src="static/home/staking-vault-image.jpg"
                    alt="earn-bnb"
                  />
                  <Box padding={2} borderTop={4} borderColor="#fda92d">
                    <Typography sx={{ textAlign: 'center' }} variant="h6">
                      Staking Vault
                    </Typography>
                  </Box>
                </Box>
              </Link>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <Link to="/calculator" underline="none" variant="body2" component={RouterLink}>
                <Box sx={{ boxShadow: '0 4px 0px 0 rgb(253 169 45)' }} borderRadius={2}>
                  <img
                    style={{ overflow: 'hidden', borderRadius: '16px 16px 0 0', objectFit: 'cover', width: '100%' }}
                    src="static/home/calc-image.jpg"
                    alt="earn-bnb"
                  />
                  <Box padding={2} borderTop={4} borderColor="#fda92d">
                    <Typography sx={{ textAlign: 'center' }} variant="h6">
                      Calculate Earnings
                    </Typography>
                  </Box>
                </Box>
              </Link>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <Link to="/statistics" underline="none" variant="body2" component={RouterLink}>
                <Box sx={{ boxShadow: '0 4px 0px 0 rgb(253 169 45)' }} borderRadius={2}>
                  <img
                    style={{ overflow: 'hidden', borderRadius: '16px 16px 0 0', objectFit: 'cover', width: '100%' }}
                    src="static/home/stats-image.jpg"
                    alt="earn-bnb"
                  />
                  <Box padding={2} borderTop={4} borderColor="#fda92d">
                    <Typography
                      id="test"
                      sx={{ textAlign: 'center', '& #test:hover': { transform: 'scale(1.5)' } }}
                      variant="h6"
                    >
                      Statistics
                    </Typography>
                  </Box>
                </Box>
              </Link>
            </Grid>
          </Grid>
        </ScrollAnimation>
      </Container>
    </Page>
  );
}
