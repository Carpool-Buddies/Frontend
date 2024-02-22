import React, {useState, useEffect} from "react";
import {Chart} from "react-google-charts";
import {Button, Table, Popup, Segment, Dimmer, Loader, Grid, Icon} from "semantic-ui-react";
import {getTissueResults} from "../../common/fetchers";
import tissueIndexToNames from "../../../config/tissueIndexToNames";
import Tabs from "../tabs";
import popups from "../../../config/popups";

const tissueFilterResults = (props) => {
    const [processesDataGraph, setProcessesDataGraph] = useState([["ProAct score", "ProAct score", {
        type: "string",
        role: "tooltip"
    }]]);
    const [processesDataTable, setProcessesDataTable] = useState([]);
    const [hgncs, setHgncs] = useState([]);
    const [ens, setEns] = useState([]);
    const [gos, setGos] = useState([]);
    const [genesToShow, setGenesToShow] = useState([]);
    const [selectedProcess, setSelectedProcess] = useState("");
    const [relatedProcess, setRelatedProcess] = useState();
    const [selectedGo, setSelectedGo] = useState("");
    const [defs, setDefs] = useState([]);
    const [selectedDef, setSelectedDef] = useState("");
    const [fcs, setFcs] = useState([]);
    const [mode, setMode] = useState("");
    const [sessionId, setSessionId] = useState("");
    const [timeStamp, setTimeStamp] = useState("");
    const [error, setError] = useState(false)

    const genesHeaders = [
        {name: "HGNC Symbol"},
        {name: "Ensembl Gene ID"}
        // { name: '>P-value' },
    ];
    const zipGene = (a, b, c) => a.map((k, i) => ({ensembl: k, hgnc: b[i], fcs: c[i]}));
    const urlParams = props.match.params;
    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedProcessesData = await getTissueResults(urlParams.selectedTissue, urlParams.threshold, urlParams.checked, urlParams.mode, urlParams.sessionId, urlParams.timeStamp);
                setMode(urlParams.mode);
                setSessionId(urlParams.sessionId);
                setTimeStamp(urlParams.timeStamp);
                if (fetchedProcessesData) {
                    const tempProcessesDataTable = fetchedProcessesData.map(([processName, score, properties], index) => [`P${index + 1}`, parseFloat(score), `${processName}\nProAct score: ${parseFloat(score).toFixed(2)}`]);
                    setProcessesDataGraph([...processesDataGraph, ...tempProcessesDataTable]);
                    setProcessesDataTable(fetchedProcessesData.map(([processName, score, properties]) => [processName, score]));
                    setHgncs(fetchedProcessesData.map(([processName, score, properties]) => properties["hgncs"]));
                    setGos(fetchedProcessesData.map(([processName, score, properties]) => properties["go"]));
                    setEns(fetchedProcessesData.map(([processName, score, properties]) => properties["ens"]));
                    setDefs(fetchedProcessesData.map(([processName, score, properties]) => properties["definition"]));
                    setFcs(fetchedProcessesData.map(([processName, score, properties]) => properties["fcs"]));
                    if (urlParams.relatedProcess) setRelatedProcess(urlParams.relatedProcess);
                }
                else{
                    setError(true)
                }
            } catch (e) {
                console.log(e)
                setError(true)
            }
        };
        fetchData();
    }, []);

    const roundTwoDigits = (num) => Math.round(num * 100) / 100;
    const tissuesToShowIndex = ["Brain0", "Brain1", "Brain2", "Brain3", "Brain4", "Brain5"];
    const tissueHeader = tissuesToShowIndex.includes(urlParams.selectedTissue) || !tissueIndexToNames[urlParams.selectedTissue] ? urlParams.selectedTissue.toLowerCase() : tissueIndexToNames[urlParams.selectedTissue].toLowerCase();
    const checkRowMatchedProcess = (givenProcess) => relatedProcess && relatedProcess === givenProcess;

    const findRelatedProcessRank = () => {
        const currRelatedProcess = urlParams.relatedProcess;
        if (currRelatedProcess) {
            const rank = processesDataTable.findIndex((processData) => processData[0] === currRelatedProcess);
            return rank + 1;
        }
        return null;
    };
    if (error) {
        return (
            <div>
                <div className="ui segment centered very padded">
                    <p>
                        Unfortunately, something went wrong.
                        <br/>
                        If the problem persists please send us an email at:
                        <a href="mailto:estiyl@bgu.ac.il">estiyl@bgu.ac.il</a>
                    </p>
                </div>
            </div>
        );
    }
    if (processesDataGraph.length > 1 && processesDataTable.length > 0) {
        const relatedProcessRank = findRelatedProcessRank();
        const navigateToProcessPage = (process) => props.history.push(`/singleProcess/${mode}/${encodeURIComponent(process)}/${sessionId}/${timeStamp}`);
        const popUpMsg = (process) => "Click to view ProAct scores in all tissues";

        const openGenesListHandler = (index, process) => {
            setGenesToShow(zipGene(hgncs[index], ens[index].split(";"), fcs[index].split(";")));
            setSelectedProcess(process);
            setSelectedGo(gos[index]);
            setSelectedDef(defs[index]);
        };
        const brainDict = {
            brain0: popups.brain0Exp,
            brain1: popups.brain1Exp,
            brain2: popups.brain2Exp,
            brain3: popups.brain3Exp,
            brain4: popups.brain4Exp,
            brain5: popups.brain5Exp
        };
        const isBrainTissue = () => tissueHeader.toLowerCase().startsWith("brain");
        const brainExplanationQm = () => {
            if (isBrainTissue()) {
                return (
                    <Popup
                        wide
                        style={{display: "inline-block"}}
                        content={brainDict[tissueHeader.toLowerCase()]}
                        position="top right"
                        size="small"
                        trigger={(
                            <small style={{
                                color: "red"
                            }}
                            >
                                &nbsp;?
                            </small>
                        )}
                    />
                );
            }
            return null;
        };
        return (
            <>
                <div style={{alignItems: "center", width: "700px", margin: "0 auto"}}>
                    <br/>
                    <h1>
                        {`Top ${urlParams.threshold} preferentially active processes in  ${tissueHeader}`}
                        {brainExplanationQm()}
                    </h1>
                    {relatedProcessRank !== null ?
                        <h4>{relatedProcessRank === 0 ? `The process '${relatedProcess}' is not among the top 20 processes in ${tissueHeader}` : `The process '${relatedProcess}' is ranked ${relatedProcessRank} in ${tissueHeader}`}</h4> : null}
                    <Button basic
                            onClick={(e) => props.history.push(`/tissueResultsMSigDB/${mode}/${urlParams.selectedTissue}/${sessionId}/${timeStamp}`)}>
                        Change to MSigDB hallmark gene sets&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Icon name='exchange' />
                    </Button>
                </div>
                <div style={{float: "left"}}>
                    <Chart
                        width={1000}
                        height={500}
                        chartType="BarChart"
                        loader={<div>Loading Chart</div>}
                        data={processesDataGraph}
                        options={{
                            title: "*Mouse over bars to get process name and score in context.",
                            chartArea: {width: "70%"},
                            colors: ["#C0C0C0"],
                            hAxis: {
                                title: "ProAct score",
                                minValue: 0
                            },
                            vAxis: {
                                title: "Processes sign"
                            },
                            legend: {position: "none"}
                        }}
                        chartEvents={[
                            {
                                eventName: "ready",
                                callback: ({chartWrapper, google}) => {
                                    const chart = chartWrapper.getChart();
                                    google.visualization.events.addListener(chart, "click", e => {
                                        const splittedTargetID = e.targetID.split("#");
                                        const rowNumber = parseInt(splittedTargetID[splittedTargetID.length - 1], 10);
                                        props.history.push(`/singleProcess/${mode}/${encodeURIComponent(processesDataTable[rowNumber][0])}/${sessionId}/${currTimeStamp}`);
                                    });
                                }
                            }
                        ]}

                        legendToggle
                    />
                    <div className="ui grid">
                        <div className="fourteen wide tablet ten wide computer center aligned column">
                            <div className="ui basic segment">
                                <div className="ui center aligned segment" style={{overflow: "auto"}}>
                                    <h3>
                                        {`Top ${urlParams.threshold} preferntially active processes in ${tissueHeader}`}
                                        {brainExplanationQm()}
                                    </h3>
                                    <Table celled textAlign="center" collapsing selectable>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell width="1" key="ProcessSign">Process
                                                    index </Table.HeaderCell>
                                                <Table.HeaderCell width="3" key="ProcessName">Process GO
                                                    name</Table.HeaderCell>
                                                <Table.HeaderCell width="1" key="Go">GO term ID</Table.HeaderCell>
                                                <Table.HeaderCell width="1" key="Score">ProAct score</Table.HeaderCell>
                                                <Table.HeaderCell width="1" key="Score rank">Score
                                                    rank</Table.HeaderCell>
                                                <Table.HeaderCell width="1" key="Genes">Associated
                                                    genes</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>

                                        <Table.Body>
                                            {processesDataTable.map((processData, index) => (
                                                // <Popup
                                                //   content={`Click to see ProAct score for the process '${processData[0]}'`}
                                                //   trigger={(
                                                //   )}
                                                // />
                                                <Table.Row key={processData[0]}
                                                           active={checkRowMatchedProcess(processData[0])}>
                                                    <Table.Cell
                                                        onClick={(e) => navigateToProcessPage(processData[0])}><Popup
                                                        content={popUpMsg(processData[0])}
                                                        trigger={(<div>{`P${index + 1}`}</div>)}/></Table.Cell>
                                                    <Table.Cell
                                                        onClick={(e) => navigateToProcessPage(processData[0])}><Popup
                                                        content={popUpMsg(processData[0])}
                                                        trigger={(<div>{processData[0]}</div>)}/></Table.Cell>
                                                    {gos.length > 0 ? <Table.Cell
                                                        onClick={(e) => navigateToProcessPage(processData[0])}><Popup
                                                        content={popUpMsg(processData[0])}
                                                        trigger={(<div>{gos[index]}</div>)}/></Table.Cell> : null}
                                                    <Table.Cell
                                                        onClick={(e) => navigateToProcessPage(processData[0])}><Popup
                                                        content={popUpMsg(processData[0])}
                                                        trigger={(
                                                            <div>{roundTwoDigits(processData[1])}</div>)}/></Table.Cell>
                                                    <Table.Cell
                                                        onClick={(e) => navigateToProcessPage(processData[0])}><Popup
                                                        content={popUpMsg(processData[0])}
                                                        trigger={(<div>{index + 1}</div>)}/></Table.Cell>
                                                    <Table.Cell><Button style={{backgroundColor: "#ECECEC"}}
                                                                        onClick={() => openGenesListHandler(index, processData[0])}>Open
                                                        list of
                                                        genes</Button></Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table>
                                </div>
                            </div>
                        </div>
                        <div className="computer only six wide centered column">
                            <div className="ui basic segment">
                                <div className="ui segment">
                                    <Tabs selectedProcess={selectedProcess} genesToShow={genesToShow}
                                          processesToShow={[{
                                              processName: selectedProcess,
                                              processGoId: selectedGo,
                                              processDef: selectedDef
                                          }]} containsFcHeader/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
    return (<div>
        <Grid>
            <Grid.Row>
                <Grid.Column>
                    <Dimmer active inverted style={{marginTop: "5%"}}>
                        <Loader inverted>Calculating ProAct scores for your query...</Loader>
                    </Dimmer>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </div>);
};

export default tissueFilterResults;
