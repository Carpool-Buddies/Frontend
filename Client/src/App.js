import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import MenuWrapper from './components/navigation/menuWrapper';
import Footer from './components/common/footer';
import headerItems from './config/headerItems';
import MenuItems from './config/menuItems';
import 'semantic-ui-css/semantic.min.css'
import logo from './BGU_logo.png'
import './styles.css'
import {Button, Form, Grid, GridColumn, GridRow, Header, Image, Message, Segment} from 'semantic-ui-react'
import {auto} from "html-webpack-plugin/lib/chunksorter";

const App = (props) => {
    const [serverRunning, setServerStatus] = useState(0);

    useEffect(() => {
        setServerStatus(1);
    }, [serverRunning]);

    const {children} = props;

    const ret = (
        <div className='shadowed-grid' style={{maxWidth: 450, borderColor: 'black', maxHeight: 500}}>
            <Segment.Group>
                <Segment.Group horizontal>
                    <Segment compact>
                        <center>
                            <Image src={logo} style={{width: 50}}/>
                        </center>
                    </Segment>
                    <Segment>
                        <Header as='h2' textAlign='center' style={{color: '#ff9900'}}>
                            Carpool BGU
                        </Header>
                    </Segment>
                </Segment.Group>
                <Segment>
                    <Form size='large'>
                        <Segment stacked>
                            <Form.Input
                                fluid icon='user'
                                placeholder='דוא״ל'/>
                            <Form.Input
                                fluid icon='lock'
                                placeholder='סיסמה'
                                type='password'/>
                            <Button fluid size='large' style={{backgroundColor: '#ff9900'}}>
                                התחבר/י
                            </Button>
                        </Segment>
                    </Form>
                    <Message>
                        לא רשום? <a href='#'>צור משתמש חדש</a>
                    </Message>
                </Segment>
            </Segment.Group>
        </div>)

    return (serverRunning === 1) ? ret : ret;
};

export default withRouter(App);
