 
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { ThirdwebNftMedia, useContract, useNFT,useTotalCount } from "@thirdweb-dev/react";
import nftabi from '../../contractsData/NFT.json'
import marketplaceabi from '../../contractsData/Marketplace.json'
// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";

function Tables() {
  const { columns, rows } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();
  // const { contract } = useContract("0x5fbdb2315678afecb367f032d93f642f64180aa3",'nft-drop',marketplaceabi);
  // // const { data: nft, isLoading, error } = useNFT(contract, '0x02');
  // const { data: totalCount, isLoading, error } = useTotalCount(contract);

  // console.log("CONTRACT",totalCount,isLoading,error)

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                display="flex"
                justifyContent="space-between"
                variant="gradient"
                bgColor="#13131d"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Requested NFTs Status
                </MDTypography>

                <MDButton variant="gradient" color="white">
                  New Request
                </MDButton>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
 
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
