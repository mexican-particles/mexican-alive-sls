# make はホスト側で実行されることを期待しています

help: ## helpを参照
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
.PHONY: help

identity: ## アカウント情報を表示する
	docker-compose run --rm dind aws sts get-caller-identity
.PHONY: identity

version: ## varsion を表示する
	docker-compose run --rm dind bash -c "python3 --version && node --version && aws --version && sls --version"
.PHONY: version

cfn-list-stacks: ## CFn の stack 一覧を表示する
	docker-compose run --rm dind aws cloudformation list-stacks
.PHONY: cfn-list-stacks

up: ## コンテナを立ち上げる
	if [ -z "$(docker container ls | grep dind)" ]; then\
		docker-compose up -d dind;\
		sleep 3;\
	fi
.PHONY: up
