// material
import {
  Container,
  Typography,
  Alert,
  AlertTitle,
  Button,
  Box,
  TextField,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Grid,
  Skeleton,
  Tab,
  Tabs,
  Chip,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Snackbar
} from '@mui/material';
import { TabPanel, TabList } from '@mui/lab';
import { useState, useEffect } from 'react';
import { ethers, BigNumber } from 'ethers';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import PieChartRoundedIcon from '@mui/icons-material/PieChartRounded';
import DiamondIcon from '@mui/icons-material/Diamond';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import RotateLeftRoundedIcon from '@mui/icons-material/RotateLeftRounded';
import HourglassTopOutlinedIcon from '@mui/icons-material/HourglassTopOutlined';
import NumberFormat from 'react-number-format';
import CustomBox from '../components/CustomBox';
import ConvertSecondsToDays from '../utils/convertSecondsToDays';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import HeaderBanner from '../components/HeaderBanner';
// settings
import { stakingContractAddress, stakingContractAbi, contractAddress } from '../ABIs/tikiTokenData';
import { erc20Abi } from '../ABIs/erc20';

// ----------------------------------------------------------------------

export default function Staking({ wallet, address, holdings }) {
  const { themeStretch } = useSettings();
  const [stakeTokens, setStakeTokens] = useState(0);
  const [stakeDays, setStakeDays] = useState(180);
  const [currentStakeTokens, setCurrentStakeTokens] = useState(null);
  const [currentStakeBNB, setCurrentStakeBNB] = useState(null);
  const [currentStakeDays, setCurrentStakeDays] = useState(null);
  const [currentTotalStaked, setCurrentTotalStaked] = useState(null);
  const [tikiStakingContract, setTikiStakingContract] = useState(null);
  const [erc20Contract, setErc20Contract] = useState(null);
  const [stakingApy, setStakingApy] = useState(null);
  const [enoughAllowance, setEnoughAllowance] = useState(null);
  const [mode, setMode] = useState('stake');
  const [refreshData, setRefreshData] = useState(false);
  const [requestWithdrawal, setRequestWithdrawal] = useState(false);
  const [requestDeposit, setRequestDeposit] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertText, setAlertText] = useState(null);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    if (wallet != null) {
      setTikiStakingContract(new ethers.Contract(stakingContractAddress, stakingContractAbi, wallet));
      setErc20Contract(new ethers.Contract(contractAddress, erc20Abi, wallet));
    } else {
      setTikiStakingContract(null);
    }
  }, [wallet]);

  useEffect(() => {
    if (tikiStakingContract != null) {
      // set state data from current user address
      tikiStakingContract.getUserInfoSelf().then((transaction) => {
        // Array Index 1: Staking Inprogress (Has tokens staked)
        // Array Index 2: ???
        // Array Index 3: ???
        // Array Index 4: ???
        // Array Index 5: Amount of tokens staked
        // Array Index 6: Ammount of BNB Rewards to widthdraw
        // console.log(transaction);
        // Check if user is staking
        const tokenAmount = BigInt(transaction[5]._hex.toString()).toString(10);
        const bnbAmount = BigInt(transaction[6]._hex.toString()).toString(10);
        // console.log(ethers.utils.formatEther(bnbAmount));
        setCurrentStakeTokens(parseFloat(ethers.utils.formatEther(tokenAmount)).toFixed(0));
        setCurrentStakeBNB(ethers.utils.formatEther(bnbAmount));
      });

      // get total locked value
      tikiStakingContract.balanceOf().then((transaction) => {
        const totalStakedTokens = BigInt(transaction._hex.toString()).toString(10);
        setCurrentTotalStaked(parseFloat(ethers.utils.formatEther(totalStakedTokens)).toFixed(0));
      });

      // get time left for stake
      tikiStakingContract.getTimeLeft().then((transaction) => {
        setCurrentStakeDays(ConvertSecondsToDays(transaction._hex.toString(10)));
      });

      setTimeout(() => {
        setRefreshData(!refreshData);
      }, 10000);
    }
  }, [tikiStakingContract, refreshData]);

  useEffect(() => {
    if (address !== null && stakeTokens > 0) {
      // get allowance
      erc20Contract.allowance(address, stakingContractAddress).then((transaction) => {
        const currentStakingAllowance = parseInt(transaction._hex, 16);
        // console.log(currentStakingAllowance);
        if (currentStakingAllowance >= ethers.utils.parseEther(stakeTokens)) {
          setEnoughAllowance(true);
        } else {
          setEnoughAllowance(false);
        }
      });
    }
  }, [address, stakeTokens, refreshData]);

  useEffect(() => {
    // get rewards for last 7 days
    if (tikiStakingContract != null && currentTotalStaked != null) {
      tikiStakingContract.getRewardsForLast7Days().then((transaction) => {
        const rewardsLast7Days = transaction.map((value) =>
          parseFloat(ethers.utils.formatEther(BigInt(value._hex.toString()).toString(10))).toFixed(2)
        );
        const avgDailyRewards = rewardsLast7Days.reduce((a, b) => parseFloat(a) + parseFloat(b)) / 7;
        const apr = (avgDailyRewards * 365) / currentTotalStaked;
        const apy = (1 + apr / 365) ** 356 - 1;
        setStakingApy(apy);
      });
    }
  }, [currentTotalStaked, holdings]);

  useEffect(() => {
    if (holdings != null) {
      setStakeTokens(parseFloat(holdings).toFixed(0));
    }
  }, [holdings]);

  useEffect(() => {
    if (mode === 'stake') {
      setStakeTokens(parseFloat(holdings).toFixed(0));
    } else {
      setStakeTokens(currentStakeTokens);
    }
  }, [mode]);

  useEffect(() => {
    if (requestWithdrawal) {
      setRequestWithdrawal(false);
      setAlertText('Successfully withdrawn tokens!');
      setOpen(true);
    }

    if (requestDeposit) {
      setRequestDeposit(false);
      setAlertText('Successfully desposited tokens!');
      setOpen(true);
    }
  }, [holdings, currentStakeTokens]);

  return (
    <Page title="Staking | TIKI Dash">
      <Snackbar
        open={open}
        onClose={handleClose}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        severity="success"
      >
        <Alert severity="success">{alertText}</Alert>
      </Snackbar>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBanner text="Staking Vault" />

        {wallet === null ? (
          <Box mt={3}>
            <Alert variant="outlined" severity="info">
              Please connect your wallet to access the TIKI Staking Vault.
            </Alert>
          </Box>
        ) : (
          ''
        )}

        {wallet != null && tikiStakingContract != null ? (
          <>
            <Alert sx={{ marginTop: '16px' }} severity="info">
              <AlertTitle>TIKI Vault Information</AlertTitle>
              <Typography>
                The TIKI Token staking vault is powered by the{' '}
                <a
                  style={{ color: 'white', marginLeft: '4px' }}
                  rel="noreferrer"
                  target="_blank"
                  href="https://app.bankerdoge.com/tiki-vault-2"
                >
                  <strong>BankerDoge Staking Platform</strong>
                </a>
                .
              </Typography>
            </Alert>
            <Grid container mt={1} columnSpacing={3} rowSpacing={2}>
              <Grid item xs={12} sm={4}>
                <CustomBox>
                  <Typography>Your Staked TIKI</Typography>
                  <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <DiamondIcon />
                      <Typography component="p" fontWeight="bold" fontSize={20}>
                        {currentStakeTokens !== null ? (
                          <NumberFormat
                            thousandSeparator
                            displayType="text"
                            suffix=" TIKI"
                            value={currentStakeTokens}
                          />
                        ) : (
                          <Skeleton sx={{ width: '85px', height: '30px' }} animation="wave" />
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </CustomBox>
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomBox>
                  <Typography>Total Locked Value</Typography>
                  <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <DiamondIcon />

                      <Typography component="p" fontWeight="bold" fontSize={20}>
                        {currentTotalStaked !== null ? (
                          <NumberFormat
                            thousandSeparator
                            displayType="text"
                            suffix=" TIKI"
                            value={currentTotalStaked}
                          />
                        ) : (
                          <Skeleton sx={{ width: '85px', height: '30px' }} animation="wave" />
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </CustomBox>
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomBox>
                  <Typography>Time Lock Remaining</Typography>
                  <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <HistoryOutlinedIcon />

                      <Typography component="p" fontWeight="bold" fontSize={20}>
                        {currentStakeDays !== null ? (
                          <NumberFormat
                            thousandSeparator
                            displayType="text"
                            suffix={currentStakeDays > 1 || currentStakeDays === 0 ? ' Days' : ' Day'}
                            value={currentStakeDays}
                          />
                        ) : (
                          <Skeleton sx={{ width: '85px', height: '30px' }} animation="wave" />
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </CustomBox>
              </Grid>
            </Grid>

            <Box mt={3}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={10}>
                  <TextField
                    id="outlined-basic"
                    type="number"
                    label="TIKI Token ($TIKI)"
                    sx={{ width: '100%' }}
                    variant="outlined"
                    onChange={(e) => {
                      setStakeTokens(e.target.value);
                    }}
                    value={stakeTokens}
                  />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <ToggleButtonGroup
                    sx={{ height: '100%', width: '100%' }}
                    value={mode}
                    onChange={(e) => {
                      setMode(e.target.value);
                    }}
                    color="primary"
                    exclusive
                  >
                    <ToggleButton sx={{ width: '50%' }} value="stake">
                      Stake
                    </ToggleButton>
                    <ToggleButton sx={{ width: '50%' }} value="unstake">
                      Unstake
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
              </Grid>

              <FormControl fullWidth sx={{ marginTop: '16px' }}>
                <InputLabel id="demo-simple-select-label">Staking Lock Period</InputLabel>
                <Select
                  defaultValue={180}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Staking Lock Period"
                  disabled={mode === 'unstake'}
                  value={stakeDays}
                  onChange={(e) => {
                    setStakeDays(e.target.value);
                  }}
                >
                  <MenuItem value={15}>15 Days</MenuItem>
                  <MenuItem value={30}>
                    30 Days + Locking Bonus: ~ 0.54% (
                    <NumberFormat
                      thousandSeparator
                      displayType="text"
                      suffix=" TIKI"
                      value={parseFloat(stakeTokens * (0.54 / 100)).toFixed(0)}
                    />
                    )
                  </MenuItem>
                  <MenuItem value={30}>
                    45 Days + Locking Bonus: ~ 0.81% (
                    <NumberFormat
                      thousandSeparator
                      displayType="text"
                      suffix=" TIKI"
                      value={parseFloat(stakeTokens * (0.81 / 100)).toFixed(0)}
                    />
                    )
                  </MenuItem>
                  <MenuItem value={90}>
                    90 Days + Locking Bonus: ~ 1.62% (
                    <NumberFormat
                      thousandSeparator
                      displayType="text"
                      suffix=" TIKI"
                      value={parseFloat(stakeTokens * (1.62 / 100)).toFixed(0)}
                    />
                    )
                  </MenuItem>
                  <MenuItem value={135}>
                    135 Days + Locking Bonus: ~ 2.43% (
                    <NumberFormat
                      thousandSeparator
                      displayType="text"
                      suffix=" TIKI"
                      value={parseFloat(stakeTokens * (2.43 / 100)).toFixed(0)}
                    />
                    )
                  </MenuItem>
                  <MenuItem value={180}>
                    180 Days + Locking Bonus: ~ 3.00% (
                    <NumberFormat
                      thousandSeparator
                      displayType="text"
                      suffix=" TIKI"
                      value={parseFloat(stakeTokens * (3.0 / 100)).toFixed(0)}
                    />
                    )
                  </MenuItem>
                </Select>
              </FormControl>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} mt={2}>
                {mode === 'stake' ? (
                  <>
                    <Chip icon={<AddCircleRoundedIcon />} label="Base Locking Fee: 5%" />
                    {stakeDays > 15 ? (
                      <Chip
                        icon={<AddCircleRoundedIcon />}
                        label={`Effective Locking Fee: ${parseFloat(5 - stakeDays * 0.018).toFixed(2)}%`}
                      />
                    ) : (
                      ''
                    )}
                    <Chip icon={<RotateLeftRoundedIcon />} label="Auto-compounding Rewards" />
                    <Chip
                      icon={<PieChartRoundedIcon />}
                      label={`Estimated APY: ${stakingApy != null ? parseFloat(stakingApy * 100).toFixed(2) : '0'}%`}
                      sx={{ marginLeft: 'auto' }}
                    />
                  </>
                ) : (
                  <Chip
                    icon={<AddCircleRoundedIcon />}
                    label={currentStakeDays > 0 ? 'Early Unstaking Fee: 10%' : 'Unstaking Fee: 5%'}
                  />
                )}
              </Stack>

              {enoughAllowance !== false && mode === 'stake' ? (
                <Button
                  size="large"
                  variant="contained"
                  sx={{ width: '100%', marginTop: '16px' }}
                  disabled={stakeTokens <= 0}
                  onClick={() => {
                    const encodedABI = tikiStakingContract.interface.encodeFunctionData('deposit', [
                      ethers.utils.parseEther(stakeTokens),
                      180
                    ]);

                    wallet.getTransactionCount().then((nonce) => {
                      const tx = {
                        chainId: 56,
                        nonce: ethers.utils.hexlify(nonce),
                        gasPrice: ethers.utils.hexlify(5 * 1500000000),
                        gasLimit: ethers.utils.hexlify(2000000),
                        to: stakingContractAddress,
                        value: 0,
                        data: encodedABI
                      };

                      wallet.sendTransaction(tx).then((confirmation) => {
                        setRequestDeposit(true);
                      });
                    });
                  }}
                >
                  {stakeTokens > 0 ? (
                    <NumberFormat
                      thousandSeparator
                      displayType="text"
                      prefix="Stake "
                      suffix=" TIKI"
                      value={stakeTokens}
                    />
                  ) : (
                    'Stake'
                  )}
                </Button>
              ) : mode !== 'unstake' ? (
                <Button
                  size="large"
                  variant="contained"
                  sx={{ width: '100%', marginTop: '16px' }}
                  disabled={stakeTokens <= 0}
                  onClick={() => {
                    const encodedABI = erc20Contract.interface.encodeFunctionData('approve', [
                      stakingContractAddress,
                      '115792089237316195423570985008687907853269984665640564039457584007913129639935'
                    ]);

                    wallet.getTransactionCount().then((nonce) => {
                      const tx = {
                        chainId: 56,
                        nonce: ethers.utils.hexlify(nonce),
                        to: contractAddress,
                        value: 0,
                        data: encodedABI
                      };

                      wallet.sendTransaction(tx).then((confirmation) => {
                        console.log(confirmation);
                      });
                    });
                  }}
                >
                  Enable vault
                </Button>
              ) : (
                <Button
                  size="large"
                  variant="contained"
                  sx={{ width: '100%', marginTop: '16px' }}
                  disabled={stakeTokens <= 0}
                  onClick={() => {
                    const encodedABI = tikiStakingContract.interface.encodeFunctionData('withdraw', [
                      ethers.utils.parseEther(stakeTokens),
                      0
                    ]);

                    wallet.getTransactionCount().then((nonce) => {
                      const tx = {
                        chainId: 56,
                        nonce: ethers.utils.hexlify(nonce),
                        gasPrice: ethers.utils.hexlify(5 * 1500000000),
                        gasLimit: ethers.utils.hexlify(2000000),
                        to: stakingContractAddress,
                        value: 0,
                        data: encodedABI
                      };

                      wallet.sendTransaction(tx).then((confirmation) => {
                        setRequestWithdrawal(true);
                      });
                    });
                  }}
                >
                  {stakeTokens > 0 ? (
                    <NumberFormat
                      thousandSeparator
                      displayType="text"
                      prefix="Unstake "
                      suffix=" TIKI"
                      value={stakeTokens}
                    />
                  ) : (
                    'Unstake'
                  )}
                </Button>
              )}

              <Button
                size="large"
                disabled={currentStakeBNB <= 0.001}
                variant="contained"
                sx={{ width: '100%', marginTop: '16px' }}
                onClick={() => {
                  const encodedABI = tikiStakingContract.interface.encodeFunctionData('withdraw', [
                    0,
                    ethers.utils.parseEther(currentStakeBNB)
                  ]);

                  wallet.getTransactionCount().then((nonce) => {
                    const tx = {
                      chainId: 56,
                      nonce: ethers.utils.hexlify(nonce),
                      gasLimit: ethers.utils.hexlify(3000000),
                      to: stakingContractAddress,
                      value: 0,
                      data: encodedABI
                    };

                    wallet.sendTransaction(tx).then((confirmation) => {
                      setRequestWithdrawal(true);
                    });
                  });
                }}
              >
                Claim {currentStakeBNB != null && currentStakeBNB > 0.001 ? parseFloat(currentStakeBNB).toFixed(5) : ''}{' '}
                BNB
              </Button>
            </Box>
          </>
        ) : (
          ''
        )}
      </Container>
    </Page>
  );
}
