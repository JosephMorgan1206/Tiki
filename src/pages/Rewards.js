// material
import { Container, Typography, Box, Alert, Grid, CircularProgress, Skeleton, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import ReactApexChart from 'react-apexcharts';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DiamondIcon from '@mui/icons-material/Diamond';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import HourglassTopOutlinedIcon from '@mui/icons-material/HourglassTopOutlined';
import { useTheme } from '@mui/material/styles';
import NumberFormat from 'react-number-format';
import HeaderBanner from '../components/HeaderBanner';
import TimeDifference from '../utils/timeDifference';
import CustomBox from '../components/CustomBox';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';

// ----------------------------------------------------------------------

export default function Rewards({
  wallet,
  address,
  tikiPrice,
  tikiVolume,
  holdings,
  lastPaid,
  paid,
  nextPayoutProgress,
  nextPayoutValue,
  bnbHoldings,
  totalPaid,
  tikiEarningSupplyTotal,
  bnbPrice,
  dividendTransactions,
  tikiContract
}) {
  const { themeStretch, themeMode } = useSettings();
  const [payoutData, setPayoutData] = useState(null);
  const [claimed, setClaimed] = useState(false);
  const theme = useTheme();
  const LIGHTER_GREY = theme.palette.grey[700];

  const chartOptions = {
    colors: [theme.palette.primary.main],
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
    dataLabels: {
      enabled: false
    },
    tooltip: {
      theme: 'dark'
    }
  };

  useEffect(() => {
    if (dividendTransactions !== null) {
      const temp = [];
      dividendTransactions.forEach((transaction, index) => {
        if (index < 20) {
          temp.push((transaction.value / 1e18).toFixed(6));
        }
      });
      setPayoutData([{ name: 'BNB', data: temp }]);
    }
  }, [dividendTransactions]);

  return (
    <Page title="Rewards | TIKI Dash">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBanner text="BNB Rewards" />
        {wallet === null ? (
          <Box mt={3}>
            <Alert variant="outlined" severity="info">
              Please connect your wallet to access the BNB Rewards tracker.
            </Alert>
          </Box>
        ) : (
          <>
            {holdings < 10000 && holdings !== null ? (
              <Box mt={3}>
                <Alert variant="outlined" severity="warning">
                  You will need 10,000 or more $TIKI to participate in the BNB redistribution protocol. Please purchase
                  more $TIKI from{' '}
                  <a
                    style={{ color: 'white' }}
                    href="https://pancakeswap.finance/swap?outputCurrency=0x9b76D1B12Ff738c113200EB043350022EBf12Ff0"
                  >
                    PancakeSwap
                  </a>
                  .
                </Alert>
              </Box>
            ) : (
              ''
            )}
            <>
              <Box mt={3}>
                <Button
                  onClick={() => {
                    const encodedABI = tikiContract.interface.encodeFunctionData('claim', []);
                    wallet.getTransactionCount().then((nonce) => {
                      const tx = {
                        chainId: 56,
                        nonce: ethers.utils.hexlify(nonce),
                        gasPrice: ethers.utils.hexlify(7 * 1000000000),
                        gasLimit: ethers.utils.hexlify(250000),
                        to: tikiContract.address,
                        value: ethers.utils.parseEther('0'),
                        data: encodedABI
                      };

                      wallet.sendTransaction(tx).then((confirmation) => {
                        setClaimed(true);
                      });
                    });
                  }}
                  sx={{ width: '100%' }}
                  size="large"
                  disabled={claimed === true || nextPayoutValue <= 0 || nextPayoutValue === null}
                  variant="contained"
                >
                  {nextPayoutValue === null
                    ? 'Loading'
                    : `Claim Rewards Manually (${parseFloat(nextPayoutValue).toFixed(4)} BNB)`}
                </Button>
              </Box>

              <Grid container mt={1} columnSpacing={3} rowSpacing={2}>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <CustomBox>
                    <Typography>Your TIKI Holdings</Typography>
                    <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <img
                          style={{ height: '20px' }}
                          src={
                            themeMode === 'dark' ? '/static/icons/tiki-icon-white.svg' : '/static/brand/logo-dark.svg'
                          }
                          alt=""
                        />
                        <Typography component="p" fontWeight="bold" fontSize={20}>
                          {holdings === null ? (
                            <Skeleton sx={{ width: '85px', height: '30px' }} animation="wave" />
                          ) : (
                            <NumberFormat value={holdings} displayType="text" thousandSeparator />
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </CustomBox>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <CustomBox>
                    <Typography>Total BNB Paid</Typography>
                    <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <DiamondIcon />
                        <Typography component="p" fontWeight="bold" fontSize={20}>
                          {paid === null ? (
                            <Skeleton sx={{ width: '85px', height: '30px' }} animation="wave" />
                          ) : (
                            <NumberFormat
                              value={(paid / 1e18).toFixed(4)}
                              displayType="text"
                              suffix=" BNB"
                              thousandSeparator
                            />
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </CustomBox>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <CustomBox>
                    <Typography>Last Payout Time</Typography>
                    <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <HistoryOutlinedIcon />
                        <Typography component="p" fontWeight="bold" fontSize={20}>
                          {(() => {
                            let result;
                            if (lastPaid === null) {
                              result = <Skeleton sx={{ width: '85px', height: '30px' }} animation="wave" />;
                            } else if (lastPaid === 0) {
                              result = 'Never';
                            } else {
                              result = TimeDifference(Date.now(), lastPaid);
                            }

                            return result;
                          })()}
                        </Typography>
                      </Box>
                    </Box>
                  </CustomBox>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <CustomBox>
                    <Typography>Next Pending Payout</Typography>
                    <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <HourglassTopOutlinedIcon />
                        <Typography component="p" fontWeight="bold" fontSize={20}>
                          {nextPayoutProgress === null ? (
                            <Skeleton sx={{ width: '85px', height: '30px' }} animation="wave" />
                          ) : (
                            [
                              holdings >= 10000
                                ? `${
                                    nextPayoutValue !== null && nextPayoutValue > 0
                                      ? `${parseFloat(nextPayoutValue).toFixed(4)} BNB`
                                      : 'Processing'
                                  } | ${nextPayoutProgress > 100 ? '100' : nextPayoutProgress}%`
                                : 'Not Applicable'
                            ]
                          )}
                        </Typography>
                      </Box>
                      {holdings >= 10000 ? (
                        <>
                          {' '}
                          <CircularProgress
                            sx={{
                              position: 'absolute',
                              right: '20px',
                              top: '50%',
                              transform: 'translateY(-50%) rotate(-90deg) !important',
                              color: LIGHTER_GREY,
                              width: '200px',
                              height: '200px'
                            }}
                            variant="determinate"
                            value={100}
                          />
                          <CircularProgress
                            sx={{
                              position: 'absolute',
                              right: '20px',
                              top: '50%',
                              transform: 'translateY(-50%) rotate(-90deg) !important',
                              zIndex: '10'
                            }}
                            variant="determinate"
                            value={nextPayoutProgress}
                          />
                        </>
                      ) : (
                        ''
                      )}
                    </Box>
                  </CustomBox>
                </Grid>
              </Grid>
            </>

            {payoutData !== null ? (
              <Box mt={3}>
                <Typography variant="h5">Last 20 BNB Rewards Paid</Typography>
                <ReactApexChart
                  type="bar"
                  sx={{ padding: '5px' }}
                  series={payoutData}
                  options={chartOptions}
                  width="100%"
                  height={350}
                />
              </Box>
            ) : (
              <Box mt={3} position="relative">
                <Typography variant="h5">Last 20 BNB Rewards Paid</Typography>
                <Skeleton sx={{ width: '100%', height: '480px', position: 'absolue', top: '-85px' }} />
              </Box>
            )}
          </>
        )}
      </Container>
    </Page>
  );
}
