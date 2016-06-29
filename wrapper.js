const MOUSE_PRIMARY_KEY = 0;
const HREF_ATTRIBUTE_NAME = 'href';
const TARGET_ATTRIBUTE_NAME = 'target';
const A_TAG_NAME = 'A';
const BODY_TAG_NAME = 'BODY';

class LinkWrapper {
  constructor (locator) {
    this._requestRouter = locator.resolve('requestRouter');
    this._window = locator.resolve('window');
    this._bus = locator.resolve('eventBus');
  }

  wrapDocument () {
    this._window.document.body.addEventListener('click', (event) => {
      if (event.defaultPrevented) {
        return;
      }
      if (event.target.tagName === A_TAG_NAME) {
        this._linkClickHandler(event, event.target);
      } else {
        const link = closestLink(event.target);
        if (!link) {
          return;
        }
        this._linkClickHandler(event, link);
      }
    });
  }

  _linkClickHandler (event, element) {
    const targetAttribute = element.getAttribute(TARGET_ATTRIBUTE_NAME);
    if (targetAttribute) {
      return;
    }

    // if middle mouse button was clicked
    if (event.button !== MOUSE_PRIMARY_KEY ||
      event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
      return;
    }

    const locationString = element.getAttribute(HREF_ATTRIBUTE_NAME);
    if (!locationString) {
      return;
    }

    event.preventDefault();

    this._requestRouter
      .go(locationString)
      .catch(reason => this._bus.emit('error', reason));
  }
}

/**
 * Finds the closest ascending "A" element node.
 * @param {Node} element DOM element.
 * @returns {Node|null} The closest "A" element or null.
 */
function closestLink(element) {
  while (element && element.nodeName !== A_TAG_NAME &&
  element.nodeName !== BODY_TAG_NAME) {
    element = element.parentNode;
  }
  return element && element.nodeName === A_TAG_NAME ? element : null;
}

module.exports = LinkWrapper;
