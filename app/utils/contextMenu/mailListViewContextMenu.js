import React from 'react';
import { ContextMenu, MenuItem } from 'react-contextmenu';

class MailListViewContextMenu extends React.Component {
  onCopyMailAddress = (e, data) => {};

  onCopyAccountId = (e, data) => {};

  onCopyPassword = (e, data) => {};

  render() {
    const { idx, id, rowIdx } = this.props;

    return (
      <ContextMenu id={id}>
        <MenuItem data={{ rowIdx, idx }} onClick={this.onCopyMailAddress}>
          メールアドレスをコピー
        </MenuItem>
        <MenuItem data={{ rowIdx, idx }} onClick={this.onCopyAccountId}>
          アカウントIDをコピー
        </MenuItem>
        <MenuItem data={{ rowIdx, idx }} onClick={this.onCopyPassword}>
          パスワードをコピー
        </MenuItem>
      </ContextMenu>
    );
  }
}

export default MailListViewContextMenu;
