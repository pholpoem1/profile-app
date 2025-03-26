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
  CircularProgress
} from "@mui/material";
import { doc, setDoc, getDoc, DocumentData } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "@/libs/firebase";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User
} from "firebase/auth";

export interface IProfileData extends DocumentData {
  name: string;
  role: string;
  email: string;
  phone: string;
  bio: string;
  avatarUrl: string;
}

export default function ProfileForm() {
  const [profile, setProfile] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    bio: "",
    avatarUrl: ""
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchProfile(currentUser.uid);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchProfile = async (uid: string) => {
    const docRef = doc(db, "profiles", uid);
    const docSnap = await getDoc(docRef);
    console.log("docSnap :>> ", docSnap.data());
    if (docSnap.exists()) {
      setProfile(docSnap.data() as IProfileData);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setProfile((prev) => ({ ...prev, avatarUrl: downloadURL }));
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await setDoc(doc(db, "profiles", user.uid), profile);
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
      avatarUrl: ""
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

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3
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
