import * as React from 'react';
import {useEffect, useState} from "react";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/he';

const App = (props) => {

    const [serverRunning, setServerStatus] = useState(0);

    useEffect(() => {
        setServerStatus(1);
    }, [serverRunning]);

    const {children} = props;

    return (serverRunning === 1) ? (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="he">
            {children}
        </LocalizationProvider>
    ) : (<h2>השרת שלנו לא באוויר :(</h2>)
}

export default App