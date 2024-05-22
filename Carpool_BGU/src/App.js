import * as React from 'react';
import {useEffect, useState} from "react";
import 'dayjs/locale/he';
import {getServerStatus} from "./common/fetchers";
import {CircularProgress} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import logo from "./static/BGU_logo.png";
import Typography from "@mui/material/Typography";
import { ToastContainer } from 'react-toastify';


const App = (props) => {

    const [serverRunning, setServerStatus] = useState(0);

    useEffect(() => {
        getServerStatus()
            .then((ret) => {
                if (ret.success && ret.success === true)
                    setServerStatus(1)
                else
                    setServerStatus(-1)})
            .catch(() => setServerStatus(-1))
    }, []);

    const {children} = props;

    return (serverRunning === 1) ? (
            <div>
                {children}
                <ToastContainer />
            </div>
        ) : (serverRunning === 0) ? (
            <div>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    sx={{minHeight: '100vh'}}
                >
                    <Grid item xs={3}>
                        <Box
                            sx={{
                                marginTop: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                border: 1,
                                borderRadius: 10,
                                boxShadow: 5,
                                padding: 10
                            }}
                        >
                            <img src={logo} style={{width: 50}} alt="bgu logo"/>
                            <Typography component="h1" variant="h5">
                                מתחבר לשרת
                            </Typography>
                            <CircularProgress/>
                        </Box>
                    </Grid>
                </Grid>
                <ToastContainer />
            </div>
        ) : (
            <div>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    sx={{minHeight: '100vh'}}
                >
                    <Grid item xs={3}>
                        <Box
                            sx={{
                                marginTop: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                border: 1,
                                borderRadius: 10,
                                boxShadow: 5,
                                padding: 10
                            }}
                        >
                            <img src={logo} style={{width: 50}} alt="bgu logo"/>
                            <Typography component="h1" variant="h5">
                                השרת שלנו לא באוויר :(
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
                <ToastContainer />
            </div>
        )
}

export default App