// imports
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import tikiData from './ABIs/tikiTokenData';
import tokenData from './ABIs/tokenData';
import pcsData from './ABIs/pcsRouter';
// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import RtlLayout from './components/RtlLayout';
import ScrollToTop from './components/ScrollToTop';
import { ProgressBarStyle } from './components/LoadingScreen';
import ThemePrimaryColor from './components/ThemePrimaryColor';
// ----------------------------------------------------------------------

// Providers
const mmProvider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed1.defibit.io/');

export default function App() {
  const [wallet, setWallet] = useState(null);
  const [address, setAddress] = useState(null);
  const [totalPaid, setTotalPaid] = useState(null);
  const [tikiPrice, setTikiPrice] = useState(null);
  const [tikiVolume, setTikiVolume] = useState(null);
  const [bnbPrice, setBnbPrice] = useState(null);
  const [bnbHoldings, setBnbHoldings] = useState(null);
  const [tikiEarningSupplyTotal, setTikiEarningSupplyTotal] = useState(null);
  const [highestBuyers, setHighestBuyers] = useState([]);
  const [holdings, setHoldings] = useState(null);
  const [paid, setPaid] = useState(null);
  const [lastPaid, setLastPaid] = useState(null);
  const [nextPayoutProgress, setNextPayoutProgress] = useState(null);
  const [nextPayoutValue, setNextPayoutValue] = useState(null);
  const [refreshTimeData, setRefreshTimeData] = useState(true);
  const [tikiHolders, setTikiHolders] = useState(null);
  const [dividendTransactions, setDividendTransactions] = useState(null);
  const [tikiStakingContract, setTikiStakingContract] = useState(
    new ethers.Contract(tikiData.stakingContractAddress, tikiData.stakingContractAbi, mmProvider)
  );
  const [tikiContract, setTikiContract] = useState(
    new ethers.Contract(tikiData.contractAddress, tikiData.abi, mmProvider)
  );
  const [pcsRouterContract, setPcsRouterContract] = useState(
    new ethers.Contract(pcsData.address, pcsData.abi, mmProvider)
  );
  const [currentProvider, setCurrentProvider] = useState('mm');

  const apiKey = '7ZZ4WKZZIB8B71XYFV8Z1I1WD7B44GZCUJ';

  const requestWallet = async () => {
    let metamask;
    try {
      metamask = new ethers.providers.Web3Provider(window.ethereum, 56);
    } catch (e) {
      console.log('wrong chain');
      return null;
    }
    await metamask.send('eth_requestAccounts', []);
    return metamask.getSigner();
  };

  const getAmountsOut = async (quoteAmount, path) =>
    pcsRouterContract.functions.getAmountsOut(quoteAmount, path, { gasLimit: 1000000000000 });

  const getTikiPrice = async () => {
    const functionResponse = await getAmountsOut(`${1 * tikiData.decimals ** 10}`, [
      tikiData.contractAddress,
      tokenData.bnb.address,
      tokenData.busd.address
    ]);
    const priceInUsd = Number(functionResponse.amounts[2].toString()) / tokenData.busd.decimals ** 10;
    return priceInUsd;
  };

  const getBnbPrice = async () => {
    const functionResponse = await getAmountsOut(`${1 * tokenData.bnb.decimals ** 10}`, [
      tokenData.bnb.address,
      tokenData.busd.address
    ]);
    const priceInUsd = Number(functionResponse.amounts[1].toString()) / tokenData.busd.decimals ** 10;
    return priceInUsd;
  };

  const getTikiVolume = async () => {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=tiki-token&vs_currencies=usd&include_market_cap=false&include_24hr_vol=true&include_24hr_change=false&include_last_updated_at=false'
    );
    const resolved = await res.json();
    const volume = resolved['tiki-token'].usd_24h_vol;
    // console.log(volume);
    return volume;
  };

  const getTikiDividenTrackerTokenSupply = async () => {
    const res = await fetch(
      `https://api.bscscan.com/api?module=stats&action=tokensupply&contractaddress=${tikiData.divContractAddress}&apikey=${apiKey}`
    );
    const resolved = await res.json();
    return (resolved.result / 1e18).toFixed(0);
  };

  const callContract = () => {
    tikiContract.getNumberOfDividendTokenHolders().then((holders) => {
      tikiContract.balanceOf(address).then((balance) => {
        setHoldings((balance / 1e18).toFixed(0));
        tikiContract.getAccountDividendsInfo(address).then((result) => {
          mmProvider.getBalance(address).then((balance) => {
            setBnbHoldings((balance / 1e18).toFixed(4));
            setPaid(parseInt(result[4]._hex, 16) - parseInt(result[3]._hex, 16));
            setLastPaid(parseInt(result[5]._hex, 16) * 1000);
            setNextPayoutProgress((100 - (parseInt(result[2]._hex, 16) / parseInt(holders._hex, 16)) * 100).toFixed(2));
            setNextPayoutValue((parseInt(result[3]._hex, 16) / 1e18).toFixed(4));
          });
        });
      });
    });
  };

  const getBnbDividendsFromAddress = async (address) => {
    const endpoint = 'https://api.bscscan.com/api?module=account&action=txlistinternal&address=';

    const res = await fetch(`${endpoint}${address}&sort=desc&apikey=${apiKey}`);
    const resolved = await res.json();

    const result = [];
    await resolved.result.forEach((transaction) => {
      if (transaction.from.toLowerCase() === tikiData.divContractAddress) {
        result.push(transaction);
      }
    });
    setDividendTransactions(result);
  };

  // const getTikiContract = () => {
  //   const contract = new ethers.Contract(tikiData.contractAddress, tikiData.abi, wallet);
  //   return contract;
  // };

  useEffect(() => {
    getTikiPrice().then(setTikiPrice);
    getBnbPrice().then(setBnbPrice);
    getTikiVolume().then(setTikiVolume);
    getTikiDividenTrackerTokenSupply().then((value) => {
      setTikiEarningSupplyTotal(parseFloat(value));
    });

    tikiContract.getNumberOfDividendTokenHolders().then((holders) => {
      setTikiHolders(parseInt(holders._hex, 16));
    });

    if (ethers.utils.isAddress(address)) {
      callContract(address);
      getBnbDividendsFromAddress(address);
    }

    tikiContract.getTotalDividendsDistributed().then((total) => {
      setTotalPaid((total / 1e18).toFixed(0));
      setTimeout(() => {
        setRefreshTimeData(!refreshTimeData);
      }, 5000);
    });
  }, [refreshTimeData]);

  // On Address State change - Pull in associated blockchain data for TIKI
  useEffect(() => {
    if (ethers.utils.isAddress(address)) {
      callContract(address);
      getBnbDividendsFromAddress(address);
    }
  }, [address]);

  useEffect(() => {
    if (currentProvider === 'mm') {
      setTikiStakingContract(
        new ethers.Contract(tikiData.stakingContractAddress, tikiData.stakingContractAbi, mmProvider)
      );
      setTikiContract(new ethers.Contract(tikiData.contractAddress, tikiData.abi, mmProvider));
      setPcsRouterContract(new ethers.Contract(pcsData.address, pcsData.abi, mmProvider));
    }
  }, [currentProvider]);

  return (
    <ThemeConfig>
      <ThemePrimaryColor>
        <RtlLayout>
          <GlobalStyles />
          <ProgressBarStyle />
          <ScrollToTop />
          <Router
            wallet={wallet}
            setWallet={setWallet}
            requestWallet={requestWallet}
            address={address}
            setAddress={setAddress}
            tikiPrice={tikiPrice}
            bnbPrice={bnbPrice}
            tikiVolume={tikiVolume}
            holdings={holdings}
            paid={paid}
            bnbHoldings={bnbHoldings}
            lastPaid={lastPaid}
            nextPayoutValue={nextPayoutValue}
            nextPayoutProgress={nextPayoutProgress}
            totalPaid={totalPaid}
            tikiEarningSupplyTotal={tikiEarningSupplyTotal}
            tikiHolders={tikiHolders}
            dividendTransactions={dividendTransactions}
            tikiContract={tikiContract}
            getTikiPrice={getTikiPrice}
            tikiStakingContract={tikiStakingContract}
            setTikiStakingContract={setTikiStakingContract}
            setTikiContract={setTikiContract}
            setPcsRouterContract={setPcsRouterContract}
          />
        </RtlLayout>
      </ThemePrimaryColor>
    </ThemeConfig>
  );
}
