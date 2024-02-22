import React, {useState, useEffect} from "react";
import {Table, Button, Dropdown, Modal} from "semantic-ui-react";
import {getUserExpData, getSessionCluster, getFullUserExpData} from "../common/fetchers";
import Tabs from "./tabs";
import exampleUserExpRanks from "../../config/exampleUserExpRanks";
import {BASE_API_URL} from "../../../config/environment";
import {CSVLink} from "react-csv";

const UserExpRanks = (props) => {
    const [data, setData] = useState(new Map());
    const [selectedCluster, setSelectedCluster] = useState("");
    const [selectedClusters, setSelectedClusters] = useState([]);
    const [genesToShow, setGenesToShow] = useState([]);
    const [selectedProcess, setSelectedProcess] = useState("");
    const [selectedProcessGo, setSelectedProcessGo] = useState("");
    const [openGeneTab, setOpenGeneTab] = useState(false);
    const [selectedProcessDef, setSelectedProcessDef] = useState("");
    const [fetchFailed, setFetchFailed] = useState(false);
    const [isWaitingForRes, setIsWaitingForRes] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [modalOpen, setModalOpen] = React.useState(false)

    const EXAMPLE_PATH = `${BASE_API_URL}/getExampleFile`;

    const zipGene = (a, b) => a.map((k, i) => ({ensembl: k, hgnc: b[i]}));

    useEffect(() => {
        const urlParams = props.match.params;
        const clusters = urlParams.selectedClusters.split(";").sort()
        const uploadedFile = props.location.state ? props.location.state.csv : "";
        const timeStamp = urlParams.timeStamp;
        const sessionId = urlParams.sessionId;
        setSelectedCluster(clusters[0]);
        setSelectedClusters(clusters)
        const processRankMap = new Map()
        const fetchData = async (cluster) => {
            const fetchedResults = await getSessionCluster(sessionId, timeStamp, "userExp", cluster);
            let proccessRank;
            if (urlParams.example) {
                proccessRank = exampleUserExpRanks;
                setIsWaitingForRes(false);
            } else if (fetchedResults !== "error") {
                proccessRank = fetchedResults;
                setIsWaitingForRes(false);
            } else {
                proccessRank = await getUserExpData(cluster, uploadedFile, sessionId, timeStamp);
            }
            if (proccessRank) {
                if (proccessRank.length === 0) {
                    setIsWaitingForRes(false);
                    setFetchFailed(true);
                } else {
                    setIsWaitingForRes(false);
                    processRankMap.set(cluster, proccessRank)
                    setData(processRankMap);
                    if (processRankMap.size === clusters.length && processRankMap.size > 0)
                        setIsReady(true)
                }
            }
        };
        clusters.forEach(cluster => fetchData(cluster))
    }, []);

    const createCsvData = (arr) => {
        const items = JSON.parse(arr)
        const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
        const header = ['processName', 'go', 'definition', 'score', 'genes', 'hgncs']
        return [
            header.join(','),
            ...items.map(row => header.map(fieldName => JSON.stringify(row[0][fieldName].toString().replaceAll(';', ','), replacer)).join(','))
        ].join('\r\n')
    };

    const createMergedCsvData = (map) => {
        const replacer = (key, value) => value === null ? '' : value
        const header = ['clusterName', 'processName', 'go', 'definition', 'score', 'genes', 'hgncs']
        Array.from(map.keys()).forEach(cluster => map.get(cluster).forEach(row => row[0].clusterName = cluster))
        const items = [...Array.from(map.values()).flat()]
        return [
            header.join(','),
            ...items.map(row => header.map(fieldName => JSON.stringify(row[0][fieldName].toString().replaceAll(';', ','), replacer)).join(','))
        ].join('\r\n')
    }

    const fetchFullData = async (cluster) => {
        let proccessRank = await getFullUserExpData(
            cluster,
            props.location.state ? props.location.state.csv : "",
            props.match.params.sessionId,
            props.match.params.timeStamp);
        if (proccessRank) {
            if (proccessRank.length === 0)
                return []
            else
                return proccessRank
        }
    };

    const downloadFullCSV = (cluster) => {
        setModalOpen(true)
        fetchFullData(cluster).then(result => {
            const link = document.createElement('a')
            link.href = URL.createObjectURL(new Blob([createCsvData(JSON.stringify(result))], {type: 'text/csv;charset=utf-8;'}))
            link.download = 'Full_ProAct_scores_processes_in_subset_' + selectedCluster + '.csv'
            link.click();
        }).finally(() => {
            setModalOpen(false)
        })
    }

    const selectProcessHandler = (processData) => {
        setGenesToShow(zipGene(processData[0]["hgncs"], processData[0]["genes"].split(";")));
        setSelectedProcess(processData[0]["processName"]);
        setSelectedProcessGo(processData[0]["go"]);
        setSelectedProcessDef(processData[0]["definition"]);
    };
    if (isWaitingForRes) {
        return <div className="ui segment"><h3>The calculation is still in progress please check this link: <a
            href={window.location.href}>{window.location.href}</a> later</h3></div>;
    }
    if (fetchFailed) {
        return <div className="ui segment">
            <h3>{`The Calculation of ProAct in subset ${selectedCluster.toLowerCase()} was failed.`}</h3><h3>please
            check that
            you upload file according to the instructions and upload again. </h3></div>;
    }
    if (isReady) {
        const urlParams = props.match.params;
        return (
            <>
                <Modal
                    open={modalOpen}
                    size='small'
                    closeOnDimmerClick={false}
                    header={'Downloading full list for ' + selectedCluster}
                    content='This might take a few minutes. Thank you for your patience.'/>
                <h2 style={{textAlign: "center", width: "100%"}}>
                    {`Top ${Math.min(10, data.get(selectedCluster).length)} ProAct process scores in subset ${selectedCluster}`}</h2>
                <table style={{padding: "10px"}}>
                    <tbody>
                    <tr>
                        <td>Select cluster:</td>
                        <td><Dropdown id="clusters" options={selectedClusters.map((fetchedCluster) => ({
                            key: fetchedCluster, value: fetchedCluster, text: fetchedCluster
                        }))} defaultValue={selectedCluster} selection
                                      onChange={(e, val) => setSelectedCluster(val.value)}/></td>
                    </tr>
                    </tbody>
                </table>
                {urlParams.example ? <Button><a href={EXAMPLE_PATH}>Download input data</a></Button> : null}
                <div className="ui grid" style={{paddingTop: "10px"}}>
                    <div className="fourteen wide tablet ten wide computer center aligned column">
                        <div className="ui center aligned segment" style={{overflow: "auto"}}>
                            <div style={{float: "center"}}>
                                <Table celled textAlign="center" collapsing>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell width="1" key="ProcessName">GO process
                                                name</Table.HeaderCell>
                                            <Table.HeaderCell width="1" key="Go">GO process term
                                                accession</Table.HeaderCell>
                                            <Table.HeaderCell width="1" key="Score">ProAct score</Table.HeaderCell>
                                            <Table.HeaderCell width="1" key="Rank">Rank in cell
                                                subset</Table.HeaderCell>
                                            <Table.HeaderCell width="1" key="Genes">Genes</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {data.get(selectedCluster).slice(0, 10).map((processData, index) => (
                                            <Table.Row key={processData[0]["go"]}>
                                                <Table.Cell>{processData[0]["processName"]}</Table.Cell>
                                                <Table.Cell>{processData[0]["go"]}</Table.Cell>
                                                <Table.Cell>{processData[0]["score"]}</Table.Cell>
                                                <Table.Cell>{index + 1}</Table.Cell>
                                                {/* <Table.Cell>{processData[0]['genes'].replace(/;/g, ',\n')}</Table.Cell> */}
                                                <Table.Cell><Button onClick={() => selectProcessHandler(processData)}>Open
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
                        <div style={{textAlign: "center", width: "100%"}}>
                            <Button onClick={() => {
                                downloadFullCSV(selectedCluster)
                            }}>
                                Download full list for<br/>{selectedCluster}</Button>
                            <CSVLink
                                filename={`Top_ProAct_scores_processes_in_subset_${selectedCluster}.csv`}
                                data={createCsvData(JSON.stringify(data.get(selectedCluster)))}
                                target="_blank">
                                <Button style={{marginTop: '10px'}}>Download top 10 list for<br/>{selectedCluster}
                                </Button>
                            </CSVLink>
                            <br/>
                            <CSVLink
                                filename={`Top_ProAct_scores_processes_in_subsets_${selectedClusters.join(',')}.csv`}
                                data={createMergedCsvData(data)}
                                target="_blank">
                                <Button style={{marginTop: '10px'}}>Download top 10 list for<br/>all clusters</Button>

                            </CSVLink>
                        </div>
                        <div className="ui basic segment">
                            <div className="ui segment">
                                <Tabs selectedProcess={selectedProcess} genesToShow={genesToShow}
                                      openGeneTab={openGeneTab}
                                      processesToShow={[{
                                          processName: selectedProcess,
                                          processGoId: selectedProcessGo,
                                          processDef: selectedProcessDef
                                      }]}/>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
    return (
        <div className="ui segment">
            <h3>{`Calculating ProAct in subsets ${selectedClusters.join(', ').toLowerCase()}.`}</h3>
            <h3>This might take a few minutes. Thank you for your patience. </h3>
            <h3>
                The results will be displayed at:
                <br/>
                <br/>
                <a href={window.location.href}>{window.location.href}</a>
                <br/>
                <br/>
                You can save the link and come back later to view the results!
            </h3>
        </div>
    );
};

export default UserExpRanks;
