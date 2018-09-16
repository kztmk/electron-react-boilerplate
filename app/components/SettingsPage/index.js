// @flow
import React from 'react';
import Person from '@material-ui/icons/Person';
import PreferencesPage from '../../containers/PersonalInfo';
import GmailBaseSettings from '../../containers/AliasMailInfo/gmailBase';
import YandexBaseSettings from '../../containers/AliasMailInfo/yandexBase';
import CustomTabs from '../../ui/CustomTabs/CustomTabs';
import { GmailIcon, YandexIcon } from '../../assets/icons';
import type AliasMailType from '../../types/aliasMailInfo';
import { initialAliasBase } from '../../containers/AliasMailInfo/reducer';

const adjTopMarginStyle = {
  marginTop: '-90px'
};

type Props = {
  isLoading: boolean,
  isFailure: boolean,
  errorMessage: string,
  aliasMailInfo: Array<AliasMailType>
}

type State = {
  gmailBase: AliasMailType,
  yandexBase: AliasMailType
}

class SettingsPage extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state={
      gmailBase: initialAliasBase,
      yandexBase: initialAliasBase
    }
  }

  componentDidMount() {
    let gmailBase = this.props.aliasMailInfo.find(alias =>alias.provider === 'gmail');
    if (!gmailBase) {
      gmailBase = { ...initialAliasBase, provider: 'gmail' };
    }

    let yandexBase = this.props.aliasMailInfo.find(alias => alias.provider === 'yandex');
    if (!yandexBase) {
      yandexBase = { ...initialAliasBase, provider: 'yandex' };
    }
    this.setState({
      gmailBase,
      yandexBase
    })
  }

  componentWillReceiveProps = nextProps => {
    let gmailBase = nextProps.aliasMailInfo.find(alias =>alias.provider === 'gmail');
    if (!gmailBase) {
      gmailBase = { ...initialAliasBase, provider: 'gmail' };
    }

    let yandexBase = nextProps.aliasMailInfo.find(alias => alias.provider === 'yandex');
    if (!yandexBase) {
      yandexBase = { ...initialAliasBase, provider: 'yandex' };
    }
    this.setState({
      gmailBase,
      yandexBase
    })
  }

  render() {
    return (
    <div style={adjTopMarginStyle}>
      <CustomTabs
        title="設定:"
        headerColor="primary"
        tabs={[
          {
            tabName: '既定の個人情報',
            tabIcon: Person,
            tabContent: <PreferencesPage/>
          },
          {
            tabName: 'Gmail',
            tabIcon: GmailIcon,
            tabContent: <GmailBaseSettings
              isAliasLoading = {this.props.isLoading}
              isAliasFailure = {this.props.isFailure}
              errorMessageAlias={this.props.errorMessage}
              gmailBase = {this.state.gmailBase}
            />
          },
          {
            tabName: 'Yandex',
            tabIcon: YandexIcon,
            tabContent: <YandexBaseSettings
              isAliasLoading={this.props.isLoading}
              isAliasFailure={this.props.isFailure}
              errorMessageAlias={this.props.errorMessage}
              yandexBase = {this.state.yandexBase}
            />
          }
        ]}
      />
    </div>
    )}
}

export default SettingsPage;
