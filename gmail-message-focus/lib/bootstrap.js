(function(global) {

    var $ = jQuery;

    // Only run this script in the top-most frame
    if (top.document === document) {

        var canvasFrame = $('#canvas_frame'),
            leaderKey = ',';

        if (!canvasFrame.length) {
            return;
        }

        var isInboxMessage = function() {
            return (/^#inbox[/]\w+/).test(location.hash);
        };

        var isSearchMessage = function() {
            return (/^#search[/][^/]+[/]\w+/).test(location.hash);
        };

        var toArray = function(collection) {
            return Array.prototype.slice.call(collection);
        };

        var canvasLoaded = function() {

            var doc = $(canvasFrame.get(0).contentDocument);

            var setupLinksTabindex = function() {
                if (isInboxMessage() || isSearchMessage()) {
                    // do not get links from gmail itself
                    var links = doc.find('[role="main"] a:not([href*=".google.com/"])');
                    links.attr('tabindex', function(i) {
                        return i + 1;
                    });
                }
            };

            $(window).on('hashchange', function(e) {
                setupLinksTabindex();
            });

            setupLinksTabindex();

            // bind keyboardshortcuts
            Mousetrap.init(doc.get(0));

            // displays current image
            Mousetrap.bind(leaderKey + ' i', function() {
                doc.find('[role="main"] :contains("Display images below")').click();
            });

        };

        canvasFrame.on('load', canvasLoaded);

    }

}(this));
