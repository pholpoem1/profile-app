"use client";

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
} from "@mui/material";
import { doc, setDoc, getDoc, DocumentData } from "firebase/firestore";
import { db } from "@/libs/firebase";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import DeleteIcon from "@mui/icons-material/Delete";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export interface IProfileData extends DocumentData {
  name: string;
  role: string;
  email: string;
  phone: string;
  bio: string;
  avatarUrl: string;
  skills: string[];
  experience: string[];
  education: string;
  projects: string[];
}

export default function ProfileForm() {
  const [profile, setProfile] = useState<IProfileData>({
    name: "",
    role: "",
    email: "",
    phone: "",
    bio: "",
    avatarUrl: "",
    skills: [],
    experience: [],
    education: "",
    projects: [],
  });
  const [newItem, setNewItem] = useState({
    skills: "",
    experience: "",
    projects: "",
  });
  // const [editingIndex, setEditingIndex] = useState<{
  //   [key: string]: number | null;
  // }>({ skills: null, experience: null, projects: null });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchProfile();
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchProfile = async () => {
    const docRef = doc(db, "profiles", "public");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setProfile({
        ...data,
        skills: data.skills || [],
        experience: data.experience || [],
        projects: data.projects || [],
      } as IProfileData);
    }
    setLoading(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `avatars/public`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setProfile((prev) => ({ ...prev, avatarUrl: downloadURL }));
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleAddToList = (key: "skills" | "experience" | "projects") => {
    const value = newItem[key].trim();
    if (value) {
      setProfile((prev) => ({ ...prev, [key]: [...prev[key], value] }));
      setNewItem((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const handleRemoveFromList = (
    key: "skills" | "experience" | "projects",
    index: number
  ) => {
    setProfile((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  const handleEditItem = (
    key: "skills" | "experience" | "projects",
    index: number,
    value: string
  ) => {
    const updated = [...profile[key]];
    updated[index] = value;
    setProfile((prev) => ({ ...prev, [key]: updated }));
  };

  const onDragEnd = (
    key: "skills" | "experience" | "projects",
    result: any
  ) => {
    if (!result.destination) return;
    const items = Array.from(profile[key]);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setProfile((prev) => ({ ...prev, [key]: items }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await setDoc(doc(db, "profiles", "public"), profile);
      setSuccess(true);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setProfile({
      name: "",
      role: "",
      email: "",
      phone: "",
      bio: "",
      avatarUrl: "",
      skills: [],
      experience: [],
      education: "",
      projects: [],
    });
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Please sign in to update your profile
        </Typography>
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Sign in with Google
        </Button>
      </Container>
    );
  }

  const renderListInput = (
    label: string,
    key: "skills" | "experience" | "projects"
  ) => (
    <Box>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
        <TextField
          placeholder={`Add ${label}`}
          value={newItem[key]}
          onChange={(e) =>
            setNewItem((prev) => ({ ...prev, [key]: e.target.value }))
          }
          fullWidth
        />
        <Button onClick={() => handleAddToList(key)} variant="contained">
          Add
        </Button>
      </Box>
      <DragDropContext onDragEnd={(result) => onDragEnd(key, result)}>
        <Droppable droppableId={key}>
          {(provided) => (
            <List ref={provided.innerRef} {...provided.droppableProps} dense>
              {profile[key].map((item, index) => (
                <Draggable
                  key={index.toString()}
                  draggableId={`${key}-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveFromList(key, index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                      sx={{ alignItems: "flex-start" }}
                    >
                      <Box {...provided.dragHandleProps} sx={{ pr: 1, pt: 1 }}>
                        <DragHandleIcon fontSize="small" />
                      </Box>
                      <TextField
                        fullWidth
                        variant="standard"
                        value={item}
                        onChange={(e) =>
                          handleEditItem(key, index, e.target.value)
                        }
                      />
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Update Profile</Typography>
        <Button variant="outlined" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Avatar
          src={profile.avatarUrl}
          sx={{ width: 100, height: 100, mx: "auto" }}
        />
        <IconButton component="label" size="small">
          <PhotoCameraIcon />
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageUpload}
          />
        </IconButton>
        {uploading && <Typography variant="body2">Uploading...</Typography>}
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Name"
          name="name"
          value={profile.name}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Role"
          name="role"
          value={profile.role}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Phone"
          name="phone"
          value={profile.phone}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Bio"
          name="bio"
          value={profile.bio}
          onChange={handleChange}
          fullWidth
          multiline
          minRows={4}
        />

        {renderListInput("Skills", "skills")}
        {renderListInput("Experience", "experience")}
        <TextField
          label="Education"
          name="education"
          value={profile.education}
          onChange={handleChange}
          fullWidth
          multiline
          minRows={2}
        />
        {renderListInput("Projects", "projects")}

        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </Box>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        message="Profile updated successfully!"
      />
    </Container>
  );
}
