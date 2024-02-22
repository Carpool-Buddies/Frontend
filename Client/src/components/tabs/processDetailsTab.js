import React, {useState, useEffect} from 'react';
import {Table, Button} from 'semantic-ui-react';

const processDetailsTab = (props) => {
    const [processesToShow, setProcessesToShow] = useState([])
    const [processHeaders, setProcessHeaders] = useState([])

    useEffect(() => {
        setProcessesToShow(props.processesToShow)
        props.processesToShow[0].processName.startsWith('HALLMARK') ?
            setProcessHeaders(
                [{name: 'MsigDB Standard name'},
                    {name: 'Systematic name'},
                    {name: 'Definition'}]) :
            setProcessHeaders([
                {name: 'GO name'},
                {name: 'GO ID'},
                {name: 'Description'}
            ])
    }, [props.processesToShow]);

    return (
        <>
            <Table striped compact="very" size="small" style={{fontSize: '0.72em'}} celled>
                <Table.Header>
                    <Table.Row>
                        {processHeaders.map((header) => <Table.HeaderCell
                            key={header.name}>{header.name}</Table.HeaderCell>)}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {processesToShow.map((processToShow) =>
                        <Table.Row key={processToShow.processName}>
                            <Table.Cell>{`${processToShow.processName}`}</Table.Cell>
                            {processToShow.processName.startsWith('HALLMARK') ?
                                <Table.Cell>{processToShow.processGoId}</Table.Cell>
                                : <Table.Cell><a
                                    href={`http://amigo.geneontology.org/amigo/term/${processToShow.processGoId}`}
                                    rel="noreferrer" target="_blank">{processToShow.processGoId}</a></Table.Cell>}
                            <Table.Cell>{processToShow.processDef}</Table.Cell>
                        </Table.Row>)}
                </Table.Body>
            </Table>
        </>
    )
}

export default processDetailsTab
