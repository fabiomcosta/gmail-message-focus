(function (global) {
  var $ = jQuery;

  // Only run this script in the top-most frame
  if (top.document === document) {
    var leaderKey = ",",
      doc = $(document),
      all = document.querySelectorAll.bind(document),
      one = document.querySelector.bind(document),
      slice = Array.prototype.slice,
      selectorDisplayImages = '[role="main"] :contains("Display images below")',
      selectorLinks =
        '[role="main"] a:not([href*="support.google.com/"]):not([href*="mail.google.com/"])';

    // we suppose that if the page contains
    // an archive button, it is a message page
    var isMessagePage = function () {
      return !!one('[aria-label="Archive"], [title="Archive"]');
    };

    var checkFor = function (testFunction, callback, interval) {
      interval = interval || 200;
      if (testFunction()) {
        callback();
      } else {
        setTimeout(
          checkFor.bind(this, testFunction, callback, interval),
          interval,
        );
      }
    };

    var addStyles = function (styles) {
      $("<style>" + styles + "</style>").appendTo("head");
    };

    class Guid {
      constructor(prefix) {
        this._cache = {};
        this._guid = 0;
        this.prefix = prefix || "";
      }
      get(from) {
        if (this._cache[from]) {
          return this._cache[from];
        }
        return (this._cache[from] = this.prefix + this._guid++);
      }
    }

    // credits http://davidwalsh.name/detect-node-insertion
    class NodeInsertDetector {
      constructor() {
        this.eventSource = $("<div>");
        this._eventNames = {};
        this.guid = new Guid("nodeInserted");
        document.addEventListener(
          "webkitAnimationStart",
          this.handler.bind(this),
          false,
        );
      }

      add(selector, handler) {
        var guid = this.guid.get(selector);

        if (!this._eventNames[guid]) {
          this._eventNames[guid] = selector;
          var styles = `
            @-webkit-keyframes ${guid} {
                from { clip: rect(1px, auto, auto, auto); }
                to { clip: rect(0px, auto, auto, auto); }
            }
            ${selector} {
                -webkit-animation-duration: 1ms;
                -webkit-animation-name: ${guid};
            }`;
          addStyles(styles);
        }

        this.eventSource.on(guid, handler);
      }

      handler(e) {
        var selector = this._eventNames[e.animationName];
        if (selector) {
          this.eventSource.triggerHandler(e.animationName, [
            e,
            e.target,
            selector,
          ]);
        }
      }
    }

    var setupLinksTabindex = function () {
      if (isMessagePage()) {
        var links = slice.call(all(selectorLinks));
        var hashLinks = [];
        var pageLinks = [];

        links.forEach((el) => {
          var href = el.getAttribute("href");
          if (href != null) {
            if (href.startsWith("#")) {
              hashLinks.push(el);
            } else {
              pageLinks.push(el);
            }
          }
        });

        // adds big tabindex so they will be focusable after everything
        hashLinks.forEach((el, i) => {
          el.setAttribute("tabindex", links.length + i);
        });

        pageLinks.forEach((el) => {
          el.setAttribute("tabindex", 0);
        });
        if (pageLinks.length) {
          pageLinks[0].focus();
        }
      }
    };

    var mainDetected = function () {
      doc.on("click", selectorDisplayImages, () => {
        // checks if all the images on the page contain a src
        // which means that the page has been refreshed with the new
        // html after clicking "Display images below", then setup tabindexes
        checkFor(() => {
          var main = $('[role="main"]');
          return main.find("img[src]").length === main.find("img").length;
        }, setupLinksTabindex);
      });

      $(window).on("hashchange", setupLinksTabindex);
      setupLinksTabindex();

      // bind keyboardshortcuts
      Mousetrap.init(document);

      // displays current images
      Mousetrap.bind(leaderKey + " i", () => {
        $(selectorDisplayImages).click();
      });

      // focus first element of the email
      // just works on message pages
      Mousetrap.bind(leaderKey + " ,", () => {
        if (isMessagePage()) {
          var firstLink = one(selectorLinks);
          if (firstLink) {
            firstLink.focus();
          }
        }
      });
    };

    var nodeDetector = new NodeInsertDetector();

    // executes this just at the
    // first time the `main` element changes
    checkFor(() => one('[role="main"]'), mainDetected);

    nodeDetector.add('[role="main"]', setupLinksTabindex);

    // for any links added after the message has been opened
    nodeDetector.add(selectorLinks, (e, animEvent, element) => {
      element.setAttribute("tabindex", 0);
    });
  }
})(this);
