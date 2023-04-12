// material
import { Container, Typography, Alert, AlertTitle } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import HeaderBanner from '../components/HeaderBanner';
// ----------------------------------------------------------------------

export default function News() {
  const { themeStretch } = useSettings();

  return (
    <Page title="News | TIKI Dash">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBanner text="News + Announcements" />
        <Alert sx={{ marginTop: '16px' }} severity="info">
          <AlertTitle>Coming soon</AlertTitle>
          <Typography>
            Be informed of all the latest TIKI news all in one place! Here, we will feature all of the latests news as
            well as important dates for all the upcoming excitment! Coming soon.
          </Typography>
        </Alert>
      </Container>
    </Page>
  );
}
