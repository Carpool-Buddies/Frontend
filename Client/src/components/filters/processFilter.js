import React, { useState } from 'react';
import { Dropdown, Grid, Input } from "semantic-ui-react";
import InputRange from 'react-input-range';
import tissuesDict from '../../config/tissueExpressionDict';
import 'react-input-range/lib/css/index.css';
import FileUploader from '../common/fileUploader';
import expressionFunctions from '../../config/expressionFunctions';
import processesDict from '../../config/processesDict';

const dataSets = [
  {
    key: 'GTEx',
    text: 'Genotype-Tissue Expression (GTEx) dataset – RNA-Sequencing',
    value: 'GTEx'
  },
  {
    key: 'HPA',
    text: 'Human Protein Atlas (HPA) – RNA-Sequencing',
    value: 'HPA'
  },
  {
    key: 'HPA_Proteins',
    text: 'Human Protein Atlas (HPA) - Protein Expression',
    value: 'HPA_Proteins'
  }
];

const ProcessFilter = (props) => {
  const { selectedAttr, onAttrChange } = props;
  return (
    <Grid style={{ paddingLeft: '40px' }}>
      <Grid.Row/>
      <Grid.Row>
        <label htmlFor="tissue_exp">
          <b>Select a process or processes:</b>
        </label>
      </Grid.Row>

      <Grid.Row>
      <div className="fields" >
        <div className="field" style={{ width: '60vh' }}>
          <Dropdown
            id="exp_dataset"
            options={processesDict}
            onChange={(e, data) => onAttrChange(data.value)}
            placeholder="Select a process or processes:"
            selection
            multiple
            search
          />
        </div>
      </div>
      </Grid.Row>
      <Grid.Row/>
    </Grid>
  );
};
export default ProcessFilter;
