import {Label, Legend, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis} from "recharts";
import React from "react";

const CellIdentityResultsGraph = ({height, width, data}) => {

    return (
        <div>
            <ScatterChart
                fill
                width={width}
                height={height}
                margin={{
                    top: 20,
                    right: 20,
                    bottom: -50,
                    left: 0,
                }}
            >
                <XAxis tick={{fontSize: 10}} angle={45} dx={15} dy={20} minTickGap={-600} height={200}
                       label={"Your cell subsets"} type="category" dataKey="x" name="Cell subset"
                       allowDuplicatedCategory={false}/>
                <YAxis label={<Label angle={-90} value='mean ProAct score'/>} width={120} type="number" dataKey="y"
                       name="mean ProAct score"/>
                <Scatter name="A school" data={data} fill="#0080ff"/>
                <Tooltip
                    content={(props) => (
                        <div style={{
                            border: '#bbb 1.5px solid',
                        }}>
                            <p style={{
                                margin: '0 0',
                                padding: '3px 7.5px',
                                backgroundColor: 'white',
                                fontSize:12
                            }}>
                                {String(props?.payload[0]?.payload?.z).split('\n').map(x => (<>{x} <br/></>))}
                            </p>
                        </div>
                    )}
                />
            </ScatterChart>
        </div>
    )
}

export default CellIdentityResultsGraph;
