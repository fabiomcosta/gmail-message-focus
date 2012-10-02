(function(global) {

    var $ = jQuery;

    // Only run this script in the top-most frame
    if (top.document === document) {

        var leaderKey = ',',
            doc = $(document);

        var isInboxMessage = function() {
            return (/^#inbox[/]\w+/).test(location.hash);
        };

        var isSearchMessage = function() {
            return (/^#search[/][^/]+[/]\w+/).test(location.hash);
        };

        var checkExistanceOfElement = function(selector, callback, timeout) {
            timeout = timeout || 200;
            var el = $(selector);
            if (el.length) {
                callback(el);
            } else {
                setTimeout(checkExistanceOfElement.bind(this, selector, callback, timeout), timeout);
            }
        };

        var mainDetected = function(main) {

            var setupLinksTabindex = function() {
                if (isInboxMessage() || isSearchMessage()) {
                    // do not get links from gmail itself
                    var links = main.find('a:not([href*=".google.com/"])');
                    links.attr('tabindex', function(i) {
                        return i + 1;
                    });
                }
            };

            $(window).on('hashchange', setupLinksTabindex);
            setupLinksTabindex();

            // bind keyboardshortcuts
            Mousetrap.init(doc.get(0));

            // displays current image
            Mousetrap.bind(leaderKey + ' i', function() {
                main.find(':contains("Display images below")').click();
            });

        };

        checkExistanceOfElement('[role="main"]', mainDetected);

    }

}(this));
