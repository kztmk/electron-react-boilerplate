// @flow
import React from 'react';
import { withStyles } from 'material-ui';
import { AddAlert } from 'material-ui-icons';
import Slide from 'material-ui/transitions/Slide';
import LoginForm from '../../containers/Login';
import FormResetPassword from '../../containers/ResetPassword';
import type { AuthType } from '../../types/auth';

import { Snackbar } from '../../ui';

const styles = {
  sliderItem: {
    transitionDuration: '1500ms'
  }
};

export type Props = {
  userAuth: AuthType
};

type State = {
  isRequestPasswordReset: boolean,
  isLoginDone: boolean
};

/**
 *   起動時にリダイレクトされ、最初に表示される画面
 *   Firebaseのuid(userAuth:userId)が空欄の場合、ログイン画面
 *   ログイン画面から、requestPasswordResetで、パスワードリセット画面
 *
 *   ログイン後は、インフォーメーション画面
 */
class HomePage extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      isRequestPasswordReset: false,
      isLoginDone: false
    };
  }

  /**
   * Prospが更新された際にstateを更新
   * @param nextProps
   */
  componentWillReceiveProps = nextProps => {
    const isOpenSuccessbar =
      nextProps.userAuth.userId.length > 0 &&
      !nextProps.userAuth.isLoginFailure &&
      !nextProps.userAuth.isLoadingIcon;
    this.setState({ isLoginDone: isOpenSuccessbar });
  };
  /**
   * このコンポーネントのプロパティを変更するメソッド
   * PasswordReset画面への切替
   */
  handleRequestPasswordReset = () => {
    this.setState({ isRequestPasswordReset: true });
  };

  /**
   * このコンポーネントのプロパティを変更するメソッド
   * PasswordReset画面から、ログイン画面へ戻す
   */
  handleCancelRequestPasswordReset = () => {
    this.setState({ isRequestPasswordReset: false });
  };

  /**
   * Login完了のSnackbarを閉じる
   */
  handleSuccessSnackbarClose = () => {
    this.setState({ isLoginDone: false });
  };

  /**
   * Login完了のSnackbarを表示
   */
  handleSuccessSnackbarOpen = () => {
    this.setState({ isLoginDone: true });
  };

  render() {
    // eslint-disable-next-line
    const isLogin = this.props.userAuth.userId.length > 0;
    return (
      <div>
        <Slide in={!isLogin}>
          {(() => {
            return this.state.isRequestPasswordReset ? (
              <FormResetPassword
                cancelRequestPasswordReset={this.handleCancelRequestPasswordReset}
                openLoginSuccessSnackbar={this.handleSuccessSnackbarOpen}
              />
            ) : (
              <LoginForm requestPasswordReset={this.handleRequestPasswordReset} />
            );
          })()}
        </Slide>
        {isLogin && <h3>ホームページ</h3>}
        <Snackbar
          color="success"
          place="bc"
          icon={AddAlert}
          open={this.state.isLoginDone}
          closeNotification={this.handleSuccessSnackbarClose}
          close
          message={<span id="login_error">ログイン完了</span>}
        />
      </div>
    );
  }
}

export default withStyles(styles)(HomePage);
