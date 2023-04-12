// material
import { Container, Typography, Alert, AlertTitle } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import HeaderBanner from '../components/HeaderBanner';

// ----------------------------------------------------------------------

export default function Nftiki() {
  const { themeStretch } = useSettings();

  return (
    <Page title="NFTIKI | TIKI Dash">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBanner text="NFTIKI" />
        <Alert sx={{ marginTop: '16px' }} severity="info">
          <AlertTitle>Coming soon</AlertTitle>
          <Typography>
            NFTIKI integrations will be coming soon. Track your NFTIKIs and explore all of the beautiful designs inside
            the TIKI Dash! For more info on NFTIKI, please visit{' '}
            <a style={{ color: 'white' }} href="https://nftiki.co/" target="_blank" rel="noreferrer">
              nftiki.co
            </a>
            .
          </Typography>
        </Alert>
      </Container>
    </Page>
  );
}
