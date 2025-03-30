import { useState, useEffect, useRef, RefObject } from "react";
import {
  Box,
  Typography,
  Stack,
  useMediaQuery,
  useTheme,
  LinearProgress,
  Avatar,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  Container
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/libs/firebase";
import NavigationStepper from "@/components/NavigationStepper";
import Loading from "@/components/Loading";

const sections = [
  "about",
  "skills",
  "experience",
  "education"
  // "contact"
] as const;

export type SectionKey = (typeof sections)[number];

export default function Home() {
  const sectionRefs: Record<
    SectionKey,
    RefObject<HTMLDivElement>
  > = Object.fromEntries(
    sections.map((key) => [key, useRef<HTMLDivElement>(null)])
  ) as Record<SectionKey, RefObject<HTMLDivElement>>;

  const [active, setActive] = useState<SectionKey>("about");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [data, setData] = useState<Partial<Record<SectionKey, any>>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchAllSections = async () => {
      try {
        const docSnap = await getDoc(doc(db, "profiles", "public"));
        if (docSnap.exists()) {
          setData(docSnap.data());
        }
      } catch (e) {
        console.error("Error loading data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAllSections();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);

      for (const key of sections) {
        const ref = sectionRefs[key];
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
            setActive(key);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (
    ref: RefObject<HTMLElement | null>,
    name: SectionKey
  ) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
      setActive(name);
      if (isMobile) setDrawerOpen(false);
    }
  };

  // const FadeBox = ({ children }: { children: ReactNode }) => (
  //   <motion.div
  //     initial={{ opacity: 0, y: 20 }}
  //     whileInView={{ opacity: 1, y: 0 }}
  //     transition={{ duration: 0.3 }}
  //     viewport={{ once: true }}
  //   >
  //     {children}
  //   </motion.div>
  // );

  if (loading) return <Loading />;

  const renderContent = (section: SectionKey) => {
    const content = data[section];
    if (!content) return null;

    switch (section) {
      case "about":
        return (
          <Stack
            direction={"column"}
            spacing={4}
            alignItems={"flex-start"}
            width={"100%"}
          >
            <Stack
              direction={"row"}
              spacing={5}
              width={"100%"}
              alignItems={"center"}
              // justifyContent={"space-between"}
            >
              <Avatar
                src={content.avatarUrl}
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: "16px",
                  border: "2px solid white"
                }}
              />
              <Stack spacing={1}>
                <Typography>📧 {content.email}</Typography>
                <Typography>📞 {content.phone}</Typography>
                <Typography>
                  🌐{" "}
                  <a target="_blank" href={content.github}>
                    {content.github}
                  </a>
                </Typography>
                <Typography>
                  🌐{" "}
                  <a target="_blank" href={content.linkedin}>
                    {content.linkedin}
                  </a>
                </Typography>
              </Stack>
            </Stack>
            <Box>
              <Typography variant="h4">{content.name}</Typography>
              <Typography variant="h6">{content.role}</Typography>
              <Box dangerouslySetInnerHTML={{ __html: content.bio }} />
            </Box>
          </Stack>
        );
      case "skills":
        return (
          <Stack spacing={3}>
            {Array.isArray(content)
              ? content.map((group: any, i: number) => (
                  <Box key={i}>
                    <Typography fontWeight="bold">{group.category}</Typography>
                    <Stack pl={2} spacing={0.5}>
                      {group.items.map((item: string, j: number) => (
                        <Typography key={j}>• {item}</Typography>
                      ))}
                    </Stack>
                  </Box>
                ))
              : null}
          </Stack>
        );
      case "experience":
        return (
          <Stack spacing={3}>
            {Array.isArray(content)
              ? content.map((exp: any, i: number) => (
                  <Box key={i}>
                    <Typography variant="h6">
                      {exp.company} - {exp.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {exp.startMonth} {exp.startYear} - {exp.endMonth}{" "}
                      {exp.endYear}
                    </Typography>
                    <Typography sx={{ mt: 1 }}>{exp.description}</Typography>
                  </Box>
                ))
              : null}
          </Stack>
        );
      case "education":
        return (
          <Stack spacing={3}>
            {Array.isArray(content)
              ? content.map((edu: any, i: number) => (
                  <Box key={i}>
                    <Typography variant="h6" fontWeight="bold">
                      {edu.institution}
                    </Typography>
                    <Typography variant="subtitle1">
                      {edu.faculty} - {edu.major}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {edu.startYear} - {edu.endYear}
                    </Typography>
                  </Box>
                ))
              : null}
          </Stack>
        );
      // case "contact":
      //   return (
      //     <Stack spacing={1}>
      //       <Typography>📧 {data.about.email}</Typography>
      //       <Typography>📞 {data.about.phone}</Typography>
      //       <Typography>🌐 {data.about.github}</Typography>
      //     </Stack>
      //   );
      default:
        return null;
    }
  };

  return (
    <Box>
      <LinearProgress
        variant="determinate"
        value={scrollProgress}
        sx={{
          height: 4,
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1200
        }}
      />

      <Box
        sx={{
          position: "fixed",
          top: 8,
          right: 16,
          zIndex: 1300,
          display: "flex",
          gap: 2
        }}
      >
        {isMobile && (
          <IconButton onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        )}
      </Box>

      <Box sx={{ display: "flex", flexGrow: 1, mt: { xs: 6, md: 0 } }}>
        {isMobile ? (
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            <NavigationStepper
              active={active}
              sections={sections}
              onSelect={(s) => scrollToSection(sectionRefs[s], s)}
            />
          </Drawer>
        ) : (
          <Box
            sx={{
              width: 220,
              position: "fixed",
              top: 64,
              left: 0,
              // height: "100vh",
              overflowY: "auto",
              zIndex: 1100
            }}
          >
            <NavigationStepper
              active={active}
              sections={sections}
              onSelect={(s) => scrollToSection(sectionRefs[s], s)}
            />
          </Box>
        )}

        <Box sx={{ flex: 1, ml: { xs: 0, md: "220px" } }}>
          {sections.map((section) => {
            return (
              <Box
                key={section}
                ref={sectionRefs[section]}
                data-section={section}
                sx={{ minHeight: "100vh", py: 10, px: { xs: 2, md: 4 } }}
              >
                <Typography variant="h4" gutterBottom>
                  {section.toUpperCase()}
                </Typography>
                {renderContent(section)}
                <Divider sx={{ mt: 6 }} />
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
