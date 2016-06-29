const LinkWrapper = require('./wrapper');

module.exports = {
  register (locator) {
    locator.register('linkWrapper', LinkWrapper, true);
    const wrapper = locator.resolve('linkWrapper');
    wrapper.wrapDocument();
  }
};
