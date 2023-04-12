// material
import { Container, Typography, Alert, AlertTitle } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import HeaderBanner from '../components/HeaderBanner';

// ----------------------------------------------------------------------

export default function Statistics() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Statistics | TIKI Dash">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBanner text="Statistics" />
        <Alert sx={{ marginTop: '16px' }} severity="info">
          <AlertTitle>Coming soon</AlertTitle>
          <Typography>Advanced statistics on all thing TIKI will be added soon to the TIKI Dash.</Typography>
        </Alert>
      </Container>
    </Page>
  );
}
