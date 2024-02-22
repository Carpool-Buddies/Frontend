import React, {useState, useEffect} from "react";
import {HeatMapGrid} from "react-grid-heatmap";
import {Dimmer, Grid, Icon, Loader, Table} from "semantic-ui-react";
import tissuesList from "../../../config/tissues";
import {getMultipleProcesses} from "../../common/fetchers";
import generateGUID from "../../common/utilities";
import tissueIndexToNames from "../../../config/tissueIndexToNames";
import heatmapLegned from "../../../static/heatmap_legend.png";

const multipleProcessesResults = (props) => {
    const [processesNames, setProcessesNames] = useState([]);
    const [tissuesNames, setTissuesNames] = useState([]);
    const [cellsData, setcellsData] = useState([]);
    const [maxValue, setMaxValue] = useState(0);
    const [minValue, setMinValue] = useState(0);
    const [processesGo, setProcessesGo] = useState([]);
    const [relatedGenes, setRelatedGenes] = useState([]);
    const [currMode, setMode] = useState("");
    const [currSessionId, setSessionId] = useState("");
    const [currTimeStamp, setTimeStamp] = useState("");
    const [isError, setErrorStatus] = useState(false);

    const flattenList = (lst) => lst.reduce((p, c) => p.concat(c));

    useEffect(() => {
        const urlParams = props.match.params;
        const decodedProcesses = decodeURIComponent(urlParams.selectedProcesses);
        const mode = urlParams.mode;
        const timeStamp = urlParams.timeStamp;
        setMode(mode);
        const sessionId = urlParams.sessionId;
        setTimeStamp(timeStamp);
        setSessionId(sessionId);
        setProcessesNames(decodedProcesses.split(";"));
        const decodedGenes = decodeURIComponent(urlParams.relatedGenes);
        if (decodedGenes)
            setRelatedGenes(decodedGenes.split(";"));

        const formatData = (arrayDict) => {
            const valuesLists = [];
            arrayDict.forEach((obj) => {
                valuesLists.push(Object.values(obj));
            });
            setMaxValue(Math.max.apply(null, flattenList(valuesLists)));
            setMinValue(Math.min.apply(null, flattenList(valuesLists)));
            return valuesLists;
        };

        const fetchData = async () => {
            try {
                const fetchedTissuesData = await getMultipleProcesses(decodedProcesses, mode, sessionId, timeStamp);
                if (fetchedTissuesData) {
                    const tissuesRankList = fetchedTissuesData.map(fetchedTissueData => fetchedTissueData["ranks"]);
                    setTissuesNames(Object.keys(tissuesRankList[0]));
                    setcellsData(formatData(tissuesRankList));
                    setProcessesGo(fetchedTissuesData.map(fetchedTissueData => fetchedTissueData["go"]))
                }
                else{
                    setErrorStatus(true)
                }
            } catch (e) {
                console.log(e)
                setErrorStatus(true)
            }
        };
        fetchData();
    }, []);
    const generateColors = (x, y) => {
        const value = cellsData[x][y];
        const ConstMaxValue = 6;
        const constMinValue = -3;
        const output = value > 0 ? `rgba(233, 14, 14, ${1 - (ConstMaxValue - value) / (ConstMaxValue)})` : `rgba(51, 51, 255, ${1 - (constMinValue - value) / (constMinValue)})`;
        return output;
    };
    const yLabels = processesNames.map((_, index) => `P${index + 1}`);
    const xLabels = currMode == "dependentData" ? tissuesNames.map((_, index) => `C${index + 1}`) : tissuesNames.map((_, index) => `T${index + 1}`);

    const tissueLegendMapper = (index) => {
        const signTissueValue = xLabels[index];
        const actualTissueValue = tissuesNames[index];
        return (
            <Table.Row key={index}>
                <Table.Cell>
                    {signTissueValue}
                </Table.Cell>
                <Table.Cell>
                    {actualTissueValue}
                </Table.Cell>
                <Table.Cell>
                    {tissueIndexToNames[actualTissueValue] || actualTissueValue}
                </Table.Cell>
            </Table.Row>
        );
    };

    const processLegendMapper = (index) => {
        const signProcessValue = yLabels[index];
        const actualProcesseValue = processesNames[index].replaceAll('_', ' ')
        const currGo = processesGo[index];
        return (
            <Table.Row key={index}>
                <Table.Cell>
                    {signProcessValue}
                </Table.Cell>
                <Table.Cell>
                    {actualProcesseValue}
                </Table.Cell>
                <Table.Cell>
                    <a href={`http://amigo.geneontology.org/amigo/term/${currGo}`} rel="noreferrer"
                       target="_blank">{currGo}</a>
                </Table.Cell>
            </Table.Row>
        );
    };
    if (isError) {
        return (<div>
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
    } else if (cellsData.length > 0) {
        return (
            <div>
                {relatedGenes && relatedGenes[0] != 'undefined' ?
                    relatedGenes.length > 1 ?
                        <h2>{`The genes ${relatedGenes.join(", ")} are associated with ${processesNames.length} processes:`}</h2> :
                        <h2>{`The gene ${relatedGenes[0]} is associated with ${processesNames.length} processes:`}</h2>
                    : <h2>ProAct scores in tissues</h2>}
                {!relatedGenes ? <h2>ProAct scores in tissues</h2> : null}
                <div className="ui grid">
                    <div className="three column row">
                        <div className="left floated column" style={{fontSize: "0.95em"}}>
                            <Icon className={"info circle"}/>
                            <i>
                                <b>
                                    Click on process to have a process-specific view
                                </b>
                            </i>
                        </div>
                        <div className="right floated column"><img src={heatmapLegned} alt="HeatmapLegend"/></div>
                    </div>
                </div>
                <br/>
                <div style={{width: "100%", overflow: "auto"}}>
                    <HeatMapGrid
                        key="HeatMapGrid"
                        data={cellsData}
                        xLabels={xLabels}
                        yLabels={yLabels}
                        // Reder cell with tooltip
                        cellRender={(x, y, value) => (
                            <div
                                title={`Process name - ${processesNames[x]}\nTissue index - ${tissuesNames[y]}\nScore = ${value !== null ? value : 'no score found'}`}
                            >
                                {value !== null ? value : 'NA'}
                            </div>
                        )}
                        xLabelsStyle={(index) => ({
                            color: "#777",
                            fontSize: ".8rem"
                        })}
                        yLabelsStyle={() => ({
                            fontSize: ".7rem",
                            color: "#777"
                        })}
                        cellStyle={(x, y, ratio) => ({
                            background: generateColors(x, y),
                            fontSize: ".8rem",
                            color: `rgb(0, 0, 0, ${ratio / 2 + 0.4})`
                        })}
                        cellHeight="2rem"
                        xLabelsPos="bottom"
                        onClick={(x, y) => props.history.push(`/singleProcess/${currMode}/${encodeURIComponent(processesNames[x])}/${currSessionId}/${currTimeStamp}`)}
                        yLabelsPos="left"
                        square
                    />
                </div>
                <br/>
                <div className="ui grid" float="center">
                    <label htmlFor="tissueLegend" key="tissueLegend">
                        <b>Legend</b>
                    </label>
                </div>
                <div className="ui grid">
                    <div className="two column row">
                        <div className="left floated column">
                            <Table celled collapsing textAlign="left" size="small">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Process index</Table.HeaderCell>
                                        <Table.HeaderCell>Process GO name</Table.HeaderCell>
                                        <Table.HeaderCell>GO term accession</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {yLabels.map((yLabel, index) => processLegendMapper(index))}
                                </Table.Body>
                            </Table>
                        </div>
                        <div className="right floated column">
                            <Table celled collapsing textAlign="left" size="small">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>{currMode === "dependentData" ? "Context" : "Tissue"} index</Table.HeaderCell>
                                        <Table.HeaderCell>{currMode === "dependentData" ? "Context" : "Tissue"} name</Table.HeaderCell>
                                        <Table.HeaderCell>{currMode === "dependentData" ? "Context" : "Tissue"}/Sub-{currMode == "dependentData" ? "context" : "Tissue"} name</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {xLabels.map((xLabel, index) => tissueLegendMapper(index))}
                                </Table.Body>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
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
export default multipleProcessesResults;
