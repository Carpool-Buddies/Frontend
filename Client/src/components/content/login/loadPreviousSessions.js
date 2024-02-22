import React, { useState, useEffect } from 'react';
import { Loader } from 'semantic-ui-react';
import SessionList from '../../navigation/sessionList';
// import { getSessions } from '../common/fetchers';

const LoadPreviousSessions = (props) => {
  const { userName } = localStorage;
  const [isFetched, setFetchStatus] = useState(false);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      if (userName !== undefined && userName !== null) {
        const res = await getSessions(userName);
        setSessions(res.getSessions.message);
        setFetchStatus(true);
      }
    }
    fetchSessions();
  }, []);

  return (
    <div className="ui segment centered very padded">
      <div className="ui header">Previous Sessions</div>
      { userName === undefined ? (
        <div>
          <p>You need to log in to see the sessions</p>
        </div>
      ) : (
        <div>
          {isFetched ? (
            <div>
              <p>
                For&nbsp;
                {userName}
              </p>
              <SessionList sessions={sessions} />
            </div>
          ) : (
            <Loader active />
          )}
        </div>
      )}
    </div>
  );
};

export default LoadPreviousSessions;
