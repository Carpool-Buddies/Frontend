import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
const MenuItem = (props) => {
  const { item } = props;
  // const [dropDownVal, setDropDownVal] = useState()
  return item.link ? (
      <NavLink to={{pathname:`/${item.link}`, state: 'download'}} activeClassName="active" className="ui item link">
        {item.name}
      </NavLink>
  ): (
  item.href ? (
    // Link Out of the page
    <a
      href={item.href}
      rel="external"
      title={item.title}
      className="ui item link"
    >
      {item.name}
    </a>
  ) : (
    <Dropdown
      id={item.name}
      options={item.options}
      onChange={(e, { key, text, value }) => props.history().push(value)}
      placeholder={item.name}
      selection
      search
      // value={{ key: 'Example output:', text: 'Example output:', value: 'Example output:' }}
    />
  )
  );
};

export default MenuItem;
