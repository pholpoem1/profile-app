import { useRef, RefObject } from 'react';
import { Box, Typography, Avatar, Stack, Link, Chip, Grid, IconButton } from '@mui/material';
import Loading from '@/components/Loading';
import { SECTIONS_MENU } from '@/utils/constants';
import { useProfileData } from '@/components/useProfileData';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

const sections = SECTIONS_MENU;

export type SectionKey = (typeof sections)[number];

export default function Home() {
  const sectionRefs: Record<SectionKey, RefObject<HTMLDivElement>> = Object.fromEntries(
    sections.map((key) => [key, useRef<HTMLDivElement>(null)])
  ) as Record<SectionKey, RefObject<HTMLDivElement>>;

  const { data, error, isLoading } = useProfileData(true);

  if (isLoading) return <Loading />;
  if (error) return <div>โหลดข้อมูลผิดพลาด</div>;
  if (!data) return <div>ไม่พบข้อมูล</div>;

  const sortedExperience = data?.experience && [...data?.experience].sort((a, b) => b.seq - a.seq);

  return (
    <Box sx={{ display: 'flex', flexGrow: 1, mt: { xs: 6, md: 0 } }}>
      <Box sx={{ flex: 1 }}>
        <Box
          id={'about'}
          component={'div'}
          ref={sectionRefs['about']}
          data-section={'about'}
          sx={{ pt: { xs: 0, md: 10 }, px: { xs: 2, md: 4 } }}
        >
          <Grid container rowSpacing={1} columnSpacing={1}>
            <Grid size={{ xs: 12, sm: 4 }} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar src={data?.about.avatarUrl} sx={{ width: 250, height: 250 }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Box>
                <Typography variant="h4">{data?.about.name}</Typography>
                <Typography variant="h6">{data?.about.role}</Typography>
                <div dangerouslySetInnerHTML={{ __html: data?.about.bio || '' }} />
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box
          id={'skills'}
          component={'div'}
          ref={sectionRefs['skills']}
          data-section={'skills'}
          sx={{ py: { xs: 0, md: 10 }, px: { xs: 2, md: 4 } }}
        >
          <Typography align="center" variant="h4" sx={{ mb: 2 }}>
            Skills
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Stack direction="row" flexWrap="wrap" gap={1} justifyContent={'center'} maxWidth={'md'}>
              {data?.skills.map((skill) => (
                <Chip
                  size="medium"
                  sx={{ backgroundColor: 'white' }}
                  key={skill.name}
                  label={skill.name}
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
          sx={{ py: { xs: 0, md: 10 }, px: { xs: 2, md: 4 } }}
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
      </Box>
    </Box>
  );
}
