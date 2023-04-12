// material
import { Container, Typography, Alert, Box, Grid, Skeleton, Button } from '@mui/material';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DiamondIcon from '@mui/icons-material/Diamond';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import CustomBox from '../components/CustomBox';
// imports
import tikiData from '../ABIs/tikiTokenData';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import HeaderBanner from '../components/HeaderBanner';

// ----------------------------------------------------------------------

export default function Recovery({ wallet }) {
  const { themeStretch } = useSettings();
  const [contract, setContract] = useState(null);
  const [withdrawable, setWithdrawable] = useState(null);
  const [withdrawn, setWithdrawn] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (wallet !== null) {
      const recoveryContract = new ethers.Contract(
        tikiData.recoveryContractAddress,
        tikiData.recoveryContractAbi,
        wallet
      );

      // gets recovery left
      // recoveryContract.totalDividendsToDistribute().then((transaction) => {
      //   console.log(transaction);
      // });

      wallet.getAddress().then((address) => {
        recoveryContract.balanceOf(address).then((balance) => {
          setContract(recoveryContract);
          setBalance(parseInt(balance._hex, 16) / 1e18);
        });
        recoveryContract.withdrawableDividendOf(address).then((withdrawable) => {
          setWithdrawable(parseInt(withdrawable._hex, 16) / 1e18);
        });
        recoveryContract.withdrawnDividendOf(address).then((withdrawn) => {
          setWithdrawn(parseInt(withdrawn._hex, 16) / 1e18);
        });
      });
    }
  }, [wallet]);

  return (
    <Page title="Recovery | TIKI Dash">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBanner text="MOAI V1 Recovery" />
        <Box mt={3}>
          {wallet === null ? (
            <Alert variant="outlined" severity="info">
              Please connnect your wallet to access to the MOAI Recovery Protocol.
            </Alert>
          ) : (
            <>
              <Grid columnSpacing={3} rowSpacing={2} container>
                <Grid item xs={12} lg={4}>
                  <CustomBox>
                    <Typography>Claimable Balance</Typography>
                    <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                      <Box display="flex" gap={2} alignItems="center">
                        <LocalOfferIcon />
                        <Typography component="p" fontWeight="bold" fontSize={20}>
                          {withdrawable === null ? (
                            <Skeleton sx={{ width: '85px', height: '30px' }} animation="wave" />
                          ) : (
                            `${withdrawable.toFixed(4)} BNB`
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </CustomBox>
                </Grid>
                <Grid item xs={12} lg={4}>
                  <CustomBox>
                    <Typography>Total Claimed</Typography>
                    <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                      <Box display="flex" gap={2} alignItems="center">
                        <LocalOfferIcon />
                        <Typography component="p" fontWeight="bold" fontSize={20}>
                          {withdrawn === null ? (
                            <Skeleton sx={{ width: '85px', height: '30px' }} animation="wave" />
                          ) : (
                            `${withdrawn.toFixed(4)} BNB`
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </CustomBox>
                </Grid>
                <Grid item xs={12} lg={4}>
                  <CustomBox>
                    <Typography>Total Reinbursement</Typography>
                    <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                      <Box display="flex" gap={2} alignItems="center">
                        <LocalOfferIcon />
                        <Typography component="p" fontWeight="bold" fontSize={20}>
                          {balance === null ? (
                            <Skeleton sx={{ width: '85px', height: '30px' }} animation="wave" />
                          ) : (
                            `${balance.toFixed(4)} BNB`
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </CustomBox>
                </Grid>
              </Grid>
              {wallet !== null && contract !== null && withdrawable > 0 ? (
                <Box mt={3}>
                  <Button
                    size="large"
                    variant="contained"
                    sx={{ width: '100%' }}
                    onClick={contract !== null ? () => contract.withdrawDividend() : null}
                  >
                    Claim now
                  </Button>
                </Box>
              ) : (
                <Box mt={3}>
                  <Button size="large" variant="contained" sx={{ width: '100%' }} disabled>
                    Nothing to claim
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
      </Container>
    </Page>
  );
}
