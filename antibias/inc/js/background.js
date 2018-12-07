var BADGE_BACKGROUND_COLOR_ON = '#0b8043';
var BADGE_BACKGROUND_COLOR_OFF = '#616161';

var DEFAULT_ENABLED_ON_INSTALL = false;


chrome.runtime.onInstalled.addListener( function(details) {
    console.info('INSTALLED antibias ', details);
    chrome.storage.local.set({'antibiasEnabled' : DEFAULT_ENABLED_ON_INSTALL }, function() {
        console.info('INSTALLED antibiasEnabled defaults to ' + DEFAULT_ENABLED_ON_INSTALL);
    });
});


/**
 * Initially setup the badge.
 */
chrome.storage.local.get('antibiasEnabled', function(data) {
    if(data.antibiasEnabled === true) {
        chrome.browserAction.setBadgeText({text: 'on'});
        chrome.browserAction.setBadgeBackgroundColor({color: BADGE_BACKGROUND_COLOR_ON});

    } else {
        chrome.browserAction.setBadgeText({text: 'off'});
        chrome.browserAction.setBadgeBackgroundColor({color: BADGE_BACKGROUND_COLOR_OFF});
    }
});

/**
 * Watch for the current tab to update its url and then send a message
 * to the content.js
 */
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var currentTabId = tabs[0].id;
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        if(tabId ===  currentTabId && changeInfo.status === 'complete') {
            chrome.storage.local.get('antibiasEnabled', function(data) {
            chrome.tabs.sendMessage(currentTabId, data.antibiasEnabled ? 'antibias-turn-on' :'antibias-turn-off',
                function(response) {

                    if(response === 'off-ok') {
                        //chrome.tabs.reload(tabs[0].id);
                    } else if(response === 'on-ok') {

                    }
            });

        });
        }
    });

})