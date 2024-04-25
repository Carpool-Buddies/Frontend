import React from "react";
import "./App.scss";
import App from "./App";
import {createRoot} from "react-dom/client";
import {HashRouter, Route, Routes} from "react-router-dom";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import './fonts/OpenSansHebrew/OpenSansHebrew-Regular.ttf'
import './fonts/MyriadPro/MYRIADPRO-REGULAR.woff'
import Home from "./Home";


const defaultTheme = createTheme({
    palette: {
        primary: {
            main: '#ff9900'
        },
        secondary: {
            main: '#58595b'
        },
    },
    typography: {
        fontFamily: ['Open Sans']
    }
});

// createRoot(document.getElementById("app")).render(<App />);
createRoot(document.getElementById('app')).render(
    <ThemeProvider theme={defaultTheme}>
        <HashRouter hashType="noslash">
            <App>
                <Routes>
                    <Route exact path="/" element={<Home />}/>
                    <Route path="/home" element={<Home />} />
                    {/*<Route path="/register" component={Register} />*/}

                </Routes>
            </App>
        </HashRouter>
    </ThemeProvider>
);