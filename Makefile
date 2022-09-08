TSFILES = src/app.ts

JSFILES = dist/app.js



all: $(JSFILES)

$(JSFILES): $(TSFILES)
	tsc

start:
	npm start

docker:
	mkdir -p "./data"
	docker-compose --env-file .env -f docker-compose.yml build
	docker-compose --env-file .env -f docker-compose.yml up -d

clean_docker:
	docker-compose --env-file .env -f docker-compose.yml stop
	docker-compose --env-file .env -f docker-compose.yml down