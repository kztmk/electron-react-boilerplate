// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import type { StateType, DispatchType } from '../../types';
import GmailSettings from '../../components/FormSettings/gmailInfo';
import type GmailType from '../../types/gmail';
import { saveGmailInfoRequest } from './actions';

const mapStateToProps = (state: StateType) => ({
  isLoading: state.Gmail.isGmailInfoLoading,
  isFailure: state.Gmail.isGmailInfoFailure,
  errorMessage: state.Gmail.errorMessage,
  gmailInfo: state.Gmail.gmailInfo
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
  startSaveGmailInfo(gmailInfo: GmailType) {
    dispatch(saveGmailInfoRequest(gmailInfo));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(GmailSettings);
