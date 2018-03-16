// @flow
import React from 'react';
import { withStyles, Tooltip, Grid } from 'material-ui';
import Modal from 'material-ui/Modal';
import IconButton from 'material-ui/IconButton';
import Cancel from 'material-ui-icons/Cancel';
import { LogoutIcon } from '../../asets/icons';
import { ItemGrid, RegularCard, Button } from '../../ui';

import LogoutButtonStyle from '../../variables/styles/logout';

type Props = {
  classes: object,
  logoutStart: () => void
};

class LogoutButton extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
  }

  handleOpenModal = () => {
    this.setState({ modalOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ modalOpen: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Tooltip
          className={classes.toolTip}
          id="nav-icon-logout"
          title="ログアウト"
          placement="bottom"
        >
          <IconButton
            className={classes.iconButton}
            onClick={this.handleOpenModal}
            aria-label="ログアウト"
          >
            <LogoutIcon className={classes.logoutIcon} />
          </IconButton>
        </Tooltip>
        <Modal open={this.state.modalOpen} onClose={this.handleCloseModal}>
          <Grid container justify="center">
            <ItemGrid xs={12} sm={10} md={6}>
              <RegularCard
                headColor="primary"
                cardTitle="ログアウト"
                cardSubtitle="ログアウトしますか？"
                footer={
                  <ItemGrid xs={12} sm={10} md={12} container justify="center">
                    <Button onClick={this.handleCloseModal}>
                      <Cancel />キャンセル
                    </Button>
                    <Button color="primary" onClick={this.props.logoutStart}>
                      <LogoutIcon />ログアウト
                    </Button>
                  </ItemGrid>
                }
              />
            </ItemGrid>
          </Grid>
        </Modal>
      </div>
    );
  }
}

export default withStyles(LogoutButtonStyle)(LogoutButton);
