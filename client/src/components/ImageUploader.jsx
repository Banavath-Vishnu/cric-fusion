import { useState } from 'react';
import { Button } from 'flowbite-react';
import { uploadFile } from '../utils/firebaseStorage';

export default function ImageUploader({ onImageUploaded }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.match('image.*')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (limit to 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setError(null);
    setUploading(true);
    setUploadProgress(0);

    try {
      const downloadURL = await uploadFile(
        file, 
        'blog-images/', 
        (progress) => setUploadProgress(progress)
      );
      
      if (onImageUploaded) {
        onImageUploaded(downloadURL);
      }
      
      // Reset state
      setFile(null);
      setUploadProgress(0);
      
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          disabled={uploading}
        />
        
        <Button
          type="button"
          onClick={handleUpload}
          disabled={!file || uploading}
          gradientDuoTone="purpleToBlue"
          size="sm"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
      
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${uploadProgress}%` }}
          ></div>
          <p className="text-xs text-gray-500 mt-1">
            Uploading: {uploadProgress.toFixed(0)}%
          </p>
        </div>
      )}
      
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
      
      {file && (
        <p className="text-sm text-gray-600">
          Selected file: {file.name} ({(file.size / 1024).toFixed(1)} KB)
        </p>
      )}
    </div>
  );
} 