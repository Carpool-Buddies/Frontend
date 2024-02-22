import React, {useState, useEffect} from "react";
import {Chart} from "react-google-charts";
import {Dimmer, Grid, Loader, Message, Popup, Table} from "semantic-ui-react";
import {getSingleProcess} from "../../common/fetchers";
import tissueIndexToNames from "../../../config/tissueIndexToNames";
import Tabs from "../tabs";

const SingleProcessResults = (props) => {
    const [tissuesDataGraph, setTissuesDataGraph] = useState([["ProAct score", "ProAct score"]]);
    const [tissuesDataTable, setTissuesDataTable] = useState([]);
    const [processName, setProcessName] = useState("");
    const [genes, setGenes] = useState([]);
    const [relatedGenes, setRelatedGenes] = useState();
    const [go, setGo] = useState("");
    const [def, setDef] = useState("");
    const [mode, setMode] = useState("");
    const [sessionId, setSessionId] = useState("");
    const [timeStamp, setTimeStamp] = useState("");
    const [noScore, setNoScore] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
            const urlParams = props.match.params;
            const decodedProcessName = decodeURIComponent(urlParams.selectedProcess);
            const currMode = urlParams.mode;
            const currTimeStamp = urlParams.timeStamp;
            setTimeStamp(currTimeStamp);
            setMode(currMode);
            const currSessionId = urlParams.sessionId;
            setSessionId(currSessionId);
            setProcessName(decodedProcessName);
            const decodedGenes = decodeURIComponent(urlParams.relatedGenes);
            if (decodedGenes && decodedGenes !== 'undefined') {
                setRelatedGenes(decodedGenes.split(";"));
            }
            const formatData = (tissuesDataObj, diagram) => {
                const output = [];
                Object.entries(tissuesDataObj).forEach(([k, v]) => {
                    (diagram === "graph") ? output.push([k, parseFloat(v[1])]) : output.push([k, v[1], v[0], tissueIndexToNames[k] || k]);
                });
                return output.sort((tissueData1, tissueData2) => tissueData2[1] - tissueData1[1]);
            };

            const fetchData = async () => {
                try {
                    const fetchedTissuesData = await getSingleProcess(decodedProcessName, currMode, currSessionId, currTimeStamp);
                    if (fetchedTissuesData) {
                        const arrangedDataGraph = formatData(fetchedTissuesData.slice(1)[0], "graph");
                        const arrangedDataTable = formatData(fetchedTissuesData.slice(1)[0], "table");
                        setTissuesDataGraph([...tissuesDataGraph, ...arrangedDataGraph]);
                        setTissuesDataTable([...tissuesDataTable, ...arrangedDataTable]);
                        setGenes(fetchedTissuesData[0]["genes"]);
                        setGo(fetchedTissuesData[0]["go"]);
                        setDef(fetchedTissuesData[0]["definition"]);
                    }
                    else {
                        setError(true)
                    }
                } catch (e) {
                    console.log(e)
                    setNoScore(true)
                }
            }
            fetchData();
        }, []
    )
    ;

    if (noScore===false && tissuesDataGraph.length > 1 && tissuesDataTable.length > 0) {
        const slicedTissueData = tissuesDataGraph.slice(0, 15);
        const minScore = Math.min(slicedTissueData[slicedTissueData.length - 1][1], -1);
        const maxScore = Math.max(slicedTissueData[1][1], 4);
        const createGraphTitle = () => {
            let firstLine = "";
            if (relatedGenes) {
                firstLine = relatedGenes.length > 1 ?
                    `The genes ${relatedGenes.join(", ")} are associated with ${processName}.\n\n` :
                    `The gene ${relatedGenes[0]} is associated with ${processName}.\n\n`
                ;
            }
            return `${firstLine} Differential activity of '${processName}' in human ${mode === "dependentData" ? "context" : "tissue"}`;
        };
        return (
            <>
                <div style={{float: "left"}}>
                    <div className="ui grid">
                        <div className="ten wide column">
                            <Chart
                                width={600}
                                height={500}
                                chartType="ColumnChart"
                                loader={<div>Loading Chart</div>}
                                data={tissuesDataGraph.slice(0, 15)}
                                options={{
                                    title: createGraphTitle(),
                                    titleTextStyle: {fontSize: 15},
                                    chartArea: {width: "70%"},
                                    colors: ["#C0C0C0"],
                                    hAxis: {
                                        title: "Tissues",
                                        textStyle: {
                                            fontSize: 10
                                        }
                                    },
                                    vAxis: {
                                        title: "ProAct Score",
                                        minValue: minScore,
                                        maxValue: maxScore
                                    },
                                    legend: {position: "none"}
                                }}
                                legendToggle
                            />
                        </div>
                        <div className="six wide column">
                            <div className="ui compact segment">
                                <Tabs selectedProcess={processName}
                                      genesToShow={genes.map(gene => ({
                                          ensembl: gene.hgnc,
                                          hgnc: gene.ens
                                      }))} //it's somehow reversed
                                      processesToShow={[{
                                          processName: processName,
                                          processGoId: go,
                                          processDef: def
                                      }]}/>
                            </div>
                        </div>
                    </div>
                    <h3>{`Differential activity of '${processName}' in human ${mode === "dependentData" ? "context" : "tissue"}`}</h3>
                    <Table celled size="small" selectable>
                        <Table.Header>
                            <Table.Row textAlign="center">
                                <Table.HeaderCell key="TissueIndex"
                                                  width="1">{mode === "dependentData" ? "Context" : "Tissue"} name</Table.HeaderCell>
                                <Table.HeaderCell key="TissueName"
                                                  width="2">{mode === "dependentData" ? "Context" : "Tissue"}/Sub-{mode === "dependentData" ? "context" : "tissue"} name</Table.HeaderCell>
                                <Table.HeaderCell key="Score" width="1">ProAct score</Table.HeaderCell>
                                <Table.HeaderCell key="Rank" width="1">Score rank</Table.HeaderCell>
                                {mode !== "dependentData" ? <Table.HeaderCell key="Pvalue" width="1">
                                    <div>Adjusted p-value</div>
                                    <div>(z-test)</div>
                                </Table.HeaderCell> : null}
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {tissuesDataTable.map((tissueData, index) => (
                                <Popup
                                    key={index}
                                    wide
                                    content={`Click to see top 20 processes in ${tissueData[0]}`}
                                    trigger={(
                                        <Table.Row key={tissueData[0]}
                                                   onClick={(e) => props.history.push(`/tissueResults/${mode}/${tissueData[0]}/20/false/${sessionId}/${timeStamp}/${processName}`)}>
                                            <Table.Cell textAlign="left">{tissueData[0]}</Table.Cell>
                                            <Table.Cell textAlign="left">{tissueData[3]}</Table.Cell>
                                            <Table.Cell textAlign="center">{tissueData[1]}</Table.Cell>
                                            <Table.Cell textAlign="center">{index + 1}</Table.Cell>
                                            {mode !== "dependentData" ?
                                                <Table.Cell textAlign="center">{tissueData[2]}</Table.Cell> : null}
                                        </Table.Row>
                                    )}
                                />
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            </>
        );
    }
    if (error) {
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
    }
    if (noScore) {
        return (
            <div className="ui segment centered very padded">
                <p>
                    {`Unfortunately there is no data for this process '${processName}'`}.
                </p>
            </div>
        )
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
    </div>)
}

export default SingleProcessResults;
