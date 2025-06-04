import { useRef, RefObject, useEffect } from 'react';
import { Box, Typography, Avatar, Stack, Chip, Grid, Link, Divider, useTheme, Button } from '@mui/material';
import Loading from '@/components/Loading';
import { SECTIONS_MENU } from '@/utils/constants';
import { useProfileData } from '@/components/useProfileData';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import SVG from 'react-inlinesvg';
import { useProfileContext } from '@/contexts/ProfileProvider';
import AOS from 'aos';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';

const sections = SECTIONS_MENU;

export type SectionKey = (typeof sections)[number];

export default function Home() {
  const theme = useTheme();
  const { setActive, setScrollProgress } = useProfileContext();

  const sectionRefs: Record<SectionKey, RefObject<HTMLDivElement>> = Object.fromEntries(
    sections.map((key) => [key, useRef<HTMLDivElement>(null)])
  ) as Record<SectionKey, RefObject<HTMLDivElement>>;

  const { data, error, isLoading } = useProfileData(true);

  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;

      setScrollProgress(progress);

      // ถ้ามี timeout เดิมอยู่ ให้ clear ก่อน
      if (scrollTimeout) clearTimeout(scrollTimeout);

      // ตั้ง timeout เพื่อรอ scroll หยุดก่อนค่อยเช็ค section
      scrollTimeout = setTimeout(() => {
        for (const key of SECTIONS_MENU) {
          const ref = sectionRefs[key];
          if (ref?.current) {
            const rect = ref.current.getBoundingClientRect();
            if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
              setActive(key);
              break;
            }
            const sectionMiddle = rect.top + rect.height / 2;
            if (sectionMiddle > 0 && sectionMiddle < window.innerHeight) {
              setActive(key);
            }
          }
        }
      }, 150); // รอ 150ms หลัง scroll หยุด
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  useEffect(() => {
    AOS.init({
      once: false,
    });
  }, []);

  if (isLoading) return <Loading />;
  if (error) return <div>โหลดข้อมูลผิดพลาด</div>;
  if (!data) return <div>ไม่พบข้อมูล</div>;

  const sortedExperience = data?.experience && [...data?.experience].sort((a, b) => b.seq - a.seq);
  const contactList = Object.entries(data?.contact || {}).sort(([key, value], [key2, value2]) => {
    return value.seq - value2.seq;
  });

  return (
    <Box sx={{ display: 'flex', flexGrow: 1, mt: { xs: 6, md: 0 } }}>
      <Box sx={{ flex: 1 }}>
        <Box
          height={{ xs: '100vh', sm: '30vh', md: '100vh' }}
          id={'about'}
          component={'div'}
          ref={sectionRefs['about']}
          data-section={'about'}
          sx={{ px: { xs: 0, md: 4 } }}
        >
          <div style={{ position: 'absolute' }}>
            <div className="glow-bg glow-circle"></div>
            <div className="glow-bg glow-oval"></div>
          </div>
          <Grid container rowSpacing={1} columnSpacing={1} height={{ xs: 0, md: '100%' }} alignItems={'center'}>
            <Grid size={{ xs: 12, sm: 4 }} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar
                src={data?.about.avatarUrl}
                sx={{
                  width: 200,
                  height: 200,
                  borderRadius: '16px',
                  border: '2px solid white',
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }} mt={{ xs: 5, sm: 0 }}>
              <Typography variant="h4" textAlign={{ xs: 'center', sm: 'left' }}>
                {data?.about.name}
              </Typography>
              <Typography variant="h6" textAlign={{ xs: 'center', sm: 'left' }}>
                {data?.about.role}
              </Typography>
              <div dangerouslySetInnerHTML={{ __html: data?.about.bio || '' }} />
              <Box display={'flex'} justifyContent={{ xs: 'center', sm: 'start' }} gap={2}>
                <Button
                  variant="outlined"
                  startIcon={<CloudDownloadOutlinedIcon />}
                  href={data?.about.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  component="a"
                >
                  Download my CV
                </Button>

                <Button
                  href={'https://github.com/pholpoem1/profile-app'}
                  variant="text"
                  target="_blank"
                  rel="noopener noreferrer"
                  component="a"
                  sx={{ ':hover': { backgroundColor: 'transparent' } }}
                  startIcon={
                    <SVG
                      viewBox="0 0 97.707 97.707"
                      src={`/assets/icons/${theme.palette.mode === 'dark' ? 'github-mark-white' : 'github-mark'}.svg`}
                      width={40}
                      height={40}
                    />
                  }
                >
                  <Typography>This profile's code</Typography>
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box
          id={'skills'}
          component={'div'}
          ref={sectionRefs['skills']}
          data-section={'skills'}
          sx={{ py: 10, px: { xs: 0, md: 4 } }}
          data-aos="zoom-in"
          data-aos-duration="500"
        >
          <Typography align="center" variant="h4" sx={{ mb: 2 }}>
            Skills
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Stack direction="row" flexWrap="wrap" gap={1} justifyContent={'center'} maxWidth={'md'}>
              {data?.skills.map((skill) => (
                <Chip
                  size="medium"
                  key={skill.name}
                  label={<Typography>{skill.name}</Typography>}
                  avatar={skill.icon ? <Avatar src={skill.icon} /> : undefined}
                />
              ))}
            </Stack>
          </Box>
        </Box>

        <Box
          id={'experience'}
          component={'div'}
          ref={sectionRefs['experience']}
          data-section={'experience'}
          sx={{ pt: 10, pb: { xs: 0, md: 5 }, px: { xs: 0, md: 4 } }}
        >
          <Typography align="center" variant="h4" sx={{ mb: 2 }}>
            Experience
          </Typography>
          <Timeline
            position="right"
            sx={{
              [`& .${timelineItemClasses.root}:before`]: {
                flex: 0,
                padding: 0,
              },
            }}
            data-aos="zoom-in"
            data-aos-duration="3000"
          >
            {sortedExperience.map((exp) => (
              <TimelineItem key={exp.seq}>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Grid container rowSpacing={1} columnSpacing={1}>
                    <Grid size={12}>
                      <Typography variant="body2" color="text.secondary">
                        {exp.startMonth} {exp.startYear} - {exp.isCurrent ? 'Present' : exp.endMonth + exp.endYear}
                      </Typography>
                    </Grid>
                    <Grid size={10} mt={2}>
                      <Typography fontWeight="bold">
                        {exp.role} - {exp.company}
                      </Typography>
                    </Grid>

                    <Grid size={12}>
                      <div dangerouslySetInnerHTML={{ __html: exp.description }} />
                    </Grid>
                  </Grid>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Box>

        <Box
          id={'contact'}
          component={'div'}
          ref={sectionRefs['contact']}
          data-section={'contact'}
          height={'100vh'}
          sx={{ py: 10, px: { xs: 0, md: 4 } }}
        >
          <Grid container rowSpacing={1} columnSpacing={1}>
            {contactList.map(([key, value], i) => {
              if (!value.url) return null;
              const name = value.url.replace('https://', '');
              return (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Button
                    href={key === 'email' ? `mailto:${value.url}` : key === 'phone' ? `tel:${value.url}` : value.url}
                    key={i}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      ':hover': { backgroundColor: 'transparent' },
                    }}
                    variant="text"
                    target="_blank"
                    rel="noopener noreferrer"
                    component="a"
                    startIcon={
                      <SVG
                        {...(key === 'github' && { viewBox: '0 0 97.707 97.707' })}
                        src={
                          key === 'github'
                            ? `/assets/icons/${theme.palette.mode === 'dark' ? 'github-mark-white' : 'github-mark'}.svg`
                            : value.icon
                        }
                        width={40}
                        height={40}
                      />
                    }
                  >
                    <Typography>{name}</Typography>
                  </Button>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
