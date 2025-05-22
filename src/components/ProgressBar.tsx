import { useProfileContext } from '@/contexts/ProfileProvider';
import { LinearProgress } from '@mui/material';

const ProgressBar = () => {
  const { scrollProgress } = useProfileContext();

  return (
    <LinearProgress
      variant="determinate"
      value={scrollProgress}
      sx={(theme) => ({
        height: 4,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1200,
        backgroundColor: 'transparent',
        '& .MuiLinearProgress-bar': {
          background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.error.main}, ${theme.palette.warning.main}, ${theme.palette.success.main})`,
        },
      })}
    />
  );
};

export default ProgressBar;
