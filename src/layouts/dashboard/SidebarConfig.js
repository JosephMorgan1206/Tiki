// mui
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const ICONS = {
  user: getIcon('ic_user'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  news: getIcon('ic_chat'),
  banking: getIcon('ic_banking'),
  calculator: getIcon('ic_calculator'),
  staking: getIcon('ic_staking'),
  art: getIcon('ic_art'),
  money: getIcon('ic_money'),
  game: getIcon('ic_game')
};

const sidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      { title: 'Home', path: PATH_DASHBOARD.general.home, icon: ICONS.dashboard },
      { title: 'Statistics', path: PATH_DASHBOARD.general.statistics, icon: ICONS.analytics },
      { title: 'Calculator', path: PATH_DASHBOARD.general.calculator, icon: ICONS.calculator },
      { title: 'News', path: PATH_DASHBOARD.general.news, icon: ICONS.news }
    ]
  },
  {
    subheader: 'Ecosystem',
    items: [
      { title: 'BNB Rewards', path: PATH_DASHBOARD.general.rewards, icon: ICONS.money },
      { title: 'Staking', path: PATH_DASHBOARD.general.staking, icon: ICONS.staking },
      { title: 'NFTIKI', path: PATH_DASHBOARD.general.nftiki, icon: ICONS.art },
      { title: 'P2E', path: PATH_DASHBOARD.general.p2e, icon: ICONS.game },
      { title: 'Referrals', path: PATH_DASHBOARD.general.referrals, icon: <LocalActivityIcon /> }
    ]
  },
  {
    subheader: 'Other',
    items: [{ title: 'Recovery', path: PATH_DASHBOARD.general.recovery, icon: ICONS.banking }]
  }
];

export default sidebarConfig;
