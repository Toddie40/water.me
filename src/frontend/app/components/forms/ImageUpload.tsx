'use client';

import { useState, useRef, type ChangeEvent } from 'react';
import { cn } from '@/app/lib/cn';

export interface ImageUploadProps {
  value?: File | null;
  onChange: (file: File | null, wasCleared?: boolean) => void;
  currentImageUrl?: string | null;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  currentImageUrl,
  className,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [wasCleared, setWasCleared] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFile(file);
  };

  const handleFile = (file: File | null) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setWasCleared(false);
    } else {
      setPreview(null);
    }
    onChange(file, false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] || null;
    handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClear = () => {
    setPreview(null);
    setWasCleared(true);
    onChange(null, true);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const displayImage = wasCleared ? null : (preview || currentImageUrl);

  return (
    <div className={cn('w-full', className)}>
      <label className="block text-sm font-medium text-botanical-bark mb-1.5">
        Plant Image
      </label>

      {displayImage ? (
        <div className="relative">
          <img
            src={displayImage}
            alt="Plant preview"
            className="w-full h-40 object-cover rounded-lg border border-botanical-stone"
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1.5 bg-botanical-cream/90 rounded-lg text-botanical-danger hover:bg-white transition-colors"
            title="Remove image"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors',
            isDragging
              ? 'border-botanical-fern bg-botanical-fern/5'
              : 'border-botanical-stone hover:border-botanical-moss hover:bg-botanical-sand/50'
          )}
        >
          <svg
            className="w-10 h-10 text-botanical-soil mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm text-botanical-soil">
            Drop an image here or click to upload
          </p>
          <p className="text-xs text-botanical-soil/70 mt-1">
            PNG, JPG up to 5MB
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
