build:
	ng build --prod  --output-hashing none
	node concat.js
	mv dist/styles.css ../public/css/
	rm -rf dist
