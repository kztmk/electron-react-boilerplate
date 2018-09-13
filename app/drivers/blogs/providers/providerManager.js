import BlogProviderFc2 from './fc2';
import BlogProviderLivedoor from './livedoor';

class BlogProviderManager {
  constructor() {
    this.providers = {
      fc2: BlogProviderFc2,
      livedoor: BlogProviderLivedoor
    };
  }

  getProviderByName(name, opts) {
    if (!name) {
      throw new Error('ブログ提供元は必須です。');
    }

    const Provider = this.providers[name.toLowerCase()];

    if (!Provider) throw new Error(`現在登録されているブログ提供元ではありません。`);
    return new Provider(opts);
  }
}

export default BlogProviderManager;
