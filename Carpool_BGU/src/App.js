import * as React from 'react';
import {useEffect, useState} from "react";

const App = (props) => {

    const [serverRunning, setServerStatus] = useState(0);

    useEffect(() => {
        setServerStatus(1);
    }, [serverRunning]);

    const {children} = props;

    return (serverRunning === 1) ? (<>{children}</>) : (<h2>השרת שלנו לא באוויר :(</h2>)
}

export default App