// material
import { Container, Typography, Alert, AlertTitle } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import HeaderBanner from '../components/HeaderBanner';

// ----------------------------------------------------------------------

export default function P2E() {
  const { themeStretch } = useSettings();

  return (
    <Page title="P2E | TIKI Dash">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBanner text="P2E Game" />
        <Alert sx={{ marginTop: '16px' }} severity="info">
          <AlertTitle>Coming soon</AlertTitle>
          <Typography>
            Our first ever TIKI-inspired P2E (Play-2-Earn) game is coming soon to join the TIKI Token Ecosystem. Engage
            in immersive gameplay that rewards players in TIKI Token with bonus for NFTIKI Holders! Early Beta expected
            during Janurary and full-release in February. Keep an eye on our announcements for more info!
          </Typography>
        </Alert>
      </Container>
    </Page>
  );
}
