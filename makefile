SERVICE_NAME = app

default:
	docker compose up -d

install: default
	docker compose exec $(SERVICE_NAME) npm install

dev: default
	docker compose exec $(SERVICE_NAME) npm run dev

test: default
	docker compose exec $(SERVICE_NAME) npm test

shell: default
	docker compose exec $(SERVICE_NAME) /bin/bash