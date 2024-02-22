import React from 'react';
import { Table } from 'semantic-ui-react';
import {
  summaryParams, networkParams, filterTissuesParams, filterUserData, filterSC1, filterSC2 
} from '../../config/summaryProps';

const TabsTable = (props) => {
  const headers = ['Property', 'Value'];
  const { resultsData } = props;

  const tableKeys = () => {
    let initKeys = summaryParams
    if (Object.prototype.hasOwnProperty.call(resultsData, 'Filter By Tissues')) initKeys = initKeys.concat(filterTissuesParams)
    else if (Object.prototype.hasOwnProperty.call(resultsData, 'Filter By Expression Data')) initKeys = initKeys.concat(filterUserData)
    else if (Object.prototype.hasOwnProperty.call(resultsData, 'Filter By User SC Data')) {
      initKeys = initKeys.concat(filterSC1)
      initKeys = initKeys.concat(Object.keys(resultsData).filter((item) => item.includes('- Cluster')))
      initKeys = initKeys.concat(filterSC2)
    }
    return initKeys
  }

  return (
    <>
      <Table celled columns="two" fixed striped compact>
        <Table.Header>
          <Table.Row>
            {headers.map((header) => (
              <Table.HeaderCell key={header}>{header}</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {tableKeys().map((key) => (
            <Table.Row key={key}>
              <Table.Cell>{key}</Table.Cell>
              <Table.Cell>{String(resultsData[key])}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <h3>Network Measurements</h3>
      <Table celled columns="two" fixed striped compact>
        <Table.Header>
          <Table.Row>
            {headers.map((header) => (
              <Table.HeaderCell key={header}>{header}</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {networkParams.map((key) => (
            <Table.Row key={key}>
              <Table.Cell>{key}</Table.Cell>
              <Table.Cell>{String(resultsData[key])}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};

export default TabsTable;
