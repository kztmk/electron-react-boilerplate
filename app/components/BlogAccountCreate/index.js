// @flow
import React from 'react';

// core components
import BlogWizard from './BlogWizard';
import GridContainer from '../../ui/Grid/GridContainer';
import GridItem from '../../ui/Grid/GridItem';

import Steps00 from './WizardChildren/step00';
import StepFc2 from './WizardChildren/stepFc2';

type Props = {
  createMailAccount: () => void,
  cancelAccount: () => void
};

class WizardViewMail extends React.Component<Props> {
  render() {
    return (
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={12}>
          <BlogWizard
            validate
            color="primary"
            steps={[
              {
                stepName: 'メールアカウント取得-個人情報',
                stepComponent: Steps00,
                stepId: 'start'
              },
              { stepName: 'Fc2', stepComponent: StepFc2, stepId: 'fc2' }
            ]}
            title="新規メールアカウウント作成"
            cancelButtonText="キャンセル"
            cancelButtonClick={this.props.cancelAccount}
            previousButtonText="戻る"
            nextButtonText="次へ"
            finishButtonText="メールアドレス取得"
            finishButtonClick={this.props.createMailAccount}
          />
        </GridItem>
      </GridContainer>
    );
  }
}

export default WizardViewMail;
