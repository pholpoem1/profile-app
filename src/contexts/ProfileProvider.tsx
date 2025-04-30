import { SectionKey } from '@/pages';
import React, { createContext, ReactNode, RefObject, useContext, useRef, useState } from 'react';

const ProfileContext = createContext({
  anchorEl: null as HTMLElement | null,
  setAnchorEl: (HTMLElement: HTMLElement | null) => {},
  active: 'about' as SectionKey,
  setActive: (active: SectionKey) => {},
  scrollProgress: 0,
  setScrollProgress: (scrollProgress: number) => {},
});

const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [active, setActive] = useState<SectionKey>('about');

  return (
    <ProfileContext.Provider value={{ anchorEl, setAnchorEl, active, setActive, scrollProgress, setScrollProgress }}>
      {children}
    </ProfileContext.Provider>
  );
};

const useProfileContext = () => useContext(ProfileContext);
export { ProfileProvider, useProfileContext };
