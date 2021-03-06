import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import Icon from '@material-ui/core/Icon';
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

export function GmailIcon() {
  return (
    <SvgIcon viewBox="0 0 32, 32">
      <path d="M 6 7.03125 C 5.691406 7.03125 5.402344 7.089844 5.125 7.175781 L 8.039063 9.03125 L 23.960938 9.03125 L 26.875 7.175781 C 26.597656 7.089844 26.308594 7.03125 26 7.03125 Z M 4.113281 7.71875 C 3.4375 8.269531 3 9.097656 3 10.03125 L 3 23.03125 C 3 24.683594 4.347656 26.03125 6 26.03125 L 26 26.03125 C 27.652344 26.03125 29 24.683594 29 23.03125 L 29 10.03125 C 29 9.097656 28.5625 8.269531 27.886719 7.71875 L 16 15.28125 Z M 6 12.445313 L 16 18.8125 L 26 12.445313 L 26 24.03125 L 6 24.03125 Z " />
    </SvgIcon>
  );
}

export function YandexIcon() {
  return(
    <SvgIcon viewBox="0 0 16 16">
      <path d="M494.84,492a2.83,2.83,0,0,0-2.84,2.84v10.32a2.83,2.83,0,0,0,2.84,2.84h7.6l5.56-8-5.56-8Zm4.25,2.92h1.81c.11,0,.17,0,.17.14V505c0,.07,0,.11-.12.11h-1a.11.11,0,0,1-.11-.09v-3.69h-.79l-2.2,3.69a.2.2,0,0,1-.19.09h-1.13c-.12,0-.2-.09-.12-.22l2.42-3.75a2.89,2.89,0,0,1-2-2.83,3.15,3.15,0,0,1,3.28-3.4Zm0,.87c-1,0-1.92.69-1.92,2.4a2,2,0,0,0,2.06,2.28h.66v-4.68Z"
            transform="translate(-492 -492)"/>
    </SvgIcon>
  );
}

export function MailTest(props) {
  return (
    <SvgIcon {...props}>
      <path d="M23.5,17L18.5,22L15,18.5L16.5,17L18.5,19L22,15.5L23.5,17M1,6V18A2,2 0 0,0 3,20H13V18H3V8.37L11,13.36L19,8.37V13H21V6A2,2 0 0,0 19,4H3C1.89,4 1,4.89 1,6M3,6H19L11,11L3,6Z" />
    </SvgIcon>
  );
}

export function AccountIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M19,21V19H15V17H19V15L22,18L19,21M10,4A4,4 0 0,1 14,8A4,4 0 0,1 10,12A4,4 0 0,1 6,8A4,4 0 0,1 10,4M10,14C11.15,14 12.25,14.12 13.24,14.34C12.46,15.35 12,16.62 12,18C12,18.7 12.12,19.37 12.34,20H2V18C2,15.79 5.58,14 10,14Z" />
    </SvgIcon>
  );
}

export function PasswordIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M12,1C5.92,1 1,5.92 1,12C1,18.08 5.92,23 12,23C18.08,23 23,18.08 23,12C23,5.92 18.08,1 12,1M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M13,13.5C13,14.13 13.4,14.7 14,14.91V18H10V11.91C10.78,11.64 11.19,10.8 10.93,10C10.78,9.58 10.44,9.24 10,9.09V6H14V12.09C13.4,12.3 13,12.87 13,13.5Z" />
    </SvgIcon>
  );
}


export function AtmarkIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M12,15C12.81,15 13.5,14.7 14.11,14.11C14.7,13.5 15,12.81 15,12C15,11.19 14.7,10.5 14.11,9.89C13.5,9.3 12.81,9 12,9C11.19,9 10.5,9.3 9.89,9.89C9.3,10.5 9,11.19 9,12C9,12.81 9.3,13.5 9.89,14.11C10.5,14.7 11.19,15 12,15M12,2C14.75,2 17.1,3 19.05,4.95C21,6.9 22,9.25 22,12V13.45C22,14.45 21.65,15.3 21,16C20.3,16.67 19.5,17 18.5,17C17.3,17 16.31,16.5 15.56,15.5C14.56,16.5 13.38,17 12,17C10.63,17 9.45,16.5 8.46,15.54C7.5,14.55 7,13.38 7,12C7,10.63 7.5,9.45 8.46,8.46C9.45,7.5 10.63,7 12,7C13.38,7 14.55,7.5 15.54,8.46C16.5,9.45 17,10.63 17,12V13.45C17,13.86 17.16,14.22 17.46,14.53C17.76,14.84 18.11,15 18.5,15C18.92,15 19.27,14.84 19.57,14.53C19.87,14.22 20,13.86 20,13.45V12C20,9.81 19.23,7.93 17.65,6.35C16.07,4.77 14.19,4 12,4C9.81,4 7.93,4.77 6.35,6.35C4.77,7.93 4,9.81 4,12C4,14.19 4.77,16.07 6.35,17.65C7.93,19.23 9.81,20 12,20H17V22H12C9.25,22 6.9,21 4.95,19.05C3,17.1 2,14.75 2,12C2,9.25 3,6.9 4.95,4.95C6.9,3 9.25,2 12,2Z" />
    </SvgIcon>
  );
}

export function ContactMail(props) {
  return (
    <SvgIcon {...props}>
      <path d="M21,8V7L18,9L15,7V8L18,10M22,3H2A2,2 0 0,0 0,5V19A2,2 0 0,0 2,21H22A2,2 0 0,0 24,19V5A2,2 0 0,0 22,3M8,6A3,3 0 0,1 11,9A3,3 0 0,1 8,12A3,3 0 0,1 5,9A3,3 0 0,1 8,6M14,18H2V17C2,15 6,13.9 8,13.9C10,13.9 14,15 14,17M22,12H14V6H22" />
    </SvgIcon>
  );
}
// <path fill="#000000" d="M23.5,17L18.5,22L15,18.5L16.5,17L18.5,19L22,15.5L23.5,17M1,6V18A2,2 0 0,0 3,20H13V18H3V8.37L11,13.36L19,8.37V13H21V6A2,2 0 0,0 19,4H3C1.89,4 1,4.89 1,6M3,6H19L11,11L3,6Z" />
/*
export function TemplateIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="" />
    </SvgIcon>
  );
}
*/
