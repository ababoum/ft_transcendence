TSFILES = src/app.ts

JSFILES = dist/app.js



all: $(JSFILES)

$(JSFILES): $(TSFILES)
	tsc

start:
	npm start