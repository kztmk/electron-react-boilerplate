import BlogProviderFc2 from './fc2';
import BlogProviderLivedoor from './livedoor';
import BlogProviderSeesaa from './seesaa';
import BlogProviderAmeba from './ameba';
import BlogProviderNinjya from './ninjya';
import BlogProviderRakuten from './rakuten';
import BlogProviderCocolog from './cocolog';
import BlogProviderYaplog from './yaplog';
import BlogProviderJugem from './jugem';
import BlogProviderHatena from './hatena';
import BlogProviderWebryBlog from './webryBlog';
import BlogProviderGoo from './goo';

class BlogProviderManager {
  constructor() {
    this.providers = {
      fc2: BlogProviderFc2,
      livedoor: BlogProviderLivedoor,
      seesaa: BlogProviderSeesaa,
      ameba: BlogProviderAmeba,
      ninjya: BlogProviderNinjya,
      rakuten: BlogProviderRakuten,
      cocolog: BlogProviderCocolog,
      yaplog: BlogProviderYaplog,
      jugem: BlogProviderJugem,
      hatena: BlogProviderHatena,
      webryblog: BlogProviderWebryBlog,
      goo: BlogProviderGoo
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
