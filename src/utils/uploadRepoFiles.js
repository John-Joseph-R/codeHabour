import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";

export async function uploadRepoFiles(repoId, files) {
  for (const file of files) {
    const storageRef = ref(storage, `repos/${repoId}/${file.webkitRelativePath}`);
    await uploadBytes(storageRef, file);
  }
}
