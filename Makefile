.PHONY: all build deploy clean re

all: build deploy

build:
	npm run build

deploy:
	npm run deploy

clean:
	rm -rf dist/

re: clean all
