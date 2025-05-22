import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Fab, Zoom } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';

interface Props {
  toggleColorMode: () => void;
  windowRef?: () => Window;
}

const ToggleThemeButton: React.FC<Props> = ({ toggleColorMode, windowRef }) => {
  const theme = useTheme();

  return (
    <Zoom in={true} onClick={toggleColorMode}>
      <div role="presentation" style={{ position: 'fixed', bottom: 16, right: 64, zIndex: 999 }}>
        <Fab size="small" sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'white' : 'transparent' }}>
          {theme.palette.mode === 'dark' ? (
            <LightModeIcon fontSize="small" sx={{ color: '#f5b942' }} />
          ) : (
            <NightlightIcon fontSize="small" sx={{ color: 'black' }} />
          )}
        </Fab>
      </div>
    </Zoom>
  );
};

export default ToggleThemeButton;
