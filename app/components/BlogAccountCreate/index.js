// @flow
import React from 'react';

// core components
import BlogWizard from './BlogWizard';
import GridContainer from '../../ui/Grid/GridContainer';
import GridItem from '../../ui/Grid/GridItem';

import Steps00 from './WizardChildren/step00';
import StepFc2 from './WizardChildren/stepFc2';
import StepWebNode from './WizardChildren/stepWebNode';
import StepLivedoor from './WizardChildren/stepLivedoor';
import StepSeesaa from './WizardChildren/stepSeesaa';
import StepAmeba from './WizardChildren/stepAmeba';
import StepRakuten from './WizardChildren/stepRakuten';
import StepKokolog from './WizardChildren/stepKokolog';
import StepYaplog from './WizardChildren/stepYaplog';
import StepNinjya from './WizardChildren/stepNinjya';
import StepHatena from './WizardChildren/stepHatena';
import StepWebryBlog from './WizardChildren/stepWebryBlog';
import StepWpcom from './WizardChildren/stepWpcom';
import StepGoo from './WizardChildren/stepGoo';

type Props = {
  createMailAccount: () => void,
  cancelAccount: () => void
};

class WizardViewBlog extends React.Component<Props> {
  render() {
    return (
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={12}>
          <BlogWizard
            validate
            color="primary"
            steps={[
              {
                stepName: 'ブログ取得-個人情報',
                stepComponent: Steps00,
                stepId: 'start'
              },
              { stepName: 'Fc2', stepComponent: StepFc2, stepId: 'fc2' },
              { stepName: 'WebNode', stepComponent: StepWebNode, stepId: 'webnode' },
              { stepName: 'Livedoor', stepComponent: StepLivedoor, stepId: 'livedoor' },
              { stepName: 'Seesaa', stepComponent: StepSeesaa, stepId: 'seesaa' },
              { stepName: 'Ameba', stepComponent: StepAmeba, stepId: 'ameba' },
              { stepName: 'Rakuten', stepComponent: StepRakuten, stepId: 'rakuten' },
              { stepName: 'Kokolog', stepComponent: StepKokolog, stepId: 'kokolog' },
              { stepName: 'Yaplog', stepComponent: StepYaplog, stepId: 'yaplog' },
              { stepName: 'Ninjya', stepComponent: StepNinjya, stepId: 'ninjya' },
              { stepName: 'Hatena', stepComponent: StepHatena, stepId: 'hatena' },
              { stepName: 'WebryBlog', stepComponent: StepWebryBlog, stepId: 'webryblog' },
              { stepName: 'WordPress.com', stepComponent: StepWpcom, stepId: 'wpcom' },
              { stepName: 'Goo', stepComponent: StepGoo, stepId: 'goo' }
            ]}
            title="新規ブログ作成"
            cancelButtonText="キャンセル"
            cancelButtonClick={this.props.cancelAccount}
            previousButtonText="戻る"
            nextButtonText="次へ"
            finishButtonText="ブログ取得"
            finishButtonClick={this.props.createMailAccount}
          />
        </GridItem>
      </GridContainer>
    );
  }
}

export default WizardViewBlog;
