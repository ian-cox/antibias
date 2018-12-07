var Popup = Popup || {};
Popup.antibiasEnabled = null;

Popup.BADGE_BACKGROUND_COLOR_ON = '#0b8043';
Popup.BADGE_BACKGROUND_COLOR_OFF = '#616161';

Popup.init = function() {
    window.requestAnimationFrame(function() {
    Popup.switchControl = new mdc.switchControl.MDCSwitch(document.querySelector('.mdc-switch'));

    Popup.nativeSwitchCtrl = $('#enable-switch');
    chrome.storage.local.get('antibiasEnabled', function(data) {
        Popup.antibiasEnabled = data.antibiasEnabled;
        Popup.nativeSwitchCtrl.prop('checked', data.antibiasEnabled);
        Popup.switchControl.checked = data.antibiasEnabled;
        Popup.toggleBadge();
       
    });

    Popup.nativeSwitchCtrl.change(function() {
        window.requestAnimationFrame(function() {
        Popup.toggleActivate().then( function(result) {
            Popup.nativeSwitchCtrl.prop('checked', result.antibiasEnabled);
            Popup.toggleBadge();

            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, result.antibiasEnabled ? 'antibias-turn-on' :'antibias-turn-off',
                    function(response) {
                    /*
                    if(response === 'off-ok') {
                        //chrome.tabs.reload(tabs[0].id);
                    } else if(response === 'on-ok') {

                    }*/
                });
            });
        });
        })

    });
    });
};

Popup.toggleBadge = function() {
    if(Popup.antibiasEnabled) {
        chrome.browserAction.setBadgeText({text: 'on'});
        chrome.browserAction.setBadgeBackgroundColor({color: Popup.BADGE_BACKGROUND_COLOR_ON});
    } else {
        chrome.browserAction.setBadgeText({text: 'off'});
        chrome.browserAction.setBadgeBackgroundColor({color: Popup.BADGE_BACKGROUND_COLOR_OFF});
    }
};

Popup.toggleActivate = function() {
    var dfr = $.Deferred();
    chrome.storage.local.get('antibiasEnabled', function(data) {
        Popup.antibiasEnabled = !data.antibiasEnabled;
        chrome.storage.local.set({'antibiasEnabled' : Popup.antibiasEnabled}, function() {
            dfr.resolve({'antibiasEnabled':  Popup.antibiasEnabled});
        });
    });
    return dfr.promise();
};




window.onload = Popup.init;