import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Uploadvideo.css';

const Uploadvideo = () => {
  const [logi, setlogi] = useState("0");
  const [lati, setlati] = useState("0");
  const [videoUrl, setVideoUrl] = useState("");
  // const [ipAddress, setIpAddress] = useState("http://localhost:4000/uploadvideo");
  const navigate = useNavigate();

  const latichange = (e) => {
    e.preventDefault();
    setlati(e.target.value);
  };
  const longichange = (e) => {
    e.preventDefault();
    setlogi(e.target.value);
  };

  const urlChange = (e) => {
    e.preventDefault();
    setVideoUrl(e.target.value);
  };
  const handlesubmit = async (e) => {
    e.preventDefault();

    // Check if either the video file or the video URL is filled
    if (!videoUrl) {
      alert('Please select a Cam IP to add.');
      return;
    }

    // Continue with the submission logic
    console.log('Longitude:', logi);
    console.log('Latitude:', lati);
    console.log('Video URL:', videoUrl);

    // Upload video and additional data
    const formData = new FormData();
    formData.append('video_url', videoUrl);
    formData.append('lati', lati);
    formData.append('logi', logi);

    const options = {
      method: 'POST',
      body: formData,
    };

    try {
      const res = await fetch('http://localhost:4000/uploadvideo', options);
      const data = await res.json();
      console.log(data);

    } catch (error) {
      console.error('Error uploading video:', error);
    }

    location.reload();
  };

  const containerStyle = {
    width: '100vw',  // Set the width to 25% of the viewport width
    height: '100vh', // Set the height to 25% of the viewport width (maintaining a 1:1 aspect ratio)
    border: '1px solid #ccc',
  };

  return (
    <div className='outer'>
      <h1 align='center'>Add camera</h1>
      <form className='form' onSubmit={handlesubmit}>
        <label>Enter Longitude: </label>
        <input type="text" value={logi} name='longi' onChange={longichange} required />
        <label>Enter Latitude: </label>
        <input type="text" value={lati} name='lati' onChange={latichange} required />
        <label>Enter Cam IP Address: </label>
        <input type="url" name='url' value={videoUrl} onChange={urlChange} placeholder='URL' />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Uploadvideo;
