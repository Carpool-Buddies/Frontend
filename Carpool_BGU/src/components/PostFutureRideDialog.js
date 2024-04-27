import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Autocomplete} from "@mui/material";
import townNames from '../static/townNames.js'
import logo from "../static/BGU_logo.png";
import Map, {GeolocateControl, Marker} from "react-map-gl/maplibre";
import {useState} from "react";

export default function FormDialog({open, handleCloseDialog}) {

    const [originLat, setOriginLat] = useState(0)
    const [originLong, setOriginLong] = useState(0)
    const [destLat, setDestLat] = useState(0)
    const [destLong, setDestLong] = useState(0)

    return (
        <React.Fragment>
            <Dialog open={open} onClose={handleCloseDialog}
                    PaperProps={{
                        component: 'form',
                        onSubmit: (event) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries(formData.entries());
                            const email = formJson.email;
                            console.log(email);
                            handleCloseDialog();
                        },
                    }}
            >
                <DialogTitle>פרסם נסיעה חדשה</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Sample text
                    </DialogContentText>
                    <Map
                        initialViewState={{
                            longitude: 0,
                            latitude: 0,
                            zoom: 14
                        }}
                        style={{width: 'auto', height: 300}}
                        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                    >
                        <GeolocateControl position='bottom-left'/>
                        <Marker longitude={originLong} latitude={originLat} anchor="bottom" pitchAlignment='map'>
                            <img alt='marker' src={logo} style={{width: 20, height: "auto"}}/>
                        </Marker>
                        <Marker longitude={destLong} latitude={destLat} anchor="bottom" pitchAlignment='map'>
                            <img alt='marker' src={logo} style={{width: 20, height: "auto"}}/>
                        </Marker>
                    </Map>

                    <img alt='marker' src={logo} style={{width: 20, height: "auto"}}/>
                    <Autocomplete
                        disablePortal
                        options={Object.keys(townNames)}
                        sx={{width: 300}}
                        onChange={(e, v)=>{
                            console.log(e)
                            console.log(v)
                            setOriginLat(townNames[v][0])
                            setOriginLong(townNames[v][1])
                        }}
                        renderInput={(params) => <TextField {...params} label="עיר מוצא"/>}
                    />
                    <Autocomplete
                        disablePortal
                        options={Object.keys(townNames)}
                        sx={{width: 300}}
                        onChange={(e, v)=>{
                            setDestLat(townNames[v][0])
                            setDestLong(townNames[v][1])
                        }}
                        renderInput={(params) => <TextField {...params} label="עיר מוצא"/>}
                    />
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button type="submit">Subscribe</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
