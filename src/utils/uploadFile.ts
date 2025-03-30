import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { storage, db } from "@/libs/firebase"; // ปรับ path ตามของคุณ
import { CONSTANTS } from "./constants";

export const uploadFileToStorageAndSaveUrl = async (
  file: File,
  userId: string,
  type: "avatar" | "resume"
) => {
  // 1. ระบุ path สำหรับเก็บใน Storage
  const storageRef = ref(storage, `${type}s/${userId}/${file.name}`);

  // 2. อัปโหลดไฟล์
  await uploadBytes(storageRef, file);

  // 3. ดึง URL
  const url = await getDownloadURL(storageRef);

  // 4. เก็บ URL ลง Firestore
  await setDoc(
    doc(db, CONSTANTS.collecttion, CONSTANTS.document),
    {
      about: {
        [`${type}Url`]: url
      }
    },
    { merge: true }
  );

  return url;
};
