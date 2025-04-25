import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePhotograph, HiOutlineDocumentText, HiOutlineTag } from 'react-icons/hi';

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      setPublishError('Title and content are required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        setIsSubmitting(false);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
      setIsSubmitting(false);
    }
  };

  return (
    
    <div className='p-4 max-w-4xl mx-auto min-h-screen bg-gray-50 dark:bg-gray-900 '>
      <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'>
        <h1 className='text-center text-3xl my-6 font-bold text-gray-800 dark:text-white'>
          Create a New Post
        </h1>
        
        <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
          {/* Title Input */}
          <div className='flex flex-col gap-2'>
            <label htmlFor='title' className='text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2'>
              <HiOutlineDocumentText className='text-gray-500' />
              Title
            </label>
            <TextInput
              type='text'
              placeholder='Enter your post title'
              required
              id='title'
              className='w-full'
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          
          {/* Category Select */}
          <div className='flex flex-col gap-2'>
            <label htmlFor='category' className='text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2'>
              <HiOutlineTag className='text-gray-500' />
              Category
            </label>
            <Select
              id='category'
              className='w-full'
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value='uncategorized'>Select a category</option>
              <option value='javascript'>JavaScript</option>
              <option value='reactjs'>React.js</option>
              <option value='intalk'>inTalk</option>
            </Select>
          </div>
          
          {/* Image Upload */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2'>
              <HiOutlinePhotograph className='text-gray-500' />
              Featured Image
            </label>
            <div className='flex flex-col md:flex-row gap-4 items-center border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800'>
              <FileInput
                type='file'
                accept='image/*'
                onChange={(e) => setFile(e.target.files[0])}
                className='flex-1'
              />
              <Button
                type='button'
                gradientDuoTone='purpleToBlue'
                size='sm'
                onClick={handleUploadImage}
                disabled={imageUploadProgress !== null}
                className='w-full md:w-auto'
              >
                {imageUploadProgress ? (
                  <div className='w-12 h-12'>
                    <CircularProgressbar
                      value={imageUploadProgress}
                      text={`${imageUploadProgress || 0}%`}
                      strokeWidth={8}
                      styles={{
                        path: { stroke: '#6366f1' },
                        text: { fill: '#6366f1', fontSize: '24px' }
                      }}
                    />
                  </div>
                ) : (
                  'Upload Image'
                )}
              </Button>
            </div>
            {imageUploadError && (
              <Alert color='failure' className='mt-2'>
                {imageUploadError}
              </Alert>
            )}
            {formData.image && (
              <div className='mt-4'>
                <img
                  src={formData.image}
                  alt='Post preview'
                  className='w-full h-64 object-cover rounded-lg'
                />
              </div>
            )}
          </div>
          
          {/* Content Editor */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Content
            </label>
            <div className='bg-white rounded-lg'>
              <ReactQuill
                theme='snow'
                placeholder='Write your post content here...'
                className='h-80 mb-16'
                required
                onChange={(value) => setFormData({ ...formData, content: value })}
              />
            </div>
          </div>
          
          {/* Submit Button */}
          <div className='flex justify-end mt-6'>
            <Button 
              type='submit' 
              gradientDuoTone='purpleToPink'
              size='lg'
              disabled={isSubmitting}
              className='px-6'
            >
              {isSubmitting ? 'Publishing...' : 'Publish Post'}
            </Button>
          </div>
          
          {/* Error Alert */}
          {publishError && (
            <Alert className='mt-4' color='failure'>
              {publishError}
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
}