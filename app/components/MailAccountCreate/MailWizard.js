/* eslint-disable react/require-default-props */
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
  stepComponent: React.Node,
  stepId: string
};

type Props = {
  classes: Object,
  steps: Array<StepsType>,
  color: 'primary' | 'warning' | 'danger' | 'success' | 'info' | 'rose',
  title: string,
  subtitle?: string,
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
  previousButton: boolean,
  finishButton: boolean,
  width: string,
  movingTabStyle: Object
};

class MailWizard extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      currentStep: 0,
      color: this.props.color,
      cancelButton: true,
      nextButton: this.props.steps.length > 1,
      previousButton: false,
      finishButton: this.props.steps.length === 1,
      width: '50%',
      movingTabStyle: {
        transition: 'transform 0s'
      },
      accountInfo: {}
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
      const selectedProvider = this[this.props.steps[0].stepId].getProvider();
      let nextStep = 0;
      switch (selectedProvider) {
        case 'Yahoo':
          nextStep = 1;
          break;
        case 'Outlook':
          nextStep = 2;
          break;
        default:
      }
      const steps00State = this[this.props.steps[0].stepId].sendState();
      console.log(steps00State);
      this.setState({
        cancelButton: false,
        currentStep: nextStep,
        nextButton: false,
        previousButton: true,
        finishButton: true,
        accountInfo: {
          provider: steps00State.provider,
          accountId: steps00State.accountId,
          password: steps00State.password,
          lastName: steps00State.lastName,
          lastNameKana: steps00State.lastNameKana,
          firstName: steps00State.firstName,
          firstNameKana: steps00State.firstNameKana,
          gender: steps00State.gender,
          birthDate: steps00State.birthDate,
          postalCode: steps00State.postalCode
        }
      });
      this.refreshAnimation(nextStep);
    }
  };

  previousButtonClick = () => {
    this.setState({
      currentStep: 0,
      cancelButton: true,
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
      const additionalInfo = this[this.props.steps[this.state.currentStep].stepId].sendState();

      const detailInfo = [];
      detailInfo.push(
        `氏名(漢字):${this.state.accountInfo.lastName} ${this.state.accountInfo.firstName}`
      );
      detailInfo.push(
        `しめい(ふりがな):${this.state.accountInfo.lastNameKana} ${
          this.state.accountInfo.firstNameKana
        }`
      );
      detailInfo.push(`生年月日:${this.state.accountInfo.birthDate}`);
      detailInfo.push(`郵便番号:${this.state.accountInfo.postalCode}`);
      let gender = '男';
      if (this.state.accountInfo.gender) {
        gender = '女';
      }
      detailInfo.push(`性別:${gender}`);

      let accId = '';
      let mailAddress = '';
      switch (this.state.accountInfo.provider) {
        case 'Yahoo':
          accId = this.state.accountInfo.accountId;
          mailAddress = `${this.state.accountInfo.accountId}@yahoo.co.jp`;
          detailInfo.push(`秘密の質問:${additionalInfo.Question}`);
          detailInfo.push(`秘密の答え:${additionalInfo.answer}`);
          break;
        case 'Outlook':
          accId = `${this.state.accountInfo.accountId}@${additionalInfo[0].domain}`;
          mailAddress = accId;
          break;
        default:
      }

      const newMailAccount = {
        key: '',
        accountId: accId,
        password: this.state.accountInfo.password,
        mailAddress,
        provider: this.state.accountInfo.provider,
        createDate: Date.now(),
        lastLogin: 0,
        tags: '',
        detailInfo
      };
      this.props.finishButtonClick(newMailAccount);
    }
  };

  refreshAnimation = index => {
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
          メール追加情報
        </a>
      </li>
    );
  };

  render() {
    const { classes, title, color, steps } = this.props;
    return (
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
                  className={this.finishButtonClasses}
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

export default withStyles(wizardStyle)(MailWizard);
