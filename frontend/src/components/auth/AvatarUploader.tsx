import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, UserCircle2 } from 'lucide-react';
import { cn } from '@/utils';

interface AvatarUploaderProps {
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  label?: string;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  onChange,
  error,
  label = 'Profile Photo',
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File | null) => {
    if (!file) {
      setPreview(null);
      onChange(null);
      return;
    }
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onChange(file);
  }, [onChange]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0] ?? null;
    handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] ?? null);
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full space-y-1 text-left">
      {label && (
        <label className="block text-[13px] font-semibold text-neutral-700 dark:text-[#CBD5E1]">
          {label}
          <span className="ml-1.5 text-neutral-400 font-normal text-[12px]">(optional)</span>
        </label>
      )}

      <div
        className={cn(
          'avatar-upload-zone flex items-center justify-start gap-3 rounded-xl p-3 transition-all',
          dragOver && 'drag-over'
        )}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload profile photo"
        onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
      >
        {/* Preview circle */}
        <div className="relative inline-flex overflow-visible">
        <div className="relative w-14 h-14 rounded-full overflow-hidden bg-neutral-100 dark:bg-[#1E293B] border-2 border-neutral-200 dark:border-[#334155] flex items-center justify-center shrink-0">
          {preview ? (
            <img src={preview} alt="Avatar preview" className="w-full h-full object-cover" />
          ) : (
            <UserCircle2 className="w-8 h-8 text-neutral-350 dark:text-[#94A3B8]" />
          )}
        </div>
        {preview && (
          <button
            type="button"
            onClick={clear}
            aria-label="Remove photo"
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

        {/* CTA */}
        <div className="min-w-0 text-left">
          <div className="flex items-center gap-1.5 text-[13px] font-semibold text-blue-700 dark:text-[#93C5FD]">
            <Upload className="w-3.5 h-3.5" />
            <span>{preview ? 'Change photo' : 'Upload photo'}</span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
            Drag & drop or click · PNG, JPG up to 2 MB
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
        aria-hidden="true"
      />

      {error && (
        <p role="alert" className="text-[12px] font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default AvatarUploader;
