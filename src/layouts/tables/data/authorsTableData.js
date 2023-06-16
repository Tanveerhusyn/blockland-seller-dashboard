import React, { useState, useEffect } from "react";
// Material Dashboard 2 React components

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import VideocamIcon from "@mui/icons-material/Videocam";
import MDBadge from "components/MDBadge";
import { Web3Button, useContract, useCreateAuctionListing,useMintNFT, useCreateDirectListing,useNFT } from "@thirdweb-dev/react";
import {MARKETPLACE_ADDRESS,NFT_COLLECTION_ADDRESS} from "../../../assets/constants"
import axios from 'axios';
import { Pending } from "@mui/icons-material";
import { useAddress } from "@thirdweb-dev/react";
import MarketplaceAddress from "../../../contractsData/Marketplace-address.json";
import MarketplaceAbi from "../../../contractsData/Marketplace.json";
import NFTAddress from "../../../contractsData/NFT-address.json";
import NFTAbi from "../../../contractsData/NFT.json";
import { ethers } from "ethers";
import {ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'
// Images
import team2 from "assets/images/team-2.jpg";
import PopupModel from "../../../examples/TextEditor";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function randomID(len) {
  let result = "";
  if (result) return result;
  var chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}
  const roomID = 'Tanveer';
const userName = randomID(5);
const userID = randomID(5);
const serverSecret = "1a04908bae6df51325fae5b21619ac21";
var zp;
 
let myMeeting = async (element) => {
  const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
    831772000,
    serverSecret,
    roomID,
    userID,
    userName
  );
  // create instance object from token
  zp = ZegoUIKitPrebuilt.create(kitToken);

  // start the call
  zp.joinRoom({
    container: element,
    
    scenario: {
      mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
    },
  });

   
};

export default function data() {
  // const [walletAddress, setWalletAddress] = useState('');
  const [rows, setRows] = useState([]);

  const [nft, setNFT] = useState();
  const [loading, setLoading] = useState(true);
  const walletAddress = useAddress();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { contract: marketplace } = useContract(MARKETPLACE_ADDRESS, "marketplace-v3");

  const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS);

  const { mutateAsync: mintNft, isLoading, error } = useMintNFT(nftCollection);


  const { mutateAsync: createDirectListing } = useCreateDirectListing(marketplace);
  const { mutateAsync: createAuctionListing } = useCreateAuctionListing(marketplace);

 
  async function checkAndProvideApproval() {
    
          const txResult =   await nftCollection.erc721.setApprovalForAll(
  MARKETPLACE_ADDRESS, // The wallet address to approve
  true, // Whether to approve (true) or remove approval (false)
);
          console.log("APPROVALLLLLL",txResult)

          if (txResult) {
              console.log("Approval provided");
          }
      
      return true;
  }
  const currentTimestamp = new Date().getTime();
  const endTimestamp = currentTimestamp + (24 * 60 * 60 * 1000); // Adding 24 hours in milliseconds
  
  async function handleSubmissionAuction(data) {
    await checkAndProvideApproval();
    const txResult = await createAuctionListing({
        assetContractAddress:NFT_COLLECTION_ADDRESS,
        tokenId: {
          _hex:data.token.tokenId,
          _isBigNumber:true
        },
        buyoutBidAmount: "1",
        minimumBidAmount: "0.3",
        startTimestamp: currentTimestamp,
        endTimestamp: endTimestamp,
    });

    return txResult;
}
  
 
  

 
  

  useEffect(() => {
    
    // Call API endpoint to retrieve documents for the walletAddress
    if (walletAddress) {
      fetch(`http://52.147.197.64:5001/user/userNFTs/${walletAddress}`)
        .then((res) => res.json())
        .then((data) => {
      
          data &&
            setRows((prevRows) =>
              data
                .map((item) => ({
                  author: <Author item={item} />,
                  status: (
                    <div
                      style={{
                        backgroundColor: "transparent",

                        padding: "5px 15px",
                        borderRadius: "10px",

                        border: `${
                          item.status == "pending" ? "1px solid red" : "1px solid #009933"
                        }`,
                        color: `${item.status == "pending" ? "red" : "#009933"}`,
                      }}
                    >
                      {item.status}
                    </div>
                  ),

                  employed: (
                    <div
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid #006bb3",
                        color: "#006bb3",
                        padding: "5px 15px",
                        borderRadius: "10px",
                      }}
                    >
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  ),
                 
                  call: (
                  <>
                   <Web3Button
                         style={{background:"#13131d",color:'white'}}
                            isDisabled={!item.mint}
                            contractAddress={MARKETPLACE_ADDRESS}
                            action={async () => {
                                return await handleSubmissionAuction(item)
                            }}
                            onSuccess={(txResult) => {
                               console.log("LISTED",txResult)
                            }}
                        >Create Auction Listing</Web3Button>
                    {/* <MDButton
                      style={{display:`${item.call?.callLink!='' && item.status!="accepted"?"block":"none"}`,marginTop:'15px'}}
                      component="a"
                      href={item.call?.callLink}
                      target="_blank"      
                      onClick={handleOpen}
                      color={item.status == "accepted" ? "dark" : "success"}
                    >
                      {item ? (
                        <>
                          <VideocamIcon sx={{ width: 25, height: 25, mr: 2 }} />

                          <span className="flex flex-row gap-2 justify-center items-center">
                            <span>{item.call?.callDate}</span>
                            <span>{item.call?.callTime}</span>
                          </span>
                        </>
                      ) : (
                        <Pending sx={{ width: 22, height: 22 }} />
                      )}
                    </MDButton> */}
                
                  </>
                  ),
                  sign: (
                    <Web3Button
                    contractAddress={NFT_COLLECTION_ADDRESS}
                    isDisabled={item.mint}
                    action={() =>
                      mintNft({
                        metadata: {
                          name: item.metadata.propertyName,
                          description: item.metadata.propertyType,
                          image: item.metadata.images[0],
                          owner: item.metadata.propertyOwner,
                          location: item.metadata.propertyAddress // Accepts any URL or File type
                        },
                        to: walletAddress, // Use useAddress hook to get current wallet address
                      })
                    }

                    onSuccess={(txResult) => {
                      console.log("TXRESULT",txResult)
                      const strVal = txResult.id._hex;

                      axios.patch(`http://52.147.197.64:5001/agent/updateField/${item._id}`, {
                        mint:true,
                        hexValue:strVal
                      })
                      .then(response => {
                        console.log(response)
                      })
                      .catch(error => {
                        // handle errors
                        console.log(error.message)
                      });
                  }}
                  >
                    Mint NFT
                  </Web3Button>
                    // <MDButton color= "dark"
                    // style={{display:`${item.status=='accepted'?"block":"none"}`,marginTop:'5px'}}
                    // onClick={() => handleSign(item.metadata.hash,item._id,item.metadata.price)}>Sign NFT</MDButton>
                  ),
                }))
                .concat(prevRows)
            );
        })
        .catch((err) => console.error(err));
    }
  }, [walletAddress]);
  const Author = ({ item }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <Card sx={{ display: "flex" }}>
        <div
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CardMedia
            component="img"
            sx={{ width: 151 }}
            image={item?.metadata.images[0]}
            alt="Live from space album cover"
          />
          <CardContent sx={{ flex: "1 0 auto" }}>
            <MDTypography component="div" variant="h5">
              {item?.metadata.propertyName}
            </MDTypography>
            <MDTypography variant="subtitle1" color="text.secondary" component="div">
              {item?.metadata.propertyAddress}
            </MDTypography>
          </CardContent>
        </div>
      </Card>
    </MDBox>
  );

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );


  

  return {
    columns: [
      { Header: "author", accessor: "author", width: "28%", align: "left" },
      { Header: "Status", accessor: "status", align: "left" },
      { Header: "Published", accessor: "employed", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
      { Header: "Scheduled Call", accessor: "call", align: "center" },
      { Header: "Sign NFT", accessor: "sign", align: "center" },
    ],
    rows,
    // rows: [
    //   {
    //     author: <Author image={team2} name="John Michael" email="john@creative-tim.com" />,
    //     function: <Job title="Manager" description="Organization" />,
    //     status: (
    //       <MDBox ml={-1}>
    //         <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
    //       </MDBox>
    //     ),
    //     employed: (
    //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //         23/04/18
    //       </MDTypography>
    //     ),
    //     action: (
    //       <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
    //        <PopupModel author = { <Author image={team2} name="John Michael" email="john@creative-tim.com" />}/>
    //       </div>
    //     ),
    //   },
    //   {
    //     author: <Author image={team3} name="Alexa Liras" email="alexa@creative-tim.com" />,
    //     function: <Job title="Programator" description="Developer" />,
    //     status: (
    //       <MDBox ml={-1}>
    //         <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
    //       </MDBox>
    //     ),
    //     employed: (
    //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //         11/01/19
    //       </MDTypography>
    //     ),
    //     action: (
    //       <>
    //         <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
    //        <PopupModel author = { <Author image={team2} name="John Michael" email="john@creative-tim.com" />}/>
    //       </div>
    //       </>
    //     ),
    //   },
    //   {
    //     author: <Author image={team4} name="Laurent Perrier" email="laurent@creative-tim.com" />,
    //     function: <Job title="Executive" description="Projects" />,
    //     status: (
    //       <MDBox ml={-1}>
    //         <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
    //       </MDBox>
    //     ),
    //     employed: (
    //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //         19/09/17
    //       </MDTypography>
    //     ),
    //     action: (
    //       <>
    //         <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
    //        <PopupModel author = { <Author image={team2} name="John Michael" email="john@creative-tim.com" />}/>
    //       </div>
    //       </>
    //     ),
    //   },
    //   {
    //     author: <Author image={team2} name="John Michael" email="john@creative-tim.com" />,
    //     function: <Job title="Manager" description="Organization" />,
    //     status: (
    //       <MDBox ml={-1}>
    //         <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
    //       </MDBox>
    //     ),
    //     employed: (
    //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //         23/04/18
    //       </MDTypography>
    //     ),
    //     action: (
    //       <>
    //         <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
    //        <PopupModel author = { <Author image={team2} name="John Michael" email="john@creative-tim.com" />}/>
    //       </div>
    //       </>
    //     ),
    //   },
    //   {
    //     author: <Author image={team3} name="Alexa Liras" email="alexa@creative-tim.com" />,
    //     function: <Job title="Programator" description="Developer" />,
    //     status: (
    //       <MDBox ml={-1}>
    //         <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
    //       </MDBox>
    //     ),
    //     employed: (
    //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //         11/01/19
    //       </MDTypography>
    //     ),
    //     action: (
    //       <>
    //         <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
    //        <PopupModel author = { <Author image={team2} name="John Michael" email="john@creative-tim.com" />}/>
    //       </div>
    //       </>
    //     ),
    //   },
    //   {
    //     author: <Author image={team4} name="Laurent Perrier" email="laurent@creative-tim.com" />,
    //     function: <Job title="Executive" description="Projects" />,
    //     status: (
    //       <MDBox ml={-1}>
    //         <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
    //       </MDBox>
    //     ),
    //     employed: (
    //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //         19/09/17
    //       </MDTypography>
    //     ),
    //     action: (
    //       <>
    //         <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
    //        <PopupModel author = { <Author image={team2} name="John Michael" email="john@creative-tim.com" />}/>
    //       </div>
    //       </>
    //     ),
    //   },
    //   {
    //     author: <Author image={team2} name="John Michael" email="john@creative-tim.com" />,
    //     function: <Job title="Manager" description="Organization" />,
    //     status: (
    //       <MDBox ml={-1}>
    //         <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
    //       </MDBox>
    //     ),
    //     employed: (
    //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //         23/04/18
    //       </MDTypography>
    //     ),
    //     action: (
    //       <>
    //         <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
    //        <PopupModel author = { <Author image={team2} name="John Michael" email="john@creative-tim.com" />}/>
    //       </div>
    //       </>
    //     ),
    //   },
    //   {
    //     author: <Author image={team3} name="Alexa Liras" email="alexa@creative-tim.com" />,
    //     function: <Job title="Programator" description="Developer" />,
    //     status: (
    //       <MDBox ml={-1}>
    //         <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
    //       </MDBox>
    //     ),
    //     employed: (
    //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //         11/01/19
    //       </MDTypography>
    //     ),
    //     action: (
    //       <>
    //         <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
    //        <PopupModel author = { <Author image={team2} name="John Michael" email="john@creative-tim.com" />}/>
    //       </div>
    //       </>
    //     ),
    //   },
    //   {
    //     author: <Author image={team4} name="Laurent Perrier" email="laurent@creative-tim.com" />,
    //     function: <Job title="Executive" description="Projects" />,
    //     status: (
    //       <MDBox ml={-1}>
    //         <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
    //       </MDBox>
    //     ),
    //     employed: (
    //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //         19/09/17
    //       </MDTypography>
    //     ),
    //     action: (
    //       <>
    //         <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
    //        <PopupModel author = { <Author image={team2} name="John Michael" email="john@creative-tim.com" />}/>
    //       </div>
    //       </>
    //     ),
    //   },
    // ],
  };
}
