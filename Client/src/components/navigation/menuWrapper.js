import React from 'react';
import MenuItem from './menuItem';
import InjectionText from '../common/injectionText';

const MenuWrapper = (props) => {
  const { items, injectionText, history } = props;
  const content = items.map((item) => <MenuItem key={item.name} item={item} history={props.history} />);

  return (
    <div className="ui vertical menu">
      <div className="header item">
        <h1 className="ui header">Welcome to ProAct website </h1>
        {/* <InjectionText>To ProAct</InjectionText> */}
      </div>
      {content}
    </div>
  );
};

export default MenuWrapper;
