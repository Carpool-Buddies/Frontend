import React from 'react';

const InjectionText = (props) => {
  const { children } = props;
  let injection;
  if (children.indexOf('anonymous') === 0) {
    injection = 'Guest';
  } else {
    injection = children;
  }
  return (

    <div>
      {injection}
    </div>
  );
};

export default InjectionText;
