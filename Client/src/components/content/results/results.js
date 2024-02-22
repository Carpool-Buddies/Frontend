import React, { useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';
import Tabs from '../tabs';

const Results = (props) => {
  const [isSession, setFetchStatus] = useState({ fetched: false, data: null });
  const [isError, setErrorStatus] = useState(false);
  const interval = useRef()

  const fetchResults = async () => {
    try {
      const {match: {params}} = props;
      localStorage.userName = params.userName
      localStorage.time = params.time
      localStorage.jobName = params.jobName
      const res = await loadSession(params.userName, params.jobName, params.time);
      const {result, message} = res['loadSession']
      if (result) {
        setFetchStatus({fetched: true, data: message})
        clearInterval(interval.current)
      } else if (message === 'error') {
        setErrorStatus(true)
        clearInterval(interval.current)
      }
    }
    catch (e){
      setFetchStatus(true)
    }
  }

  const fetchSample = async () => {
    const res = await getSample();
    const { result, message } = res['getSample']
    if (result) setFetchStatus({ fetched: true, data: message })
    else setErrorStatus(true)
  }

  useEffect(() => {
    const { location: { pathname } } = props;
    if (pathname === '/sample') {
      fetchSample();
    } else {
      fetchResults();
      if (!isSession.fetched && !isError) {
        interval.current = setInterval(() => fetchResults(), 30000)
      }
    }
    return () => clearInterval(interval.current)
  }, [props]);

  const { location: { pathname } } = props

  return (
    isSession.fetched ? (
      <Segment>
        <Tabs resultsData={isSession.data} />
      </Segment>
    ) : (isError ? (
      <div className="ui segment centered very padded">
        <p>
          Unfortunately, something went wrong.
          <br />
          If the problem persists please send us an email at:
          <a href="mailto:estiyl@bgu.ac.il">estiyl@bgu.ac.il</a>
        </p>
      </div>
    ) : (
      <Segment>
        <Loader active size="large" style={{ paddingBottom: '160px' }}>My Protein Net is running...</Loader>
        <div className="ui mini header" style={{ paddingTop: '100px' }}>
          If you just executed new session and expecting results, please be patient. Run time is approximately 15 minutes for each run.
          This page will update every 30 seconds to check if your job is ready.
          Alternatively, you can access this session later through:
          <ul>
            <li>
              This link:&nbsp;
              <a href={`https://netbio.bgu.ac.il/myproteinnet2/#${pathname.substr(1)}`}>
                https://netbio.bgu.ac.il/myproteinnet2/#
                {pathname.substr(1)}
              </a>
            </li>
            <li>
              &apos;Load Previous Session&apos; on left menu
            </li>
          </ul>
        </div>
      </Segment>
    ))
  );
};

export default withRouter(Results);
