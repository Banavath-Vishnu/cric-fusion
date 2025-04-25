import { useState } from 'react';
import { Button, TextInput, Textarea } from 'flowbite-react';
import ImageUploader from './ImageUploader';

export default function BlogPostForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
    image: initialData.image || '',
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleImageUploaded = (imageUrl) => {
    setFormData({
      ...formData,
      image: imageUrl
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">Title</label>
        <TextInput
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">Content</label>
        <Textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows={6}
        />
      </div>
      
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">Featured Image</label>
        <ImageUploader onImageUploaded={handleImageUploaded} />
        
        {formData.image && (
          <div className="mt-2">
            <p className="text-sm mb-2">Preview:</p>
            <img 
              src={formData.image} 
              alt="Preview" 
              className="max-h-40 rounded-md shadow-sm" 
            />
          </div>
        )}
      </div>
      
      <Button type="submit" gradientDuoTone="purpleToPink">
        {initialData.id ? 'Update Post' : 'Create Post'}
      </Button>
    </form>
  );
} 