import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

// mail outline
// <i class="material-icons">web</i>
// <i class="material-icons">mail_outline</i>
// <i class="material-icons">settings</i>
// <i class="material-icons">account_box</i>

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

export function PasswordResetIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M12.63,2C18.16,2 22.64,6.5 22.64,12C22.64,17.5 18.16,22 12.63,22C9.12,22 6.05,20.18 4.26,17.43L5.84,16.18C7.25,18.47 9.76,20 12.64,20A8,8 0 0,0 20.64,12A8,8 0 0,0 12.64,4C8.56,4 5.2,7.06 4.71,11H7.47L3.73,14.73L0,11H2.69C3.19,5.95 7.45,2 12.63,2M15.59,10.24C16.09,10.25 16.5,10.65 16.5,11.16V15.77C16.5,16.27 16.09,16.69 15.58,16.69H10.05C9.54,16.69 9.13,16.27 9.13,15.77V11.16C9.13,10.65 9.54,10.25 10.04,10.24V9.23C10.04,7.7 11.29,6.46 12.81,6.46C14.34,6.46 15.59,7.7 15.59,9.23V10.24M12.81,7.86C12.06,7.86 11.44,8.47 11.44,9.23V10.24H14.19V9.23C14.19,8.47 13.57,7.86 12.81,7.86Z" />
    </SvgIcon>
  );
}

export function MailSeenIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M12,15.36L4,10.36V18H20V10.36L12,15.36M4,8L12,13L20,8V8L12,3L4,8V8M22,8V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V8C2,7.27 2.39,6.64 2.97,6.29L12,0.64L21.03,6.29C21.61,6.64 22,7.27 22,8Z" />
    </SvgIcon>
  );
}

export function MailUnseenIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
    </SvgIcon>
  );
}
export function TrashIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
    </SvgIcon>
  );
}

export function CloseIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z" />
    </SvgIcon>
  );
}

export function FolderDownloadIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M20,6A2,2 0 0,1 22,8V18A2,2 0 0,1 20,20H4C2.89,20 2,19.1 2,18V6C2,4.89 2.89,4 4,4H10L12,6H20M19.25,13H16V9H14V13H10.75L15,17.25" />
    </SvgIcon>
  );
}

export function AddIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M11,15V12H9V15H6V17H9V20H11V17H14V15H11Z" />
    </SvgIcon>
  );
}

export function SaveAltIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M19,12v7H5v-7H3v7c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2v-7H19z M13,12.67l2.59-2.58L17,11.5l-5,5l-5-5l1.41-1.41L11,12.67V3   h2V12.67z" />
    </SvgIcon>
  );
}

export function CancelIcon(props) {
  return (
    <SvgIcon {...props}>
      <path
        d="M12,2C6.47,2,2,6.47,2,12c0,5.53,4.47,10,10,10c5.53,0,10-4.47,10-10C22,6.47,17.53,2,12,2z M12,20c-4.41,0-8-3.59-8-8
      s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20z"
      />
    </SvgIcon>
  );
}

/*
export function TemplateIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="" />
    </SvgIcon>
  );
}
*/
