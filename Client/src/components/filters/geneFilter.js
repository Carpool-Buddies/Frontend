import React, { useState } from "react";
import {Dropdown, Grid, Icon, Input, Popup} from "semantic-ui-react";
import "react-input-range/lib/css/index.css";
import gensDict from "../../config/genesDict";
import diseaseGenes from "../../config/diseaseGenes";

const geneFilter = (props) => {
  const { selectedAttr, onAttrChange, extractedGenes ,genesNoProcessFoundPopout} = props;
  const filteredGenes = gensDict.filter((genDict) => diseaseGenes.includes(genDict.text));
  let geneOptions = extractedGenes || (selectedAttr.checked ? filteredGenes : gensDict);
  geneOptions.sort((a,b)=>(a.key > b.key) ? 1 : -1 );

  return (
    <Grid style={{ paddingLeft: "30px" }}>
      <Grid.Row/>
      <Grid.Row>
        <span>
          <label htmlFor="tissue_exp">
            <b>Select a gene or genes:</b>
            <Popup
              wide
              style={{ display: "inline-block" }}
              content="The list includes genes that participate in at least one process in dataset"
              position="top left"
              size="small"
              trigger={(
                // <small>
                  <b style={{ color: "red" }}>&nbsp;&nbsp;&nbsp;&nbsp;?</b>
                // </small>
              )}
            />
          </label>
        </span>
      </Grid.Row>
      <Grid.Row>
        <span className="fields" >
          <span className="field" style={{ width: "44vh" }}>

            <Popup content='No processes available for selected genes'
                   open={genesNoProcessFoundPopout}
                   position='top right'
                   trigger={<Dropdown
                       id="exp_dataset"
                       options={geneOptions}
                       onChange={(e, data) => onAttrChange("selectedGenes", data.value)}
                       placeholder="Select a gene or genes:"
                       selection
                       search
                       multiple
                       noResultsMessage="No result found - gene isn't in process"
                   />}/>
            <br />
            <br />
          </span>
        </span>
      </Grid.Row>
    </Grid>
  );
};
export default geneFilter;
