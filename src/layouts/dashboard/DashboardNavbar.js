import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
import { useState } from 'react';
import WalletConnectProvider from '@walletconnect/web3-provider';

// material
import { alpha, styled } from '@mui/material/styles';
import {
  Box,
  Stack,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  DialogTitle,
  Dialog,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import DiamondIcon from '@mui/icons-material/Diamond';
// ether
import { ethers } from 'ethers';
import tikiData from '../../ABIs/tikiTokenData';
import tokenData from '../../ABIs/tokenData';
import pcsData from '../../ABIs/pcsRouter';
// hooks
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
// components
import MHidden from '../../components/@material-extend/MHidden';
import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
import NotificationsPopover from './NotificationsPopover';
import useSettings from '../../hooks/useSettings';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const COLLAPSE_WIDTH = 102;

const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
};

export default function DashboardNavbar({
  onOpenSidebar,
  wallet,
  setWallet,
  requestWallet,
  setAddress,
  setTikiStakingContract,
  setTikiContract,
  setPcsRouterContract
}) {
  const { isCollapse } = useCollapseDrawer();
  const { onChangeMode, themeMode } = useSettings();
  const [open, setOpen] = useState(false);
  const [openConnect, setOpenConnect] = useState(false);
  const [wcErrorOpen, SetWcErrorOpen] = useState(false);
  const [connectOptionsOpen, setConnectOptionsOpen] = useState(false);

  const wcProvider = new WalletConnectProvider({
    rpc: {
      56: 'https://bsc-dataseed1.defibit.io/'
    },
    supportedChainIds: [56]
  });

  // Subscribe to accounts change
  wcProvider.on('accountsChanged', (accounts) => {
    setAddress(accounts[0]);
  });

  // Subscribe to chainId change
  wcProvider.on('chainChanged', (chainId) => {
    console.log(chainId);
    if (chainId !== 56) {
      SetWcErrorOpen(true);
      wcProvider.disconnect();
    }
  });

  // Subscribe to session connection
  wcProvider.on('connect', () => {
    const ethersTemp = new ethers.providers.Web3Provider(wcProvider);
    if (wcProvider.chainId === 56) {
      setWallet(ethersTemp.getSigner());
      // Update contracts with new provider
      setTikiStakingContract(
        new ethers.Contract(tikiData.stakingContractAddress, tikiData.stakingContractAbi, ethersTemp.getSigner())
      );
      setTikiContract(new ethers.Contract(tikiData.contractAddress, tikiData.abi, ethersTemp.getSigner()));
      setPcsRouterContract(new ethers.Contract(pcsData.address, pcsData.abi, ethersTemp.getSigner()));
    } else {
      SetWcErrorOpen(true);
      wcProvider.disconnect();
    }
  });

  // Subscribe to session disconnection
  wcProvider.on('disconnect', (code, reason) => {
    setWallet(null);
    setAddress(null);
  });

  async function getWallet() {
    const walletResult = await requestWallet();
    if (walletResult === null) return;

    const walletAddr = await walletResult.getAddress();
    return [walletResult, walletAddr];
  }

  const wcConnectHandler = async () => {
    console.log(wcProvider);
    try {
      await wcProvider.enable();
    } catch (e) {
      setWallet(null);
      setAddress(null);
      SetWcErrorOpen(true);
      wcProvider.disconnect();
    }
  };

  const handleConnection = () => {
    try {
      if (wallet === null) {
        getWallet().then((result) => {
          setWallet(result[0]);
          setAddress(result[1]);
          setOpen(true);
        });
      } else {
        setWallet(null);
        setAddress(null);
        setOpen(true);
        setConnectOptionsOpen(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleConnectionOpen = () => {
    setConnectOptionsOpen(!connectOptionsOpen);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    SetWcErrorOpen(false);
    setOpenConnect(false);
  };
  const action = (
    <>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );
  return (
    <RootStyle
      sx={{
        ...(isCollapse && {
          width: { lg: `calc(100% - ${COLLAPSE_WIDTH}px)` }
        })
      }}
    >
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        severity={wallet !== null ? 'success' : 'info'}
      >
        <Alert severity="success">{wallet !== null ? 'Wallet connected successfully.' : 'Wallet disconnected.'}</Alert>
      </Snackbar>

      <Snackbar
        open={wcErrorOpen}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        severity="warning"
      >
        <Alert severity="warning">Please select BSC network on WalletConnect!</Alert>
      </Snackbar>

      <Dialog onClose={handleClose} open={openConnect}>
        <DialogTitle>Set backup account</DialogTitle>
        <List sx={{ pt: 0 }}>
          <ListItem button>
            <ListItemText />
          </ListItem>

          <ListItem autoFocus button>
            <ListItemText primary="Add account" />
          </ListItem>
        </List>
      </Dialog>

      <ToolbarStyle>
        <MHidden width="lgUp">
          <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
            <Icon icon={menu2Fill} />
          </IconButton>
        </MHidden>

        <Box sx={{ flexGrow: 1 }} />
        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <Button
            href="https://pancakeswap.finance/swap?outputCurrency=0x9b76D1B12Ff738c113200EB043350022EBf12Ff0"
            target="_blank"
            variant="outlined"
            endIcon={<DiamondIcon />}
          >
            Buy $TIKI
          </Button>
          {connectOptionsOpen && wallet === null ? (
            <>
              <IconButton onClick={wcConnectHandler}>
                <img src="/static/icons/walletconnect-circle-blue.svg" alt="walet connect" width="30px" />
              </IconButton>
              <IconButton onClick={handleConnection}>
                <img src="/static/icons/TWT.svg" alt="twt" width="30px" />
              </IconButton>
              <IconButton onClick={handleConnection}>
                <img src="/static/icons/metamask-fox.svg" alt="metamask" width="30px" />
              </IconButton>
              <IconButton sx={{ backgroundColor: 'rgba(255, 0, 0, 0.2)' }} color="error" onClick={handleConnectionOpen}>
                <CloseIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Button
                onClick={wallet === null ? handleConnectionOpen : handleConnection}
                variant="contained"
                endIcon={<LinkIcon />}
              >
                {wallet !== null ? 'Disconnect' : 'Connect'}
              </Button>

              <IconButton onClick={onChangeMode} aria-label="access-mode">
                {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </>
          )}
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
