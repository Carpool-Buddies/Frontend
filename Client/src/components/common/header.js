import React from 'react';
import HeaderButton from './headerButton';
import labHeader from '../../static/‏‏lab_header_ProAct.jpg'

const Header = ({ headerButtons }) => (
  <div className="header-image">
    <a href="https://netbio.bgu.ac.il" rel="external">
      <img
        src={labHeader}
        style={{ width: '100%' }}
        alt="The logo of the lab and the link to the main lab site"
      />
    </a>
    <div style={{ top: '0.4%', right: '0.5%', position: 'absolute' }}>
      {headerButtons.map((button) => <HeaderButton key={button.route} {...button} />)}
    </div>
  </div>
);

export default Header;
