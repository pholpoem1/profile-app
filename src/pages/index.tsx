// pages/index.tsx

import { useState, useEffect, useRef, ReactNode, RefObject } from "react";
import {
  Box,
  Typography,
  Stack,
  List,
  // ListItem,
  ListItemText,
  useMediaQuery,
  LinearProgress,
  Avatar,
  Switch,
  FormControlLabel,
  CircularProgress,
  ListItemButton
  // ListItem
} from "@mui/material";
import { red, grey } from "@mui/material/colors";
import { motion } from "framer-motion";
// import MenuIcon from "@mui/icons-material/Menu";
// import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/libs/firebase";
import { IProfileData } from "./profile";

export default function Home() {
  const aboutRef = useRef(null);
  const skillsRef = useRef(null);
  const experienceRef = useRef(null);
  const educationRef = useRef(null);
  const contactRef = useRef(null);
  const projectsRef = useRef(null);

  const [active, setActive] = useState("About");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [profile, setProfile] = useState<IProfileData | null>(null);
  const isMobile = useMediaQuery("(max-width:900px)");

  useEffect(() => {
    const fetchProfile = async () => {
      const docRef = doc(db, "profiles", "public");
      const docSnap = await getDoc(docRef);
      console.log("docSnap.data() :>> ", docSnap);
      if (docSnap.exists()) {
        setProfile(docSnap.data() as IProfileData);
      }
    };
    fetchProfile();
  }, []);

  const sectionMap = {
    About: aboutRef,
    Skills: skillsRef,
    Experience: experienceRef,
    Projects: projectsRef,
    Education: educationRef,
    Contact: contactRef
  };

  const scrollToSection = (
    ref: RefObject<HTMLElement | null>,
    name: string
  ) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
      setActive(name);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = Object.entries(sectionMap).find(
              ([, ref]) => ref.current === entry.target
            );
            if (section) setActive(section[0]);
          }
        });
      },
      { threshold: 0.3 }
    );

    Object.values(sectionMap).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const bgColor = darkMode ? "#121212" : "#ffffff";
  const textColor = darkMode ? grey[100] : red[700];

  if (!profile) {
    return (
      <Box
        sx={{
          bgcolor: bgColor,
          color: textColor,
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }

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
      <Box sx={{ position: "fixed", top: 8, right: 16, zIndex: 1300 }}>
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
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        {!isMobile && (
          <Box
            sx={{
              width: 200,
              p: 2,
              position: "sticky",
              top: 0,
              alignSelf: "flex-start"
            }}
          >
            <Typography variant="h6" gutterBottom>
              Navigation
            </Typography>
            <List>
              {Object.entries(sectionMap).map(([name, ref]) => (
                <ListItemButton
                  key={name}
                  // button
                  selected={active === name}
                  onClick={() => ref.current && scrollToSection(ref, name)}
                >
                  <ListItemText primary={name} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        )}

        <Box sx={{ flex: 1 }}>
          {/* Hero */}
          <Box ref={aboutRef} sx={{ minHeight: "100vh", py: 10, px: 4 }}>
            <FadeBox>
              <Stack direction="row" spacing={4} alignItems="center">
                <Avatar
                  src={profile.avatarUrl || "/profile.jpg"}
                  alt="Profile"
                  sx={{ width: 120, height: 120 }}
                />
                <Box>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    {profile.name || "Your Name"}
                  </Typography>
                  <Typography variant="h5" gutterBottom>
                    {profile.role || "Your Role"}
                  </Typography>
                  <Typography variant="body1">
                    {profile.bio || "Short bio or description goes here."}
                  </Typography>
                </Box>
              </Stack>
            </FadeBox>
          </Box>

          {/* The rest of your sections remain the same... */}
        </Box>
      </Box>
    </Box>
  );
}
