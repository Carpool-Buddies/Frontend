import React from 'react';
import { Table } from 'semantic-ui-react';
import Charts from './charts';

const OutputFiles = (props) => {
  const headers = ['File', 'Description'];
  const { links, summary, ppiDistribution } = props;

  // const fileKeys = () => {
  //   let keys = ['The initial unfiltered interactome']
  //   if (Object.prototype.hasOwnProperty.call(links, 'The interactome filtered by public tissue expression data')) {
  //     return keys.concat(['The interactome filtered by public tissue expression data', 'The edges which been removed by public tissue expression data'])
  //   }
  //   if (Object.prototype.hasOwnProperty.call(links, "The interactome filtered by user's expression data")) {
  //     return keys.concat(["The interactome filtered by user's expression data", "The edges which been removed by user's expression data"])
  //   }
  //   if (Object.prototype.hasOwnProperty.call(links, "The edges which been removed by prevalent genes filter")) {
  //     return keys.concat([])
  //   }
  // }

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
          {Object.keys(links).map((key) => (
            <Table.Row key={key}>
              {/* eslint-disable-next-line react/jsx-no-target-blank */}
              <Table.Cell><a href={links[key]} target="_blank">{links[key].split('/').pop()}</a></Table.Cell>
              <Table.Cell>{String(key)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Charts ppiDistribution={ppiDistribution} />
    </>
  );
};

export default OutputFiles;
