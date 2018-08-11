// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import IconButton from '@material-ui/core/IconButton';
import Cancel from '@material-ui/icons/Cancel';
import { LogoutIcon } from '../../assets/icons';
import GridItem from '../../ui/Grid/GridItem';
import Card from '../../ui/Card/Card';
import CardHeader from '../../ui/Card/CardHeader';
import CardText from '../../ui/Card/CardText';
import CardFooter from '../../ui/Card/CardFooter';
import Button from '../../ui/CustomButtons/Button';

import LogoutButtonStyle from '../../assets/jss/material-dashboard-pro-react/components/logout';

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

  handleClickLogout = () => {
    this.setState({ modalOpen: false });
    this.props.logoutStart();
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Tooltip id="nav-icon-logout" title="ログアウト" placement="bottom">
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
            <GridItem xs={12} sm={10} md={6}>
              <Card>
                <CardHeader text color="primary">
                  <CardText color="primary">
                    <h4 className={classes.cardTitleWhite}>ログアウト</h4>
                    <h4 className={classes.cardCategoryWhite}>
                      ログアウトしますか？
                    </h4>
                  </CardText>
                </CardHeader>
                <CardFooter>
                  <GridItem xs={12} sm={10} md={12} container justify="center">
                    <Button onClick={this.handleCloseModal}>
                      <Cancel />
                      キャンセル
                    </Button>
                    <Button color="primary" onClick={this.handleClickLogout}>
                      <LogoutIcon />
                      ログアウト
                    </Button>
                  </GridItem>
                </CardFooter>
              </Card>
            </GridItem>
          </Grid>
        </Modal>
      </div>
    );
  }
}

export default withStyles(LogoutButtonStyle)(LogoutButton);
