/**
 * Wikimedia-Video-Tracking-Tool
 * 
 * mediaplaycounts-api
 * API-Documentation: https://phabricator.wikimedia.org/P4339
 * 
 * developed by DIQA-Projektmanagement GmbH 2017
 * 
 * @author: Kai Kühn
 * @license: CC0 1.0
 */
(function($) { 
	
	Date.prototype.toEnglish = function(join) {
		  var mm = this.getMonth() + 1; // getMonth() is zero-based
		  var dd = this.getDate();

		  return [(mm>9 ? '' : '0') + mm,
		          (dd>9 ? '' : '0') + dd,
		          this.getFullYear()
		         ].join(join ? join : '');
	};
	
	Date.prototype.yyyymmdd = function(join) {
		  var mm = this.getMonth() + 1; // getMonth() is zero-based
		  var dd = this.getDate();

		  return [this.getFullYear(),
		          (mm>9 ? '' : '0') + mm,
		          (dd>9 ? '' : '0') + dd
		         ].join(join ? join : '');
	};
	
	/**
	 * Ajax class provides access to mediaplayaccounts webservice.
	 */
	window.Ajax = function(crossDomain) {
		
		var URL_API_TEMPLATE = 'https://tools.wmflabs.org/mediaplaycounts/api/1/FilePlaycount/date_range/<filename>/<from>/<to>';
		var that = {};
		
		/**
		 * True if proxy should be used
		 */
		that.crossDomain = crossDomain ? crossDomain : false;
			
		/**
		 * Requests Video tracking data.
		 * 
		 * @param filename Filename
		 * @param from Date from
		 * @param to Date until
		 * @param callbackOnSuccess Function with parameters: resultTable and totalCount
		 * @param callbackonError Function with a error object as parameter
		 */
		that.getVideoTrackingData = function(filename, from, to, callbackOnSucess, callbackOnError) {
			var url = URL_API_TEMPLATE;
			
			url = url.replace(/<filename>/, filename);
			url = url.replace(/<from>/, from != null ? from.yyyymmdd() : '19000101');
			url = url.replace(/<to>/, to != null ? to.yyyymmdd() : '21000101');
			
			var ajaxProperties = {
				type : 'GET',
				url : url,
				
				success : function(jsondata) {
					try {
						var response = typeof(jsondata) == 'string' ? $.parseJSON(jsondata) : jsondata;
					} catch(e) {
						callbackOnError(jsondata);
						return;
					}
					var resultTable = [];
					$.each(response.details, function(i, e) { 
						var year = e.date.substr(0,4);
						var month = e.date.substr(4,2);
						var day = e.date.substr(6,2);
						var date = new Date(year+"-"+month+"-"+day);
						var timestamp_start = date.getTime()/1000;
						var timestamp_end = date.getTime()/1000 + 3600 * 24;
						resultTable.push([filename, date, timestamp_start, timestamp_end, e.count]);
					});
					callbackOnSucess(resultTable, response.total);

				},
				error : function(jsondata) {
					callbackOnError(jsondata);
				}
			};
			
			if (that.crossDomain) {
				ajaxProperties['dataType'] = 'jsonp';
				ajaxProperties['url'] = 'proxy.php?callback=jsonp&url='+encodeURIComponent(url);
			}
			
			$.ajax(ajaxProperties);
		};
		
		/**
		 * Export data as CSV file.
		 * @param data Data returned from Ajax.getVideoTrackingData
		 */
		that.exportAsCSV = function(data) {
			
			var header = ["Video title", "Date (MM/DD/YYYY)", "Start Time (unixtimestampofdate)", "End Time (unixtimestampofdate)", "Views per day"];
			if (!data) {
				data = [];
			}
			
			// create content
			var csvContent = "data:text/csv;charset=utf-8,";
			csvContent += header.join(";")+"\n";
			
			$.each(data, function(i, e){

			   dataString = e[0] + ';' + e[1].toEnglish('/') + ';' + e[2] + ';' + e[3] + ';' + e[4];
			   csvContent += dataString+ "\n";

			}); 
			
			// download file
			var today = new Date();
			var isoDate = today.toISOString('%d-%b-%Y'); 
			
			var encodedUri = encodeURI(csvContent);
			var link = $("<a>");
			link.attr("href", encodedUri);
			link.attr("download", "video-tracking-"+isoDate+".csv");
			$('body').append(link); // Required for FF

			link.get(0).click();
		};
		
		return that;
	};
	
}(jQuery));