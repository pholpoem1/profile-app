// pages/index.tsx

import { useState, useEffect, useRef, ReactNode, RefObject } from "react";
import {
  Box,
  Typography,
  Stack,
  Stepper,
  Step,
  StepLabel,
  useMediaQuery,
  useTheme,
  LinearProgress,
  Avatar,
  Switch,
  FormControlLabel,
  CircularProgress,
  Divider,
  Drawer,
  IconButton
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { red, grey } from "@mui/material/colors";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/libs/firebase";

const sections = [
  "about",
  "skills",
  "experience",
  "projects",
  "education",
  "contact"
] as const;
type SectionKey = (typeof sections)[number];

export default function Home() {
  const sectionRefs: Record<
    SectionKey,
    RefObject<HTMLDivElement>
  > = Object.fromEntries(sections.map((key) => [key, useRef(null)])) as Record<
    SectionKey,
    RefObject<HTMLDivElement>
  >;

  const [active, setActive] = useState<SectionKey>("about");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
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
          console.log("docSnap.data() :>> ", docSnap.data());
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

  const FadeBox = ({ children }: { children: ReactNode }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );

  const renderContent = (section: SectionKey) => {
    console.log("data :>> ", data);
    console.log("section :>> ", section);
    const content =
      section === "about" || section === "education" ? data : data[section];
    if (!content) return null;

    switch (section) {
      case "about":
        return (
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={4}
            alignItems={{ xs: "flex-start", md: "center" }}
          >
            <Avatar src={content.avatarUrl} sx={{ width: 100, height: 100 }} />
            <Box>
              <Typography variant="h4">{content.name}</Typography>
              <Typography variant="h6">{content.role}</Typography>
              <Typography>{content.bio}</Typography>
            </Box>
          </Stack>
        );
      case "skills":
      case "experience":
      case "projects":
        return (
          <Stack spacing={1}>
            {Array.isArray(content)
              ? content.map((item, i) => (
                  <Typography key={i}>• {item}</Typography>
                ))
              : null}
          </Stack>
        );
      case "education":
        return (
          <Box>
            <Typography variant="h6">{content.degree}</Typography>
            <Typography>{content.institution}</Typography>
            <Typography>{content.year}</Typography>
          </Box>
        );
      case "contact":
        return (
          <Stack spacing={1}>
            <Typography>📧 {content.email}</Typography>
            <Typography>📞 {content.phone}</Typography>
            <Typography>🌐 {content.website}</Typography>
          </Stack>
        );
      default:
        return null;
    }
  };

  const bgColor = darkMode ? "#121212" : "#ffffff";
  const textColor = darkMode ? grey[100] : red[700];

  const navComponent = (
    <Box sx={{ width: 220, px: 2, py: 4 }}>
      <Typography variant="h6" gutterBottom>
        Navigation
      </Typography>
      <Stepper
        activeStep={sections.indexOf(active)}
        orientation="vertical"
        nonLinear
      >
        {sections.map((name) => (
          <Step key={name} completed={false}>
            <StepLabel
              onClick={() => scrollToSection(sectionRefs[name], name)}
              sx={{ cursor: "pointer" }}
            >
              {name.toUpperCase()}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );

  return (
    <Box
      sx={{
        bgcolor: bgColor,
        color: textColor,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column"
      }}
    >
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
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
          }
          label="Dark Mode"
        />
      </Box>

      <Box sx={{ display: "flex", flexGrow: 1, mt: { xs: 6, md: 0 } }}>
        {isMobile ? (
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            {navComponent}
          </Drawer>
        ) : (
          <Box
            sx={{
              width: 220,
              position: "fixed",
              top: 64,
              left: 0,
              height: "100vh",
              overflowY: "auto",
              zIndex: 1100
            }}
          >
            {navComponent}
          </Box>
        )}

        <Box sx={{ flex: 1, ml: { xs: 0, md: "220px" } }}>
          {sections.map((section) => (
            <Box
              key={section}
              ref={sectionRefs[section]}
              data-section={section}
              sx={{ minHeight: "100vh", py: 10, px: { xs: 2, md: 4 } }}
            >
              <FadeBox>
                <Typography variant="h4" gutterBottom>
                  {section.toUpperCase()}
                </Typography>
                {loading && <CircularProgress />}
                {!loading && renderContent(section)}
              </FadeBox>
              <Divider sx={{ mt: 6 }} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
