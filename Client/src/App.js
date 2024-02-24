import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css'
import './styles.css'

const App = (props) => {
    const [serverRunning, setServerStatus] = useState(0);

    useEffect(() => {
        setServerStatus(1);
    }, [serverRunning]);

    const {children} = props;

    return (serverRunning === 1) ? (<>{children}</>) : (<h2>השרת שלנו לא באוויר :(</h2>)
};

export default withRouter(App);
