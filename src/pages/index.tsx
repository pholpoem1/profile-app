import { useState, useEffect, useRef, RefObject } from 'react';
import { Box, Typography, useMediaQuery, useTheme, Avatar, Divider, Stack, Link, Chip } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/libs/firebase';
import Loading from '@/components/Loading';
import { SECTIONS_MENU } from '@/utils/constants';

const sections = SECTIONS_MENU;

export type SectionKey = (typeof sections)[number];

export default function Home() {
  const sectionRefs: Record<SectionKey, RefObject<HTMLDivElement>> = Object.fromEntries(
    sections.map((key) => [key, useRef<HTMLDivElement>(null)])
  ) as Record<SectionKey, RefObject<HTMLDivElement>>;
  const [data, setData] = useState<Partial<Record<SectionKey, any>>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAllSections = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'profiles', 'public'));
        if (docSnap.exists()) {
          setData(docSnap.data());
        }
      } catch (e) {
        console.error('Error loading data:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAllSections();
  }, []);

  if (loading) return <Loading />;

  return (
    <Box>
      <Box sx={{ display: 'flex', flexGrow: 1, mt: { xs: 6, md: 0 } }}>
        <Box sx={{ flex: 1, ml: { xs: 0, md: '220px' } }}>
          {Object.entries(data).map((section) => {
            const sectionName = section[0] as SectionKey;

            return (
              <Box
                id={sectionName}
                component={'div'}
                key={sectionName}
                ref={sectionRefs[sectionName]}
                data-section={sectionName}
                sx={{ minHeight: '100vh', py: 10, px: { xs: 2, md: 4 } }}
              >
                <Typography variant="h3" gutterBottom>
                  {/* {sectionName.name} */}
                </Typography>
              </Box>
            );
          })}

          {/* {sections.map((section) => {
            return (
              <Box
                id={section}
                component={'div'}
                key={section}
                ref={sectionRefs[section]}
                data-section={section}
                sx={{ minHeight: '100vh', py: 10, px: { xs: 2, md: 4 } }}
              >
                <Typography variant="h3" gutterBottom></Typography>
              </Box>
            );
          })} */}
        </Box>
      </Box>
    </Box>
  );
}
