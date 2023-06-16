

import React,{ useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Grid from '@mui/material/Grid'
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import axios from 'axios'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useAddress } from "@thirdweb-dev/react-core";
import { ConnectWallet } from "@thirdweb-dev/react";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Cover() {
  const [email, setEmail] = useState("");
  // const [walletAddress, setWalletAddress] = useState("");
  const walletAddress = useAddress();
  const [errorMessage, setErrorMessage] = useState("");
  const [showConnectButton, setShowConnectButton] = useState(false);

  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    if (event.target.value !== "") {
      setShowConnectButton(true);
    } else {
      setShowConnectButton(false);
    }
  };

  const [openSnake, setOpenSnake] = React.useState(false);

   

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnake(false);
  };

  const handleSubmit = async ()=>{
    axios.post("http://52.147.197.64:5001/user/login", { email, walletAddress })
    .then((response) => {
      console.log(response);
      // Handle successful login here
      localStorage.setItem('currentUser',JSON.stringify(response.data.user))
      navigate('/dashboard')
    })
    .catch((error) => {
      console.error(error);
      // Handle login error here
      setOpenSnake(true)
      setErrorMessage(error.response.data.message)
    });
  }

  const handleConnectMetamask = async() => {
    // TODO: Handle connecting to Metamask
    if (!window.ethereum) {
      alert("MetaMask not detected. Please install it.");
      return;
    }
  
    try {
      // Request accounts access
      await window.ethereum.request({ method: "eth_requestAccounts" });
  
      // Get the current account
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      const currentAccount = accounts[0];
  
      // Do something with the current account
      console.log(`Connected to MetaMask with account: ${currentAccount}`);
      setWalletAddress(currentAccount)
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <BasicLayout image={bgImage}>
    <Card>
      <MDBox
        variant="gradient"
        bgColor="info"
        borderRadius="lg"
        coloredShadow="info"
        mx={2}
        mt={-3}
        p={2}
        mb={1}
        textAlign="center"
      >
        <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
          Sign in
        </MDTypography>
        <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
         
        </Grid>
      </MDBox>
      <MDBox pt={4} pb={3} px={3}>
      <MDBox component="form" role="form">
        <MDBox mb={2}>
          <MDInput type="text" label="Name" variant="standard" fullWidth />
        </MDBox>
        <MDBox mb={2}>
          <MDInput
            type="email"
            label="Email"
            variant="standard"
            fullWidth
            value={email}
            onChange={handleEmailChange}
          />
        </MDBox>
        {showConnectButton && (
          <MDBox mb={2}>
            <ConnectWallet/>
          </MDBox>
        )}
        <MDBox display="flex" alignItems="center" ml={-1}>
          <Checkbox />
          <MDTypography
            variant="button"
            fontWeight="regular"
            color="text"
            sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
          >
            &nbsp;&nbsp;I agree the&nbsp;
          </MDTypography>
          <MDTypography
            component="a"
            href="#"
            variant="button"
            fontWeight="bold"
            color="info"
            textGradient
          >
            Terms and Conditions
          </MDTypography>
        </MDBox>
      
          <MDBox mt={4} mb={1}>
          <MDButton disabled={!email || !walletAddress } onClick={handleSubmit} variant="gradient" color="info" fullWidth>
            sign in
          </MDButton>
        </MDBox>
        
      
       
      </MDBox>
    </MDBox>
    </Card>
    {
      openSnake &&(
        <Snackbar open={openSnake} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
      )
    }
  </BasicLayout>
 
  );
}

export default Cover;

