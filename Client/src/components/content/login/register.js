import React, {useState, useEffect} from "react";
import logo from '../../../static/BGU_logo.png'
import {
    Button,
    Header,
    Segment,
    Image, Message, Form
} from "semantic-ui-react";
import {login} from "../../common/fetchers";

const Register = props => {

    const [serverRunning, setServerStatus] = useState(0);

    useEffect(() => {
        setServerStatus(1);
    }, [serverRunning]);

    const {children} = props;
    console.log(children)

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async event => {
        event.preventDefault();

        const ret = await login(username, password);
        if (ret.message === 'Login successful')
            props.history.push(`/home`);
        else
            console.log(ret);
    };

    return (
        <div className='shadowed-grid' style={{maxWidth: 450, borderColor: 'black', maxHeight: 700}}>
            <Segment.Group className='shadowed-grid' style={{maxWidth: 450, borderColor: 'black', maxHeight: 700}}>
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
                    <Form size='large' onSubmit={handleLogin}>
                        <Segment stacked>
                            <Form.Input
                                fluid icon='user'
                                value={username} onChange={(e) => setUsername(e.target.value)}
                                label='שם פרטי'/>
                            <Form.Input
                                fluid icon='user'
                                value={username} onChange={(e) => setUsername(e.target.value)}
                                label='שם משפחה'/>
                            <Form.Input
                                fluid icon='user'
                                value={username} onChange={(e) => setUsername(e.target.value)}
                                label='טלפון נייד'/>
                            <Form.Input
                                fluid icon='user'
                                value={username} onChange={(e) => setUsername(e.target.value)}
                                label='דוא״ל'/>
                            <Form.Input
                                fluid icon='lock'
                                label='סיסמה'
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                type='password'/>
                            <Form.Input
                                fluid icon='lock'
                                label='אימות סיסמה'
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                type='password'/>
                            <Button fluid size='large' style={{backgroundColor: '#ff9900'}}>
                                התחבר/י
                            </Button>
                        </Segment>
                    </Form>
                    <Message>
                        <Button onClick={(event) => props.history.push(`/home`)}>
                            This one's different!
                        </Button>
                        לא רשום? <a href='/register'
                    >צור משתמש חדש</a>
                    </Message>
                </Segment>
            </Segment.Group>
        </div>);
}
export default Register;
