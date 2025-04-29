import { SECTIONS_MENU } from '@/utils/constants';
import { Menu, MenuItem } from '@mui/material';

const MenuMobile = ({
  anchorEl,
  setAnchorEl,
}: {
  anchorEl: null | HTMLElement;
  setAnchorEl: (value: HTMLElement | null) => void;
}) => {
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={open}
      onClose={handleClose}
      onClick={handleClose}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            // '& .MuiAvatar-root': {
            //   width: 32,
            //   height: 32,
            //   ml: -0.5,
            //   mr: 1,
            // },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      {SECTIONS_MENU.map((section) => (
        <MenuItem key={section} onClick={handleClose}>
          {section.charAt(0).toUpperCase() + section.slice(1)}
        </MenuItem>
      ))}
      {/* <MenuItem onClick={handleClose}>Profile</MenuItem> */}
    </Menu>
  );
};

export default MenuMobile;
