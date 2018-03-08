/* @flow */
import React from "react";
import { withStyles, FormControl, InputLabel, Input } from "material-ui";
import { Clear, Check } from "material-ui-icons";
import cx from "classnames";

import customInputStyle from "../../variables/styles/customInputStyle";

export type Props = {
  classes: Object,
  labelText?: number | string | React.Element | Array<any>,
  labelProps?: Object,
  id?: string,
  inputProps?: Object,
  formControlProps?: Object,
  error?: boolean,
  success?: boolean,
};

function CustomInput(props: Props) {
  const {
    classes,
    formControlProps,
    labelText,
    id,
    labelProps,
    inputProps,
    error,
    success
  } = props;

  const labelClasses = cx({
    [" " + classes.labelRootError]: error,
    [" " + classes.labelRootSuccess]: success && !error
  });
  const inkbarClasses = cx({
    [classes.inkbarError]: error,
    [classes.inkbarSuccess]: success && !error,
    [classes.inkbar]: !success && !error
  });
  const marginTop = cx({
    [classes.marginTop]: labelText === undefined
  });
  return (
    <FormControl
      {...formControlProps}
      className={formControlProps.className + " " + classes.formControl}
    >
      {labelText !== undefined ? (
        <InputLabel
          className={classes.labelRoot + labelClasses}
          htmlFor={id}
          {...labelProps}
        >
          {labelText}
        </InputLabel>
      ) : null}
      <Input
        classes={{
          root: marginTop,
          disabled: classes.disabled,
          underline: classes.underline,
          inkbar: inkbarClasses
        }}
        id={id}
        {...inputProps}
      />
      {error ? (
        <Clear className={classes.feedback + " " + classes.labelRootError} />
      ) : success ? (
        <Check className={classes.feedback + " " + classes.labelRootSuccess} />
      ) : null}
    </FormControl>
  );
}

export default withStyles(customInputStyle)(CustomInput);
