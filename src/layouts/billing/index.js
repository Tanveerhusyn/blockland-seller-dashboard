 
import PropTypes from "prop-types";

import React,{useState,useEffect} from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardHeader from '@mui/material/CardHeader';
import MDButton from 'components/MDButton';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import './style.css'
import {useNavigate} from 'react-router-dom'
// Material Dashboard 2 React context
import { useMaterialUIController } from "context";
 
import { useNFTs, useContract,useAddress,useOwnedNFTs } from "@thirdweb-dev/react";

function Billing() {
  const [controller] = useMaterialUIController();
  const navigate = useNavigate()
  const { darkMode } = controller;

  const { contract } = useContract("0xfdad15EfA327910e379EDcAf0d9e09A32369eac1","nft-collection");
  const walletAddress = useAddress();
  const { data, isLoading, error } = useOwnedNFTs(contract,walletAddress);
  console.log("Half a second",data)
  // const [walletAddress, setWalletAddress] = useState('');
  const [rows, setRows] = useState([]);


  // useEffect(() => {
  //   // Retrieve walletAddress from localStorage
  //   const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  //   console.log('current',currentUser)
  //   if (currentUser) {
  //     setWalletAddress(currentUser.walletAddress);
  //   }
  // }, []);

//   useEffect(() => {
//     // Call API endpoint to retrieve documents for the walletAddress
//     if (walletAddress) {
//       fetch(`http://52.147.197.64:5001/user/userNFTs/${walletAddress}`)
//         .then((res) => res.json())
//         .then((data) => {
//           console.log("Received Data",data)
           
//           data && setRows((prevRows) =>
//   data
//     .filter((item) => item.token.tokenId && item.token.tokenId!= '') // Filter out items with status !== 'accepted'
//     .map((item, idx) => ({
//       id: item._id,
//       title: item?.metadata.propertyName,
//       description:
//         'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica',
//       imageUrl: item?.metadata.images[0],
//       imageAlt: 'A green iguana',
//       date: () => new Date(item.createdAt).toLocaleDateString('en-US'),
//     }))
//     .concat(prevRows)
// );

//         })
//         .catch((err) => console.error(err))
//     }
//   }, [walletAddress]);
  return (
    <DashboardLayout>
        <MDBox
                
                 
                mb={3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="#13131d"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  My NFTs
                </MDTypography>
              </MDBox>
    <Grid container spacing={2}>
    {!isLoading && data.map((_, index) => (
      <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
        <Card sx={{ maxWidth: 345 }}>
         
          <CardMedia
            component="img"
            alt="green iguana"
            height="200"
            width="300"
            sx={{maxWidth:'300px',maxHeight:'200px'}}
            image={_.metadata.image}
          />
          <CardContent>
            <Typography variant="caption">
              {_?.date || "12-06-2023"}
            </Typography>
            <Typography gutterBottom variant="h5" component="div">
              {_.metadata.name}
            </Typography>
            <p className="card-description" style={{
      display: '-webkit-box',
      '-webkit-box-orient': 'vertical',
      '-webkit-line-clamp': 3,
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }} color="text.secondary">
              {_.metadata.description}
            </p>
          </CardContent>
          <CardActions sx={{display:'flex',justifyContent:'space-between'}}>
            <Button size="small">Share</Button>
            <MDButton onClick={()=>{
              console.log("ID",_)
              navigate(`/nft/${_.metadata.id}`)
            }} variant="gradient" color="dark" >View</MDButton>
          </CardActions>
        </Card>
      </Grid>
    ))}
  </Grid>
  </DashboardLayout>
  );
}

 

export default Billing;


// import React, { useState } from "react";
// import axios from 'axios';

// function ImageVerifier() {
//   const [image1, setImage1] = useState("");
//   const [image2, setImage2] = useState("");

//   const handleImage1Change = (event) => {
//     const file = event.target.files[0];
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onloadend = () => {
//       setImage1(reader.result);
//     };
//   };

//   const handleImage2Change = (event) => {
//     const file = event.target.files[0];
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onloadend = () => {
//       setImage2(reader.result);
//     };
//   };
//   let data = {
    
//         "img1_path":image1,
//         "img2_path":image2
      
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     console.log("DATA",data)
//     await axios.post("http://3.238.41.255:5000/verify",data,{headers:{"Content-Type" : "application/json"}})
//      .then((res)=>{
// console.log("response:",res)
 
//      })
//      .catch((err)=>{
//        console.log(err)
//      })
//   };

//   return (
//     <form style={{marginLeft:'300px'}} onSubmit={handleSubmit}>
//       <div>
//         <label htmlFor="image1">Image 1:</label>
//         <input type="file" accept="image/*" onChange={handleImage1Change} />
//       </div>
//       <div>
//         <label htmlFor="image2">Image 2:</label>
//         <input type="file" accept="image/*" onChange={handleImage2Change} />
//       </div>
//       <button type="submit">Verify</button>
//     </form>
//   );
// }

// export default ImageVerifier;
