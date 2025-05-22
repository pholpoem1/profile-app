import React from 'react';
import { useScrollTrigger, Zoom, Fab } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface ScrollTopProps {
  windowRef?: () => Window;
}

const ScrollTop: React.FC<ScrollTopProps> = ({ windowRef }) => {
  const trigger = useScrollTrigger({
    target: windowRef ? windowRef() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Zoom in={trigger} onClick={handleClick}>
      <div role="presentation" style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 999 }}>
        <Fab color="error" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </div>
    </Zoom>
  );
};

export default ScrollTop;
