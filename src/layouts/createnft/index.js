 import React,{useState,useEffect} from 'react';
// react-router-dom components
import { Link,useNavigate } from "react-router-dom";
import { ethers } from 'ethers';
// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import axios from 'axios'
// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";
import { useAddress } from "@thirdweb-dev/react";
import MarketplaceAddress from '../../contractsData/Marketplace-address.json';
import MarketplaceAbi from '../../contractsData/Marketplace.json';
import NFTAddress from '../../contractsData/NFT-address.json';
import NFTAbi from '../../contractsData/NFT.json';

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

function CreateNFT() {  
  
 

    const walletAddress =  useAddress();


  
    const [nft, setNFT] = useState();
    const [marketplace, setMarketplace] = useState();
    const [loading, setLoading] = useState(true);


    useEffect(()=>{
      const loadContracts = async () => {
        // Get deployed copies of contracts
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // Set signer
        const signer = provider.getSigner()
        const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer)
        setMarketplace(marketplace)
        const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
        setNFT(nft)
        setLoading(false)
      }
      if(walletAddress){
        loadContracts()
      }
    },[walletAddress]) 
    const [propertyData, setPropertyData] = useState({
        propertyName: "",
        propertyType: "",
        propertyAddress: "",
        propertyLocation: "",
        propertyOwner: "",
        propertyStatus: "",
        isApproved: false,
        price: 0,
        images: null
      });

      const navigate = useNavigate()
    
      const [userData, setUserData] = React.useState(() => {
        // Get form data from localStorage or use default values
        const storedUser = JSON.parse(localStorage.getItem("currentUser")) || {
          fullName: "",
          email: "",
          phone: "",
          cnic: "",
          address: "",
        };
    
        return storedUser;
      });

      const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPropertyData({
          ...propertyData,
          [name]: value
        });
      };

      const getLocation = () => {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            function(position) {
              const loca = `${position?.coords?.latitude},${position?.coords?.longitude}`;
              resolve(loca);
            },
            function(error) {
              reject(error);
            }
          );
        });
      }
      
    
      const handleImageChange = (event) => {
        setPropertyData({
          ...propertyData,
          images: event.target.files[0]
        });
      };


      const mint = async (uri) => {
        // const uri = `https://ipfs.infura.io/ipfs/${result.path}`
        // mint nft 
        await (await nft.mint(uri)).wait()
        // get tokenId of new nft 
        const id = await nft.tokenCount()
        console.log("TOKENID",id)
        // approve marketplace to spend nft
        // await (await nft.setApprovalForAll(marketplace.address, true)).wait()
        // // add nft to marketplace
        // const listingPrice = ethers.utils.parseEther(price.toString())
        // await (await marketplace.makeItem(nft.address, id, listingPrice)).wait()
      }

   

      const sendFileToIPFS = async (metadata) => {
          console.log(metadata)
        
            try {

              const url =  `https://api.pinata.cloud/pinning/pinFileToIPFS`

    const response = await axios.post(
      url,
      metadata,
      {
          maxContentLength: "Infinity",
          headers: {
            'pinata_api_key': `49140fed6ceaa567db53`,
            'pinata_secret_api_key': `4cc835fc906036d8128b663c0deba8a49be7ccc68567137f1269d8fe1d1b3468`,
            "Content-Type": "multipart/form-data"
        },
      }
  )

  console.log(response)


                 


            } catch (error) {
                console.log("Error sending File to IPFS: ")
                console.log(error)
            }
         
    }
    
      const handleSubmit = async(event) => {
        event.preventDefault();
        // code to submit the form data
         // create a new form data object
  const formData = new FormData();
  
  // add metadata to the form data
  const metadata = {...propertyData};
  metadata.walletAddress  = walletAddress;
  const currentLocation = await getLocation();
  console.log("Before submitting",currentLocation)
  metadata.propertyLocation = currentLocation;
  delete metadata.images;
  formData.append('metadata', JSON.stringify(metadata));

  // add images to the form data
  formData.append('images', propertyData.images);

  console.log(metadata)


  try {
    axios.post('http://52.147.197.64:5001/user/nft-requests', formData)
    .then(response => {
      // handle success
      console.log(response);
      const tokenURI = `https://gateway.pinata.cloud/ipfs/${response.data.ipfsHash}`;
      console.log("Token URI", tokenURI);
      // mint(tokenURI)
      navigate('/reports')
    })
    .catch(error => {
      // handle errors
      console.log(error.message)
    });
  } catch (error) {
    // handle errors
  }
      };
    
      return (
        <DashboardLayout>
          <Card sx={{mx:2}}>
            <MDBox
              variant="gradient"
              bgColor="#13131d"
              borderRadius="lg"
              coloredShadow="success"
              mx={1}
              mb={2}
              p={3}
               
              textAlign="center"
            >
              <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                Create Your NFT Now!
              </MDTypography>
              <MDTypography display="block" variant="button" color="white" my={1}>
                Enter your property details
              </MDTypography>
            </MDBox>
            <MDBox pt={4} pb={3} px={3}>
              <MDBox component="form" role="form" onSubmit={handleSubmit}>
                <MDBox mb={2}>
                  <MDInput
                    type="text"
                    label="Name"
                    variant="standard"
                    fullWidth
                    name="propertyName"
                    value={propertyData.propertyName}
                    onChange={handleInputChange}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    type="text"
                    label="Type"
                    variant="standard"
                    fullWidth
                    name="propertyType"
                    value={propertyData.propertyType}
                    onChange={handleInputChange}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    type="text"
                    label="Address"
                    variant="standard"
                    fullWidth
                    name="propertyAddress"
                    value={propertyData.propertyAddress}
                    onChange={handleInputChange}
                  />
                </MDBox>
               
                <MDBox mb={2}>
                  <MDInput
                    type="text"
                    label="Owner"
                    variant="standard"
                    fullWidth
                    name="propertyOwner"
                    value={propertyData.propertyOwner}
                    onChange={handleInputChange}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    type="text"
                    label="Status"
                    variant="standard"
                    fullWidth
                    name="propertyStatus"
                    value={propertyData.propertyStatus}
                    onChange={handleInputChange}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    type="number"
                    label="Price"
                    variant="standard"
                    fullWidth
                    name="price"
                    value={propertyData.price}
                    onChange={handleInputChange}
                  />
                </MDBox>
                <MDBox mb={2}>
              <MDInput
                type="file"
                label="Images"
                variant="standard"
                fullWidth
                name="images"
                onChange={handleImageChange}
              />
            </MDBox>
         
            <MDButton variant="contained" color="info" type="submit">
              Submit
            </MDButton>
          </MDBox>
        </MDBox>
      </Card>
    </DashboardLayout>
  );
}
export default CreateNFT;
 
 
