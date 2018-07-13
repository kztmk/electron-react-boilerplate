import EmailProviderOutlook from './outlook';
import EmailProviderYahoo from './yahoo';

class EmailProviderManager {
  constructor() {
    this.providers = {
      outlook: EmailProviderOutlook,
      yahoo: EmailProviderYahoo
    };
  }

  getProviderByName(name, opts) {
    if (!name) {
      throw new Error('メール提供元は必須です。');
    }

    const Provider = this.providers[name.toLowerCase()];

    if (!Provider) throw new Error(`現在登録されているメール提供元ではありません。`);
    return new Provider(opts);
  }

  getProviderByEmail(email, opts) {
    if (!email) throw new Error('メールアドレスは必須です。');

    let Provider;
    if (
      /@outlook\.jp/i.test(email) ||
      /@outlook\.com/i.test(email) ||
      /@hotmail\.com/i.test(email)
    ) {
      Provider = this.providers.outlook;
    }

    if (/@yahoo\.co\.jp/i.test(email)) {
      Provider = this.providers.yahoo;
    }

    if (!Provider) throw new Error(`"${email}"では、登録されているメール提供元が判断出来ません。`);
    return new Provider(opts);
  }
}

export default EmailProviderManager;
