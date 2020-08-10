import React from 'react';

export default function App(props) {
  const { children } = props;
  return React.createElement(React.Fragment, null, children);
}
