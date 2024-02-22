import { Button, Grid, Image } from "semantic-ui-react";
import perProcess from "../../../static/perProcess.jpg";
import perContextData from "../../../static/contextHeatmap.png";
import perGtex from "../../../static/Human.png";
import React, { useState } from "react";

const AnalysisOptions = ({ selectedAnalysis, onAnalysisSelect, filterButtonRef }) => {

  return (
    <Grid columns={3} stretched>
      <Grid.Row>
        <Grid.Column>
          <Button
            className={selectedAnalysis === "singleCell" ? "black" : ""}
            basic
            onClick={e => onAnalysisSelect(e, "singleCell")}
            ref={filterButtonRef}
          >
            <div>
              <label htmlFor="sc">
                <b>Your clustered single-cell data</b>
              </label>
            </div>
            {/* eslint-disable-next-line global-require,import/no-unresolved */}
            <Image
              src={perProcess}
              verticalAlign="middle"
              style={{
                paddingTop: "10px",
                marginTop: "30px",
                height: "190px"
              }}
            />
          </Button>
        </Grid.Column>
        <Grid.Column>
          <Button
            basic
            onClick={e => onAnalysisSelect(e, "dependentData")}
            ref={filterButtonRef}
            className={selectedAnalysis === "dependentData" ? "black" : ""}
          >
            <div>
              <label htmlFor="sc">
                <b>
                  Your gene expression dataset (treatments,
                  developmental stages, etc.)
                </b>
              </label>
            </div>
            {/* eslint-disable-next-line global-require,import/no-unresolved */}
            <Image
              src={perContextData}
              verticalAlign="middle"
              style={{ paddingTop: "10px", height: "190px" }}
            />
          </Button>
        </Grid.Column>
        <Grid.Column>
          <Button
            basic
            onClick={e => onAnalysisSelect(e, "gtex")}
            ref={filterButtonRef}
            className={selectedAnalysis === "gtex" ? "black" : ""}
          >
            <div>
              <label htmlFor="sc">
                <b>34 human tissues (GTEx V8)</b>
              </label>
            </div>
            {/* eslint-disable-next-line global-require,import/no-unresolved */}
            <Image
              src={perGtex}
              verticalAlign="middle"
              style={{
                paddingTop: "10px",
                marginTop: "30px",
                height: "190px"
              }}
            />
          </Button>
        </Grid.Column>
      </Grid.Row>
    </Grid>);
};

export default AnalysisOptions;
