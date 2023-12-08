.PHONY: all build deploy clean fclean re

all: build deploy

build:
	npm run build

deploy:
	npm run deploy

clean:
	rm -rf dist/

log:
	sls logs -f shortUrlConverter

fclean:
	clean
	sls remove

re: clean all
