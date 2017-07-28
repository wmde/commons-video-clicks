/**
 * Wikimedia-Video-Tracking-Tool
 * 
 * developed by DIQA-Projektmanagement GmbH 2017
 * 
 * @author: Kai Kühn
 * @license: CC0 1.0
 */
(function($) { 
	
	/**
	 * Set this to false if no proxy should be used.
	 */
	var USE_PROXY = false;
	
	var ajax = new window.Ajax(USE_PROXY);
	
	/**
	 * Store the results of a query
	 */
	var state = {};
	
	var statereset = function() {
		state = {};
	};
	
	/**
	 * Requests the webservice, updates the result table and exports the data as CSV if necessary.
	 * 
	 * @param boolean exportAsCSV
	 */
	var getViews = function(exportAsCSV) {
		
		// read query parameters
		var videoURL = $('#video-link').val(); 
		var videoresource = videoURL.match(/File:(.+$)/);
		if (videoresource != null) {
			filename = videoresource[1];
		} else {
			filename = videoURL;
		}
		
		if (filename == '') {
			bootbox.alert("Please enter at least Video-Link");
			return false;
		}
		var from = new Date($( "#date-from" ).val());
		var to = new Date($( "#date-to" ).val());
		
		waitingDialog.show();
		
		// do actual webservice request
		try {
			ajax.getVideoTrackingData(filename, from, to, function(resultTable, totalCount) { 
				
				waitingDialog.hide();
				
				// updates state
				state.resultTable = resultTable;
				state.totalCount = totalCount;
				
				var html = '';
				
				if (resultTable.length == 0) {
					$('#result-table tr.data').remove();
					$('span.total-number').html('');
					$('span#video-title').html('');
					$('span.total-number-days').html('');
					bootbox.alert("No video tracking results found!");
					return;
				}
				
				// update HTML
				$.each(resultTable, function(i, e) { 
					html += '<tr class="row data">';
					html += '<td class="data-row">' + e[1].toEnglish('/') + '</td>';
					html += '<td class="data-row"></td>';
					html += '<td class="data-row">' + e[4] + '</td>';
					html += '</tr>';
				});	
				
				$('span#video-title').html(filename);
				$('span.total-number-days').html(resultTable.length);
				
				$('#result-table tr.data').remove();
				
				if (html != '') {
					$(html).insertAfter($('#result-table tr.title'));
				}
				
				$('span.total-number').html(totalCount);
				
				// export as CSV
				if (exportAsCSV) {
					ajax.exportAsCSV(state.resultTable);
				}
				
			}, function(jsonData) { 
				console.log(jsonData);
				waitingDialog.hide();
				$('#result-table tr.data').remove();
				$('span.total-number').html('');
				$('span#video-title').html('');
				$('span.total-number-days').html('');
				bootbox.alert("The video link or video name is possibly wrong. Please check or visit help page.");
			});
		} catch(e) {
			waitingDialog.hide();
		}
		
		return true;
	};
	
	// register change listeners for indication if a new query is necessary for CSV export
	$('#video-link').change(statereset);
	$('#date-from').change(statereset);
	$('#date-to').change(statereset);
	
	$(function() {
		
		// initialize buttons and GUI elements
		$( "#date-from" ).datepicker();
		$( "#date-to" ).datepicker();
		
		$('#clear-query').click(function() { 
			$( "#date-from" ).val('');
			$( "#date-to" ).val('');
			$('#video-link').val(''); 
		});
		
		$('#get-views-button').click(function() { 
			getViews(false);
		});
		
		$('#csv-export').click(function() { 
			if (state.resultTable) {
				ajax.exportAsCSV(state.resultTable);
				return;
			}
			getViews(true);
		});
	});
	
}(jQuery));