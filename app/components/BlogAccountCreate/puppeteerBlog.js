import BlogDriver from '../../drivers/blogs';

class PuppeteerBlog {
  constructor(blogInfo) {
    this.client = null;
    switch (blogInfo.provider) {
      case 'fc2':
        console.log('--create fc2 instance');
        this.client = new BlogDriver('fc2');
        break;
      case 'livedoor':
        this.client = new BlogDriver('livedoor');
        break;
      case 'seesaa':
        this.client = new BlogDriver('seesaa');
        break;
      case 'ameba':
        this.client = new BlogDriver('ameba');
        break;
      case 'ninjya':
        this.client = new BlogDriver('ninjya');
        break;
      case 'rakuten':
        this.client = new BlogDriver('rakuten');
        break;
      case 'kokolog':
        this.client = new BlogDriver('cocolog');
        break;
      case 'yaplog':
        this.client = new BlogDriver('yaplog');
        break;
      case 'jugem':
        this.client = new BlogDriver('jugem');
        break;
      case 'hatena':
        this.client = new BlogDriver('hatena');
        break;
      case 'webryblog':
        this.client = new BlogDriver('webryblog');
        break;
      case 'goo':
        this.client = new BlogDriver('goo');
        break;
      case 'webnode':
        this.client = new BlogDriver('webnode');
        break;
      case 'wpcom':
        this.client = new BlogDriver('wpcom');
        break;
      default:
    }
  }

  signup(blogInfo) {
    if (this.client) {
      this.client.signup(blogInfo);
    }
  }

  signin(blogInfo) {
    if (this.client) {
      return this.client.signin(blogInfo);
    }
  }

  openTopPage(blogInfo) {
    if (this.client) {
      return this.client.openTopPage(blogInfo);
    }
  }
}

export default PuppeteerBlog;
