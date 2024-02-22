import React from 'react';
import SemanticUiPopup from 'semantic-ui-popup';
import SemanticUiTransition from 'semantic-ui-transition'

$.fn.popup = SemanticUiPopup;
$.fn.transition = SemanticUiTransition;

class QTipPopup extends React.Component {
  componentDidMount() {
    $(this.popupIcon).popup({
      on: 'hover',
      content: this.props.content
    });
  }

  render() {
    return (
        <i className="help small link icon" ref={popupIcon => this.popupIcon = popupIcon}/>
    );
  }
}

export default QTipPopup;
