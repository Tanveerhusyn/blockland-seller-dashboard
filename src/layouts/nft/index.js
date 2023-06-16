import React, { ReactElement, useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useParams } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import Switch from "@mui/material/Switch";
import { useNavigate } from "react-router-dom";
import {
  useAddress,
  useNFT,
  useContract,
  useNFTs,
  useOwnedNFTs,
  useCreateAuctionListing,
  Web3Button,
  useContractWrite
} from "@thirdweb-dev/react";
import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";

import {} from "@thirdweb-dev/react";

import {
  InfoOutlined,
  HistoryToggleOffOutlined,
  SettingsOutlined,
  ListOutlined,
  TimerOutlined,
} from "@mui/icons-material";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import { Divider } from "@mui/material";
import axios from "axios";
import { ethers } from "ethers";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import MarketplaceAddress from "../../contractsData/Marketplace-address.json";
import MarketplaceAbi from "../../contractsData/Marketplace.json";
import NFTAddress from "../../contractsData/NFT-address.json";
import NFTAbi from "../../contractsData/NFT.json";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <MDBox sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </MDBox>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Nft = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);
  const [nft, setNFT] = useState();
  const [payload, setPayLoad] = useState({
    listingType: "auctionListing",
    contractAddress: "0xfdad15EfA327910e379EDcAf0d9e09A32369eac1",
    tokenId: id,
    price: 0.1,
  });
  // const [marketplace, setMarketplace] = useState();
  const [loading, setLoading] = useState(true);
  const contractAddress = "0x8FC4fCCF2b8b034972fe5B5e00b53fC8667a8D3f";
  const { contract: marketplace } = useContract(contractAddress, "marketplace-v3");
console.log("Marketplace", marketplace)
  const { contract } = useContract("0xfdad15EfA327910e379EDcAf0d9e09A32369eac1", "nft-collection");
  const walletAddress = useAddress();
  const { data } = useNFT(contract, id);
  
  const { mutateAsync, isLoading, error } = useContractWrite(
    marketplace,
    "createAuction",
  );

  async function handleCreateListing(props) {
    try {
      // Store the result of either the direct listing creation or the auction listing creation
      let transactionResult;
      const { listingType, contractAddress, tokenId, price } = props;

      // Depending on the type of listing selected, call the appropriate function
      // For Direct Listings:
      if (listingType === "directListing") {
        transactionResult = await createDirectListing(contractAddress, tokenId, price);
      }

      // For Auction Listings:
      if (listingType === "auctionListing") {
        transactionResult = await createAuctionListing(contractAddress, tokenId, price);
      }

      // If the transaction succeeds, take the user back to the homepage to view their listing!
      if (transactionResult) {
        console.log("Successful");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function createAuctionListing(contractAddress, tokenId, price) {
    try {
       

      const transaction = await marketplace.englishAuctions.createAuction({
        assetContractAddress: contractAddress, // Required - smart contract address of NFT to sell
        tokenId: tokenId, // Required - token ID of the NFT to sell
        buyoutBidAmount: "2", // Required - amount to buy the NFT and close the listing
        minimumBidAmount: "0.002", // Required - Minimum amount that bids must be to placed
        quantity: "1", // Optional - number of tokens to sell (1 for ERC721 NFTs)
        startTimestamp: new Date(), // Optional - when the listing should start (default is now)
        endTimestamp: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // Optional - when the listing should end (default is 7 days from now)
        bidBufferBps: 100, // Optional - percentage the next bid must be higher than the current highest bid (default is contract-level bid buffer bps)
        timeBufferInSeconds: 60 * 10, // Optional - time in seconds that are added to the end time when a bid is placed (default is contract-level time buffer in seconds)
      });

      return transaction;
    } catch (error) {
      console.error(error);
    }
  }

  // useEffect(()=>{
  //   const loadContracts = async () => {
  //     // Get deployed copies of contracts
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     // Set signer
  //     const signer = provider.getSigner();
  //     const marketplace = new ethers.Contract(
  //       MarketplaceAddress.address,
  //       MarketplaceAbi.abi,
  //       signer
  //     );
  //     setMarketplace(marketplace);
  //     const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);
  //     setNFT(nft);
  //     setLoading(false);
  //   };
  //   loadContracts();

  // },[])
  // const { id } = useParams(); // Extract the id parameter from the URL
  const [nftRequest, setNFTRequest] = useState(null);

  // React.useEffect(() => {
  //   const fetchNFTRequest = async () => {
  //     try {
  //       const response = await axios.get(`http://52.147.197.64:5001/user/nft-requests/${id}`);
  //       console.log("response",response)
  //       setNFTRequest(response.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchNFTRequest();

  // }, [id]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSign = async () => {
    try {
      const idd = await nft.tokenCount();
      console.log("TOKENID", idd);
      // approve marketplace to spend nft
      await (await nft.setApprovalForAll(marketplace.address, true)).wait();
      // add nft to marketplace
      const listingPrice = ethers.utils.parseEther(nftRequest.metadata.price.toString());
      await (await marketplace.makeItem(nft.address, idd, listingPrice)).wait();
    } catch (err) {
      console.log("Error", err);
    }
  };
  const [checked, setChecked] = React.useState(["wifi"]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <DashboardLayout>
      <div className="bg-gray-100">
        <div className="relative flex">
          <div className="min-h-screen lg:w-1/3"></div>
          <div className="hidden w-3/4 min-h-screen  dark:bg-gray-800 lg:block"></div>

          <div className="container  flex flex-col justify-center w-full min-h-screen px-6 py-10 mx-auto lg:absolute lg:inset-x-0">
            <div className="bg-lg:mt-10 lg:flex lg:items-center rounded bg-white shadow p-4 pl-10 ">
              <div className="w-full mb-26">
                <h3 className="mt-6 text-lg font-medium text-blue-500">{data?.metadata.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">{data?.owner}</p>
                <img
                  className="object-cover mt-4 shadow-lg object-center w-full lg:w-[32rem] rounded-lg h-100"
                  src={data?.metadata.image}
                  alt=""
                />
                <div class="btn-group grid grid-cols-2 pt-16"></div>
              </div>

              <div className="mb-10 lg:px-10 lg:mt-0 w-full">
                <section style={{ width: "530px" }} className="container px-4  mb-30">
                  {/* <h2 className="text-lg font-medium text-gray-800 dark:text-white">Customers</h2>

                  <p className="mt-1  text-sm text-gray-500 dark:text-gray-300">
                    These companies have purchased in the last 12 months.
                  </p> */}

                  <div className="flex flex-col mt-2 ">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        {/* <Tabs value={value} onChange={handleChange} aria-label="icon tabs example">
                          <Tab icon={<PhoneIcon />} aria-label="phone" />
                          <Tab icon={<FavoriteIcon />} aria-label="favorite" />
                          <Tab icon={<PersonPinIcon />} aria-label="person" />
                        </Tabs> */}
                        <Box
                          sx={{
                            width: "100%",
                            background: "white",
                            padding: "20px",
                            borderRadius: "10px",
                          }}
                        >
                          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <Tabs
                              value={value}
                              onChange={handleChange}
                              aria-label="basic tabs example"
                            >
                              <Tab
                                icon={<InfoOutlined />}
                                label="NFT Details"
                                className="mr-4"
                                {...a11yProps(0)}
                              />
                              <Tab
                                icon={<HistoryToggleOffOutlined />}
                                label="Transaction history"
                                {...a11yProps(1)}
                              />
                              <Tab icon={<SettingsOutlined />} label="Setting" {...a11yProps(2)} />
                            </Tabs>
                          </Box>
                          <TabPanel value={value} index={0}>
                            <List
                              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
                            >
                              <ListItem>
                                <ListItemAvatar>
                                  <Avatar>
                                    <ImageIcon />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={data?.metadata.name} secondary="NFT Name" />
                              </ListItem>
                              <Divider />
                              <ListItem>
                                <ListItemAvatar>
                                  <Avatar>
                                    <WorkIcon />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={data?.owner} secondary="Address" />
                              </ListItem>
                              <Divider />

                              <ListItem>
                                <ListItemAvatar>
                                  <Avatar>
                                    <BeachAccessIcon />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={data?.supply} secondary="Price" />
                              </ListItem>
                              <Divider />
                            </List>
                          </TabPanel>
                          <TabPanel value={value} index={1}>
                            <List
                              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
                            >
                              <ListItem>
                                <ListItemAvatar>
                                  <Avatar>
                                    <ImageIcon />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary="0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE"
                                  secondary="Jan 9, 2014"
                                />
                              </ListItem>
                              <Divider />
                              <ListItem>
                                <ListItemAvatar>
                                  <Avatar>
                                    <WorkIcon />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary="0x7a2c78b5a7d0148c1e2e5370d0a4f95d56992d4c"
                                  secondary="Jan 7, 2014"
                                />
                              </ListItem>
                              <Divider />

                              <ListItem>
                                <ListItemAvatar>
                                  <Avatar>
                                    <BeachAccessIcon />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary="0x4d6cb2772453f3c39e1b6d12ba01eeb3cc9f80a9"
                                  secondary="July 20, 2014"
                                />
                              </ListItem>
                              <Divider />
                            </List>
                          </TabPanel>
                          <TabPanel value={value} index={2}>
                            <List
                              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
                            >
                              <ListItem>
                                <ListItemIcon>
                                  <ListOutlined />
                                </ListItemIcon>
                                <ListItemText id="switch-list-label-wifi" primary="List" />
                                <Switch
                                  edge="end"
                                  onChange={handleToggle("wifi")}
                                  checked={checked.indexOf("wifi") !== -1}
                                  inputProps={{
                                    "aria-labelledby": "switch-list-label-wifi",
                                  }}
                                />
                              </ListItem>
                              <Divider />
                              <ListItem>
                                <ListItemIcon>
                                  <TimerOutlined />
                                </ListItemIcon>
                                <ListItemText
                                  id="switch-list-label-bluetooth"
                                  primary="Enable Bidding"
                                />
                                <Switch
                                  edge="end"
                                  onChange={handleToggle("bluetooth")}
                                  checked={checked.indexOf("bluetooth") !== -1}
                                  inputProps={{
                                    "aria-labelledby": "switch-list-label-bluetooth",
                                  }}
                                />
                              </ListItem>
                              <Divider />
                              <ListItem>
                                <button
                                  onClick={async ()=>await handleCreateListing(payload)}
                                  className="btn btn btn-outline btn-error w-full my-4 gap-2"
                                >
                                  List on the marketplace
                                </button>

 

{/* <Web3Button
      contractAddress={contractAddress}
      action={() =>
        mutateAsync(
          // Place your arguments here in an array, in the same order as your smart contract function
          [{
            assetContractAddress: contractAddress, // Contract Address of the NFT
            buyoutPricePerToken: price, // Maximum price, the auction will end immediately if a user pays this price.
            currencyContractAddress: NATIVE_TOKEN_ADDRESS, // NATIVE_TOKEN_ADDRESS is the crpyto curency that is native to the network. i.e. Goerli ETH.
            listingDurationInSeconds: 60 * 60 * 24 * 7, // When the auction will be closed and no longer accept bids (1 Week)
            quantity: 1, // How many of the NFTs are being listed (useful for ERC 1155 tokens)
            reservePricePerToken: 0, // Minimum price, users cannot bid below this amount
            startTimestamp: new Date(), // When the listing will start
            tokenId: id, // Token ID of the NFT.
          }],
        )
      }
    >
      Send Transaction
    </Web3Button> */}
                              </ListItem>
                              <Divider />
                            </List>
                          </TabPanel>
                        </Box>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Nft;
