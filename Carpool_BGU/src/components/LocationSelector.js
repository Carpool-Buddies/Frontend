import React, {useEffect, useState} from 'react';
import {AdvancedMarker, APIProvider, Map} from '@vis.gl/react-google-maps';
import Box from "@mui/material/Box";
import RoomIcon from '@mui/icons-material/Room';
import {Autocomplete, IconButton, InputAdornment, Slider, Tab, Tabs} from "@mui/material";
import townNames from "../static/townNames";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {getCoordsFromAddress} from "../common/fetchers";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import SearchIcon from '@mui/icons-material/Search';
import Typography from "@mui/material/Typography";
import {Circle} from "./circle";

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

const LocationSelector = ({title, setLocationDetails, selectionClick, actionText}) => {
    const [tabValue, setTabValue] = React.useState(2);
    const [searchText, setSearchText] = useState('')
    const [coords, setCoords] = useState({lat: 0, long: 0})
    const [radius, setRadius] = useState(1);


    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoords({lat: position.coords.latitude, long: position.coords.longitude});
            });
    }, []);

    const findAddress = async () => {
        const ret = await getCoordsFromAddress(searchText)
        console.log(ret)
    }

    const handleCoordsSubmit = () => {
        setLocationDetails({coords: coords, radius: radius})
        selectionClick()
    };

    return coords.lat!==0 && (<Box display='flex'
                 justifyContent="center">
        <Grid
            container
            display='flex'
            justifyContent="center">
            <Grid item xs={12}>
                <Typography>
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={12} justifyContent='center'>
                <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} variant="fullWidth">
                    <Tab disabled label='לפי עיר (בקרוב!)' {...a11yProps(0)}/>
                    <Tab disabled label='לפי כתובת (בקרוב!)' {...a11yProps(1)}/>
                    <Tab label='לפי נקודה' {...a11yProps(2)}/>
                </Tabs>
            </Grid>
            <Grid item xs={12}>
                <APIProvider apiKey='AIzaSyCFaNEpBsTboNXUeUheimTz8AbP5BLPZ2g'>
                    <Map
                        mapId={'a6c72e4f93862a68'}
                        style={{width: '100%', height: 300}}
                        defaultCenter={{lat: coords.lat, lng: coords.long}}
                        defaultZoom={14}
                        gestureHandling={'greedy'}
                        disableDefaultUI={true}
                        onDrag={(e) => {
                            if (tabValue === 2)
                                setCoords({lat: e.map.getCenter().lat(), long: e.map.getCenter().lng()})
                        }}
                    >
                        <AdvancedMarker position={{lat: coords.lat, lng: coords.long}}>
                            <RoomIcon color='primary'/>
                        </AdvancedMarker>
                        <Circle
                            radius={radius * 1000}
                            center={{lng: coords.long, lat: coords.lat}}
                            strokeOpacity={0}
                            fillColor={'#088'}
                            fillOpacity={0.4}
                        />
                    </Map>
                </APIProvider>
                <Typography>
                    רדיוס {actionText} (ק"מ)
                </Typography>
                <Slider
                    size="small"
                    value={radius}
                    min={0.5}
                    max={5}
                    step={0.1}
                    valueLabelDisplay="auto"
                    onChange={(event, newValue) => {
                        setRadius(newValue);
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <CustomTabPanel value={tabValue} index={0}>
                    <Autocomplete
                        disablePortal
                        options={Object.keys(townNames)}
                        onChange={(e, v) => {
                            setCoords({lat: townNames[v][0], long: townNames[v][1]})
                        }}
                        renderInput={(params) => <TextField {...params} label="עיר מוצא"/>}
                    />
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={1}>
                    <TextField fullWidth
                               InputProps={{
                                   endAdornment: (<InputAdornment position="end">
                                       <IconButton onClick={findAddress}><SearchIcon/></IconButton>
                                   </InputAdornment>),
                               }}
                               label="הקלד כתובת"
                               onChange={(e) => setSearchText(e.target.value)}
                    />
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={2}>
                    <Button onClick={handleCoordsSubmit} variant="contained">בחר</Button>
                </CustomTabPanel>
            </Grid>
        </Grid>
    </Box>);
};

export default LocationSelector;
