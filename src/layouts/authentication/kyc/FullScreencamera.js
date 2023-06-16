import { useRef, useState, useEffect } from 'react';

const Camera = ({ onPictureTaken }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isTakingPicture, setIsTakingPicture] = useState(false);

  const handleStartCamera = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setStream(newStream)
    } catch (error) {
      console.error(error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleTakePicture = () => {
    setIsTakingPicture(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0);
        const picture = canvas.toDataURL();
        onPictureTaken(picture);
        setIsTakingPicture(false);
        stopCamera();
      }
    }
  };

  useEffect(() => {
    handleStartCamera();
    return () => {
      stopCamera();
    };
  }, [])

  return (
    <div className="camera-container">
      <video ref={videoRef} autoPlay muted className="camera-video"></video>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      <div className="camera-controls">
        <button className="camera-button" onClick={handleTakePicture}>
          <span className="sr-only">Take Picture</span>
        </button>
      </div>
    </div>
  );
};

export default Camera;
