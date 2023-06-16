import React, { useRef, useState } from 'react';


const Camera= ({ onPictureTaken }) => {
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

  React.useEffect(() => {
    handleStartCamera()
    return () => {
      stopCamera();
    };
  }, [])
  

  return (
    <div className="relative w-full h-full shadow-lg rounded-md overflow-hidden">
    <video ref={videoRef} autoPlay muted className="w-full h-full object-cover"></video>
    <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex justify-center">
      <button className="rounded-full bg-white w-16 h-16 shadow-xl border-4 border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500" onClick={handleTakePicture}>
        <span className="sr-only">Take Picture</span>
      </button>
      {/* <button className="px-4 py-2 text-white bg-blue-500 rounded-full shadow-md ml-4" onClick={handleStartCamera}>Start Camera</button> */}
    </div>
  </div>
  );
};

export default Camera;
