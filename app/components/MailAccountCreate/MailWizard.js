/* eslint-disable prefer-template,jsx-a11y/anchor-is-valid,jsx-a11y/anchor-has-content,jsx-a11y/anchor-has-content,react/require-default-props */
/* eslint-disable no-return-assign */
// @flow
import React from 'react';
import cx from 'classnames';
import SweetAlert from 'react-bootstrap-sweetalert';

// material-ui components
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

import PuppeteerEmail from './puppeteerEmail';

// core components
import Button from '../../ui/CustomButtons/Button';
import Table from '../../ui/Table/Table';
import wizardStyle from '../../assets/jss/material-dashboard-pro-react/components/wizardStyle';
import type MailAccountType from '../../types/mailAccount';

const errorStyles = {
  fontWeight: 'bold',
  color: '#f00'
};

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
  cancelButtonClasses?: string,
  cancelButtonText: string,
  cancelButtonClick: () => void,
  previousButtonClasses?: string,
  previousButtonText: string,
  nextButtonClasses?: string,
  nextButtonText: string,
  // finishButtonClasses?: string,
  finishButtonText: string,
  finishButtonClick: () => void,
  validate: boolean,
  mailAccounts: Array<MailAccountType>,
  isCreating: boolean,
  isCreatingFailure: boolean,
  errorMessage: string
};

/*
MailWizard.defaultProps = {
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
  validate: true,
  mailAccounts: [],
  isCreating: false,
  isCreatingFailure: false,
  errorMessage: ''
};
*/

type State = {
  currentStep: number,
  color: 'primary' | 'warning' | 'danger' | 'success' | 'info' | 'rose',
  nextButton: boolean,
  previousButton: boolean,
  finishButton: boolean,
  width: string,
  movingTabStyle: Object,
  accountInfo: Object,
  sweetAlert: Object,
  targetMailAccount: MailAccountType
};

class MailWizard extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      currentStep: 0,
      cancelButton: true,
      nextButton: this.props.steps.length > 1,
      previousButton: false,
      finishButton: this.props.steps.length === 1,
      width: '50%',
      movingTabStyle: {
        transition: 'transform 0s'
      },
      accountInfo: {},
      sweetAlert: '',
      targetMailAccount: {}
    };
  }

  componentDidMount() {
    this.refreshAnimation(0);
    window.addEventListener('resize', this.updateWidth.bind(this));
  }

  componentWillReceiveProps = nextProps => {
    // target gmail
    console.log(`--MailWizard--loading:${this.props.isCreating}--next:${nextProps.isCreating}`);
    if (this.state.accountInfo.provider === 'Gmail') {
      // loading status change true to false
      // if (this.props.isCreating && !nextProps.isCreating) {
      // error status check
      const { mailAddress } = this.state.targetMailAccount;
      console.log(
        `===MailWizard--fail:${this.props.isCreatingFailure}--next:${nextProps.isCreatingFailure}`
      );
      if (!nextProps.isCreatingFailure) {
        console.log('=======gmail create success=======');
        // success
        this.setState({
          sweetAlert: (
            <SweetAlert
              success
              style={{ display: 'block', marginTop: '-100px' }}
              title="Gmail登録完了"
              onConfirm={() => this.hideAlert()}
              onCancel={() => this.hideAlert()}
              confirmBtnCssClass={this.props.classes.button + ' ' + this.props.classes.success}
            >
              メールアドレス: {mailAddress} <br />
              の登録が完了しました。
            </SweetAlert>
          )
        });
      } else {
        // gmail create fail
        this.setState({
          sweetAlert: (
            <SweetAlert
              warning
              style={{ display: 'block', marginTop: '-100px' }}
              title="エラー発生"
              onConfirm={() => this.closeAlert()}
              onCancel={() => this.closeAlert()}
              confirmBtnCssClass={this.props.classes.button + ' ' + this.props.classes.warning}
            >
              メールアドレス: {mailAddress} <br />
              の登録中に以下のエラーが発生しました。<br />
              エラー: {this.props.errorMessage}
            </SweetAlert>
          )
        });
      }
      // }
    }
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWidth.bind(this), true);
  }

  updateWidth() {
    this.refreshAnimation(this.state.currentStep);
  }

  /**
   * cancel button click or finish button and close
   */
  cancelButtonClick = () => {
    // 全てのフォームのstateを初期化
    // 本体
    this.setState({
      currentStep: 0,
      cancelButton: true,
      nextButton: this.props.steps.length > 1,
      previousButton: false,
      finishButton: this.props.steps.length === 1,
      accountInfo: {},
      sweetAlert: ''
    });
    // steps0-2
    this[this.props.steps[0].stepId].initState();
    this[this.props.steps[1].stepId].initState();
    this[this.props.steps[2].stepId].initState();
    this[this.props.steps[3].stepId].initState();
    // tab move to init location
    this.refreshAnimation(0);
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
        case 'Gmail':
          nextStep = 2;
          break;
        case 'Yandex':
          nextStep = 3;
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
          postalCode: steps00State.postalCode,
          prefecture: steps00State.prefecture
        }
      });
      this.refreshAnimation(nextStep);
      if (nextStep === 3) {
        this[this.props.steps[3].stepId].getInfo(
          steps00State.lastNameKana,
          steps00State.firstNameKana
        );
      }
    }
  };

  /**
   * previous button click on step2
   */
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

  getDialogMessge = user => {
    let gender = '';
    if (user.gender) {
      gender = '女性';
    } else {
      gender = '男性';
    }
    console.log(`provider2: ${user.provider}`);
    switch (user.provider) {
      case 'yahoo':
        console.log('yahoo dialog');
        return (
          <Table
            tableData={[
              ['アカウントID：', user.username, 'パスワード：', user.password],
              ['氏名：', `${user.lastName} ${user.firstName}`, '性別:', gender],
              [
                '生年月日:',
                `${user.birthday.year}/${user.birthday.month}/${user.birthday.day}`,
                '郵便番号:',
                user.postalCode
              ],
              ['秘密の質問:', user.secret.question],
              ['秘密の質問の答え:', user.secret.answer]
            ]}
          />
        );
      case 'outlook':
        return (
          <Table
            tableData={[
              ['アカウントID：', user.username, 'パスワード：', user.password],
              ['氏名：', `${user.lastName} ${user.firstName}`, '性別:', gender],
              [
                '生年月日:',
                `${user.birthday.year}/${user.birthday.month}/${user.birthday.day}`,
                'ドメイン:',
                user.domain
              ]
            ]}
          />
        );
      case 'gmail':
        return (
          <Table
            tableData={[
              ['作成メールアドレス:', user.email],
              ['アカウントID：', user.username, 'パスワード：', user.password],
              ['氏名：', `${user.lastName} ${user.firstName}`, '性別:', gender],
              ['生年月日:', `${user.birthday.year}/${user.birthday.month}/${user.birthday.day}`]
            ]}
          />
        );

      case 'yandex':
        return (
          <Table
            tableData={[
              ['作成メールアドレス:', user.email],
              ['アカウントID：', user.username, 'パスワード：', user.password],
              ['氏名：', `${user.lastName} ${user.firstName}`, '性別:', gender],
              ['秘密の質問:', `${user.secret.question}`],
              ['質問の答:', `${user.secret.answer}`]
            ]}
          />
        );
      default:
        break;
    }
  };

  showFinishDialog = (user, newMailAccount) => {
    console.log(`provider1: ${user.provider}`);
    const message = this.getDialogMessge(user);
    this.setState({
      sweetAlert: (
        <SweetAlert
          style={{ display: 'block', marginTop: '-280px', width: '620px' }}
          title="メールアカウント作成開始"
          onConfirm={() => this.createEmailAccount(user, newMailAccount)}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={this.props.classes.button + ' ' + this.props.classes.btnSuccess}
          cancelBtnCssClass={this.props.classes.button + ' ' + this.props.classes.btnDanger}
          confirmBtnText="作成"
          cancelBtnText="キャンセル"
          showCancel
        >
          <p>以下の情報でメールアカウントの作成を開始します。 </p>
          {message}
          <p>
            メールアドレス一覧への登録を最初に行います。
            <br />
            途中で
            <span style={errorStyles}>エラー</span>
            が発生した場合には、
            <br />
            ・可能な場合は、失敗時点から手動で継続
            <br />
            ・ブラウザを閉じて、メール一覧から削除
            <br />
            で、対処してください。
          </p>
        </SweetAlert>
      )
    });
  };

  showErrorDialog = email => {
    this.setState({
      sweetAlert: (
        <SweetAlert
          style={{ display: 'block', marginTop: '-100px' }}
          title="既にメールアドレスは存在します。"
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={this.props.classes.button + ' ' + this.props.classes.success}
        >
          作成しようとしたメールアドレス<br />
          {email}
          <br />
          は、すでにリストに存在しています。
        </SweetAlert>
      )
    });
  };

  createEmailAccount = (user, newMailAccount) => {
    // save to database
    console.log('save to db');
    this.setState({ sweetAlert: null });
    this.props.finishButtonClick(newMailAccount);
    if (user.provider !== 'gmail') {
      // close dialog and create form
      this.hideAlert();
      // create account
      const puppeteerEmail = new PuppeteerEmail(user);
      puppeteerEmail.signup(user);
    } else {
      this.setState({ targetMailAccount: newMailAccount });
    }
  };

  hideAlert = () => {
    this.setState({ sweetAlert: '' });
    this.cancelButtonClick();
  };

  closeAlert = () => {
    this.setState({ sweetAlert: null });
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

      const user = {};
      const detailInfo = [];

      detailInfo.push(
        `氏名(漢字):${this.state.accountInfo.lastName} ${this.state.accountInfo.firstName}`
      );
      user.lastName = this.state.accountInfo.lastName;
      user.firstName = this.state.accountInfo.firstName;

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
      detailInfo.push(`都道府県:${this.state.accountInfo.prefecture}`);

      let accId = '';
      let mailAddress = '';
      let userKey = '';
      user.username = this.state.accountInfo.accountId;
      user.password = this.state.accountInfo.password;
      // birthday スラッシュは自動で入るので、4桁-yyyy、2桁-MM、2桁-DD
      user.birthday = {};
      const [year, month, day] = this.state.accountInfo.birthDate.split('/');
      // check numbers
      if (!/\d{4}/.test(year)) throw new Error('生年月日-年が不正な値です。');
      if (!/\d{2}/.test(month)) throw new Error('生年月日-月が不正な値です。');
      if (!/\d{2}/.test(day)) throw new Error('生年月日-日が不正な値です。');

      user.birthday = { year, month, day };

      switch (this.state.accountInfo.provider) {
        case 'Yahoo':
          user.provider = 'yahoo';
          user.postalCode = this.state.accountInfo.postalCode;
          accId = user.username;
          user.gender = this.state.accountInfo.gender;
          user.email = `${this.state.accountInfo.accountId}@yahoo.co.jp`;
          mailAddress = user.email;
          detailInfo.push(`秘密の質問:${additionalInfo.Question}`);
          detailInfo.push(`秘密の答え:${additionalInfo.answer}`);

          user.secret = {};
          user.secret.question = additionalInfo.Question;
          user.secret.answer = additionalInfo.answer;

          break;
        case 'Outlook':
          user.provider = 'outlook';
          accId = this.state.accountInfo.accountId;
          mailAddress = `${this.state.accountInfo.accountId}@${additionalInfo[0].domain}`;
          user.domain = additionalInfo[0].domain;

          // birthday check -- outlook do not accept MM, DD
          user.birthday.month = this.zeroSuppress(user.birthday.month);
          user.birthday.day = this.zeroSuppress(user.birthday.day);
          break;
        case 'Gmail':
          user.provider = 'gmail';
          user.email = `${additionalInfo.accountName}@${additionalInfo.domain}`;
          mailAddress = user.email;
          accId = additionalInfo.accountName;
          userKey = additionalInfo.sequenceKey;
          break;
        case 'Yandex':
          user.provider = 'yandex';
          accId = this.state.accountInfo.accountId;
          mailAddress = `${accId}@yandex.com`;
          user.email = mailAddress;
          detailInfo.push(`姓(ローマ字)${additionalInfo.lastNameHepburn}`);
          detailInfo.push(`名(ローマ字)${additionalInfo.firstNameHepburn}`);
          detailInfo.push(`秘密の質問:${additionalInfo.question}`);
          detailInfo.push(`質問の答え:${additionalInfo.answer}`);

          user.secret = {};
          user.secret.question = additionalInfo.question;
          user.secret.answer = additionalInfo.answer;
          user.firstName = additionalInfo.firstNameHepburn;
          user.lastName = additionalInfo.lastNameHepburn;
          console.log();
          break;
        default:
      }

      const existsEmail = this.props.mailAccounts.find(
        mailAccount => mailAccount.mailAddress === user.email
      );

      if (!existsEmail) {
        const newMailAccount = {
          key: userKey,
          accountId: accId,
          password: this.state.accountInfo.password,
          mailAddress,
          provider: this.state.accountInfo.provider,
          createDate: Date.now(),
          lastLogin: 0,
          tags: '',
          detailInfo
        };

        // show dialog
        this.showFinishDialog(user, newMailAccount);
        // create account
      } else {
        this.showErrorDialog(user.email);
      }
    }
  };

  refreshAnimation = index => {
    // eslint-disable-next-line react/no-string-refs
    let moveDistance = this.refs.wizard.children[0].offsetWidth / 2;

    const indexTemp = index === 0 ? 0 : 1;
    moveDistance *= indexTemp;
    moveDistance -= 8;

    const { width } = this.state.width;
    const movingTabStyle = {
      width: '50%',
      transform: `translate3d(${moveDistance}px, 0, 0)`,
      transition: 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'
    };
    this.setState({ movingTabStyle });
  };

  // eslint-disable-next-line arrow-body-style
  zeroSuppress = val => {
    return val.replace(/^0+([0-9]+)/, '$1');
  };

  writeTabs = () => {
    const { classes } = this.props;
    console.log(`current:${this.state.currentStep}`);
    if (this.state.currentStep !== 0) {
      return (
        <li className={classes.steps} key={this.state.currentStep} style={{ width: '50%' }}>
          <a
            className={classes.stepsAnchor}
            onClick={() => this.previousButtonClick()}
            role="button"
            tabIndex="0"
            onKeyPress={() => this.previousButtonClick()}
          >
            {this.props.steps[0].stepName}
          </a>
        </li>
      );
    }
    return (
      <li className={classes.steps} key={-1} style={{ width: '50%' }}>
        <a
          className={classes.stepsAnchor}
          onClick={() => this.previousButtonClick()}
          role="button"
          tabIndex="0"
          onKeyPress={() => this.previousButtonClick()}
        >
          メール追加情報
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
                <a
                  className={classes.stepsAnchor}
                  onClick={() => this.previousButtonClick()}
                  role="button"
                  tabIndex="0"
                  onKeyPress={() => this.previousButtonClick()}
                />
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
        {this.state.sweetAlert}
      </div>
    );
  }
}

export default withStyles(wizardStyle)(MailWizard);
