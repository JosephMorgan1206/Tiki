// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = '';

// ----------------------------------------------------------------------

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    home: path(ROOTS_DASHBOARD, '/home'),
    statistics: path(ROOTS_DASHBOARD, '/statistics'),
    calculator: path(ROOTS_DASHBOARD, '/calculator'),
    news: path(ROOTS_DASHBOARD, '/news'),
    recovery: path(ROOTS_DASHBOARD, '/recovery'),
    staking: path(ROOTS_DASHBOARD, '/staking'),
    nftiki: path(ROOTS_DASHBOARD, '/nftiki'),
    rewards: path(ROOTS_DASHBOARD, '/rewards'),
    p2e: path(ROOTS_DASHBOARD, '/p2e'),
    referrals: path(ROOTS_DASHBOARD, '/referrals')
  }
};
