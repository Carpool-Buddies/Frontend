import React from 'react';
import { Link } from 'react-router-dom';

const HeaderButton = ({
  label, icon, route, external,
}) => (external ? (
  <a
    href={route}
    target="_blank"
    rel="noopener noreferrer"
    className="circular blue ui icon button"
    title={label}
  >
    <i className={`icon large ${icon}`} />
  </a>
) : (
  <Link
    to={`${route}`}
    className="circular blue ui icon button"
    title={label}
  >
    <i className={`icon large ${icon}`} />
  </Link>
));

export default HeaderButton;
