var holidays = [];
var currentDate = moment().add(1, 'days');

var sundays = [];
createInputCalendar('#input-date');

jQuery(window).resize(function(){
			jQuery('#input-date').datepicker('hide');
			jQuery('#input-date').blur();
	});		

function createInputCalendar(id) {
    jQuery(id).datepicker({
        minDate: currentDate.format("MM/DD/YYYY"),
        maxDate: '+12m',
        defaultDate: 0,
        beforeShow: function(input, inst) {
            var instHeight = 0;
            setTimeout(function() {
                instHeight = inst.dpDiv.height();
                jQuery('#ui-datepicker-div').addClass('single-input-cal')
                if (input.getBoundingClientRect().top < instHeight) {
                    inst.dpDiv
                        .removeClass('ui-top-cal-arrow')
                        .addClass('ui-bottom-cal-arrow')
                        .position({
                            my: 'right top+5',
                            at: 'right bottom',
                            collision: 'none',
                            of: input
                        });
                } else {
                    inst.dpDiv
                        .removeClass('ui-bottom-cal-arrow')
                        .addClass('ui-top-cal-arrow')
                        .position({
                            my: 'right bottom-5',
                            at: 'right top',
                            collision: 'none',
                            of: input
                        });
                }
            }, 0);
        },
        beforeShowDay: function(date) {
            var theday = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
            if (jQuery.inArray(theday, holidays) > -1) return [true, 'holiday ui-state-disabled'];
            return [true, ''];
        }
    });
}
	
	// Select and set calendar attributes/functions.
	function selectCalendarDate(date, positionId){
		var dateObj = new Date(date);
		var month = dateObj.getUTCMonth() + 1;
		var day = dateObj.getUTCDate();
		var year = dateObj.getUTCFullYear();
		newdate = month + "/" + day + "/" + year;
		
		var index = jQuery.inArray(newdate, currentlySelectedDates);
		if (index >= 0) {
			currentlySelectedDates.splice(index, 1);
		} else {
		currentlySelectedDates.push(newdate);
		}
		var test = (currentlySelectedDates.length == 0);
	}


	// Initializing Resume calendar
	

	function calendarCreator(id, trackingId) {
    jQuery(id).datepicker({
		maxDate:"+12m",
		minDate: "+1d",
		numberOfMonths: 1,
		beforeShowDay: function(date) {
			var startDate  = $.datepicker.parseDate($.datepicker._defaults.dateFormat, $("#modal-resume-date").val());
			var day = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
			var week = date.getDay();
			  
			if(week == 0){
				sundays.push(day); 
		    }
			if (jQuery.inArray(day, sundays) > -1) return [''];
			if (jQuery.inArray(day, holidays) > -1) return [''];
			if (jQuery.inArray(day, holidays) > -1) return [true, 'disabled-date ui-datepicker-unselectable'];
				return [true, startDate  && ((date.getTime() == startDate.getTime())) ? "dp-highlight" : ""];
			},
			beforeShow: $('#clear-resume-dates').click(function() {
				$('a.ui-state-default').removeClass('ui-state-active');
				$('a.ui-state-default').parent().removeClass('dp-highlight');
				$("#modal-resume-date").val(null);
				resumeDisableDate = [];
			}),
			beforeShow: $('#save-resume-date').click(function() {
				$('a.ui-state-default').removeClass('ui-state-active');
				$('a.ui-state-default').parent().removeClass('dp-highlight');
			
			
			}),
			beforeShow: $('.resume-start-day-modal-close').click(function() {
				$('a.ui-state-default').removeClass('ui-state-active');
				$('a.ui-state-default').parent().removeClass('dp-highlight');
				$("#modal-resume-date").val(null);
				resumeDisableDate = [];
			}),
			beforeShow: $('.resume-start-input').click(function() {
				//$("#modal-resume-date").val(null);	
			}),
			onSelect: function(date, inst) {
				var startDate  = $.datepicker.parseDate($.datepicker._defaults.dateFormat, $("#modal-resume-date").val());
				$("#modal-resume-date").val(date);	 
			    $(this).datepicker();
			}	
    });
        
        
    $('#save-resume-date').click(function () {
        var thisTracking = jQuery(this).data("thisTracking");
        $("#select-date-"+ thisTracking).val($("#modal-resume-date").val());
        //if on mod page
        $("#select-date-modify").val($("#modal-resume-date").val());
	});
	}

	// Prevent the background from scrolling to the top of page when changing the month in the calendar modal.
	$(function(e) {      
    	$('#modal-start-end #resume-start-cal').click(function($e) {
    		$e.preventDefault();
    	});
	});

	$("#modal-start-end").on("hidden.bs.modal", function(){
		$('#resume-start-cal').datepicker('setDate', null);
	});