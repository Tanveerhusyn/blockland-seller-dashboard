import React, { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";

function Dropzone({onFileSelect}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  function handleFileSelect(event) {
    const file = event.target.files[0];

    // check that the selected file is an image
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);

      // create a preview URL for the selected file
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrl(previewUrl);
      // console.log("Hello",previewUrl)
      // onFileSelect(previewUrl)
      // const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        onFileSelect(reader.result);
      };
    } else {
      console.error("Selected file is not an image");
    }
  }

  function handleDeleteClick() {
    setSelectedFile(null);
    setPreviewUrl(null);
  }

  return (
    <div className="relative w-full" style={{height:'150px'}}>
      {previewUrl && (
        <div
          className="relative flex flex-col items-center justify-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative rounded-lg border-2 border-dashed border-gray-400 overflow-hidden">
            <img
              src={previewUrl}
              alt="Preview"
              className={`w-52 transition-opacity duration-200 ease-in-out ${
                isHovered ? "opacity-100" : "opacity-70"
              }`}
            />
            <IconButton
              onClick={handleDeleteClick}
              className={`absolute top-0 right-0 bg-gray-700 text-white transition-opacity duration-200 ease-in-out ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      )}
      {!previewUrl && (
        <div
          className="border-2 border-dashed border-gray-400 p-8 h-full text-center cursor-pointer"
        >
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <label htmlFor="fileInput" className="flex items-center justify-center">
            <CloudUploadIcon className="text-gray-400 mr-2" />
            Drag and drop an image or click here to select
          </label>
        </div>
      )}
    </div>
  );
}

export default Dropzone;
