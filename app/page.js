'use client';  // Add this as the first line
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false,
    onDrop: acceptedFiles => {
      setError('');
      setFile(acceptedFiles[0]);
    }
  });

  const handleConvert = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Conversion failed');

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'converted.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Word to PDF Converter</h1>
        
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 cursor-pointer
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
        >
          <input {...getInputProps()} />
          <p className="text-gray-600">
            {isDragActive ? 'Drop the file here' : 'Drag & drop a Word file, or click to select'}
          </p>
        </div>

        {file && (
          <div className="mb-6">
            <p className="text-gray-700 mb-2">Selected file: {file.name}</p>
            <button
              onClick={handleConvert}
              disabled={loading}
              className={`w-full py-2 px-4 rounded-lg font-medium text-white
                ${loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? 'Converting...' : 'Convert to PDF'}
            </button>
          </div>
        )}

        {error && <p className="text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
}