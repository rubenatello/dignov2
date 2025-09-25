import React, { useState, useEffect } from 'react';
import { studioAPI, Image } from '../../lib/api';

interface ImageLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (image: Image) => void;
}

export default function ImageLibraryModal({ isOpen, onClose, onSelectImage }: ImageLibraryModalProps) {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'recent' | 'all' | 'upload'>('recent');
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    alt_text: '',
    source: '',
    source_url: '',
  });
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadImages();
    }
  }, [isOpen, selectedTab, searchQuery]);

  const loadImages = async () => {
    setLoading(true);
    try {
      if (selectedTab === 'recent') {
        const data = await studioAPI.getRecentImages();
        setImages(data);
      } else {
        const data = await studioAPI.getImages(searchQuery);
        setImages(data);
      }
    } catch (error) {
      console.error('Failed to load images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setLoading(true);
    try {
      const newImage = await studioAPI.uploadImage(file, {
        ...uploadData,
        alt_text: uploadData.alt_text || file.name,
      });
      
      setImages(prev => [newImage, ...prev]);
      setUploadData({
        title: '',
        description: '',
        alt_text: '',
        source: '',
        source_url: '',
      });
      setSelectedTab('recent');
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" onClick={onClose} />
        
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-900">Media Library</h2>
              <div className="flex bg-slate-100 rounded-lg p-1">
                {[
                  { key: 'recent', label: 'Recent' },
                  { key: 'all', label: 'Browse' },
                  { key: 'upload', label: 'Upload' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedTab(tab.key as any)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                      selectedTab === tab.key
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {selectedTab === 'upload' ? (
              <div className="space-y-6">
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <h3 className="text-lg font-semibold mb-2 text-slate-800">Drop your image here</h3>
                  <p className="text-slate-600 mb-4">or click to browse</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors text-sm font-medium"
                  >
                    Select Image
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Image title"
                    value={uploadData.title}
                    onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Alt text"
                    value={uploadData.alt_text}
                    onChange={(e) => setUploadData({ ...uploadData, alt_text: e.target.value })}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Photo credit/source"
                    value={uploadData.source}
                    onChange={(e) => setUploadData({ ...uploadData, source: e.target.value })}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="url"
                    placeholder="Source URL (optional)"
                    value={uploadData.source_url}
                    onChange={(e) => setUploadData({ ...uploadData, source_url: e.target.value })}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <textarea
                    placeholder="Caption/description"
                    value={uploadData.description}
                    onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                    className="col-span-2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedTab === 'all' && (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search images..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 pl-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                  {loading ? (
                    Array(8).fill(0).map((_, i) => (
                      <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                    ))
                  ) : (
                    images.map((image) => (
                      <div
                        key={image.id}
                        className="group cursor-pointer"
                        onClick={() => onSelectImage(image)}
                      >
                        <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden ring-transparent group-hover:ring-2 group-hover:ring-blue-500 transition-all duration-200">
                          <img
                            src={(image as any).image_url || image.image}
                            alt={image.alt_text}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        <div className="mt-2 px-1">
                          <p className="text-sm font-medium text-slate-900 truncate">{image.title}</p>
                          <p className="text-xs text-slate-500 truncate">{image.source}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}