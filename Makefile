SRC = $(shell find lib -type f -name "*.js")
TESTS = test/fileutil.js
TESTTIMEOUT = 5000
REPORTER = spec

test:
	mocha --reporter $(REPORTER) --timeout $(TESTTIMEOUT) --require should

.PHONY: test