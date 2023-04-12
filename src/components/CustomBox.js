import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ScrollAnimation from 'react-animate-on-scroll';
import useSettings from '../hooks/useSettings';

export default function CustomBox({ children }) {
  const theme = useTheme();
  const settings = useSettings();
  const PRIMARY_ACCENT = theme.palette.grey[800];
  const { themeMode, setColor } = settings;
  return (
    <ScrollAnimation animateOnce animateIn="animate__fadeIn" duration={2}>
      <Box
        sx={{ boxShadow: themeMode === 'dark' ? '0 4px 0px 0 rgb(253 169 45)' : '0 4px 0px 0 #212B36' }}
        borderRadius={2}
        p={3}
        bgcolor={themeMode === 'dark' ? PRIMARY_ACCENT : setColor.main}
        overflow="hidden"
        position="relative"
      >
        {children}
      </Box>
    </ScrollAnimation>
  );
}
