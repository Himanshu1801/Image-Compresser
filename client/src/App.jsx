import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('dark');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setProcessedImage(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true);

    try {
      const response = await axios.post('https://image-compresser.onrender.com/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      if (response.data.image) {
        const imageBase64 = response.data.image;
        setProcessedImage(`data:image/jpeg;base64,${imageBase64}`);
      } else {
        alert("Processing failed. No image returned.")
      }

    } catch (error) {
      console.error('Error uploading file:', error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const response = await axios.post('https://image-compresser.onrender.com/download', formData, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'processed_image.jpg');
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      setSelectedFile(null);
      setProcessedImage(null);

      document.querySelector('input[type="file"]').value = "";
    } catch (error) {
      console.error('Error downloading image:', error.response?.data || error);
      alert("Error downloading the image.");
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="container">
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      <h1>Image Processing App</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile || loading}>
        {loading ? 'Processing...' : 'Process Image'}
      </button>
      {processedImage && (
        <div>
          <img src={processedImage} alt="Processed" />
          <button className="download-button" onClick={handleDownload}>
            Download Processed Image
          </button>
        </div>
      )}
    </div>
  );
}

export default App;