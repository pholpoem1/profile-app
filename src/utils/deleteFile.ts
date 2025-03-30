// utils/deleteFile.ts
import { db } from "@/libs/firebase";
import { doc, setDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { CONSTANTS } from "./constants";
// import { db } from '@/lib/firebase';

export const deleteFileAndClearUrl = async (
  fileUrl: string,
  key: "avatarUrl" | "resumeUrl"
) => {
  try {
    if (fileUrl) {
      const decodedUrl = decodeURIComponent(fileUrl.split("?")[0]);
      const pathStartIndex = decodedUrl.indexOf("/o/") + 3;
      const path = decodedUrl.substring(pathStartIndex);
      const cleanPath = path.replace(
        /^.*?(avatars|resumes)\//,
        (_, folder) => `${folder}/`
      );
      const fileRef = ref(getStorage(), cleanPath);
      await deleteObject(fileRef);
    }
  } catch (err) {
    console.warn(`Failed to delete file from storage (${key}):`, err);
  }

  await setDoc(
    doc(db, CONSTANTS.collecttion, CONSTANTS.document),
    {
      about: {
        [key]: ""
      }
    },
    { merge: true }
  );
};
