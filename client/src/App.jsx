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
    setProcessedImage(null); // Clear previously displayed image when a new file is selected
  };

  const handleUpload = async () => {
    if (!selectedFile) return; // Prevent processing if no file is selected

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      const imageBase64 = response.data.image;
      setProcessedImage(`data:image/jpeg;base64,${imageBase64}`);
    } catch (error) {
      console.error('Error uploading file:', error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get('http://localhost:5000/download', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'processed_image.jpg');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading image:', error.response?.data || error);
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