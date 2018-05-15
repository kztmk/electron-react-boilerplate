// @flow
import React from 'react';

type Props = {
  breakLabel: string,
  breakClassName: string
};
const BreakView = (props: Props) => {
  const label = props.breakLabel;
  const className = props.breakClassName || 'break';

  return <li className={className}>{label}</li>;
};

export default BreakView;
