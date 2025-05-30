import useSWR from 'swr';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/libs/firebase';
import { IProfileData } from '@/pages/myadminmanager';
import { CONSTANTS } from '@/utils/constants';

const fetchProfile = async (): Promise<IProfileData | null> => {
  const snap = await getDoc(doc(db, CONSTANTS.collecttion, CONSTANTS.document));
  if (snap.exists()) return snap.data() as IProfileData;
  return null;
};

export const useProfileData = (isLogin: boolean) => {
  return useSWR(isLogin ? 'profile-data' : null, fetchProfile);
};
