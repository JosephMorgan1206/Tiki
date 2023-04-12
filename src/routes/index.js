import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// components
import LoadingScreen from '../components/LoadingScreen';
// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/');

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router(props) {
  return useRoutes([
    // Dashboard Routes
    {
      path: '/',
      element: <DashboardLayout {...props} />,
      children: [
        { element: <Navigate to="/home" replace /> },
        {
          path: 'home',
          element: <Home {...props} />
        },
        { path: 'statistics', element: <Statistics {...props} /> },
        { path: 'calculator', element: <Calculator {...props} /> },
        { path: 'news', element: <News {...props} /> },
        { path: 'recovery', element: <Recovery {...props} /> },
        { path: 'staking', element: <Staking {...props} /> },
        { path: 'nftiki', element: <Nftiki {...props} /> },
        { path: 'rewards', element: <Rewards {...props} /> },
        { path: 'p2e', element: <P2E {...props} /> },
        { path: 'referrals', element: <Referrals {...props} /> }
      ]
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '*', element: <Navigate to="/home" replace /> }
      ]
    },
    { path: '*', element: <Navigate to="/home" replace /> }
  ]);
}

// IMPORT COMPONENTS

// Dashboard
const Home = Loadable(lazy(() => import('../pages/Home')));
const Statistics = Loadable(lazy(() => import('../pages/Statistics')));
const Calculator = Loadable(lazy(() => import('../pages/Calculator')));
const News = Loadable(lazy(() => import('../pages/News')));
const Recovery = Loadable(lazy(() => import('../pages/Recovery')));
const Staking = Loadable(lazy(() => import('../pages/Staking')));
const Nftiki = Loadable(lazy(() => import('../pages/Nftiki')));
const Rewards = Loadable(lazy(() => import('../pages/Rewards')));
const P2E = Loadable(lazy(() => import('../pages/P2E')));
const Referrals = Loadable(lazy(() => import('../pages/Referrals')));
