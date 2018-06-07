// @flow
import React from 'react';

// core components
import MailWizard from './MailWizard';
import { GridContainer, ItemGrid } from '../../ui';

import Steps00 from './WizardChildren/step00';
import StepOutlook from './WizardChildren/stepOutlook';
import StepYahoo from './WizardChildren/stepYahoo';

type Props = {
  createMailAccount: () => void,
  cancelAccount: () => void
};

class WizardViewMail extends React.Component<Props> {
  render() {
    return (
      <GridContainer justify="center">
        <ItemGrid xs={12} sm={12} md={12}>
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
              { stepName: 'Outlook', stepComponent: StepOutlook, stepId: 'outlook' }
            ]}
            title="新規メールアカウウント作成"
            cancelButtonText="キャンセル"
            cancelButtonClick={this.props.cancelAccount}
            previousButtonText="戻る"
            nextButtonText="次へ"
            finishButtonText="メールアドレス取得"
            finishButtonClick={this.props.createMailAccount}
          />
        </ItemGrid>
      </GridContainer>
    );
  }
}

export default WizardViewMail;