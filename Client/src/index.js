import React from 'react';
import { render } from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import App from './App';
import Home from './components/content/home/home';
import Results from './components/content/results/results';
import Login from './components/content/login/login';
import LoadPreviousSessions from './components/content/login/loadPreviousSessions';
import TissueFilterResults from './components/content/results/tissueFilterResults'
import SingleProcessResults from './components/content/results/singleProcessResults'
import MultipleProcessesResults from './components/content/results/multipleProcessesResults'
import MultipleMSigDB from "./components/content/results/multipleMSigDB";
import SingleMSigDB from "./components/content/results/singleMSigDB";
import UserExpResults from './components/content/results/userExpResults';
import UserExpRanks from './components/content/userExpRanks';
import cellIdentityResults from './components/content/results/cellIdentityResults';
import TissueFilterResultsMSigDB from "./components/content/results/tissueFilterResultsMSigDB";
import 'semantic-ui-css/semantic.min.css'
import DownloadData from "./components/content/downloadData";

render(
  <HashRouter hashType="noslash">
    <App>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/home" component={Home} />
        <Route path="/download" component={DownloadData}/>
        <Route path="/login" component={Login} />
        <Route path="/load-session" component={LoadPreviousSessions} />
        <Route path="/sample" component={Results} />
        <Route path="/results/:userName/:jobName/:time" component={Results} />
        <Route path="/tissueResults/:mode/:selectedTissue/:threshold/:checked/:sessionId/:timeStamp/:relatedProcess?" component={TissueFilterResults} />
        <Route path="/tissueResultsMSigDB/:mode?/:selectedTissue/:sessionId/:timeStamp/:relatedProcess?" component={TissueFilterResultsMSigDB} />
        <Route path="/singleProcess/:mode/:selectedProcess/:sessionId/:timeStamp/:relatedGenes?" component={SingleProcessResults} />
        <Route path="/multipleProcesses/:mode/:selectedProcesses/:sessionId/:timeStamp/:relatedGenes?" component={MultipleProcessesResults} />
        <Route path="/multipleProcessesMSigDB/:mode?/:sessionId/:timeStamp" component={MultipleMSigDB} />
        <Route path="/singleProcessMSigDB/:mode?/:selectedProcesses/:sessionId/:timeStamp" component={SingleMSigDB} />
        <Route path="/userExpResults/:clusters/:sessionId/:timeStamp" component={UserExpResults} />
        <Route path="/userExpRanks/:selectedClusters/:sessionId/:timeStamp/:example?" component={UserExpRanks} />
        <Route path="/cellIdentityGroupsData/:sessionId/:timeStamp/:example?" component={cellIdentityResults} />

      </Switch>
    </App>
  </HashRouter>,
  document.getElementById('root')
);
