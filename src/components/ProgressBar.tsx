import { useProfileContext } from '@/contexts/ProfileProvider';
import { LinearProgress } from '@mui/material';

const ProgressBar = () => {
  const { scrollProgress } = useProfileContext();

  return (
    <LinearProgress
      variant="determinate"
      value={scrollProgress}
      sx={{
        height: 4,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1200,
      }}
    />
  );
};

export default ProgressBar;
