prod:
	yarn install
	yarn ng build --prod --output-hashing=none --named-chunks=true
	node concat.js
	cd ../../../../.. && php bin/console assets:install
