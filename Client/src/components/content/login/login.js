import React, { useState, useEffect } from 'react';
import { Button } from 'semantic-ui-react';
import Message from 'semantic-ui-react/dist/commonjs/collections/Message/Message';
import InjectionText from '../../common/injectionText';
import generateGUID from '../../common/utilities';

const Login = () => {
  const userNameInput = React.createRef();
  const [userVerified, setVerification] = useState(false);
  const [userName, setUserName] = useState(null);
  const [invalidName, setInvalidName] = useState(false);

  useEffect(() => {
    if (localStorage.userName) {
      setUserName(localStorage.userName);
      setVerification(true);
    }
  });

  const logoutHandler = () => {
    setVerification(false);
    setUserName(null);
    localStorage.clear();
  };

  const loginHandler = () => {
    const username = userNameInput.current.value;
    if (username === undefined || username === '') {
      setInvalidName(true);
    } else {
      setUserName(username);
      setVerification(true);
      setInvalidName(false);
      localStorage.userName = username;
    }
  };

  const anonymousLoginHandler = () => {
    localStorage.userName = `anonymous_${generateGUID()}`;
    setVerification(true);
    setInvalidName(false);
  };

  return (userVerified) ? (
    <div className="ui middle aligned center aligned grid">
      <div className="six wide column">
        <div className="ui  segment">
          {userName !== null && userName.indexOf('anonymous') === 0 ? (
            <h2 className="ui teal header">Welcome Guest</h2>
          ) : (
            <h2 className="ui teal header">
              Welcome to ProAct website
              {' '}
              {userName}
            </h2>
          )}
          <br />
          <Button onClick={logoutHandler}>
            Logout
          </Button>

        </div>
      </div>
    </div>
  ) : (
    <div className="ui middle aligned center aligned grid">
      <div className="fourteen wide column">
        <div className="ui segment">
          <h2 className="ui header very padded">
            Please enter your Username:
          </h2>

          <div className="ui field">
            <input ref={userNameInput} type="text" placeholder="Enter Username" />
            {invalidName ? (
              <Message
                negative
                title="Action Forbidden"
                content={"Username can't be empty"}
              />
            ) : ''}
          </div>
          <br />
          <div className="ui field">
            <Button onClick={loginHandler}>
              Login
            </Button>

          </div>
          <br />
          OR

          <div className="ui field">
            <br />
            <Button onClick={anonymousLoginHandler}>
              Enter Anonymously
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
