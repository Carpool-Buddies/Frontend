import React, {useState, useEffect} from 'react';
import {Button, Checkbox} from 'semantic-ui-react';

const UserExpResults = (props) => {
    const [clusters, setClusters] = useState([])
    const [uploadedFile, setUploadedFile] = useState()
    const [checkedValues, setCheckedValues] = useState([]);

    useEffect(() => {
        if (props.location.state) {
            setUploadedFile(props.location.state.csv)
        }
        const formatClusters = (fetchedClusters) => {
            const formattedClusters = []
            fetchedClusters.forEach((fetchedCluster) => {
                formattedClusters.push({key: fetchedCluster, value: fetchedCluster, text: fetchedCluster})
            })
            return formattedClusters
        }
        const fetchedClusterList = props.match.params.clusters.split(';')
        const formattedClusters = formatClusters(fetchedClusterList.sort())
        setClusters(formattedClusters)
    }, []);

    const checkboxOptions = clusters.map(item => {
        return {key: item.key, label: item.text, value: item.value};
    });
    const handleCheckboxChange = (e, {value}) => {
        setCheckedValues(prevValues => (checkedValues.includes(value) ? prevValues.filter(val => val !== value) : [...prevValues, value]));
    };

    const onSubmit = () => {
        const urlParams = props.match.params
        const timeStamp = urlParams.timeStamp
        const sessionID = urlParams.sessionId
        const path = `/userExpRanks/${checkedValues.join(";")}/${sessionID}/${timeStamp}`
        props.history.push({
            pathname: path,
            state: {csv: uploadedFile}
        })
    }

    const selectAll = () => {
        setCheckedValues(checkboxOptions.map(option => (option.value)))
    }

    const deselectAll = () => {
        setCheckedValues([])
    }


    return (
        <div className="eight wide column">
            <h2>Select subsets for ProAct scores</h2>
            <br/>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                {checkboxOptions.map(option => (
                    <Checkbox style={{margin: "10px"}}
                              key={option.key} label={option.label} value={option.value}
                              checked={checkedValues.includes(option.value)} onChange={handleCheckboxChange}/>))}
            </div>
            <div className="ui divider"></div>
            <div>
                <Button style={{margin: "10px"}} value={"Select All"} onClick={selectAll}>Select All</Button>
                <Button style={{margin: "10px"}} value={"Deselect All"} onClick={deselectAll}>Deselect All</Button>
            </div>
            <br/>
            <Button
                color="blue"
                fluid
                disabled={checkedValues.length === 0}
                onClick={onSubmit}
                style={{margin: 'auto'}}
            >
                Submit
            </Button>
        </div>
    )
}

export default UserExpResults;
