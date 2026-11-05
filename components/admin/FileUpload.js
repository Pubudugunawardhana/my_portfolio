'use client';

import { useRef, useState } from 'react';
import { FileText, Loader2, Trash2, UploadCloud } from 'lucide-react';

const MAX_MB = 10;

async function uploadToCloudinary(file, resourceType) {
  const signRes = await fetch('/api/upload', { method: 'POST' });
  const sign = await signRes.json();
  if (!signRes.ok) throw new Error(sign.message || 'Could not start upload');

  const body = new FormData();
  body.append('file', file);
  body.append('api_key', sign.apiKey);
  body.append('timestamp', sign.timestamp);
  body.append('signature', sign.signature);
  body.append('folder', sign.folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${sign.cloudName}/${resourceType}/upload`, { method: 'POST', body });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Upload failed');
  return data.secure_url;
}

// Uploads straight to Cloudinary and reports the resulting URL via onChange.
export function FileUpload({ value, onChange, kind = 'image', aspect = 'aspect-video', label = 'Upload image' }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const isImage = kind === 'image';

  const handleFile = async (file) => {
    if (!file) return;
    setError(null);
    if (file.size > MAX_MB * 1024 * 1024) return setError(`File must be under ${MAX_MB} MB`);
    setBusy(true);
    try {
      onChange(await uploadToCloudinary(file, isImage ? 'image' : 'raw'));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`relative overflow-hidden rounded-xl border border-dashed border-border bg-bg ${isImage ? aspect : ''}`}
      >
        {value && isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : value ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 text-sm hover:text-accent">
            <FileText size={20} /> <span className="truncate">View current file</span>
          </a>
        ) : (
          <button type="button" onClick={() => inputRef.current?.click()} className="flex h-full min-h-28 w-full flex-col items-center justify-center gap-2 p-6 text-sm text-muted hover:text-fg">
            <UploadCloud size={22} /> {label}
            <span className="text-xs">or drag &amp; drop · max {MAX_MB} MB</span>
          </button>
        )}
        {busy && (
          <div className="absolute inset-0 grid place-items-center bg-bg/80 text-sm"><Loader2 className="animate-spin" /></div>
        )}
      </div>

      {value && (
        <div className="mt-2 flex gap-2">
          <button type="button" onClick={() => inputRef.current?.click()} className="btn-ghost px-3 py-1.5 text-xs"><UploadCloud size={14} /> Replace</button>
          <button type="button" onClick={() => onChange('')} className="btn-ghost px-3 py-1.5 text-xs text-red-500"><Trash2 size={14} /> Remove</button>
        </div>
      )}
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        hidden
        accept={isImage ? 'image/*' : '.pdf,application/pdf'}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
