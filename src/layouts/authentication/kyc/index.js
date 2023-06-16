import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import FullScreenCamera from "./FullScreenCamera";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import MDBox from "components/MDBox";
import axios from 'axios';
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";

import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';
 
import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';

import Dropzone from "./Dropzone";
import { ConnectWallet ,useAddress} from "@thirdweb-dev/react";
const steps = ["Upload Documents", "Take Live Selfie", "Review"];

export default function KnowYourCutomer() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [pic, setPic] = React.useState("");
  const [picture, setPicture] = React.useState(null);
  const [isMetaMaskConnected, setIsMetaMaskConnected] = React.useState(false);
  const walletAddress = useAddress()
  const navigate = useNavigate();


  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef();

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      '&:hover': {
        bgcolor: green[700],
      },
    }),

  };

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  // async function connectToMetaMask() {
  //   // check if MetaMask is installed
  //   if (window.ethereum) {
  //     try {
  //       // request user permission to connect to MetaMask
  //       await window.ethereum.request({ method: "eth_requestAccounts" });
  //       setIsMetaMaskConnected(true);

  //       // get the user's MetaMask address
  //       const accounts = await window.ethereum.request({ method: "eth_accounts" });
  //       setWalletAddress(accounts[0]);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   } else {
  //     console.error("MetaMask not installed");
  //   }
  // }

  const handlePictureTaken = (picture) => {
    setPicture(picture);
  };

  const handleTakeAnotherPicture = () => {
    setPicture(null);
  };
  const [completed, setCompleted] = React.useState({});

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };
  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const [imageUrl, setImageUrl] = React.useState(null);
  const [imageUrl2, setImageUrl2] = React.useState(null);
  const [verification, setVerification] = React.useState(null)

  const [formData, setFormData] = React.useState(() => {
    // Get form data from localStorage or use default values
    const storedFormData = JSON.parse(localStorage.getItem("formData")) || {
      fullName: "",
      email: "",
      phone: "",
      cnic: "",
      address: "",
    };

    return storedFormData;
  });

  function handleFileSelect(previewUrl) {
    console.log("IMAGE", previewUrl);
    setImageUrl(previewUrl);
  }
  function handleFileSelect2(previewUrl) {
    setImageUrl2(previewUrl);
  }

  let data = {
    img1_path: imageUrl,
    img2_path: picture,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccess(false);
    setLoading(true);
   

    setTimeout(()=>{
        setVerification({
          isVerified:true
        })
        setSuccess(true);
        setLoading(false);
    },5000)
    // await axios
    //   .post("http://52.147.197.64:5000/verify", data, {
    //     headers: { "Content-Type": "application/json" },
    //   })
    //   .then((res) => {
    //     console.log("response:", res);
    //     setVerification(res.data)
    //     setSuccess(res.data.verified=="True"?true:false);
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     setSuccess(false);
    //     setLoading(false);
    //   })
     
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };
  const handleRegister = () => {
    // Add walletAddress to form data
    const updatedFormData = {
      ...formData,
      walletAddress: walletAddress,
    };

    // Send updated form data to API
    fetch("http://52.147.197.64:5001/user/register", {
      method: "POST",
      body: JSON.stringify(updatedFormData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        navigate("/authentication/sign-in");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleReset = () => {
    setActiveStep(0);
    setVerification(null)
    setCompleted({});
  };

  // React.useEffect(() => {
  //   if(allStepsCompleted()){
  //     router.push('/dashboard')
  //   }

  // }, [allStepsCompleted])

  return (
    <>
      <div className="flex justify-center items-center w-full bg-gray-100 h-screen">
        <MDBox sx={{ height: "90%" }}>
          <Stepper
            sx={{
              ".MuiStepConnector-root": {
                top: 0,
              },
              ".MuiStepConnector-root span": {
                borderColor: "white",
              },

              ".MuiSvgIcon-root": {
                borderRadius: "50%",
                border: "1px solid #1976d2",
              },
              ".MuiSvgIcon-root:not(.Mui-completed)": {
                color: "white",
              },
              ".MuiStepIcon-text:not(.Mui-completed)": {
                fill: "white",
              },
              ".MuiStepIcon-text": {
                fill: "#1976d2",
                fontWeight: 500,
              },
              ".Mui-completed": {
                fill: "green",
              },
              ".MuiSvgIcon-root.Mui-active": {
                color: "#1976d2",
                padding: "3px",
                borderRadius: "50%",
                border: "1px solid #1976d2",
                marginY: "-3px",
              },
              ".Mui-active .MuiStepIcon-text": {
                fill: "white",
              },
            }}
            nonLinear
            activeStep={activeStep}
          >
            {steps.map((label, index) => (
              <Step key={label} completed={completed[index]}>
                <StepButton color="info" onClick={handleStep(index)}>
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
          <div className="h-full">
            {allStepsCompleted() ? (
              <div
                className="flex justify-center items-center flex-col gap-8"
                style={{ height: "100%" }}
              >
                <img
                  style={{ height: "100px" }}
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/800px-MetaMask_Fox.svg.png"
                />
                <div>
                  <Typography variant="h6" gutterBottom>
                    Form Data:
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Full Name:</strong> {formData.fullName}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Email:</strong> {formData.email}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Phone:</strong> {formData.phone}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>CNIC:</strong> {formData.cnic}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Address:</strong> {formData.address}
                  </Typography>
                </div>
                <ConnectWallet/>

                <MDBox sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <MDBox sx={{ flex: "1 1 auto" }} />
                  <MDButton color="danger" sx={{ mx: 2 }} onClick={handleReset}>
                    Reset
                  </MDButton>
                  <MDButton color="info" onClick={handleRegister}>
                    Register
                  </MDButton>
                </MDBox>
              </div>
            ) : (
              <div style={{ height: "100%" }} className="">
                <div sx={{ mt: 2, mb: 1, py: 1, height: "100%" }}>
                  {activeStep == 0 ? (
                    <div className="flex flex-col p-4 gap-6 mt-2 h-full">
                      <div>
                        <p className="py-2 text-gray-700 text-sm">Upload CNIC Front:</p>
                        <Dropzone onFileSelect={handleFileSelect} />
                      </div>
                      <div>
                        <p className="py-2 text-gray-700 text-sm">Upload CNIC Back:</p>
                        <Dropzone onFileSelect={handleFileSelect2} />
                      </div>
                    </div>
                  ) : activeStep == 1 ? (
                    <div className="p-8 h-[400px]">
                      {picture ? (
                        <div className="w-full h-full shadow-lg rounded relative">
                          <img
                            src={picture}
                            alt="Taken Picture"
                            className="w-full h-full object-cover rounded mb-4"
                          />
                          <button
                            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 btn btn-outline btn-info"
                            onClick={handleTakeAnotherPicture}
                          >
                            Take Another Picture
                          </button>
                        </div>
                      ) : (
                        <div className="w-full h-full shadow-lg rounded">
                          <FullScreenCamera onPictureTaken={handlePictureTaken} />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col p-4 gap-6 mt-2 h-full">
                      <div>
                        <p className="py-2 text-gray-700">Selected Images:</p>
                        {imageUrl && picture && (
                          <div className="border-dotted border-4 rounded-md p-4">
                            <div className="flex justify-between">
                              <img
                                src={imageUrl}
                                alt="Selected"
                                className="max-w-xs rounded-md mr-1"
                              />
                              <img src={picture} alt="Selected" className="max-w-xs rounded-md" />
                            </div>
                          </div>
                        )}
                        {!imageUrl || (!picture && <p>No image selected or captured yet.</p>)}
                      </div>
                      <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                      <MDBox sx={{ m: 1, position: 'relative' }}>
        <MDButton
          variant="gradient"
          color={`${success?"success":"info"}`}
          sx={buttonSx}
          disabled={loading}
          onClick={handleSubmit}
        >
          {verification==null?"Verify":success==true?"Verified":loading?"Verifying":"Could not recognize. Retry"}
        </MDButton>
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              color: green[500],
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </MDBox>
     {
      verification!=null && !success && <MDButton color="secondary" sx={{ mx: 2 }} onClick={handleReset}>
      Reset
    </MDButton>
     }
                      </div>
                    </div>
                  )}
                </div>
                <MDBox sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <MDButton
                    color="info"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </MDButton>
                  <MDBox sx={{ flex: "1 1 auto" }} />
                  {/* disabled={verification!=null && !success} */}
                  <MDButton  color="info" onClick={handleComplete} sx={{ mr: 1 }}>
                    Next
                  </MDButton>
                </MDBox>
              </div>
            )}
          </div>
        </MDBox>
      </div>
    </>
  );
}
