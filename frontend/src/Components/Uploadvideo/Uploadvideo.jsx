import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Uploadvideo.css';

const Uploadvideo = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [logi, setlogi] = useState("0");
  const [lati, setlati] = useState("0");
  const [videoUrl, setVideoUrl] = useState("");
  // const [ipAddress, setIpAddress] = useState("http://localhost:4000/uploadvideo");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedVideo(file);

      // Generate a preview URL for the selected video
      const previewURL = URL.createObjectURL(file);
      setVideoPreview(previewURL);
    }
  };

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

  // const handleIpChange = (e) => {
  //   e.preventDefault();
  //   setIpAddress(e.target.value);
  // };

  const handlesubmit = async (e) => {
    e.preventDefault();

    // Check if either the video file or the video URL is filled
    if (!(selectedVideo || videoUrl)) {
      alert('Please select a video file or a Cam IP.');
      return;
    }

    // Continue with the submission logic
    console.log('Longitude:', logi);
    console.log('Latitude:', lati);
    console.log('Video File:', selectedVideo);
    console.log('Video URL:', videoUrl);

    // Upload video and additional data
    const formData = new FormData();
    formData.append('video_url', videoUrl);
    formData.append('video', selectedVideo);
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

  const stopStream = async (e) => {
    e.preventDefault();
    const apiUrl = 'http://localhost:4000/stop_stream';
    
    try {
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const containerStyle = {
    width: '100vw',  // Set the width to 25% of the viewport width
    height: '100vh', // Set the height to 25% of the viewport width (maintaining a 1:1 aspect ratio)
    border: '1px solid #ccc',
  };

  const iframeStyle = {
    width: '90vw',
    height: '90vh',
    border: '2px solid #5d5d5d',
  };

  return (
    <div className='outer'>
      <h1>Video Uploader</h1>
      <form className='form' onSubmit={handlesubmit}>
        <label>Enter Longitude: </label>
        <input type="text" value={logi} name='longi' onChange={longichange} required />
        <label>Enter Latitude: </label>
        <input type="text" value={lati} name='lati' onChange={latichange} required />
        <label>Select Video file: </label>
        <input type="file" accept="video/*" onChange={handleFileChange} />
        Or
        <label>Enter Cam IP Address: </label>
        <input type="url" name='url' value={videoUrl} onChange={urlChange} placeholder='URL' />
        <button type="submit">Submit</button>
        <button onClick={stopStream}>Stop Stream</button>
      </form>
      
      {selectedVideo && (
        <div className='preview'>
          <h2>Selected Video</h2>
          <p>File Name: {selectedVideo.name}</p>
          <p>File Size: {selectedVideo.size} bytes</p>

          {videoPreview && (
            <div>
              <h2>Video Preview</h2>
              <video width="400" controls>
                <source src={videoPreview} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      )}

      <div className='stream' style={containerStyle}>
      <h1>Stream</h1>
        <iframe
          title="Embedded Video"
          src="http://localhost:4000/uploadvideo"
          style={iframeStyle}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default Uploadvideo;
