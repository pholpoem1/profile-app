import { useProfileContext } from '@/contexts/ProfileProvider';
import { SECTIONS_MENU } from '@/utils/constants';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { smoothScrollTo } from './Header';

const MenuMobile = ({ isOpenMenu, toggleDrawer }: { isOpenMenu: boolean; toggleDrawer: () => void }) => {
  const sectionMenu = SECTIONS_MENU;
  const { active, setActive } = useProfileContext();

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {sectionMenu.map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              className={`menu-item ${text === active ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(text);
                if (el) {
                  smoothScrollTo(el.offsetTop, 1000);
                  setActive(text);
                }
                toggleDrawer();
              }}
            >
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer open={isOpenMenu} onClose={toggleDrawer}>
      {DrawerList}
    </Drawer>
  );
};

export default MenuMobile;
