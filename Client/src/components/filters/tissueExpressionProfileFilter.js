import React, {useState} from "react";
import {Dropdown, Grid, GridRow, Input} from "semantic-ui-react";
import InputRange from "react-input-range";
import tissuesDict from "../../config/tissueExpressionDict";
import "react-input-range/lib/css/index.css";
import tissueIndexToNames from "../../config/tissueIndexToNames";

const TissueExpProfileFilter = (props) => {
    const {
        selectedAttr,
        onAttrChange,
        mode,
        extractedTissues
    } = props;
    const additionalMsg = selectedAttr.selectedTissue.startsWith("Brain") ? `${selectedAttr.selectedTissue} includes ${tissueIndexToNames[selectedAttr.selectedTissue]}` : "";

    let selectedTissues = extractedTissues || tissuesDict(mode);
    selectedTissues.sort((a,b)=>(a.key > b.key) ? 1 : -1 );

    return (
        <Grid style={{paddingLeft: "40px"}}>
            <Grid.Row>
                <label htmlFor="tissue_exp" style={{paddingTop: "10px"}}>
                    <b>{mode === "gtex" ? "Select a tissue:" : "Select your query context"}</b>
                </label>
            </Grid.Row>
            <Grid.Row style={{padding:"0"}}>
                <div className="fields">
                    <Dropdown
                        id="exp_tissue"
                        options={selectedTissues}
                        onChange={(e, data) => onAttrChange("selectedTissue", data.value)}
                        placeholder={mode === "gtex" ? "Select a tissue" : "Select a condition"}
                        selection
                        search
                    />
                </div>
            </Grid.Row>
            <Grid.Row style={{padding:"0"}}>
                <div>{additionalMsg}</div>
            </Grid.Row>
            <Grid.Row>
                <label htmlFor="threshold"><b>Select number of top preferentially active processes (e.g top
                    5)</b></label>
            </Grid.Row>
            <Grid.Row>
                <div className="fields">
                    <div style={{width: "30vh"}} className="field">
                        <InputRange
                            maxValue={25}
                            minValue={0}
                            value={selectedAttr.threshold}
                            onChange={(val) => onAttrChange("threshold", val)}
                            name="threshold"
                        />
                    </div>
                </div>
            </Grid.Row>

            <Grid.Row>
                <div key="db">
                    <div className="ui checkbox">
                        <input
                            type="checkbox"
                            checked={selectedAttr.checked}
                            onClick={(_) => onAttrChange("checked", !selectedAttr.checked)}
                        />
                        {/*<label htmlFor="db"><b>Display processes with disease gene/s only</b></label>*/}
                    </div>
                </div>
            </Grid.Row>
            <Grid.Row/>
        </Grid>
    )
        ;
};
export default TissueExpProfileFilter;
