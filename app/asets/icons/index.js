import React from 'react';
import SvgIcon from 'material-ui/SvgIcon';

//mail outline
//<i class="material-icons">web</i>
//<i class="material-icons">mail_outline</i>
//<i class="material-icons">settings</i>
//<i class="material-icons">account_box</i>

export function LoginIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10,17.25V14H3V10H10V6.75L15.25,12L10,17.25M8,2H17A2,2 0 0,1 19,4V20A2,2 0 0,1 17,22H8A2,2 0 0,1 6,20V16H8V20H17V4H8V8H6V4A2,2 0 0,1 8,2Z" />
    </SvgIcon>
  );
}

export function LogoutIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M17,17.25V14H10V10H17V6.75L22.25,12L17,17.25M13,2A2,2 0 0,1 15,4V8H13V4H4V20H13V16H15V20A2,2 0 0,1 13,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2H13Z" />
    </SvgIcon>
  );
}
