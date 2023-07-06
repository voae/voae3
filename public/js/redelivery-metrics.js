// Create custom JS GTM before header loads.
var dataLayer = window.dataLayer = window.dataLayer || [];

var actionList = {};

buildActionList();

function addMetrics(action) {

    var actionToGTM = actionList[action];

    dataLayer.push(actionToGTM);

}

function addMetricsCustomAction(attributeCategory, attributeAction, attributeOptions) {

    dataLayer.push({
        "event": "availableActions",
        "attribute": {
            "category": attributeCategory,
            "action": attributeAction,
            "options": attributeOptions
        }
    });

}

function actionListWithParams(actionName, params) {
    switch (actionName) {
        case "step1": {
            /*dataLayer.push({
                "event": "RCASvpv",
                "RCASstep": "Step 1: Choose a Service",
                "RCASnextPage": "/find-available-appointments",
                "RCASservice": params.getService,
                "RCASApplicants": params.totalApplicants,
                "RCASMinors": params.Minors
            });*/

            var userLoggedIn = params.getLogin

            if (userLoggedIn == 'Logged In') {

                dataLayer.push({
                    'event': 'vpvRedelivery',
                    'page': 'redelivery-step-1-availability',
                    'loginStatus': params.getLogin,
                    'accountType': params.getAcctType,
                    'accountZip': params.acctZip,
                    'customerID': params.custRegID,
                    'accountStartDate': params.accountCreate
                });
            } else {
                dataLayer.push({
                    'event': 'vpvRedelivery',
                    'page': 'redelivery-step-1-availability',
                    'loginStatus': params.getLogin
                });
            }
            break;

        }
        case "step2": {
            dataLayer.push({
                'page': 'redelivery-confirmation',
                'confirmationNumber': '<< CONFIRMATION NUMBER >>',
                'loginStatus': '<< LOGIN STATUS >>',
                'accountType': '<< ACCOUNT TYPE >>',
                'accountZip': '<< ACCOUNT ZIP CODE >>',
                'customerID': '<< CUSTOMER ID >>',
                'accountStartDate': '<< ACCOUNT START DATE >>'
            });
            break;
        }
        case "step3": {
            dataLayer.push({
                'page': 'modify-redelivery-step-1',
                'confirmationNumber': params.modifyConfNum
            });
            break;
        }
        default:
            break;
    }

}

function buildActionList() {
    // Possibly use a JAXRS REST function to be driven by a DB

    // Structure
    // "ActionName" : { "event":"<Usually> availableActions", "attribute":{"category":"<Category Name>", "action":"<ActionName>" }}

    actionList.step2VPV = {
        'event': 'vpvRedelivery',
        'page': 'redelivery-step-2-select-packages'
    };

    actionList.step3VPVConfirmed = {
        'event': 'vpvRedelivery',
        'page': 'redelivery-step-3-confirm-selections'
    };

    actionList.step4VPVSignUp = {
        'event': 'vpvRedelivery',
        'page': 'redelivery-step-4-informed-delivery'
    };

    actionList.confirmationRedliv = {
        'event': 'vpvRedelivery',
        'page': 'redelivery-step-1-availability'
    };

    actionList.modifyRedliv = {
        'event': 'vpvRedelivery',
        'page': 'modify-redelivery-step-2'

    };


}

function idxsGA(selection) {

    dataLayer.push({
        'event': 'application',
        'application': {
            'element': 'IDXS Prompt',
            'selectedCheckbox': selection,
            'userAction': 'interaction'
        }
    });

}
