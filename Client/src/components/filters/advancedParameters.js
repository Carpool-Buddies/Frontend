import React, { useState } from 'react';
import {
  Checkbox, Dropdown, Input, Button, Popup
} from 'semantic-ui-react';
import Parameters from '../../config/advancedParameters';
import popups from '../../config/popups';

const AdvancedParameters = (props) => {
  const { selectedAttr, onAttrChange, onMultipleChange } = props;

  const [goKeywordsStatus, setKeywordsStatus] = useState(false);
  const [evidencesStatus, setEvidencesStatus] = useState(false);

  const handleAttributesList = (attr, item) => {
    if (selectedAttr[attr].includes(item)) {
      const newList = selectedAttr[attr].filter((i) => i !== item);
      onAttrChange(attr, newList);
    } else onAttrChange(attr, [...selectedAttr[attr], item]);
  };

  const onWeightingChange = (type) => {
    if (type === 'go') onMultipleChange({ weighting: 'go', goSize: '700' });
    else onMultipleChange({ weighting: 'uniform', goSize: '100' });
  }

  return (
    <>
      <div className="two column row">
        <div className="four wide column" style={{ paddingRight: '0px' }}>
          <label htmlFor="weighting">
            <b>Choose weighting scheme:</b>
          </label>
          <Popup
            wide
            style={{ display: 'inline-block' }}
            content={popups.weighting}
            position="top left"
            size="small"
            trigger={(
              <small>
                <b style={{ color: 'red' }}>&nbsp;&nbsp;&nbsp;&nbsp;?</b>
              </small>
            )}
          />
        </div>
        <div className="five wide column" style={{ paddingLeft: '0px' }}>
          <Dropdown
            id="weighting"
            options={Parameters.weightings}
            onChange={(e, data) => onWeightingChange(data.value)}
            placeholder="Choose weighting scheme:"
            fluid
            selection
            value={selectedAttr.weighting}
          />
        </div>
      </div>

      <div className="three column row">
        {Parameters.goTypes.map((item) => (
          <div key={item} className="four wide column">
            <Checkbox
              id={item.value}
              label={item.text}
              onChange={(e, data) => onAttrChange(data.id, !selectedAttr[data.id])}
              checked={selectedAttr[item.value]}
            />
          </div>
        ))}
      </div>

      {selectedAttr.weighting === 'go'
      && (
      <>
        <div className="row">
          <div className="four wide column">
            <label htmlFor="keywords">
              <b>Choose GO term keywords:</b>
            </label>
            <Popup
              wide
              style={{ display: 'inline-block' }}
              content={popups.keywords}
              position="top left"
              size="small"
              trigger={(
                <small>
                  <b style={{ color: 'red' }}>&nbsp;&nbsp;&nbsp;&nbsp;?</b>
                </small>
              )}
            />
          </div>
          <div className="ten wide column">
            <Input fluid disabled value={selectedAttr.goTerms} />
          </div>
          <div className="two wide column">
            <Button
              size="small"
              onClick={(e) => { e.preventDefault(); setKeywordsStatus(!goKeywordsStatus); }}
            >
              More...
            </Button>
          </div>
        </div>
        {goKeywordsStatus
        && (
        <div className="four column row">
          {Parameters.goTermsKeywords.map((item) => (
            <div key={item} className="column">
              <Checkbox
                label={item}
                onChange={(e, data) => handleAttributesList('goTerms', data.label)}
                checked={selectedAttr.goTerms.includes(item)}
              />
            </div>
          ))}
        </div>
        )}
      </>
      )}

      <div className="row">
        <div className="five wide column">
          <label htmlFor="keywords">
            <b>Choose annotation evidence codes:</b>
          </label>
          <Popup
            wide
            style={{ display: 'inline-block' }}
            content={popups.evidence}
            position="top left"
            size="small"
            trigger={(
              <small>
                <b style={{ color: 'red' }}>&nbsp;&nbsp;&nbsp;&nbsp;?&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>
              </small>
            )}
          />
        </div>
        <div className="nine wide column">
          <Input fluid disabled value={selectedAttr.evidences} />
        </div>
        <div className="two wide column">
          <Button
            size="small"
            onClick={(e) => { e.preventDefault(); setEvidencesStatus(!evidencesStatus); }}
          >
            More...
          </Button>
        </div>
      </div>

      {evidencesStatus
      && (
        <div className="four column row">
          {Parameters.evidenceCodes.map((item) => (
            <div key={item} className="column">
              <Checkbox
                label={item}
                onChange={(e, data) => handleAttributesList('evidences', data.label)}
                checked={selectedAttr.evidences.includes(item)}
              />
            </div>
          ))}
        </div>
      )}

      <div className="row">
        <div className="five wide column">
          <label htmlFor="go_size">
            <b>Choose GO process size limit:</b>
          </label>
          <Popup
            wide
            style={{ display: 'inline-block' }}
            content={popups.goSize}
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
          <Input
            type="number"
            onChange={(e, data) => onAttrChange('goSize', data.value)}
            value={selectedAttr.goSize}
          />
        </div>
      </div>

    </>
  );
};

export default AdvancedParameters;
