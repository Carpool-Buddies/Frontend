import React from "react";
import "./App.scss";
import App from "./App";
import {createRoot} from "react-dom/client";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import './fonts/OpenSansHebrew/OpenSansHebrew-Regular.ttf'
import './fonts/MyriadPro/MYRIADPRO-REGULAR.woff'
import Home from "./Home";
import Register from "./register";
import {heIL} from "@mui/x-date-pickers/locales";
import {prefixer} from 'stylis';
import {CacheProvider} from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import dayjs from "dayjs";


const defaultTheme = createTheme({
    direction: 'rtl',
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
    },
    heIL
});

// Create rtl cache
const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
});


require('dayjs/locale/he')

dayjs.locale('he') // use locale globally

createRoot(document.getElementById('app')).render(
    <ThemeProvider theme={defaultTheme}>
        <CacheProvider value={cacheRtl}>
            <BrowserRouter hashType="noslash">
                <App>
                    <Routes>
                        <Route exact path="/" element={<Home/>}/>
                        <Route path="/home" element={<Home/>}/>
                        <Route path="/register" element={<Register/>}/>
                    </Routes>
                </App>
            </BrowserRouter>
        </CacheProvider>
    </ThemeProvider>
);