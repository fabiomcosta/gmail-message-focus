(function(global) {

    // Only run this script in the top-most frame
    if (top.document === document) {

        var canvasFrame = document.getElementById('canvas_frame');

        if (!canvasFrame) {
            return;
        }

        var isInboxMessage = function() {
            return (/^\#inbox\/\w+/).test(location.hash);
        };

        var toArray = function(collection) {
            return Array.prototype.slice.call(collection);
        };

        var canvasLoaded = function() {

            var doc = canvasFrame.contentDocument;

            var setupLinksTabindex = function() {
                if (isInboxMessage()) {
                    // do not get links from gmail itself
                    var links = toArray(doc.querySelectorAll('[role="main"] a:not([href*=".google.com/"])'));

                    links.forEach(function(link, i) {
                        link.setAttribute('tabindex', i + 1);
                    });
                }
            };

            window.addEventListener('hashchange', function(e) {

                setupLinksTabindex();

            }, false);

            setupLinksTabindex();

        };

        canvasFrame.addEventListener('load', canvasLoaded, false);

    }

}(this));
