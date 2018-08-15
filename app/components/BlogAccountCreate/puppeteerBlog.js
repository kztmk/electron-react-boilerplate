import BlogDriver from '../../drivers/blogs';

class PuppeteerBlog {
  constructor(blogInfo) {
    this.client = null;
    switch (blogInfo.provider) {
      case 'fc2':
        this.client = new BlogDriver('fc2');
        break;
      case 'outlook':
        this.client = new BlogDriver('outlook');
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
}

export default PuppeteerBlog;
