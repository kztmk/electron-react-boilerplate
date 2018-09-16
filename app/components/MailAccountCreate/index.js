// @flow
import React from 'react';

// core components
import MailWizard from '../../containers/MailAccountCreate/MailWizard';
import GridContainer from '../../ui/Grid/GridContainer';
import GridItem from '../../ui/Grid/GridItem';

import Steps00 from '../../containers/MailAccountCreate/WizardChildren/step00';
import StepYandex from '../../containers/MailAccountCreate/WizardChildren/stepYandex';
import StepYahoo from './WizardChildren/stepYahoo';
import StepGmail from '../../containers/MailAccountCreate/WizardChildren/stepGmail';
import type MailAccountType from '../../types/mailAccount';

type Props = {
  createMailAccount: () => void,
  cancelAccount: () => void,
  mailAccounts: Array<MailAccountType>
};

class WizardViewMail extends React.Component<Props> {
  createMailAccount = () => {
    // validate data
    // generate data
  };

  render() {
    return (
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={12}>
          <MailWizard
            validate
            color="primary"
            steps={[
              {
                stepName: 'メールアカウント取得-個人情報',
                stepComponent: Steps00,
                stepId: 'start'
              },
              { stepName: 'Yahoo', stepComponent: StepYahoo, stepId: 'yahoo' },
              {
                stepName: 'Gmail',
                stepComponent: StepGmail,
                stepId: 'gmail'
              },
              { stepName: 'Yandex', stepComponent: StepYandex, stepId: 'yandex' }
            ]}
            title="新規メールアカウント作成"
            cancelButtonText="キャンセル"
            cancelButtonClick={this.props.cancelAccount}
            previousButtonText="戻る"
            nextButtonText="次へ"
            finishButtonText="メールアドレス取得"
            finishButtonClick={this.props.createMailAccount}
            mailAccounts={this.props.mailAccounts}
          />
        </GridItem>
      </GridContainer>
    );
  }
}

export default WizardViewMail;
