import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Snackbar,
  Avatar,
  IconButton,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Stack
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { db } from "@/libs/firebase";
import AddIcon from "@mui/icons-material/Add";

interface IEducationItem {
  institution: string;
  faculty: string;
  major: string;
  startYear: number;
  endYear: number;
}
interface ISkillGroup {
  category: string;
  items: string[];
}
interface IExperienceGroup {
  company: string;
  role: string;
  description: string;
  startMonth: string;
  startYear: number;
  endMonth: string;
  endYear: number;
}
interface IProfileData {
  about: {
    name: string;
    role: string;
    email: string;
    phone: string;
    bio: string;
    avatarUrl: string;
  };
  skills: ISkillGroup[];
  experience: IExperienceGroup[];
  education: IEducationItem[];
}

const years = Array.from(
  { length: 50 },
  (_, i) => new Date().getFullYear() - i
);
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

export default function ProfileForm() {
  const [profile, setProfile] = useState<IProfileData>({
    about: { name: "", role: "", email: "", phone: "", bio: "", avatarUrl: "" },
    skills: [],
    experience: [],
    education: []
  });
  const [newSkillCategory, setNewSkillCategory] = useState("");
  const [newSkillItem, setNewSkillItem] = useState("");
  const [currentSkillItems, setCurrentSkillItems] = useState<string[]>([]);
  const [newEducation, setNewEducation] = useState<IEducationItem>({
    institution: "",
    faculty: "",
    major: "",
    startYear: 2010,
    endYear: 2014
  });
  const [editingEducationIndex, setEditingEducationIndex] = useState<
    number | null
  >(null);
  const [successSection, setSuccessSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const [newExperience, setNewExperience] = useState<IExperienceGroup>({
    company: "",
    role: "",
    description: "",
    startMonth: "",
    startYear: new Date().getFullYear(),
    endMonth: "",
    endYear: new Date().getFullYear()
  });

  const auth = getAuth();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) fetchProfile();
      else setLoading(false);
    });
    return () => unsub();
  }, []);

  const fetchProfile = async () => {
    const snap = await getDoc(doc(db, "profiles", "public"));
    if (snap.exists()) {
      setProfile(snap.data() as IProfileData);
    }
    setLoading(false);
  };

  const handleAvatarUpload = async (file: File) => {
    const storageRef = ref(getStorage(), "avatars/public");
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setProfile((p) => ({ ...p, about: { ...p.about, avatarUrl: url } }));
  };

  const handleAddSkillItem = () => {
    if (newSkillItem.trim()) {
      setCurrentSkillItems([...currentSkillItems, newSkillItem.trim()]);
      setNewSkillItem("");
    }
  };

  const handleAddSkillGroup = () => {
    if (!newSkillCategory || currentSkillItems.length === 0) return;
    setProfile((p) => ({
      ...p,
      skills: [
        ...p.skills,
        { category: newSkillCategory, items: currentSkillItems }
      ]
    }));
    setNewSkillCategory("");
    setCurrentSkillItems([]);
  };

  const handleEducationSave = () => {
    const updated = profile.education ? [...profile.education] : [];
    if (editingEducationIndex !== null)
      updated[editingEducationIndex] = newEducation;
    else updated.push(newEducation);
    setProfile((p) => ({ ...p, education: updated }));
    setNewEducation({
      institution: "",
      faculty: "",
      major: "",
      startYear: 2010,
      endYear: 2014
    });
    setEditingEducationIndex(null);
  };

  const handleExperienceSave = () => {
    const {
      company,
      role,
      description,
      startMonth,
      startYear,
      endMonth,
      endYear
    } = newExperience;
    if (!company || !role || !description || !startMonth || !endMonth) {
      alert("Please fill in all fields.");
      return;
    }
    if (
      startYear > endYear ||
      (startYear === endYear &&
        months.indexOf(startMonth) > months.indexOf(endMonth))
    ) {
      alert("Start date must be before end date.");
      return;
    }
    setProfile((prev) => ({
      ...prev,
      experience: prev.experience
        ? [...prev.experience, newExperience]
        : [newExperience]
    }));
    setNewExperience({
      company: "",
      role: "",
      description: "",
      startMonth: "",
      startYear: new Date().getFullYear(),
      endMonth: "",
      endYear: new Date().getFullYear()
    });
  };

  const handleEditExperience = (index: number) => {
    const exp = profile.experience[index];
    setNewExperience(exp);
    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const handleDeleteExperience = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  if (loading)
    return (
      <Container>
        <CircularProgress />
      </Container>
    );

  if (!user) {
    return (
      <Container sx={{ textAlign: "center", py: 10 }}>
        <Typography variant="h5" gutterBottom>
          Sign in to edit your profile
        </Typography>
        <Button
          variant="contained"
          onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
        >
          Sign in with Google
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>
          Update Profile
        </Typography>
        <Button color="error" onClick={() => signOut(auth)}>
          Logout
        </Button>
      </Box>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>About</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" gap={2} alignItems="center">
            <Avatar
              src={profile.about.avatarUrl}
              sx={{ width: 80, height: 80 }}
            />
            <IconButton component="label">
              <PhotoCamera />
              <input
                type="file"
                hidden
                onChange={(e) =>
                  e.target.files?.[0] && handleAvatarUpload(e.target.files[0])
                }
              />
            </IconButton>
          </Box>
          {["name", "role", "email", "phone", "bio"].map((f, i) => (
            <TextField
              key={f}
              label={f}
              fullWidth
              sx={{ mt: 2 }}
              value={profile.about[f as keyof typeof profile.about]}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  about: { ...p.about, [f]: e.target.value }
                }))
              }
            />
          ))}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Skills</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {profile.skills?.map((group, i) => (
            <Box key={i} mb={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                {group.category}
              </Typography>
              <List dense>
                {group.items?.map((item, j) => (
                  <ListItem key={j}>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" fontWeight="bold">
            Add New Skill Group
          </Typography>
          <TextField
            fullWidth
            label="Category"
            value={newSkillCategory}
            onChange={(e) => setNewSkillCategory(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Box display="flex" gap={2} mt={2}>
            <TextField
              label="Skill"
              fullWidth
              value={newSkillItem}
              onChange={(e) => setNewSkillItem(e.target.value)}
            />
            <IconButton aria-label="add" onClick={handleAddSkillItem}>
              <AddIcon />
            </IconButton>
          </Box>
          <List dense>
            {currentSkillItems?.map((item, idx) => (
              <ListItem key={idx}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
          <Button
            sx={{ mt: 2 }}
            onClick={handleAddSkillGroup}
            startIcon={<AddIcon />}
          >
            Add Skill Group
          </Button>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Experience</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <TextField
              label="Company"
              value={newExperience.company}
              onChange={(e) =>
                setNewExperience((p) => ({ ...p, company: e.target.value }))
              }
            />
            <TextField
              label="Role"
              value={newExperience.role}
              onChange={(e) =>
                setNewExperience((p) => ({ ...p, role: e.target.value }))
              }
            />
            <TextField
              label="Description"
              multiline
              minRows={2}
              value={newExperience.description}
              onChange={(e) =>
                setNewExperience((p) => ({ ...p, description: e.target.value }))
              }
            />
            <Stack direction="row" spacing={2}>
              <TextField
                select
                label="Start Month"
                value={newExperience.startMonth}
                onChange={(e) =>
                  setNewExperience((p) => ({
                    ...p,
                    startMonth: e.target.value
                  }))
                }
                sx={{ flex: 1 }}
              >
                {months.map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Start Year"
                value={newExperience.startYear}
                onChange={(e) =>
                  setNewExperience((p) => ({
                    ...p,
                    startYear: +e.target.value
                  }))
                }
                sx={{ flex: 1 }}
              >
                {years.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                select
                label="End Month"
                value={newExperience.endMonth}
                onChange={(e) =>
                  setNewExperience((p) => ({ ...p, endMonth: e.target.value }))
                }
                sx={{ flex: 1 }}
              >
                {months.map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="End Year"
                value={newExperience.endYear}
                onChange={(e) =>
                  setNewExperience((p) => ({ ...p, endYear: +e.target.value }))
                }
                sx={{ flex: 1 }}
              >
                {years.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </Stack>
          <Button
            sx={{ mt: 2 }}
            onClick={handleExperienceSave}
            startIcon={<AddIcon />}
          >
            Add Experience
          </Button>
          {profile.experience?.map((exp, i) => (
            <Box
              key={i}
              mt={2}
              p={2}
              border={1}
              borderColor="divider"
              borderRadius={1}
            >
              <Typography fontWeight="bold">
                {exp.company} - {exp.role}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {exp.startMonth} {exp.startYear} - {exp.endMonth} {exp.endYear}
              </Typography>
              <Typography sx={{ mt: 1 }}>{exp.description}</Typography>
              <Box textAlign="right">
                <IconButton onClick={() => handleEditExperience(i)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteExperience(i)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Education</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <TextField
              label="Institution"
              value={newEducation.institution}
              onChange={(e) =>
                setNewEducation((p) => ({ ...p, institution: e.target.value }))
              }
            />
            <TextField
              label="Faculty"
              value={newEducation.faculty}
              onChange={(e) =>
                setNewEducation((p) => ({ ...p, faculty: e.target.value }))
              }
            />
            <TextField
              label="Major"
              value={newEducation.major}
              onChange={(e) =>
                setNewEducation((p) => ({ ...p, major: e.target.value }))
              }
            />
            <Stack direction="row" spacing={2}>
              <TextField
                select
                label="Start Year"
                value={newEducation.startYear}
                onChange={(e) =>
                  setNewEducation((p) => ({ ...p, startYear: +e.target.value }))
                }
                sx={{ flex: 1 }}
              >
                {years.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="End Year"
                value={newEducation.endYear}
                onChange={(e) =>
                  setNewEducation((p) => ({ ...p, endYear: +e.target.value }))
                }
                sx={{ flex: 1 }}
              >
                {years.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </Stack>
          <Button onClick={handleEducationSave} sx={{ mt: 1 }}>
            + Add Education
          </Button>
          {profile.education?.map((edu, i) => (
            <Box key={i} mt={2} display="flex" justifyContent="space-between">
              <Box>
                <Typography fontWeight={600}>{edu.institution}</Typography>
                <Typography>
                  {edu.faculty} - {edu.major}
                </Typography>
                <Typography>
                  {edu.startYear} - {edu.endYear}
                </Typography>
              </Box>
              <Box>
                <IconButton
                  onClick={() => {
                    setNewEducation(edu);
                    setEditingEducationIndex(i);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() =>
                    setProfile((p) => ({
                      ...p,
                      education: p.education.filter((_, j) => j !== i)
                    }))
                  }
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </AccordionDetails>
      </Accordion>

      <Box textAlign="center" mt={4}>
        <Button
          variant="contained"
          size="large"
          onClick={async () => {
            if (!user) return;
            await setDoc(doc(db, "profiles", "public"), profile, {
              merge: true
            });
            setSuccessSection("all");
            setTimeout(() => setSuccessSection(null), 3000);
          }}
        >
          Save All
        </Button>
      </Box>

      <Snackbar
        open={!!successSection}
        autoHideDuration={3000}
        onClose={() => setSuccessSection(null)}
        message={`Updated ${successSection} section!`}
      />
    </Container>
  );
}
