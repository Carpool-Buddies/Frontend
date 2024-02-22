import React, { useState, useEffect } from 'react';
import { Segment, Tab } from 'semantic-ui-react';
import GenesHgncTab from '../tabs/genesHgncTab';
import ProcessDetailsTab from '../tabs/processDetailsTab';

const Tabs = (props) => {
  const { 
    selectedProcess, genesToShow, processesToShow, containsFcHeader 
  } = props;

  const panes = [
    {
      menuItem: 'Process details',
      key: 'ProcessDetails',
      render: () => <><br /><ProcessDetailsTab selectedProcess={selectedProcess} processesToShow={processesToShow} /></>
    },

    {
      menuItem: 'Genes',
      key: 'Genes',
      render: () => <><br /><GenesHgncTab selectedProcess={selectedProcess} genesToShow={genesToShow} containsFcHeader={containsFcHeader} /></>
    }
  ];

  return (
    <Tab panes={panes} defaultActiveIndex={0} menuPosition="right" />
  );
};

export default Tabs;
