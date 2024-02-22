import React, { useState, useEffect } from 'react';
import { Table, Button } from 'semantic-ui-react';

const genesHgncTab = (props) => {
  const [genesToShow, setGenesToShow] = useState([])
  const [selectedProcess, setSelectedProcess] = useState('')
  
  const genesHeaders = [
    { name: 'HGNC Symbol' },
    { name: 'Ensembl Gene ID' }
  ] 
  useEffect(() => {
    setGenesToShow(props.genesToShow)
    setSelectedProcess(props.selectedProcess)
  }, [props.genesToShow, props.selectedProcess]);
  return (
    <>
      <b>{selectedProcess !== '' ? `Genes for '${selectedProcess.replaceAll('_',' ')}'` : ''}</b>
      <Table striped compact="very" size="small" style={{ fontSize: '0.72em' }} celled>
        <Table.Header>
          <Table.Row>
            {genesHeaders.map((header) => <Table.HeaderCell key={header.name}>{header.name}</Table.HeaderCell>)}
            {props.containsFcHeader ? <Table.HeaderCell key="FC">Fold change value</Table.HeaderCell> : null}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {genesToShow.map((geneToShow) => (
            <Table.Row key={geneToShow['hgnc']}>
              <Table.Cell>{geneToShow['ensembl']}</Table.Cell>
              <Table.Cell>{geneToShow['hgnc']}</Table.Cell>
              {props.containsFcHeader ? <Table.Cell>{geneToShow['fcs']}</Table.Cell> : null}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  ) 
}

export default genesHgncTab
