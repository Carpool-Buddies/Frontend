import React, {useEffect, useState} from 'react';
import Map, {Source, Layer, GeolocateControl, Marker} from "react-map-gl/maplibre";
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
import circle from "@turf/circle"

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

    const markerRadius = circle([coords.long, coords.lat], radius, {
        steps: 50,
        units: "kilometers",
        properties: {foo: "bar"}
    });

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
                <Map
                    initialViewState={{
                        longitude: coords.long, latitude: coords.lat, zoom: 14
                    }}
                    onMove={(vp) => {
                        if (tabValue === 2)
                            setCoords({lat: vp.viewState.latitude, long: vp.viewState.longitude})
                    }}
                    style={{width: '100%', height: 300}}
                    mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                >
                    <GeolocateControl position='bottom-left'/>
                    <Marker
                        anchor="bottom"
                        latitude={coords.lat}
                        longitude={coords.long}
                    >
                        <RoomIcon color='primary'/>
                    </Marker>
                    <Source id="my-data" type="geojson" data={markerRadius}>
                        <Layer
                            id="point-90-hi"
                            type="fill"
                            paint={{
                                "fill-color": "#088",
                                "fill-opacity": 0.4,
                                "fill-outline-color": "yellow"
                            }}
                        />
                    </Source>
                </Map>
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
