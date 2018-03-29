// @flow
import React from 'react';
import cx from 'classnames';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';
import FormControl from 'material-ui/Form/FormControl';
import FormHelperText from 'material-ui/Form/FormHelperText';
import Input from 'material-ui/Input';
import InputLabel from 'material-ui/Input/InputLabel';

// material-ui-icons
import Clear from 'material-ui-icons/Clear';
import Check from 'material-ui-icons/Check';

import customInputStyle from '../../asets/jss/material-dashboard-pro-react/components/customInputStyle';

// react/require-default-props
/* eslint-disable */
export type Props = {
  classes: Object,
  labelText?: number | string | React.Element | Array<any>,
  labelProps?: Object,
  id?: string,
  inputProps?: Object,
  formControlProps?: Object,
  error?: boolean,
  success?: boolean,
  helpText?: string,
  rtlActive?: boolean
};
/* eslint-enable */

function CustomInput(props: Props) {
  const {
    classes,
    formControlProps,
    labelText,
    id,
    labelProps,
    inputProps,
    error,
    success,
    helpText,
    rtlActive
  } = props;

  let labelClasses = cx({
    [` ${classes.labelRootError}`]: error,
    [` ${classes.labelRootSuccess}`]: success && !error
  });

  const inkbarClasses = cx({
    [classes.inkbarError]: error,
    [classes.inkbarSuccess]: success && !error,
    [classes.inkbar]: !success && !error
  });
  let formControlClasses = classes.formControl;
  if (formControlProps !== undefined) {
    formControlClasses += ` ${formControlProps.className}`;
  }
  let underlineClasses = classes.underline;
  if (inputProps !== undefined) {
    formControlClasses =
      `${formControlClasses
      } ${
        cx({
          [classes.inputWithAdornment]:
          (inputProps.startAdornment !== undefined ||
            inputProps.endAdornment !== undefined) &&
          labelText === undefined
        })}`;
    underlineClasses = cx({
      [classes.underline]: inputProps.disabled !== true
    });
  }
  if (inputProps !== undefined) {
    labelClasses =
      `${labelClasses
      } ${
        cx({
          [classes.labelWithAdornment]: inputProps.endAdornment !== undefined
        })}`;
  }
  const successClasses =
    `${classes.feedback
    } ${
      classes.labelRootSuccess
    } ${
      cx({
        [classes.feedbackNoLabel]: labelText === undefined,
        [classes.feedbackAdorment]:
        inputProps !== undefined && inputProps.endAdornment !== undefined
      })}`;
  const errorClasses =
    `${classes.feedback
    } ${
      classes.labelRootError
    } ${
      cx({
        [classes.feedbackNoLabel]: labelText === undefined,
        [classes.feedbackAdorment]:
        inputProps !== undefined && inputProps.endAdornment !== undefined
      })}`;
  const input =
    `${classes.input
    } ${
      cx({
        [classes.inputRTL]: rtlActive,
        [classes.inputNoLabel]: labelText === undefined
      })}`;
  return (
    <FormControl
      {...formControlProps}
      className={formControlClasses}
      aria-describedby={`${id}-text`}
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
          input,
          disabled: classes.disabled,
          underline: underlineClasses,
          inkbar: inkbarClasses
        }}
        id={id}
        {...inputProps}
      />
      {error ? (
        <Clear className={errorClasses} />
      ) : success ? (
        <Check className={successClasses} />
      ) : null}
      {helpText !== undefined ? (
        <FormHelperText id={`${id}-text`}>{helpText}</FormHelperText>
      ) : null}
    </FormControl>
  );
}

export default withStyles(customInputStyle)(CustomInput);
