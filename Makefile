lint:
	npx eslint --fix .

install-deps:
	npm install

build:
	make lint
	npx rimraf dist
	npm run build

test:
	npm run test

test-coverage:
	npm run test-coverage

cleanup:
	npx rimraf dist && npx rimraf package-lock.json && npx rimraf node_modules