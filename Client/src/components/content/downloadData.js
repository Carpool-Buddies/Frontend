import React, {useEffect, useRef, useState} from 'react';
import {withRouter} from 'react-router-dom';
import {Dimmer, Icon, List, Loader, Segment} from 'semantic-ui-react';
import {BASE_API_URL} from "../../../config/environment";

const DownloadData = (props) => {
    return (

        <div className="ui segment centered very padded">
            <h2>Download data: </h2>
            <List bulleted>

                <List.Item>
                    ProAct scores (6,939 processes in 34 human tissues):
                    &nbsp; <a href={`${BASE_API_URL}/getProActScoresFile`} download="ProAct_scores_in_tissues">
                    download <Icon fitted name='download'/> </a></List.Item>
                <List.Item>GO Processes and their associated genes (12,499 processes):
                    &nbsp; <a href={`${BASE_API_URL}/getProcessesAndGenesFile`} download="processes_and_genes_ENS">
                        download <Icon fitted name='download'/></a></List.Item>
                <List.Item>GO Processes and their associated cell types (2,001 process):
                    &nbsp; <a href={`${BASE_API_URL}/getProcessesAndAssociatedFile`} download="processes_and_associated_cell_types">
                        download <Icon fitted name='download'/></a></List.Item>
                <List.Item>MSigDB hallmark gene sets and their associated genes (50 processes):
                    &nbsp; <a href={`${BASE_API_URL}/getMsigdbGenesEnsFile`} download="msigdb_genes_ens">
                        download <Icon fitted name='download'/></a></List.Item>
            </List>
        </div>
    );
};

export default withRouter(DownloadData);

