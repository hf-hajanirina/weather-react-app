import { createTheme, ThemeOptions } from "@mui/material/styles";

const lightTheme: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
};

const darkTheme: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#303030",
      paper: "#424242",
    },
  },
};

export const getTheme = (mode: "light" | "dark") =>
  createTheme(mode === "light" ? lightTheme : darkTheme);

export default createTheme(lightTheme);
