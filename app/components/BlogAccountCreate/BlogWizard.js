/* eslint-disable jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions,jsx-a11y/anchor-has-content */
/* eslint-disable no-return-assign */
// @flow
import React from 'react';
import cx from 'classnames';

// material-ui components
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

// core components
import Button from '../../ui/CustomButtons/Button';

import wizardStyle from '../../assets/jss/material-dashboard-pro-react/components/wizardStyle';

type StepsType = {
  stepName: string,
  stepComponent: Object,
  stepId: string
};

type Props = {
  classes: Object,
  steps: Array<StepsType>,
  color: 'primary' | 'warning' | 'danger' | 'success' | 'info' | 'rose',
  title: string,
  // subtitle?: string,
  cancelButtonClasses?: string,
  cancelButtonText: string,
  cancelButtonClick: () => void,
  previousButtonClasses?: string,
  previousButtonText: string,
  nextButtonClasses?: string,
  nextButtonText: string,
  finishButtonClasses?: string,
  finishButtonText: string,
  finishButtonClick: () => void,
  validate: boolean
};

type State = {
  currentStep: number,
  color: 'primary' | 'warning' | 'danger' | 'success' | 'info' | 'rose',
  nextButton: boolean,
  cancelButton: boolean,
  previousButton: boolean,
  finishButton: boolean,
  width: string,
  movingTabStyle: Object
};

class BlogWizard extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      currentStep: 0,
      // color: this.props.color,
      cancelButton: true,
      nextButton: this.props.steps.length > 1,
      previousButton: false,
      finishButton: this.props.steps.length === 1,
      // width: '50%',
      movingTabStyle: {
        transition: 'transform 0s'
      }
    };
  }

  componentDidMount() {
    this.refreshAnimation(0);
    window.addEventListener('resize', this.updateWidth.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWidth.bind(this), true);
  }

  updateWidth() {
    this.refreshAnimation(this.state.currentStep);
  }

  cancelButtonClick = () => {
    this.props.cancelButtonClick();
  };

  /**
   * Next button click
   */
  nextButtonClick = () => {
    if (this[this.props.steps[0].stepId].isValidated()) {
      console.log('step0 validate true');
      const selectedProvider = this[this.props.steps[0].stepId].getProvider();
      let nextStep = 0;
      switch (selectedProvider) {
        case 'fc2':
        nextStep = 1;
        break;
        case 'webnode':
        nextStep = 2;
        break;
        case 'livedoor':
        nextStep = 3;
        break;
        case 'seesaa':
        nextStep = 4;
        break;
        case 'ameba':
        nextStep = 5;
        break;
        case 'rakuten':
        nextStep = 6;
        break;
        case 'kokolog':
        nextStep = 7;
        break;
        case 'yaplog':
        nextStep = 8;
        break;
        case 'ninjya':
        nextStep = 9;
        break;
        case 'hatena':
        nextStep = 10;
        break;
        case 'webryBlog':
        nextStep = 11;
        break;
        case 'wpcom':
        nextStep = 12;
        break;
        case 'goo':
        nextStep = 13;
        break;
        default:
      }
      this.setState({
        cancelButton: false,
        currentStep: nextStep,
        nextButton: false,
        previousButton: true,
        finishButton: true
      });
      this.refreshAnimation(nextStep);
    }
  };

  previousButtonClick = () => {
    this.setState({
      currentStep: 0,
      nextButton: true,
      previousButton: false,
      finishButton: false
    });
    this.refreshAnimation(0);
  };

  finishButtonClick = () => {
    if (
      this.props.validate &&
      ((this[this.props.steps[this.state.currentStep].stepId].isValidated !== undefined &&
        this[this.props.steps[this.state.currentStep].stepId].isValidated()) ||
        this[this.props.steps[this.state.currentStep].stepId].isValidated === undefined) &&
      this.props.finishButtonClick !== undefined
    ) {
      this.props.finishButtonClick();
    }
  };

  refreshAnimation = index => {
    // eslint-disable-next-line react/no-string-refs
    let moveDistance = this.refs.wizard.children[0].offsetWidth / 2;

    const indexTemp = index === 0 ? 0 : 1;
    moveDistance *= indexTemp;
    moveDistance -= 8;

    const movingTabStyle = {
      width: '50%',
      transform: `translate3d(${moveDistance}px, 0, 0)`,
      transition: 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'
    };
    this.setState({ movingTabStyle });
  };

  writeTabs = () => {
    const { classes } = this.props;
    console.log(`current:${this.state.currentStep}`);
    if (this.state.currentStep !== 0) {
      return (
        <li className={classes.steps} key={this.state.currentStep} style={{ width: '50%' }}>
          <a className={classes.stepsAnchor} onClick={() => this.previousButtonClick()}>
            {this.props.steps[0].stepName}
          </a>
        </li>
      );
    }
    return (
      <li className={classes.steps} key={-1} style={{ width: '50%' }}>
        <a className={classes.stepsAnchor} onClick={() => this.previousButtonClick()}>
          ブログ追加情報
        </a>
      </li>
    );
  };

  render() {
    const { classes, title, color, steps } = this.props;
    return (
      // eslint-disable-next-line react/no-string-refs
      <div className={classes.wizardContainer} ref="wizard">
        <Card className={classes.card}>
          <div className={classes.wizardHeader}>
            <h3 className={classes.title}>{title}</h3>
          </div>
          <div className={classes.wizardNavigation}>
            <ul className={classes.nav}>
              <li className={classes.steps} key={0} style={{ width: '50%' }}>
                <a className={classes.stepsAnchor} onClick={() => this.previousButtonClick()} />
              </li>
              {this.writeTabs()}
            </ul>
            <div
              className={`${classes.movingTab} ${classes[color]}`}
              style={this.state.movingTabStyle}
            >
              {steps[this.state.currentStep].stepName}
            </div>
          </div>
          <div className={classes.content}>
            {steps.map((prop, key) => {
              const stepContentClasses = cx({
                [classes.stepContentActive]: this.state.currentStep === key,
                [classes.stepContent]: this.state.currentStep !== key
              });
              return (
                // eslint-disable-next-line react/no-array-index-key
                <div className={stepContentClasses} key={key}>
                  {/* <prop.stepComponent innerRef={prop.stepId}/> */}
                  <prop.stepComponent innerRef={node => (this[prop.stepId] = node)} />
                </div>
              );
            })}
          </div>
          <div className={classes.footer}>
            <div className={classes.left}>
              {this.state.previousButton ? (
                <Button
                  className={this.props.previousButtonClasses}
                  onClick={() => this.previousButtonClick()}
                >
                  {this.props.previousButtonText}
                </Button>
              ) : null}
              {this.state.cancelButton ? (
                <Button
                  className={this.props.cancelButtonClasses}
                  onClick={() => this.cancelButtonClick()}
                >
                  {this.props.cancelButtonText}
                </Button>
              ) : null}
            </div>
            <div className={classes.right}>
              {this.state.nextButton ? (
                <Button
                  color="rose"
                  className={this.props.nextButtonClasses}
                  onClick={() => this.nextButtonClick()}
                >
                  {this.props.nextButtonText}
                </Button>
              ) : null}
              {this.state.finishButton ? (
                <Button
                  color="rose"
                  className={this.props.finishButtonClasses}
                  onClick={() => this.finishButtonClick()}
                >
                  {this.props.finishButtonText}
                </Button>
              ) : null}
            </div>
            <div className={classes.clearfix} />
          </div>
        </Card>
      </div>
    );
  }
}

BlogWizard.defaultProps = {
  steps: [],
  color: 'primary',
  title: '',
  subtitle: '',
  cancelButtonClasses: '',
  cancelButtonText: '',
  cancelButtonClick: '',
  previousButtonClasses: '',
  previousButtonText: '',
  nextButtonClasses: '',
  nextButtonText: '',
  finishButtonClasses: '',
  finishButtonText: '',
  finishButtonClick: '',
  validate: true
};

export default withStyles(wizardStyle)(BlogWizard);
