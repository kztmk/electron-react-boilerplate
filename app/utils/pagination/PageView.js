// @flow

import React from 'react';

type Props = {
  pageClassName: string,
  pageLinkClassName: string,
  onClick: () => void,
  href: string,
  page: number,
  extraAriaContext: string,
  selected: string,
  activeClassName: string
};

const PageView = (props: Props) => {
  const cssClassName = props.pageClassName;
  let linkClassName = props.pageLinkClassName;
  let ariaLabel = `Page ${props.page} ${
    props.extraAriaContext ? ` ${props.extraAriaContext}` : ''
  }`;
  let ariaCurrent = null;

  if (props.selected) {
    ariaCurrent = 'page';
    ariaLabel = `Page-${props.page}が、現在選択されています。`;
    if (typeof linkClassName !== 'undefined') {
      linkClassName = `${linkClassName} ${props.activeClassName}`;
    } else {
      linkClassName = props.activeClassName;
    }
  }

  return (
    <li className={cssClassName}>
      <a
        onClick={props.onClick}
        role="button"
        className={linkClassName}
        href={props.href}
        tabIndex="0"
        aria-label={ariaLabel}
        aria-current={ariaCurrent}
        onKeyPress={props.onClick}
      >
        {props.page}
      </a>
    </li>
  );
};

export default PageView;
