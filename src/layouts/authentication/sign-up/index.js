

// react-router-dom components
import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import axios from 'axios'
function SignUp() {
  const [formData, setFormData] = useState({});

  const navigate = useNavigate();
  const handleSubmit = async ()=>{
    axios.post("http://52.147.197.64:5001/user/login", { email, walletAddress })
    .then((response) => {
      console.log(response);
      // Handle successful login here
    })
    .catch((error) => {
      console.error(error);
      // Handle login error here
    });
  }

   


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
          Sign UP
        </MDTypography>
     
      </MDBox>
      <MDBox pt={4} pb={3} px={3}>
        <MDBox component="form" role="form" onSubmit={(e) => {
            e.preventDefault();
            localStorage.setItem('formData', JSON.stringify(formData));
            navigate('/authentication/kyc')

          }}>
        <MDBox mb={2}>
              <MDInput type="text" required label="Full Name" variant="standard" fullWidth value={formData.fullname || ''} onChange={(e) => setFormData({ ...formData, fullname: e.target.value })} />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="email" required label="Email" variant="standard" fullWidth value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="text" required label="Phone" variant="standard" fullWidth value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="text" required label="CNIC" variant="standard" fullWidth value={formData.cnic || ''} onChange={(e) => setFormData({ ...formData, cnic: e.target.value })} />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="text" required label="Address" variant="standard" fullWidth value={formData.address || ''} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            </MDBox>
         
          <MDBox mt={4} mb={1}>
         
            <MDButton
                type="submit"
                color="info"
                fullWidth
              >
               Proceed to KYC
              </MDButton>
          </MDBox>
          <MDBox mt={3} mb={1} textAlign="center">
            <MDTypography variant="button" color="text">
              Already have account?{" "}
              <MDTypography
                component={Link}
                to="/authentication/sign-in"
                variant="button"
                color="info"
                fontWeight="medium"
                textGradient
              >
                Sign in
              </MDTypography>
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  </BasicLayout>
  );
}

export default SignUp;
