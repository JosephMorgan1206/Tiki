import PropTypes from 'prop-types';
// material
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import useSettings from '../hooks/useSettings';

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object
};

export default function Logo({ sx }) {
  const theme = useTheme();
  const settings = useSettings();
  const { themeMode } = settings;

  return (
    <Box sx={{ width: 40, height: 40, ...sx }}>
      <img alt="tiki-logo" src={themeMode === 'dark' ? '/static/brand/logo.svg' : '/static/brand/logo-dark.svg'} />
    </Box>
  );
}
