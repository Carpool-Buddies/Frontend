import React, {createRef, useState, useEffect} from "react";
import {
    Button,
    Dimmer,
    Divider,
    Header,
    Icon,
    Loader,
    Modal,
    Segment,
    Transition,
    Grid,
    Image, Message, GridRow
} from "semantic-ui-react";
import TissueExpProfileFilter from "../../filters/tissueExpressionProfileFilter";
import ProcessFilter from "../../filters/processFilter";
import UserExpDataFilter from "../../filters/userExpressionDataFilter";
import GeneFilter from "../../filters/geneFilter";
import {
    postCSV,
    postSession,
    extractFeaturesFromFile,
    postScoreMatrix, getProcessesByMultipleGenes
} from "../../common/fetchers";
import tsne from "../../../static/gene.png";
import perProcessUserExp from "../../../static/perProcess_old.jpg";
import perGtex from "../../../static/Human.png";
import tissuePresentationToIndex from "../../../config/tissuePresentationToIndex";
import genesDict from "../../../config/genesDict";
import AnalysisOptions from "./analysisOptions";
import {arrayToUrlString} from "../../../utils";

const Home = props => {
    ///////////////////////////////////////////////////////////Old State
    const [isError, setErrorStatus] = useState(false);
    const [isRunning, setRunStatus] = useState(false);
    const [selectedOrganism, setOrganism] = useState("Human");
    const [genesNoProcessFoundPopout, setGenesNoProcessFoundPopout] = useState(false);
    const [errorFile, setErrorFile] = useState(false);
    const initialSCDataFilter = {
        fileName: "",
        expData: "",
        function: "gt",
        threshold: 2,
        scPercent: 80
    };

    const initialUserExpData = {
        fileName: "",
        expData: "",
        fileFormat: 2,
        function: "gt",
        route: "ranks",
        sessionId: ""
    };
    const [filterUserSCData, setUserSCData] = useState(initialSCDataFilter);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [MSigDB, setSelectedMSigDB] = useState(null);
    const [selectedAnalysis, setSelectedAnalysis] = useState(null);
    const [searchProcess, setSearchProcess] = useState(false);

    ///////////////////////////////////////////////////////////new State
    const initialTissueExpFilter = {
        selectedTissue: "",
        threshold: 0,
        checked: false
    };
    const initialGeneFilter = {
        selectedGenes: [],
        checked: false
    };
    const [selectedProcesses, setSelectedProcesses] = useState([]);
    const [filterTissueExp, setTissueExp] = useState(initialTissueExpFilter);
    const [filterUserExpData, setUserExpData] = useState(initialUserExpData);
    const [matrixUserExpData, setMatrixUserExpData] = useState(
        initialUserExpData
    );
    const [selectedGenesExp, setSelectedGenesExp] = useState(initialGeneFilter);
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [sessionId, setSessionId] = useState();
    const [extractedTissues, setExtractedTissues] = useState();
    const [extractedGenes, setExtractedGenes] = useState();
    const [isCalculatingMatrix, setIsCalculatingMatrix] = useState(false);
    const [currTimeStamp, setTimeStamp] = useState("");
    const [errorMessage, setErrorMessage] = useState(false);
    /////////////////////////////////////////////////////////

    const generateGUID = () =>
        "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            // eslint-disable-next-line no-bitwise,no-mixed-operators
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });

    useEffect(() => {
        if (!sessionId) {
            if (!localStorage.getItem("sessionId")) {
                const guid = generateGUID();
                localStorage.setItem("sessionId", guid);
                setSessionId(guid);
            } else {
                setSessionId(localStorage.getItem("sessionId"));
            }
        }
    });
    const createDict = (lst, type) => {
        const output = [];
        lst.forEach(element => {
            if (type === "tissue" || genesDict.some(obj => obj.text === element)) {
                output.push({key: element, text: element, value: element});
            }
        });
        return output;
    };
    const onExpDataUpload = async (e, type) => {
        setErrorFile(false)
        const file = e.target.files[0];
        const fileName = file.name;
        const reader = new FileReader();
        reader.onloadend = async () => {
            if (selectedAnalysis === "dependentData") {
                setExtractedTissues();
                setExtractedGenes();
                setMatrixUserExpData({
                    ...matrixUserExpData,
                    expData: reader.result,
                    fileName,
                    sessionId: sessionId
                });
                const featuresObj = await extractFeaturesFromFile(reader.result);
                if (featuresObj != "error") {
                    setExtractedTissues(createDict(featuresObj["tissues"], "tissue"));
                    setExtractedGenes(createDict(featuresObj["genes"], "gene"));
                } else {
                    error()
                }
            } else {
                setUserExpData({
                    ...filterUserExpData,
                    expData: reader.result,
                    fileName
                });
            }
        };
        reader.readAsText(file);
    };

    const filterButtonRef = createRef();

    const onFilterSelect = (e, filter) => {
        e.preventDefault();
        setSearchProcess(null)
        if (selectedFilter === filter) setSelectedFilter(null);
        else setSelectedFilter(filter);

        if (filter === "sc") setUserSCData(initialSCDataFilter);
        else if (filter === "tissueExp") setTissueExp(initialTissueExpFilter);
        else if (filter === "userExp") setUserExpData(initialUserExpData);
        else if (filter === "genes") setSelectedGenesExp(initialGeneFilter);
    };

    const onProcessSearchSelect = (e) => {
        e.preventDefault();
        setSearchProcess(searchProcess ? null : true)
    };

    const onMSigDBSelect = (e) => {
        e.preventDefault();
        setSearchProcess(false)
        setSelectedMSigDB("MSigDB")
    };

    const onAnalysisSelect = (e, filter) => {
        setErrorFile(false)
        e.preventDefault();
        if (selectedAnalysis === filter)
            setSelectedAnalysis(null)
        else
            setSelectedAnalysis(filter)
    };
    const filterWasFilled = () =>
        (selectedFilter === "tissueExp" &&
            filterTissueExp.selectedTissue !== "" &&
            filterTissueExp.threshold > 0) ||
        (selectedFilter === "sc" && selectedProcesses.length > 0) ||
        (selectedFilter === "genes" && selectedGenesExp?.selectedGenes?.length > 0);

    const error = () => {
        setErrorFile(true)
        setErrorMessage(true)
        setTimeout(() => {
            setErrorMessage(false)
        }, 1500)
    }

    const submitPermission = () =>
        (selectedFilter === "sc" && MSigDB === "MSigDB") ||
        (selectedAnalysis === "gtex" && filterWasFilled()) ||
        (selectedAnalysis === "singleCell" && filterUserExpData.expData !== "") ||
        (selectedAnalysis === "dependentData" &&
            matrixUserExpData.expData !== "" &&
            filterWasFilled());
    let isCurrenFileEmpty = () => matrixUserExpData.fileName === "";

    const onSubmit = async e => {
        e.preventDefault();
        setIsCalculatingMatrix(true);
        const timeStamp = await postSession(sessionId)
        setTimeStamp(timeStamp);
        if (!isCurrenFileEmpty() && selectedFilter !== "") {
            await postScoreMatrix(matrixUserExpData.expData, sessionId, timeStamp);
            setIsCalculatingMatrix(false);
        }
        if (selectedFilter === "tissueExp") {
            props.history.push(
                `/tissueResults/${selectedAnalysis}/${
                    selectedAnalysis !== "dependentData"
                        ? tissuePresentationToIndex[filterTissueExp.selectedTissue]
                        : filterTissueExp.selectedTissue
                }/${filterTissueExp.threshold}/${
                    filterTissueExp.checked
                }/${sessionId}/${timeStamp}`
            );
        } else if (selectedFilter === "sc" && MSigDB != "MSigDB" && searchProcess) {
            if (selectedProcesses.length === 1) {
                props.history.push(
                    `/singleProcess/${selectedAnalysis}/${encodeURIComponent(selectedProcesses[0])}/${sessionId}/${timeStamp}`
                );
            } else {
                props.history.push(
                    `/multipleProcesses/${selectedAnalysis}/${arrayToUrlString(selectedProcesses)}/${sessionId}/${timeStamp}`
                );
            }
        } else if (selectedFilter === "sc" && MSigDB === "MSigDB") {
            props.history.push(
                `/multipleProcessesMSigDB/${selectedAnalysis}/${sessionId}/${timeStamp}`)
        } else if (!selectedFilter || selectedFilter === "") {
            if (filterUserExpData.route === "ranks") {
                setDisableSubmit(true);
                const fetchedClusters = await postCSV(
                    filterUserExpData,
                    timeStamp,
                    sessionId
                );
                setDisableSubmit(false);
                if (fetchedClusters != "error") {
                    const path = `/userExpResults/${fetchedClusters.join(
                        ";"
                    )}/${sessionId}/${timeStamp}`;
                    props.history.push({
                        pathname: path,
                        state: {csv: filterUserExpData}
                    });
                } else {
                    error()
                    setIsCalculatingMatrix(false)
                }
            } else {
                const path = `/cellIdentityGroupsData/${sessionId}/${timeStamp}`;
                props.history.push({
                    pathname: path,
                    state: {csv: filterUserExpData}
                });
            }
        } else if (selectedFilter === "genes") {
            const fetchedProcesses = await getProcessesByMultipleGenes(decodeURIComponent(selectedGenesExp.selectedGenes));
            if (fetchedProcesses) {
                if (fetchedProcesses.length > 1) {
                    props.history.push(
                        `/multipleProcesses/${selectedAnalysis}/${arrayToUrlString(fetchedProcesses)}/${sessionId}/${timeStamp}/${arrayToUrlString(selectedGenesExp.selectedGenes)}`
                    );
                } else if (fetchedProcesses.length === 1) {
                    const url = `/singleProcess/${selectedAnalysis}/${encodeURIComponent(fetchedProcesses[0])}/${sessionId}/${timeStamp}/${arrayToUrlString(selectedGenesExp.selectedGenes)}`;
                    props.history.push(url);
                } else {
                    setGenesNoProcessFoundPopout(true);
                    setTimeout(() => ((setGenesNoProcessFoundPopout(false))), 5000);
                    setIsCalculatingMatrix(false);
                }
            }
        }
    }


    const loaderIndeterminate = msg => (
        <div style={{textAlign: "center", width: "100%"}}>
            <Loader active inline/>
            <h3>{msg}</h3>
        </div>
    );

    const filterDataOptions = mode => (
        <Grid columns={3} stretched>
            <Grid.Row>
                <Grid.Column>
                    <Button
                        basic
                        onClick={e => onFilterSelect(e, "sc")}
                        className={selectedFilter === "sc" ? "black" : ""}
                        ref={filterButtonRef}
                    >
                        <div style={{width: "200px"}}>
                            <label htmlFor="sc">
                                <b>Search by process</b>
                            </label>
                        </div>
                        {/* eslint-disable-next-line global-require,import/no-unresolved */}
                        <Image
                            src={perProcessUserExp}
                            verticalAlign="middle"
                            style={{
                                paddingTop: "10px",
                                marginTop: "10px",
                                height: "190px"
                            }}
                        />
                    </Button>
                </Grid.Column>

                {/* tissue button */}
                <Grid.Column>
                    <Button
                        basic
                        onClick={e => onFilterSelect(e, "tissueExp")}
                        className={selectedFilter === "tissueExp" ? "black" : ""}
                        ref={filterButtonRef}
                        disabled={selectedOrganism !== "Human"}
                    >
                        <div style={{width: "200px"}}>
                            <label htmlFor="sc">
                                <b>
                                    {mode === "gtex"
                                        ? "Search by tissue"
                                        : "Search by context"}
                                </b>
                            </label>
                        </div>
                        <Image
                            src={perGtex}
                            verticalAlign="middle"
                            style={{
                                paddingTop: "10px",
                                marginTop: "10px",
                                height: "190px"
                            }}
                        />
                    </Button>
                </Grid.Column>

                {/* gene button */}
                <Grid.Column>
                    <Button
                        basic
                        onClick={e => onFilterSelect(e, "genes")}
                        className={selectedFilter === "genes" ? "black" : ""}
                        ref={filterButtonRef}
                    >
                        <div style={{width: "200px"}}>
                            <label htmlFor="genes">
                                <b>Search by gene</b>
                            </label>
                        </div>
                        <Image
                            src={tsne}
                            verticalAlign="middle"
                            style={{
                                paddingTop: "10px",
                                marginTop: "10px",
                                height: "190px"
                            }}
                        />
                    </Button>
                </Grid.Column>
            </Grid.Row>
            {/* one proccess transition */}
            <Transition
                visible={selectedFilter === "sc"}
                animation="scale"
                duration={200}
                unmountOnHide
            >
                <div style={{padding: "15px", width: "100%"}}>
                    <Grid>
                        <GridRow/>
                        <Grid.Row centered>
                            <Button.Group>
                                <Button
                                    onClick={value => onProcessSearchSelect(value)}
                                >
                                    Select a process or processes
                                </Button>
                                <Button.Or text='or'/>
                                <Button
                                    onClick={value => onMSigDBSelect(value)}
                                >
                                    MSigDB hallmark gene sets
                                </Button>
                            </Button.Group>
                        </Grid.Row>
                        <GridRow/>
                    </Grid>
                </div>
            </Transition>

            <Transition
                visible={searchProcess && selectedFilter === "sc"}
                duration={100}
            >
                <div style={{padding: "15px", width: "100%"}}>
                    <Segment raised>
                        <ProcessFilter
                            selectedAttr={selectedProcesses}
                            onAttrChange={value => {
                                setSelectedProcesses(value)
                                setSelectedMSigDB(null)
                            }}
                        />
                    </Segment>
                </div>
            </Transition>

            {/* filter transition */}
            <Transition
                visible={selectedFilter === "tissueExp" && selectedOrganism === "Human"}
                animation="scale"
                duration={200}
                unmountOnHide
            >
                <Segment raised style={{width: "100%"}}>
                    <TissueExpProfileFilter
                        selectedAttr={filterTissueExp}
                        onAttrChange={(attr, value) =>
                            setTissueExp({...filterTissueExp, [attr]: value})
                        }
                        mode={mode}
                        extractedTissues={extractedTissues}
                    />
                </Segment>
            </Transition>

            {/* gene filter transition */}
            <Transition
                visible={selectedFilter === "genes"}
                animation="scale"
                duration={200}
                unmountOnHide
            >
                <div style={{padding: "15px", width: "100%"}}>
                    <Segment raised style={{width: "100%"}}>
                        <GeneFilter
                            selectedAttr={selectedGenesExp}
                            onAttrChange={(attr, value) =>
                                setSelectedGenesExp({...selectedGenesExp, [attr]: value})
                            }
                            extractedGenes={extractedGenes}
                            genesNoProcessFoundPopout={genesNoProcessFoundPopout}
                        />
                    </Segment>
                </div>
            </Transition>
        </Grid>
    );

    const menuAccordingScoreMatrix = mode => (
        <div>
            <Divider horizontal section style={{padding: "20px"}}>
                <Header as="h4">
                    <Icon name="filter"/>
                    {mode === "gtex"
                        ? "Explore differential processes activity in human tissues (GTEx v.8)"
                        : "Analyze context-dependent differential processes activity"}
                </Header>
            </Divider>

            {mode === "dependentData" ? (
                <UserExpDataFilter
                    selectedAttr={matrixUserExpData}
                    onAttrChange={(attr, value) =>
                        setMatrixUserExpData({...matrixUserExpData, [attr]: value})
                    }
                    onDataUpload={e => onExpDataUpload(e, "tissue")}
                    mode={mode}
                />
            ) : null}
            <br/>
            <br/>
            {mode === "dependentData" && !isCurrenFileEmpty() && !extractedTissues && !errorFile
                ? loaderIndeterminate(
                    " Extracting gene and context names from your data"
                )
                : null}
            {mode === "gtex" || (!isCurrenFileEmpty() && extractedTissues)
                ? filterDataOptions(mode)
                : null}

        </div>
    );

    const defaultView = mode => (
        <div>
            {mode === "single cell" ? (
                <UserExpDataFilter
                    selectedAttr={filterUserExpData}
                    onAttrChange={(attr, value) =>
                        setUserExpData({...filterUserExpData, [attr]: value})
                    }
                    onDataUpload={e => onExpDataUpload(e, "tissue")}
                    mode={mode}
                />
            ) : null}
            {/* </Segment> */}
            {mode === "gtex" || mode === "dependentData"
                ? menuAccordingScoreMatrix(mode)
                : null}
            {errorMessage ? <div style={{textAlign: "center"}}>
                <Message negative compact tyle={{
                    marginLeft: "auto",
                    marginRight: "auto"
                }}>
                    <Message.Header>Wrong input file</Message.Header>
                    <p> Please check the tutorial
                        or {mode === "dependentData" ? "example file" : "Single-cell example input"}</p>
                </Message>
            </div> : null}
            <br/>
            <br/>
            <br/>
            <div className="row">
                {!disableSubmit && !isCalculatingMatrix ? (
                    <div>
                        <Button
                            color="blue"
                            fluid
                            icon
                            labelPosition="right"
                            disabled={!submitPermission()}
                            onClick={onSubmit}
                            style={{margin: "auto"}}
                        >
                            Submit
                            <Icon name="check circle"/>
                        </Button>

                    </div>

                ) : (<div>
                    <br/>
                    <br/>
                    {isCalculatingMatrix ? (
                        loaderIndeterminate("Calculating")
                    ) : (
                        loaderIndeterminate("Finding cell subsets")
                    )}
                </div>)}
            </div>
            {/* </div> */}
        </div>
    );

    return (
        <div
            className="ui raised padded container segment"
            style={{width: "100%"}}
        >
            <form className="ui form" id="homeForm">
                {!isError ? (
                    !isRunning ? (
                        <>
                            <div className="ui dividing header">
                                <h1>Process Activity (ProAct): <br/> Quantifying differential process activity in
                                    tissues and cell
                                    types</h1>
                            </div>
                            {/* <Segment raised> */}
                            <Divider horizontal section style={{padding: "20px"}}>
                                <Header as="h4">
                                    <Icon name="filter"/>
                                    Analyze process activity in
                                </Header>
                            </Divider>
                            <AnalysisOptions onAnalysisSelect={onAnalysisSelect} filterButtonRef={filterButtonRef}
                                             selectedAnalysis={selectedAnalysis}/>
                            <Transition
                                visible={selectedAnalysis === "singleCell"}
                                animation="scale"
                                duration={200}
                                unmountOnHide
                            >
                                {defaultView("single cell")}
                            </Transition>
                            <Transition
                                visible={selectedAnalysis === "gtex"}
                                animation="scale"
                                duration={200}
                                unmountOnHide
                            >
                                {defaultView("gtex")}
                            </Transition>
                            <Transition
                                visible={selectedAnalysis === "dependentData"}
                                animation="scale"
                                duration={200}
                                unmountOnHide
                            >
                                {defaultView("dependentData")}
                            </Transition>
                        </>
                    ) : (
                        <Modal open size="mini">
                            <Modal.Header>You are being transferred</Modal.Header>
                            <Modal.Content>
                                <Dimmer active>
                                    <Loader/>
                                </Dimmer>
                            </Modal.Content>
                        </Modal>
                    )
                ) : (
                    <div className="ui segment centered very padded">
                        <p>
                            Unfortunately, something went wrong.
                            <br/>
                            If the problem persists please send us an email at:
                            <a href="mailto:estiyl@bgu.ac.il">estiyl@bgu.ac.il</a>
                        </p>
                    </div>
                )}
            </form>
            <br/>
            <br/>
            <br/>
        </div>);
}
export default Home;
