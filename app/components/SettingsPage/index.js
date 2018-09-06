// @flow
import React from 'react';
import Person from '@material-ui/icons/Person';
import PreferencesPage from '../../containers/PersonalInfo';
import GmailSettings from '../../containers/Gmail';
import CustomTabs from '../../ui/CustomTabs/CustomTabs';
import { GmailIcon } from '../../assets/icons';

const adjTopMarginStyle = {
  marginTop: '-60px'
};

const SettingsPage = () => (
  <div style={adjTopMarginStyle}>
    <CustomTabs
      title="設定:"
      headerColor="primary"
      tabs={[
        {
          tabName: '既定の個人情報',
          tabIcon: Person,
          tabContent: <PreferencesPage />
        },
        {
          tabName: 'Gmail',
          tabIcon: GmailIcon,
          tabContent: <GmailSettings />
        }
      ]}
    />
  </div>
);

export default SettingsPage;
