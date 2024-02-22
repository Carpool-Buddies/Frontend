import React from 'react';
import { Table } from 'semantic-ui-react';

const ErrorsLog = (props) => {
  const headers = ['Source', 'Error Type'];
  const { errors } = props;

  return (
    Object.keys(errors).length > 0 ? (
      <>
        {Object.keys(errors).map((type) => (
          <div key={type} style={{ padding: '15px' }}>
            <h4>{type}</h4>
            <Table celled columns="two" fixed striped compact>
              <Table.Header>
                <Table.Row>
                  {headers.map((header) => (
                    <Table.HeaderCell key={header}>{header}</Table.HeaderCell>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {errors[type].map((e, idx) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Table.Row key={idx}>
                    <Table.Cell>{Object.prototype.hasOwnProperty.call(e, 'database') ? e['database'] : e['geneName']}</Table.Cell>
                    <Table.Cell>{e['error']}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        ))}
      </>
    ) : (
      <div className="ui segment centered very padded">
        <p>
          There were not any errors in your session.
        </p>
      </div>
    )
  );
};

export default ErrorsLog;
