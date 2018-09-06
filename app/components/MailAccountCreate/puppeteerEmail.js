import EmailDriver from '../../drivers/emails';

class PuppeteerEmail {
  constructor(user) {
    this.client = null;
    switch (user.provider) {
      case 'yahoo':
        this.client = new EmailDriver('yahoo');
        break;
      case 'outlook':
        this.client = new EmailDriver('outlook');
        break;
      case 'gmail':
        this.client = new EmailDriver('gmail');
        break;
      case 'yandex':
        this.client = new EmailDriver('yandex');
        break;
      default:
    }
  }

  signup(user) {
    if (this.client) {
      this.client.signup(user);
    }
  }

  signin(user) {
    if (this.client) {
      return this.client.signin(user);
    }
  }
}

export default PuppeteerEmail;
