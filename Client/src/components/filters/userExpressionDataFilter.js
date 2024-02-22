import React, { useState } from "react";
import {
  Divider, Header, Popup, Image, Icon
} from "semantic-ui-react";
import InputRange from "react-input-range";
import tissuesDict from "../../config/tissueExpressionDict";
import "react-input-range/lib/css/index.css";
import FileUploader from "../common/fileUploader";
import popups from "../../config/popups";
import expressionFunctions from "../../config/expressionFunctions";
import perUserExp from "../../static/perUserExp.jpg";
import scatterGraph from "../../static/scatterGraph.jpg";
import {BASE_API_URL} from "../../../config/environment";
const fileFormats = [{ text: "gene ID", value: 1 }, {
  text: "gene ID, expression",
  value: 2
}, { text: "gene ID, expression, p-value", value: 3 }];
// eslint-disable-next-line space-infix-ops
const UserExpDataFilter = (props) => {
  const {
    selectedAttr, onAttrChange, onDataUpload, mode
  } = props;
  const checkBoxSelection = () => (
    <div className="row" style={{ paddingTop: "15px", paddingBottom: "15px" }}>
      <div className="ui raised segment" style={{ width: "100%" }}>
        <div className="ui stackable center aligned divided two column grid">
          <div className="column">
            <div className="ui radio checkbox">
              <input type="radio" value="VCF" checked={selectedAttr.route === "ranks"}
                     onChange={(_) => onAttrChange("route", "ranks")} />
              <label htmlFor="ranks" style={{ display: "inline-block" }}>
                <b>Top preferentially active processes for separate subsets</b>
                <Image src={perUserExp} verticalAlign="middle" style={{ paddingTop: "10px", height: "190px" }} />
                {/* <div>Calculate ProAct scores per subset and view top 10 processes in your query cell subset.</div> */}
              </label>
            </div>
          </div>
          <div className="column">
            <div className="ui radio checkbox">
              <input type="radio" value="manual" checked={selectedAttr.route === "cellGroup"}
                     onChange={(_) => onAttrChange("route", "cellGroup")} />
              <label htmlFor="cellGroup" style={{ display: "inline-block" }}>
                <b>Suggested cell-type annotations</b>
                <Image src={scatterGraph} verticalAlign="middle"
                       style={{ paddingTop: "10px", height: "190px", width: "200px" }} />
                {/* <div>Calculate mean ProAct scores of cell-type associated processes in subsets. View process-groups that are most active in cell subsets.</div> */}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <>
      {mode === "single cell" ? (
        <Divider horizontal section style={{ padding: "20px" }}>
          <Header as="h4">
            <Icon name="filter" />
            Analyze differential processes activity in cell subsets
          </Header>
        </Divider>
      ) : null}
      <div className="ui grid" style={{ padding: "10px" }}>
        {mode === "single cell" ? checkBoxSelection() : null}
        <div className="row" style={{ paddingTop: "15px", paddingBottom: "15px" }}>
          <div className="six wide column">
            <label htmlFor="exp_data">{mode === "single cell" ? "Upload your cell subsets profiles" :
              "Upload differential gene expression matrix"}</label>
            <Popup
              wide
              style={{ display: "inline-block" }}
              content={mode === "single cell" ? popups.userExpData : popups.userExpDataSamples}
              position="top left"
              size="small"
              trigger={(
                // <small>
                  <b style={{ color: "red" }}>&nbsp;&nbsp;&nbsp;&nbsp;?</b>
                // </small>
              )}
            />
          </div>

          <div className="three wide column" style={{ paddingLeft: "0px" }}>
            <FileUploader
              onFileUpload={onDataUpload}
              fileName={selectedAttr.fileName}
            />
            {mode !== "single cell" ? <a href={`${BASE_API_URL}/getExampleFileDifferentialGeneExpression`} download="InputExample"><small>download example</small></a>:
                <a href={`${BASE_API_URL}/getExampleFile`} download="InputExample"><small>download example</small></a>}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserExpDataFilter;
