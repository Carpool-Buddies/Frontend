import React, {useState} from 'react';
import Map, {GeolocateControl, Marker} from "react-map-gl/maplibre";
import Box from "@mui/material/Box";
import RoomIcon from '@mui/icons-material/Room';
import {Autocomplete, IconButton, InputAdornment, Tab, Tabs} from "@mui/material";
import townNames from "../static/townNames";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {getAddress} from "../common/fetchers";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import SearchIcon from '@mui/icons-material/Search';

function CustomTabPanel(props) {
    const {children, value, index, ...other} = props;

    return (<Box justifyContent="center" textAlign='center'
                 role="tabpanel"
                 hidden={value !== index}
                 id={`simple-tabpanel-${index}`}
                 aria-labelledby={`simple-tab-${index}`}
                 {...other}
    >
        {value === index && (<Box sx={{p: 3}}>
            {children}
        </Box>)}
    </Box>);
}

CustomTabPanel.propTypes = {
    children: PropTypes.node, index: PropTypes.number.isRequired, value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`, 'aria-controls': `simple-tabpanel-${index}`,
    };
}

const LocationSelector = () => {
    const [lat, setLat] = useState(32.034191)
    const [long, setLong] = useState(34.87721)
    const [originSearchText, setOriginSearchText] = useState('')
    const [tabValue, setTabValue] = React.useState(0);

    const [markerPosition, setMarkerPosition] = useState({
        latitude: lat, longitude: long,
    });

    const findOriginAddress = async () => {
        const ret = await getAddress(originSearchText)
        console.log(ret)
    }

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleSubmit = () => {
        console.log('Chosen location:', markerPosition);
    };

    const handleViewportChange = (newViewport) => {
        if (tabValue === 2) {
            setMarkerPosition({
                latitude: newViewport.viewState.latitude, longitude: newViewport.viewState.longitude,
            });
        }
    };

    return (<Box display='flex'
                 justifyContent="center">
        <Grid
            container
            display='flex'
            justifyContent="center">
            <Grid item xs={12} justifyContent='center'>
                <Tabs value={tabValue} onChange={handleChange} variant="fullWidth">
                    <Tab label='לפי עיר' {...a11yProps(0)}/>
                    <Tab label='לפי כתובת' {...a11yProps(1)}/>
                    <Tab label='לפי נקודה' {...a11yProps(2)}/>
                </Tabs>
            </Grid>
            <Grid item xs={12}>
                <Map
                    initialViewState={{
                        longitude: long, latitude: lat, zoom: 14
                    }}
                    onMove={handleViewportChange}
                    style={{width: '100%', height: 300}}
                    mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                >
                    <GeolocateControl position='bottom-left'/>
                    <Marker
                        latitude={markerPosition.latitude}
                        longitude={markerPosition.longitude}
                    >
                        <RoomIcon color='primary'/>
                    </Marker>
                </Map>
            </Grid>
            <Grid item xs={12}>
                <CustomTabPanel value={tabValue} index={0}>
                    <Autocomplete
                        disablePortal
                        options={Object.keys(townNames)}
                        onChange={(e, v) => {
                            setLat(townNames[v][0])
                            setLong(townNames[v][1])
                        }}
                        renderInput={(params) => <TextField {...params} label="עיר מוצא"/>}
                    />
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={1}>
                    <TextField
                        InputProps={{
                            endAdornment: (<InputAdornment position="end">
                                <IconButton onClick={findOriginAddress} ><SearchIcon/></IconButton>
                            </InputAdornment>),
                        }}
                        label="הקלד כתובת"
                        onChange={(e) => setOriginSearchText(e.target.value)}
                    />
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={2}>
                    <Button onClick={handleSubmit} variant="contained">בחר</Button>
                </CustomTabPanel>
            </Grid>
        </Grid>
    </Box>);
};

export default LocationSelector;
