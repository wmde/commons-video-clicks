# README #
This tool is used to query video tracking data of video resources on commons.wikimedia.org. It allows exporting them as a CSV file.

## Usage ##
**Video-Link:** Please enter the URL / name of a video resource.
The following formats are allowed:
* https://commons.wikimedia.org/wiki/File:How_Wikipedia_contributes_to_free_knowledge.webm
* File:How_Wikipedia_contributes_to_free_knowledge.webm
* How_Wikipedia_contributes_to_free_knowledge.webm

**Date from:** Enter the date from which the tracking results should be requested. The format is month/day/year. You can also use the datepicker.

**Date to:** Enter the date until the tracking results should be requested. The format is month/day/year. You can also use the datepicker.

**Get views:** Requests the data and displays it in the table.

**Export as CSV:** Requests the data and exports it in a CSV file. Delimiter is semi-colon.

## Configuration options ##
If a proxy is used, this application requires PHP with php-curl installed. To deactivate the proxy set in wikimedia-video-tool.js:

```var USE_PROXY = false;```
	
Please note that in this case the application must run on tools.wmflabs.org. Otherwise you would receive a cross-domain-request error.

## License ##
This application was developed in June 2017 by [DIQA-Projektmanagement GmbH](http://www.diqa-pm.de) and is distributed under Creative Commons License CC0 1.0 Universal.
