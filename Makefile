publish: build
	open "https://chrome.google.com/webstore/developer/dashboard"

build: clean
	@mkdir -p build
	@zip -r build/build gmail-message-focus/

clean:
	@rm -rf build

.PHONY: build lib pages
