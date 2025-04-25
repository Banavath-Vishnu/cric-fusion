import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";

const storage = getStorage(app);

/**
 * Uploads a file to Firebase Storage and returns the download URL
 * @param {File} file - The file to upload
 * @param {string} folderPath - The folder path in storage (e.g., 'blog-images/')
 * @param {function} progressCallback - Optional callback for upload progress
 * @returns {Promise<string>} The download URL of the uploaded file
 */
export const uploadFile = (file, folderPath = "", progressCallback = null) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }

    // Create a unique filename
    const timestamp = new Date().getTime();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}${encodeURIComponent(file.name)}`;
    
    // Create storage reference
    const storageRef = ref(storage, `${folderPath}${fileName}`);
    
    // Upload file
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Register observers on upload task
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Upload progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (progressCallback) {
          progressCallback(progress);
        }
      },
      (error) => {
        // Upload failed
        console.error("Upload failed:", error);
        reject(error);
      },
      () => {
        // Upload completed successfully, get download URL
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            resolve(downloadURL);
          })
          .catch((error) => {
            reject(error);
          });
      }
    );
  });
};

/**
 * Gets the download URL for a file in Firebase Storage
 * @param {string} filePath - The full path to the file in storage
 * @returns {Promise<string>} The download URL
 */
export const getFileUrl = async (filePath) => {
  try {
    const fileRef = ref(storage, filePath);
    return await getDownloadURL(fileRef);
  } catch (error) {
    console.error("Error getting file URL:", error);
    throw error;
  }
}; 