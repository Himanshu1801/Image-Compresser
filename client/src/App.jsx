import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setProcessedImage(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
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
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div>
      <h1>Image Processing App</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Process Image</button>
      {processedImage && <img src={`data:image/jpeg;base64,${processedImage}`} alt="Processed" />}
      {processedImage && <button onClick={handleDownload}>Download Processed Image</button>}
    </div>
  );
}

export default App
