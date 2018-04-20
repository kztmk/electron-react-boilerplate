// @flow
import React from 'react';

type Props = {
  row1: string,
  elmWord: string,
  row2: string
};

const SweetAlertTitle = (props: Props) => (
  <span>
    {props.row1}
    <br />
    {props.elmWord}
    <br />
    {props.row2}
  </span>
);

export default SweetAlertTitle;
