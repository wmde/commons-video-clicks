# README #

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

Dabei handelt es sich um eine HTML5-Anwendung, die cURL-Abfragen in einer graphischen Oberfläche 
darstellt (inkl. CSV-Export). Ergebnis soll eine Auswertung von Klickzahlen von "https://commons.wikimedia.org/"-Videos sein.

### Configuration ###

If a proxy is used, this application requires PHP with php-curl installed. To deactivate the proxy set in wikimedia-video-tool.js:

	var USE_PROXY = false;
	
Please note that in this case the application must run on tools.wmflabs.org. Otherwise you would receive a cross-domain-request error.