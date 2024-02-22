import {isNumeric} from "jquery";
import React, {useState, useEffect} from "react";
import {CSVLink} from "react-csv";
import {Chart} from "react-google-charts";
import {Table, Button, TableHeader, Icon, Segment, Grid} from "semantic-ui-react";
import {getCellIdentityGroupsData, getSession} from "../../common/fetchers";
import exampleCellIdentity from "../../../config/exampleCellIdentity";
import "./cellIdentityResults.css";
import {ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label} from 'recharts';
import cellIdentityResultsGraph from "./cellIdentityResultsGraph";
import CellIdentityResultsGraph from "./cellIdentityResultsGraph";
import {BASE_API_URL} from "../../../../config/environment";

const cellIdentityResults = props => {
    const [data, setData] = useState();
    const [numOfGenesInProcesses, setNumOfGenesInProcesses] = useState(0);
    const [numOfGenesInUserFile, setNumOfGenesInUserFile] = useState(0);
    const [tableHeaders, setTableHeaders] = useState([""]);
    const [error, setError] = useState(false);
    const [tableData, setTableData] = useState({
        column: 0,
        direction: "",
        data: []
    });
    const [graphData, setGraphData] = useState([
        "mean ProAct score",
        "cell type groups",
        {type: "string", role: "tooltip"}
    ]);
    const [ticks, setTicks] = useState([]);
    const [columnSortBy, setColumnSortBy] = useState("");
    const [dataToDownload, setDataToDownload] = useState();
    const [isWaitingForRes, setIsWaitingForRes] = useState(false);
    // const [sessionId, setSessionId] = useState()
    // const [timeStamp, settimeStamp] = useState()

    const roundTo2Digits = varaible =>
        typeof varaible === "number" ? Math.round(varaible * 100) / 100 : varaible;

    const extractRowsNames = fetchedData => {
        const firstRowAttr = Object.keys(fetchedData)[0];
        return Object.keys(fetchedData[firstRowAttr]);
    };

    const toggleArrow = idx => {
        if (tableData.column === idx) {
            if (tableData.direction === "ascending") return " ▲";
            return " ▼";
        }
        return "";
    };
    const sortNumericAndStrings = arr =>
        arr.sort((a, b) =>
            isNumeric(a) && !isNumeric(b) ? 1 : !isNumeric(a) && isNumeric(b) ? -1 : 0
        );

    const extractTableData = (fetchedData, fetchedHeaders) => {
        const rows = [];

        const rowsNames = extractRowsNames(fetchedData);
        rowsNames.forEach(rowName => {
            const row = [];
            row.push(rowName);
            fetchedHeaders.forEach(fetchedHeader => {
                if (fetchedHeader !== "") {
                    row.push(roundTo2Digits(fetchedData[fetchedHeader][rowName]));
                }
            });
            rows.push(row);
        });
        return rows;
    };

    const extractGraphData = fetchData => {
        // eslint-disable use-isnan
        const dots = [];
        sortNumericAndStrings(Object.keys(fetchData)).forEach(cluster => {
            Object.keys(fetchData[cluster]).forEach((key, index) => {
                if (typeof fetchData[cluster][key] === "number") {
                    dots.push([
                        cluster,
                        fetchData[cluster][key],
                        `Your cell subset: ${cluster}\nSuggested cell type: ${key}\nMean ProAct score: ${roundTo2Digits(
                            fetchData[cluster][key]
                        )}`
                    ]);
                }
            });
        });
        return dots;
    };

    const createTicks = fetchData => {
        const objsArr = Object.values(fetchData);
        const rowsNames = Object.keys(objsArr[0]);
        const generatedTicks = [];
        rowsNames.forEach((rowName, index) =>
            generatedTicks.push({v: index, f: rowName})
        );
        return generatedTicks;
    };

    const createProcessesCsvData = () => {
        if (dataToDownload) {
            const columnsNames = ["", ...Object.keys(dataToDownload)];
            const rowsNames = Object.keys(dataToDownload[columnsNames[1]]);
            const csvContent = columnsNames.slice(1).map(columnName => [
                columnName,
                ...rowsNames.map(rowsName => dataToDownload[columnName][rowsName]),
            ]);
            const csvData = [["", ...rowsNames], ...csvContent];
            return csvData;
        }
        return []
    };

    const createCellCsvData = () => {
        if (tableData) {
            let resData = [];
            tableData.data.forEach(a => resData.push([...a].reverse())); // reverse rows
            let headers = [...tableHeaders].reverse();
            return [headers, ...resData];
        }
        return [];
    };

    useEffect(() => {
        const uploadedFile = props.location.state ? props.location.state.csv : "";
        const urlParams = props.match.params;
        const timeStamp = urlParams.timeStamp;
        const sessionID = urlParams.sessionId;
        const fetchData = async () => {
            try {
                const fetchedResults = await getSession(sessionID, timeStamp, "cellType");
                let cellIdentityRank;
                if (urlParams.example) {
                    cellIdentityRank = exampleCellIdentity;
                    setIsWaitingForRes(false);
                } else if (fetchedResults !== "error") {
                    cellIdentityRank = fetchedResults;
                    setIsWaitingForRes(false);
                } else {
                    cellIdentityRank = await getCellIdentityGroupsData(
                        uploadedFile,
                        timeStamp,
                        sessionID
                    );
                }
                if (cellIdentityRank.length != 0) {
                    setData(cellIdentityRank["data"]);
                    setDataToDownload(cellIdentityRank["data_to_download"]);
                    setNumOfGenesInProcesses(
                        cellIdentityRank["number_of_genes_in_processes"]
                    );
                    setNumOfGenesInUserFile(cellIdentityRank["num_of_genes_in_user_file"]);
                    const fetchedHeaders = sortNumericAndStrings(
                        Object.keys(cellIdentityRank["data"])
                    );
                    // fetchedHeaders.push("");
                    let newTableHeaders = [...tableHeaders, ...fetchedHeaders];
                    newTableHeaders[0] = "Cell type";
                    setTableHeaders(newTableHeaders);
                    setTableData({
                        column: "",
                        direction: "",
                        data: extractTableData(cellIdentityRank["data"], fetchedHeaders)
                    });
                    const initGraphData = [...extractGraphData(cellIdentityRank["data"])];
                    const tempGraphData = initGraphData.map(arr => ({x: arr[0], y: arr[1], z: arr[2]}));
                    setGraphData(tempGraphData);

                    setTicks(createTicks(cellIdentityRank["data"]));
                    setIsWaitingForRes(false);
                } else {
                    setError(true)
                }
            } catch(e) {
                console.log(e)
                setError(true)
            }
        }
        if (!data) {
            fetchData();
        }
    }, []);

    const handleSort = e => {
        const sortData = (dataToSort, index) =>
            dataToSort.sort((rowA, rowB) => {
                if (tableData.direction === "ascending") {
                    return !isNumeric(rowA[index]) || rowA[index] < rowB[index]
                        ? -1
                        : !isNumeric(rowB[index]) || rowA[index] > rowB[index]
                            ? 1
                            : 0;
                }
                return !isNumeric(rowB[index]) || rowA[index] < rowB[index]
                    ? -1
                    : !isNumeric(rowA[index]) || rowA[index] > rowB[index]
                        ? 1
                        : 0;
            });
        const columnIdx = e.target.id;
        if (
            tableData.direction === "descending" ||
            tableData.column !== columnIdx
        ) {
            setTableData({
                column: columnIdx,
                direction: "ascending",
                data: sortData(tableData.data, columnIdx)
            });
        } else {
            setTableData({
                column: columnIdx,
                direction: "descending",
                data: sortData(tableData.data, columnIdx).reverse()
            });
        }
    };
    const EXAMPLE_PATH = `${BASE_API_URL}/getExampleFile`;

    if (isWaitingForRes) {
        return (
            <div className="ui segment">
                <h3>
                    The calculation is still in progress please check this link:{" "}
                    <a href={window.location.href}>{window.location.href}</a> later
                </h3>
            </div>
        );
    }
    if (error) {
        return (
            <div className="ui segment">
                <h3>Calculating ProAct for user file was failed</h3>
                <h3>
                    please check that you upload file according to the instructions and
                    upload again.{" "}
                </h3>
            </div>
        );
    }
    if (data) {
        // setTableData(extractTableData())
        const urlParams = props.match.params;
        if (data.length === 0) {
            return (
                <div className="ui segment">
                    <h3>Calculating ProAct for user file was failed</h3>
                    <h3>
                        please check that you upload file according to the instructions and
                        upload again.{" "}
                    </h3>
                </div>
            );
        }
        return (
            <div style={{width: "100%"}}>
                <h1 style={{textAlign: "center", width: "100%"}}>
                    ProAct scores in cell subsets
                </h1>
                <h3
                    style={{textAlign: "center", width: "100%"}}
                >{`Among ${numOfGenesInUserFile} genes in your input file, ${numOfGenesInProcesses} genes participate in processes associated with cell types.`}</h3>
                <br/>
                <Grid>
                    <Grid.Row style={{paddingLeft: "50px"}}>
                        <CSVLink
                            filename="Suggested_cell_types_ProAct.csv"
                            data={createCellCsvData()}
                            target="_blank"
                        >
                            <Button>Download scores matrix</Button>
                        </CSVLink>
                        <CSVLink
                            filename="Processes_scores.csv"
                            data={createProcessesCsvData()}
                            target="_blank"
                        >
                            <Button>Download process scores in cell subsets</Button>
                        </CSVLink>
                        {urlParams.example ? (
                            <div>
                                <Button>
                                    <a href={EXAMPLE_PATH}>Download input data</a>
                                </Button>
                            </div>
                        ) : null}
                    </Grid.Row>
                </Grid>

                <br/>
                <br/>
                <CellIdentityResultsGraph height={400} width={900} data={graphData}/>

                <div>
                    <Icon className={"info circle"}/>
                    <i>
                        <b>
                            Click on subset name to sort the suggested cell types by ProAct scores
                        </b>
                    </i>
                </div>
                <br/>
                <div
                    className="ui center aligned segment tscroll"
                    style={{overflow: "auto"}}
                >
                    <Table
                        celled
                        compact="very"
                        size="small"
                        style={{fontSize: "0.72em"}}
                        sortable
                    >
                        <Table.Header>
                            <Table.Row key=".">
                                {tableHeaders.map((tableHeader, index) => (
                                    <Table.HeaderCell
                                        onClick={handleSort}
                                        width="1"
                                        key={String(index)}
                                        id={index}
                                    >
                                        {tableHeader + toggleArrow(String(index))}
                                    </Table.HeaderCell>
                                ))}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {tableData.data.map((row, index) => (
                                <Table.Row key={row[0]}>
                                    {row.map(value => (
                                        <Table.Cell>{String(value)}</Table.Cell>
                                    ))}
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
                <div className="computer only six wide centered column">
                </div>
            </div>
        );
    }
    return (
        <div className="ui segment">
            <h3>Calculating ProAct suggested annotations</h3>
            <h3>This might take a few minutes. Thank you for your patience. </h3>
            <br/>
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

export default cellIdentityResults;
