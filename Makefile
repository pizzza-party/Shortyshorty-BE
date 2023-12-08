.PHONY: all build deploy clean re local

all: build deploy

build:
	tsc

deploy:
	serverless deploy

# 로컬에서 람다 확인
local: 
	serverless invoke local --function sample

clean:
	rm -rf dist/

re: clean all
