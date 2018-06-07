// @flow
import React from 'react';
import cx from 'classnames';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';

// core components
import GridContainer from '../Grid/GridContainer';
import ItemGrid from '../Grid/ItemGrid';

import instructionStyle from '../../assets/jss/material-dashboard-pro-react/components/instructionStyle';

// react/require-default-props
/* eslint-disable */
export type Props = {
  classes: Object,
  title: number | string | React.Element | Array<any>,
  text: number | string | React.Element | Array<any>,
  image: string,
  imageAlt?: string,
  className?: string,
  imageClassName?: string
};
/* eslint-enable */

function Instruction(props: Props) {
  const {
    classes,
    title,
    text,
    image,
    className,
    imageClassName,
    imageAlt
  } = props;
  const instructionClasses = cx({
    [classes.instruction]: true,
    [className]: className !== undefined
  });
  const pictureClasses = cx({
    [classes.picture]: true,
    [imageClassName]: imageClassName !== undefined
  });
  return (
    <div className={instructionClasses}>
      <GridContainer>
        <ItemGrid xs={12} sm={12} md={8}>
          <strong>{title}</strong>
          <p>{text}</p>
        </ItemGrid>
        <ItemGrid xs={12} sm={12} md={4}>
          <div className={pictureClasses}>
            <img src={image} alt={imageAlt} className={classes.image} />
          </div>
        </ItemGrid>
      </GridContainer>
    </div>
  );
}

Instruction.defaultProps = {
  imageAlt: '...'
};

export default withStyles(instructionStyle)(Instruction);
