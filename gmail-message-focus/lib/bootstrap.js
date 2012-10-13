(function(global) {

    var $ = jQuery;

    // Only run this script in the top-most frame
    if (top.document === document) {

        var leaderKey = ',',
            doc = $(document);

        // we are supposing that if the page contains
        // an archive button, it is a message page
        var isMessagePage = function() {
            return !!doc.find('[aria-label="Archive"], [title="Archive"]').length;
        };

        var checkFor = function(testFunction, callback, interval) {
            interval = interval || 200;
            if (testFunction()) {
                callback();
            } else {
                setTimeout(checkFor.bind(this, testFunction, callback, interval), interval);
            }
        };

        var checkExistanceOfElement = function(selector, callback, interval) {
            checkFor(function() {
                return doc.find(selector).length;
            }, callback, interval);
        };

        var mainDetected = function() {

            var setupLinksTabindex = function() {
                if (isMessagePage()) {
                    // do not get links from gmail itself
                    var links = doc.find('[role="main"] a:not([href*=".google.com/"])');
                    links.attr('tabindex', function(i) {
                        return i + 1;
                    });
                    links.first().focus();
                }
            };

            doc.on('click', '[role="main"] :contains("Display images below")', function() {
                // checks if all the images on the page contain a src
                // which means that the page has been refreshed with the new
                // html after clicking "Display images below", then setup tabindexes
                checkFor(function() {
                    var main = doc.find('[role="main"]');
                    return main.find('img[src]').length === main.find('img').length;
                }, setupLinksTabindex);
            });

            $(window).on('hashchange', setupLinksTabindex);
            setupLinksTabindex();

            // bind keyboardshortcuts
            Mousetrap.init(doc.get(0));

            // displays current image
            Mousetrap.bind(leaderKey + ' i', function() {
                doc.find('[role="main"] :contains("Display images below")').click();
            });

        };

        checkExistanceOfElement('[role="main"]', mainDetected);

    }

}(this));
