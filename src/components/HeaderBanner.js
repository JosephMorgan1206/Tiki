import { useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import useSettings from '../hooks/useSettings';

export default function HeaderBanner({ text }) {
  const { setColor } = useSettings();
  const theme = useTheme();
  const PRIMARY_TEXT = theme.palette.grey[800];
  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        p={3}
        borderRadius="16px"
        bgcolor={setColor.main}
        alignItems="center"
        gap={2}
        position="relative"
        boxShadow={2}
      >
        <img
          style={{
            width: '56px',
            borderRight: `1px solid`,
            borderColor: PRIMARY_TEXT,
            paddingRight: '1em'
          }}
          src="\static\brand\tiki-logo-dark.png"
          alt="logo"
        />
        <Typography component="h1" variant="h3" color={PRIMARY_TEXT}>
          {text}
        </Typography>
      </Box>
    </>
  );
}
