import Row1 from "./Row1";
import Row2 from "./Row2";
import {  Stack } from "@mui/material";
import Header from "../../components/Header";

const Dashboard = () => {
  return (
    <div>
<Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Header
          isDashboard={true}
          title={"DASHBOARD"}
          subTitle={"Welcome"}
        />
      </Stack>

      <Row1 />
      {/* <Row2 /> */}
    </div>
  );
};

export default Dashboard;
