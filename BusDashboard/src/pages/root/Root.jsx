import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useLocation } from "react-router-dom"; // Import useLocation
import Drawerr from "../../components/Drawerr";
import getDesignTokens from "../../Theme";

export const Root = () => {
  const location = useLocation(); // Get the current location

  const [mode, setMode] = React.useState(
    localStorage.getItem("currentMode")
      ? localStorage.getItem("currentMode")
      : "dark"
  );
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  // Conditionally show Drawer only if the user is not on the login page
  const isLoginPage = location.pathname === "/login";

  return (
    <ThemeProvider theme={theme}>
      {!isLoginPage && (
        <Drawerr
          open={open}
          handleDrawerOpen={handleDrawerOpen}
          handleDrawerClose={handleDrawerClose}
          setMode={setMode}
        />
      )}
    </ThemeProvider>
  );
};
