lint:
	npx eslint .

install-deps:
	npm install

build:
	rm -rf dist
	npm run build

test:
	npm test