import React, {useState, useEffect} from "react";
import logo from '../../../static/BGU_logo.png'
import {
    Button,
    Header,
    Segment,
    Image, Message, Form
} from "semantic-ui-react";
import {login, logout, mystery} from "../../common/fetchers";

const Home = props => {

    const {children} = props;

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [accessToken, setAccessToken] = useState('');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        console.log('use effect')
        console.log(isLoggedIn)
        if (localStorage.getItem("accessToken") !== '') {
            console.log('here')
            setIsLoggedIn(true)
            setAccessToken(localStorage.getItem("accessToken"))
        }
        else
            setIsLoggedIn(false);
    }, [isLoggedIn, accessToken]);


    const handleLogin = async event => {
        event.preventDefault();

        const ret = await login(username, password);
        if (ret.message === 'Login successful') {
            localStorage.setItem('accessToken', ret.access_token)
            setIsLoggedIn(true)
            setUsername('')
            setPassword('')
        } else
            console.log(ret);
    };
    const handleLogout = async event => {
        event.preventDefault();

        const ret = await logout(accessToken);
        console.log(ret);

        localStorage.setItem('accessToken', '')
        setIsLoggedIn(false)

    };

    const handleMysteryFunction = async event => {
        event.preventDefault();

        const ret = await mystery(accessToken);
        if (ret.logged_in_as) {
            alert(ret.logged_in_as)
        } else
            console.log(ret);
    };

    const loggedInHome = (
        <>
            <h2>אתה מחובר!</h2>
            <Button onClick={(e) => handleLogout(e)}>התנתק</Button>
            <Button onClick={(e) => handleMysteryFunction(e)}>???</Button>
        </>
    )

    const loggedOutHome = (
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
                    <Form size='large' onSubmit={handleLogin}>
                        <Segment stacked>
                            <Form.Input
                                fluid icon='user'
                                value={username} onChange={(e) => setUsername(e.target.value)}
                                placeholder='דוא״ל'/>
                            <Form.Input
                                fluid icon='lock'
                                placeholder='סיסמה'
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                type='password'/>
                            <Button fluid size='large' style={{backgroundColor: '#ff9900'}}>
                                התחבר/י
                            </Button>
                        </Segment>
                    </Form>
                    <Message>
                        לא רשום? <a onClick={(event) => props.history.push(`/register`)}>
                        צור משתמש חדש</a>
                    </Message>
                    <Message>
                        <a onClick={(event) => props.history.push(`/register`)}>שכחת דוא״ל / סיסמה?</a>
                    </Message>
                </Segment>
            </Segment.Group>
        </div>
    )

    return isLoggedIn ? loggedInHome : loggedOutHome;
}
export default Home;
