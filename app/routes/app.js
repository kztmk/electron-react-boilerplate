import HomePage from '../containers/HomePage';
import BlogsListPage from '../components/BlogsListPage';
import MailAddressListPage from '../components/MailAddressListPage';
import ProfilePage from '../components/ProfilePage';
import SettingsPage from '../components/SettingsPage';
import AuthPage from '../components/AuthPage';
import { LoginIcon, LogoutIcon } from '../asets/icons';

import Home from 'material-ui-icons/Home';
import MailOutline from 'material-ui-icons/MailOutline';
import Web from 'material-ui-icons/Web';
import AccountBox from 'material-ui-icons/AccountBox';
import Settings from 'material-ui-icons/Settings';

const appRoutes = [
  {
    id: 'nav-icon-home',
    path: '/home',
    navName: 'トップ',
    icon: Home,
    component: HomePage
  },
  {
    id: 'nav-icon-mailaddresses',
    path: '/mailaddresses',
    navName: 'メールアドレス一覧',
    icon: MailOutline,
    component: MailAddressListPage
  },
  {
    id: 'nav-icon-blogs',
    path: '/blogs',
    navName: 'ブログ一覧',
    icon: Web,
    component: BlogsListPage
  },
  {
    id: 'nav-icon-profile',
    path: '/profile',
    navName: 'プロフィール',
    icon: AccountBox,
    component: ProfilePage
  },
  {
    id: 'nav-icon-settings',
    path: '/settings',
    navName: '設定',
    icon: Settings,
    component: SettingsPage
  },
  {
    redirect: true,
    path: '/',
    to: '/home'
  }
];

export default appRoutes;
