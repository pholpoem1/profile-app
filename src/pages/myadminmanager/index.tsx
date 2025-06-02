import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Avatar,
  IconButton,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  FormControlLabel,
  Checkbox,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import { doc, setDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '@/libs/firebase';
import AddIcon from '@mui/icons-material/Add';
import { useDropzone } from 'react-dropzone';
import { uploadFileToStorageAndSaveUrl } from '@/utils/uploadFile';
import { CONSTANTS } from '@/utils/constants';
import { deleteFileAndClearUrl } from '@/utils/deleteFile';
import { useSnackbar } from 'notistack';
import Image from 'next/image';
import Loading from '@/components/Loading';
import InputText from '@/components/Input/InputText';
import dynamic from 'next/dynamic';
import InputSelect from '@/components/Input/InputSelect';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import Label from '@/components/Input/Label';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { useAuth } from '@/components/useAuth';
import { useProfileData } from '@/components/useProfileData';

const RitchText = dynamic(() => import('@/components/Input/RitchText'), {
  ssr: false,
});

interface IEducationItem {
  seq: number;
  institution: string;
  faculty: string;
  major: string;
  startYear: string;
  endYear: string;
}

interface ISkillItem {
  seq: number;
  name: string;
  icon: string;
}
interface IExperienceGroup {
  seq: number;
  company: string;
  role: string;
  description: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  isCurrent?: boolean;
}
interface IContactItem {
  email: {
    url: string;
    icon: string;
  };
  phone: {
    url: string;
    icon: string;
  };
  linkedin: {
    url: string;
    icon: string;
  };
  github: {
    url: string;
    icon: string;
  };
  lineId: {
    url: string;
    icon: string;
  };
}

interface IAbout {
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  resumeUrl?: string;
}
export interface IProfileData {
  about: IAbout;
  skills: ISkillItem[];
  experience: IExperienceGroup[];
  education: IEducationItem[];
  contact: IContactItem;
}

const years = [
  ...Array.from({ length: 20 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return {
      label: year.toString(),
      value: year.toString(),
    };
  }),
];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => ({
  label: month,
  value: month,
}));

export default function ProfileForm() {
  const { enqueueSnackbar } = useSnackbar();
  const { user, loading: authLoading } = useAuth();
  const { data: dataProfile, error, isLoading } = useProfileData(!!user);
  const [profile, setProfile] = useState<IProfileData>({
    about: {
      name: '',
      role: '',
      bio: '',
      avatarUrl: '',
      resumeUrl: '',
    },
    skills: [
      {
        seq: 1,
        name: '',
        icon: '',
      },
    ],
    experience: [],
    education: [],
    contact: {
      email: {
        url: '',
        icon: '',
      },
      phone: {
        url: '',
        icon: '',
      },
      linkedin: {
        url: '',
        icon: '',
      },
      github: {
        url: '',
        icon: '',
      },
      lineId: {
        url: '',
        icon: '',
      },
    },
  });
  const [newSkillCategory, setNewSkillCategory] = useState('');
  const [newSkillItem, setNewSkillItem] = useState('');
  const [currentSkillItems, setCurrentSkillItems] = useState<string[]>([]);
  const [newEducation, setNewEducation] = useState<IEducationItem>({
    seq: 1,
    institution: '',
    faculty: '',
    major: '',
    startYear: '',
    endYear: '',
  });
  const [editingEducationIndex, setEditingEducationIndex] = useState<number | null>(null);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);

  const [newExperience, setNewExperience] = useState<IExperienceGroup>({
    seq: 1,
    company: '',
    role: '',
    description: '',
    startMonth: '',
    startYear: '',
    endMonth: '',
    endYear: '',
  });

  useEffect(() => {
    if (!dataProfile) return;
    setProfile(dataProfile);
  }, [dataProfile]);

  const onSubmitProfile = async () => {
    if (!user) return;

    await setDoc(doc(db, CONSTANTS.collecttion, CONSTANTS.document), profile, {
      merge: true,
    });
    enqueueSnackbar('Upload Success!', { variant: 'success' });
  };

  const handleAddSkillItem = () => {
    if (newSkillItem.trim()) {
      setCurrentSkillItems([...currentSkillItems, newSkillItem.trim()]);
      setNewSkillItem('');
    }
  };

  const handleDeleteSkils = (index: number) => {
    setCurrentSkillItems(currentSkillItems.filter((_, i) => i !== index));
  };

  const handleAddSkillGroup = () => {
    setProfile((prev) => ({
      ...prev,
      skills: [
        ...(prev.skills || []),
        {
          seq: prev.skills.length + 1,
          name: newSkillCategory,
          icon: '',
        },
      ],
    }));
  };

  const handleEducationSave = () => {
    const updated = profile?.education ? [...profile?.education] : [];
    if (editingEducationIndex !== null) updated[editingEducationIndex] = newEducation;
    else updated.push(newEducation);
    setProfile((p) => ({ ...p, education: updated }));
    setNewEducation({
      seq: 1,
      institution: '',
      faculty: '',
      major: '',
      startYear: '',
      endYear: '',
    });
    setEditingEducationIndex(null);
  };

  const handleExperienceSave = () => {
    const { company, role, description, startMonth, endMonth, seq, isCurrent } = newExperience;
    if (!company || !role || !description) {
      if (!isCurrent && (!startMonth || !endMonth)) {
        alert('Please fill in all fields.');
      }
      return;
    }

    setProfile((prev) => ({
      ...prev,
      experience: prev.experience
        ? [...prev.experience, { ...newExperience, seq: prev.experience.length + 1 }]
        : [{ ...newExperience, seq: 1 }],
    }));
    setNewExperience({
      seq: 1,
      company: '',
      role: '',
      description: '',
      startMonth: '',
      startYear: '',
      endMonth: '',
      endYear: '',
    });
  };

  const handleEditExperience = (index: number) => {
    const exp = profile?.experience[index];
    setNewExperience(exp as IExperienceGroup);
    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const handleDeleteExperience = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const handleAvatarDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file || !user) return;
    setIsAvatarUploading(true);
    const url = await uploadFileToStorageAndSaveUrl(file, user.uid, 'avatar');

    setProfile((preState) => ({
      ...preState,
      about: {
        ...preState.about,
        avatarUrl: url,
      },
    }));
    setIsAvatarUploading(false);
    enqueueSnackbar('Upload Success!', { variant: 'success' });
  };

  const handleResumeDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file || !user) return;
    setIsFileUploading(true);
    const url = await uploadFileToStorageAndSaveUrl(file, user.uid, 'resume');

    setProfile((preState) => ({
      ...preState,
      about: {
        ...preState.about,
        resumeUrl: url,
      },
    }));
    setIsFileUploading(false);
    enqueueSnackbar('Upload Success!', { variant: 'success' });
  };

  const { getRootProps: getAvatarRootProps, getInputProps: getAvatarInputProps } = useDropzone({
    onDrop: handleAvatarDrop,
    disabled: profile?.about.avatarUrl ? true : false,
    accept: { 'image/*': [] },
  });
  const { getRootProps: getResumeRootProps, getInputProps: getResumeInputProps } = useDropzone({
    onDrop: handleResumeDrop,
    disabled: profile?.about.resumeUrl ? true : false,
    accept: {
      'application/pdf': [],
    },
  });

  const deleteAvatarFromFirestore = async () => {
    if (user) {
      await deleteFileAndClearUrl(profile?.about.avatarUrl as string, 'avatarUrl');
      setProfile((p) => ({ ...p, about: { ...p.about, avatarUrl: '' } }));

      enqueueSnackbar('Delete Success!', { variant: 'success' });
    }
  };

  const deleteResumeFromFirestore = async () => {
    if (user) {
      await deleteFileAndClearUrl(profile?.about.resumeUrl!, 'resumeUrl');
      setProfile((p) => ({ ...p, about: { ...p.about, resumeUrl: '' } }));

      enqueueSnackbar('Delete Success!', { variant: 'success' });
    }
  };

  if (isLoading) return <Loading />;
  if (!dataProfile) return <div>ไม่พบข้อมูล</div>;

  if (!user) {
    return (
      <Container sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h5" gutterBottom>
          Sign in to edit your profile
        </Typography>
        <Button variant="contained" onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}>
          Sign in with Google
        </Button>
      </Container>
    );
  }

  const handleRemoveSkillGroup = (index: number) => {
    if (dataProfile)
      setProfile((prev) => ({
        ...prev,
        skills: profile?.skills.filter((s) => s.seq !== index),
      }));
  };

  const sortedExperience = profile?.experience && [...profile?.experience].sort((a, b) => b.seq - a.seq);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={2} mt={4}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>About</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box display={'flex'} justifyContent={'center'} flexDirection={'column'}>
              <Box gap={2} {...getAvatarRootProps()} sx={{ cursor: 'pointer' }}>
                <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                  {isAvatarUploading ? (
                    <CircularProgress size="30px" />
                  ) : (
                    <>
                      <Avatar
                        src={profile?.about.avatarUrl}
                        sx={{
                          width: 150,
                          height: 150,
                          borderRadius: '16px',
                          border: '2px solid white',
                        }}
                      />
                      <input {...getAvatarInputProps()} />
                      {!profile?.about.avatarUrl && (
                        <Typography variant="body2">Click or drag image to upload avatar</Typography>
                      )}
                    </>
                  )}
                </Box>
              </Box>
              {profile?.about.avatarUrl && (
                <Box width={'100%'} display={'flex'} justifyContent={'center'}>
                  <IconButton
                    sx={{ maxWidth: 'fit-content' }}
                    aria-label="delete"
                    size="large"
                    color="error"
                    onClick={deleteAvatarFromFirestore}
                  >
                    <HighlightOffRoundedIcon fontSize="inherit" />
                  </IconButton>
                </Box>
              )}
            </Box>
            <Stack spacing={2}>
              <InputText
                label={'Name'}
                value={profile?.about.name || ''}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    about: {
                      ...p.about,
                      name: e?.target.value as string,
                    },
                  }))
                }
              />

              <InputText
                label={'Role'}
                value={profile?.about.role || ''}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    about: {
                      ...p.about,
                      role: e?.target.value as string,
                    },
                  }))
                }
              />

              <RitchText
                onChange={(value) => {
                  setProfile((p) => ({
                    ...p,
                    about: {
                      ...p.about,
                      bio: value as string,
                    },
                  }));
                }}
                label="Bio"
                value={profile?.about.bio || ''}
              />

              <Grid container rowSpacing={1} columnSpacing={1}>
                <Grid size={6}>
                  <InputText
                    label="Email"
                    value={profile?.contact?.email.url || ''}
                    onChange={(e) =>
                      setProfile((p) => ({
                        ...p,
                        contact: {
                          ...p.contact,
                          email: {
                            ...p.contact.email,
                            url: e?.target.value || '',
                          },
                        },
                      }))
                    }
                  />
                </Grid>
                <Grid size={6}>
                  <InputText
                    label="Email Icon"
                    value={profile?.contact?.email.icon || ''}
                    onChange={(e) =>
                      setProfile((p) => ({
                        ...p,
                        contact: {
                          ...p.contact,
                          email: {
                            ...p.contact.email,
                            icon: e?.target.value || '',
                          },
                        },
                      }))
                    }
                  />
                </Grid>
              </Grid>

              <Grid container rowSpacing={1} columnSpacing={1}>
                <Grid size={6}>
                  <InputText
                    label="Phone"
                    value={profile?.contact?.phone.url || ''}
                    onChange={(e) =>
                      setProfile((p) => ({
                        ...p,
                        contact: {
                          ...p.contact,
                          phone: {
                            ...p.contact.phone,
                            url: e?.target.value || '',
                          },
                        },
                      }))
                    }
                  />
                </Grid>
                <Grid size={6}>
                  <InputText
                    label="Phone Icon"
                    value={profile?.contact?.phone.icon || ''}
                    onChange={(e) =>
                      setProfile((p) => ({
                        ...p,
                        contact: {
                          ...p.contact,
                          phone: {
                            ...p.contact.phone,
                            icon: e?.target.value || '',
                          },
                        },
                      }))
                    }
                  />
                </Grid>
              </Grid>

              <Grid container rowSpacing={1} columnSpacing={1}>
                <Grid size={6}>
                  <InputText
                    label="Github"
                    value={profile?.contact?.github.url || ''}
                    onChange={(e) =>
                      setProfile((p) => ({
                        ...p,
                        contact: {
                          ...p.contact,
                          github: {
                            ...p.contact.github,
                            url: e?.target.value || '',
                          },
                        },
                      }))
                    }
                  />
                </Grid>
                <Grid size={6}>
                  <InputText
                    label="Github Icon"
                    value={profile?.contact?.github.icon || ''}
                    onChange={(e) =>
                      setProfile((p) => ({
                        ...p,
                        contact: {
                          ...p.contact,
                          github: {
                            ...p.contact.github,
                            icon: e?.target.value || '',
                          },
                        },
                      }))
                    }
                  />
                </Grid>
              </Grid>

              <Grid container rowSpacing={1} columnSpacing={1}>
                <Grid size={6}>
                  <InputText
                    label="Linkedin"
                    value={profile?.contact?.linkedin.url || ''}
                    onChange={(e) =>
                      setProfile((p) => ({
                        ...p,
                        contact: {
                          ...p.contact,
                          linkedin: {
                            ...p.contact.linkedin,
                            url: e?.target.value || '',
                          },
                        },
                      }))
                    }
                  />
                </Grid>
                <Grid size={6}>
                  <InputText
                    label="Linkedin Icon"
                    // value={profile?.contact?.linkedin.icon || ''}
                    onChange={(e) =>
                      setProfile((p) => ({
                        ...p,
                        contact: {
                          ...p.contact,
                          linkedin: {
                            ...p.contact.linkedin,
                            icon: e?.target.value || '',
                          },
                        },
                      }))
                    }
                  />
                </Grid>
              </Grid>

              <Grid container rowSpacing={1} columnSpacing={1}>
                <Grid size={6}>
                  <InputText
                    label="Line"
                    value={profile?.contact?.lineId.url || ''}
                    onChange={(e) => {
                      setProfile((p) => ({
                        ...p,
                        contact: {
                          ...p.contact,
                          lineId: {
                            ...p.contact.lineId,
                            url: e?.target.value || '',
                          },
                        },
                      }));
                    }}
                  />
                </Grid>
                <Grid size={6}>
                  <InputText
                    label="Line Icon"
                    value={profile?.contact?.lineId.icon || ''}
                    onChange={(e) =>
                      setProfile((p) => ({
                        ...p,
                        contact: {
                          ...p.contact,
                          lineId: {
                            ...p.contact.lineId,
                            icon: e?.target.value || '',
                          },
                        },
                      }))
                    }
                  />
                </Grid>
              </Grid>
            </Stack>
            <Box display={'flex'} alignItems={'center'} width={'100%'}>
              {isFileUploading ? (
                <CircularProgress size="30px" />
              ) : (
                <Box
                  mt={3}
                  {...getResumeRootProps()}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                  }}
                >
                  <input {...getResumeInputProps()} />

                  {profile?.about.resumeUrl ? (
                    <Typography mt={1} fontSize={14}>
                      <a href={profile?.about.resumeUrl} target="_blank" rel="noopener noreferrer">
                        <Image src={'/assets/images/pdf_icon.png'} width={50} height={50} alt="" />
                      </a>
                    </Typography>
                  ) : (
                    <Typography variant="body2">Click or drag file to upload resume (.pdf)</Typography>
                  )}
                </Box>
              )}
              {profile?.about.resumeUrl ? (
                <IconButton aria-label="delete" size="large" color="error" onClick={deleteResumeFromFirestore}>
                  <HighlightOffRoundedIcon fontSize="inherit" />
                </IconButton>
              ) : null}
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Skills</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <Grid container rowSpacing={1} columnSpacing={1}>
                <Grid size={5}>
                  <Label>Skill Name</Label>
                </Grid>
                <Grid size={6}>
                  <Label>Skill Icon</Label>
                </Grid>
                {profile?.skills?.map((skill) => {
                  return (
                    <>
                      <Grid size={5}>
                        <InputText
                          placeholder="Name"
                          value={skill.name || ''}
                          onChange={(e) => {
                            const updateSkillName = profile?.skills.find((s) => s.seq === skill.seq);
                            if (updateSkillName) {
                              let _updateSkillName = { ...updateSkillName, name: e?.target.value || '' };
                              setProfile((p) => ({
                                ...p,
                                skills: p.skills.map((s) => (s.seq === skill.seq ? _updateSkillName : s)),
                              }));
                            }
                          }}
                        />
                      </Grid>
                      <Grid size={6}>
                        <InputText
                          placeholder="Icon"
                          value={skill.icon || ''}
                          onChange={(e) => {
                            const updateSkillIcon = profile?.skills.find((s) => s.seq === skill.seq);
                            if (updateSkillIcon) {
                              let _updateSkillIcon = { ...updateSkillIcon, icon: e?.target.value || '' };
                              setProfile((p) => ({
                                ...p,
                                skills: p.skills.map((s) => (s.seq === skill.seq ? _updateSkillIcon : s)),
                              }));
                            }
                          }}
                        />
                      </Grid>
                      {skill.seq !== 1 && (
                        <IconButton
                          sx={{ alignItems: 'flex-end', '&:hover': { backgroundColor: 'transparent' } }}
                          onClick={() => handleRemoveSkillGroup(skill.seq)}
                          color="error"
                          size="large"
                          style={{ justifyContent: 'flex-end' }}
                        >
                          <ClearRoundedIcon />
                        </IconButton>
                      )}
                    </>
                  );
                })}
              </Grid>
            </Stack>
            <Button onClick={handleAddSkillGroup} startIcon={<AddIcon />}>
              Add Skill
            </Button>
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Experience</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <InputText
                value={newExperience.company}
                onChange={(e: any) => setNewExperience((p) => ({ ...p, company: e.target.value }))}
                label="Company"
              />

              <InputText
                value={newExperience.role}
                onChange={(e: any) => setNewExperience((p) => ({ ...p, role: e.target.value }))}
                label="Role"
              />

              <RitchText
                onChange={(value) =>
                  setNewExperience((p) => ({
                    ...p,
                    description: value as string,
                  }))
                }
                label="Description"
                value={newExperience.description}
              />
              <Stack direction="row" spacing={2}>
                <InputSelect
                  label="Start Month"
                  options={months}
                  value={newExperience.startMonth}
                  onChange={(e) =>
                    setNewExperience((p) => ({
                      ...p,
                      startMonth: e.target.value,
                    }))
                  }
                />
                <InputSelect
                  label="Start Year"
                  options={years}
                  value={newExperience.startYear}
                  onChange={(e) =>
                    setNewExperience((p) => ({
                      ...p,
                      startYear: e.target.value,
                    }))
                  }
                />
              </Stack>
              <Stack>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newExperience.isCurrent}
                      onChange={(e) => {
                        setNewExperience((p) => ({
                          ...p,
                          isCurrent: e.target.checked,
                          ...(e.target.checked === true && {
                            endMonth: '',
                            endYear: '',
                          }),
                        }));
                      }}
                    />
                  }
                  label="Present"
                />
              </Stack>

              <Stack direction="row" spacing={2}>
                <InputSelect
                  label="End Month"
                  options={months}
                  value={newExperience.endMonth}
                  onChange={(e) =>
                    setNewExperience((p) => ({
                      ...p,
                      endMonth: e.target.value,
                    }))
                  }
                  isDisabled={newExperience.isCurrent}
                />
                <InputSelect
                  label="End Year"
                  options={years}
                  value={newExperience.endYear}
                  onChange={(e) =>
                    setNewExperience((p) => ({
                      ...p,
                      endYear: e.target.value,
                    }))
                  }
                  isDisabled={newExperience.isCurrent}
                />
              </Stack>
            </Stack>
            <Button sx={{ mt: 2 }} onClick={handleExperienceSave} startIcon={<SaveOutlinedIcon />}>
              Save Experience
            </Button>
            {sortedExperience?.map((exp, i) => {
              return (
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={1}
                  mt={2}
                  key={i}
                  p={2}
                  border={1}
                  borderColor="divider"
                  borderRadius={1}
                >
                  <Grid size={10} mt={2}>
                    <Typography fontWeight="bold">
                      {exp.role} - {exp.company}
                    </Typography>
                  </Grid>
                  <Grid size={2}>
                    <IconButton onClick={() => handleEditExperience(i)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteExperience(i)}>
                      <HighlightOffRoundedIcon />
                    </IconButton>
                  </Grid>
                  <Grid size={12}>
                    <Typography variant="body2" color="text.secondary">
                      {exp.startMonth} {exp.startYear} - {exp.isCurrent ? 'Present' : exp.endMonth + exp.endYear}
                    </Typography>
                  </Grid>
                  <Grid size={12}>
                    <div dangerouslySetInnerHTML={{ __html: exp.description }} />
                  </Grid>
                </Grid>
              );
            })}
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Education</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <InputText
                value={newEducation.institution}
                onChange={(e: any) =>
                  setNewEducation((p) => ({
                    ...p,
                    institution: e.target.value,
                  }))
                }
                label="Institution"
              />
              <InputText
                label="Faculty"
                value={newEducation.faculty}
                onChange={(e) =>
                  setNewEducation((p) => ({
                    ...p,
                    faculty: e?.target.value || '',
                  }))
                }
              />
              <InputText
                label="Major"
                value={newEducation.major}
                onChange={(e) =>
                  setNewEducation((p) => ({
                    ...p,
                    major: e?.target.value || '',
                  }))
                }
              />
              <Stack direction="row" spacing={2}>
                <InputSelect
                  label="Start Year"
                  options={years}
                  value={newEducation.startYear}
                  onChange={(e) => {
                    setNewEducation((p) => ({
                      ...p,
                      startYear: e.target.value,
                    }));
                  }}
                />
                <InputSelect
                  label="End Year"
                  options={years}
                  value={newEducation.endYear}
                  onChange={(e) => {
                    setNewEducation((p) => ({
                      ...p,
                      endYear: e.target.value,
                    }));
                  }}
                />
              </Stack>
            </Stack>
            <Button onClick={handleEducationSave} sx={{ mt: 1 }} startIcon={<SaveOutlinedIcon />}>
              Save Education
            </Button>
            {profile?.education?.map((edu, i) => (
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
                    color="error"
                    onClick={() =>
                      setProfile((p) => ({
                        ...p,
                        education: p.education.filter((_, j) => j !== i),
                      }))
                    }
                  >
                    <HighlightOffRoundedIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      </Stack>
      <Box textAlign="center" mt={4}>
        <Button variant="contained" size="large" onClick={onSubmitProfile}>
          Save All
        </Button>
      </Box>

      {/* <Snackbar
          open={!!successSection}
          autoHideDuration={3000}
          onClose={() => setSuccessSection(null)}
          message={`Updated ${successSection} section!`}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        /> */}
    </Container>
  );
}
