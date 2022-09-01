TSFILES = app.ts

JSFILES = app.js



all: $(JSFILES)

$(JSFILES): $(TSFILES)
	tsc $(TSFILES)