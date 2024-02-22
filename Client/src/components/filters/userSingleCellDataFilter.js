/*eslint object-curly-newline: ["error", "never"]*/

import React, { useState } from 'react';
import { Dropdown, Input, Message, Popup } from 'semantic-ui-react';
import InputRange from 'react-input-range';
import FileUploader from '../common/fileUploader';
import expressionFunctions from '../../config/expressionFunctions';
import popups from '../../config/popups';

const UserSCDataFilter = (props) => {
  const { onAttrChange, selectedAttr, onDataUpload } = props;
  const percents = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(((item) => ({ key: item, text: `${item}%`, value: item })));

  const [isDismissed, dismissMessage] = useState(false)

  return (
    <div className="ui grid">
      {!isDismissed && (
      <Message
        info
        onDismiss={() => dismissMessage(true)}
        style={{ margin: '10px' }}
      >
        <Message.Header>
          New feature in MyProteinNet v2 - Filter your interactome by your Single Cell data
        </Message.Header>
        {/*<p>*/}
        {/*  By input your Single Cell expression profile, you will have your interactome filtered by each cluster*/}
        {/*  and also by prevalent genes among all clusters. To apply this filter, kindly follow these instructions:*/}
        {/*</p>*/}
        <ul>
          <li>
            Upload your Single Cell expression profile to create an interactome per cell subset and a combined interactome.
          </li>
          <li>
            This table should contain gene-names as rows indices (Ensembl/Symbol/Entrez),
            named subsets as columns headers and expression values in the inner cells. The headers names must contain
            string and numbers only, without spaces inside them. We accept csv/tsv/txt files. Here an
            {' '}
            <a href="https://netbio.bgu.ac.il/myprotein-results/MyProteinNet2Sessions/scData.txt">example file.</a>
          </li>
          {/*<li>*/}
          {/*  Choose the expression function: This function determines the filtration manner, due to the threshold.*/}
          {/*  For example, if you choose &#34;Greater than&#34;, the filter will keep genes which expressed over the*/}
          {/*  threshold.*/}
          {/*</li>*/}
          {/*<li>*/}
          {/*  Choose the threshold: This is the expression value which limit the filtration.*/}
          {/*</li>*/}
          {/*<li>*/}
          {/*  Choose the threshold of prevalnce: Based on this percentage value, the joint interactome of the clusters*/}
          {/*  will be built.*/}
          {/*  For example, if you will choose 80%, the joint interactome will keep genes which expressed among at least*/}
          {/*  80% of the clusters.*/}
          {/*</li>*/}
        </ul>
      </Message>
      )}
      <div className="row" style={{ padding: '25px', paddingLeft: '15px' }}>
        <div className="four wide column">
          <label htmlFor="exp_data">
            Add your SC expression data:
          </label>
          <Popup
            wide
            style={{ display: 'inline-block' }}
            content={popups.singleCellDataFormat}
            position="top left"
            size="small"
            trigger={(
              <small>
                <b style={{ color: 'red' }}>&nbsp;&nbsp;&nbsp;&nbsp;?</b>
              </small>
            )}
          />
        </div>
        <div className="three wide column">
          <FileUploader
            onFileUpload={onDataUpload}
            fileName={selectedAttr.fileName}
          />
        </div>
        <div className="eight wide column">
          <label htmlFor="file_format">Expression Function:&nbsp;&nbsp;</label>
          <Dropdown
            value={selectedAttr.function}
            options={expressionFunctions}
            onChange={(e, data) => onAttrChange('function', data.value)}
            placeholder="Choose a function"
            selection
          />
        </div>
        <div style={{ paddingLeft: '15px' }}>
          <a href="https://netbio.bgu.ac.il/myproteinnetsp/Sample.txt" target="_blank" rel="noreferrer">download sample file</a>
        </div>
      </div>

      <div className="row" style={{ paddingTop: '25px', paddingLeft: '25px' }}>
        <div>
          <label htmlFor="threshold">Gene Expression Threshold&nbsp;&nbsp;</label>
        </div>
        <div className="field" style={{ width: '23vh', paddingRight: '80px' }}>
          <Input
            type="number"
            step="0.1"
            onChange={(e, data) => onAttrChange('threshold', data.value)}
            value={selectedAttr.threshold}
            style={{ width: '70px' }}
          />
        </div>
        <div style={{ width: '30vh', float: 'right' }}>
          <InputRange
            maxValue={500}
            minValue={0}
            value={Number(selectedAttr.threshold)}
            onChange={(val) => onAttrChange('threshold', val)}
            name="threshold"
          />
        </div>

      </div>
      <div className="row" style={{ padding: '15px', paddingLeft: '25px' }}>
        <div className="five wide column">
          <label htmlFor="prevalence">
            Combined interactome threshold
            <br />
            (% of subsets expressing a gene)&nbsp;&nbsp;
          </label>
        </div>
        <div className="field" style={{ width: '2vh' }}>
          <Dropdown
            style={{ width: '2vh' }}
            id="percent"
            options={percents}
            onChange={(e, data) => onAttrChange('scPercent', data.value)}
            selection
            value={selectedAttr.scPercent}
          />
        </div>
      </div>

    </div>
  );
};

export default UserSCDataFilter;
