/*
// side panel activity
// Create a variable to track the side panel's status (active/inactive)
let isSidePanelActive = false;

// Listen for the extension icon click event
chrome.action.onClicked.addListener(() => {
    // Toggle the status when the side panel is opened or closed
    isSidePanelActive = !isSidePanelActive;
});

// Listen for messages from the side panel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === "sidePanelStatus") {
        // Respond to the side panel with its current status
        sendResponse({ isSidePanelActive });
    }
});
*/
// request scanning
const domainData = {};
const urls = {};

console.log('background.js loaded.')

chrome.webNavigation.onCompleted.addListener((details) => {
    // https://developer.chrome.com/docs/extensions/reference/webNavigation/#event-onCompleted
    //console.log(details)
    console.log("webNavigation.onCompleted")

    let domain = new URL(details.url).hostname.trim();

    // Confirm domain found, if not, use entire details.url value.
    // Happens when url is set to something like "about:blank".
    if (domain === '') {
        domain = details.url
    }

    //console.log("Base domain is " + domain)

    // Base statistics
    if (urls[domain]) {
        urls[domain].count++;
    }
    else {
        urls[domain] = {
            count: 1
        }
    }

    // Order data from most requests made to least.
    const domainsArray = Object.entries(urls);
    domainsArray.sort((a, b) => b[1].count - a[1].count);
    const sortedDomainsByCount = Object.fromEntries(domainsArray);

    // Send data to sidepanel.js
    chrome.runtime.sendMessage(sortedDomainsByCount)
})

/*
chrome.webRequest.onHeadersReceived.addListener(
    (details) => {
        const domain = new URL(details.url).hostname;
        if (domainData[domain]) {
            domainData[domain].count++;
            domainData[domain].size += parseInt(details.responseHeaders.find((header) => header.name.toLowerCase() === "content-length").value);
        } else {
            domainData[domain] = {
                count: 1,
                size: parseInt(details.responseHeaders.find((header) => header.name.toLowerCase() === "content-length").value),
            };
        }
        chrome.action.setPopup({ tabId: details.tabId, popup: "sidepanel.html" });
        chrome.action.setBadgeText({ text: String(domainData[domain].count), tabId: details.tabId });
        chrome.action.setBadgeBackgroundColor({ color: "#008000", tabId: details.tabId });
        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            func: updatePopupData,
            args: [domainData],
        });

        return { responseHeaders: details.responseHeaders };
    },
    { urls: ["<all_urls>"] },
    ["responseHeaders"]
);

function updatePopupData(domainData) {
    console.log('sending message ' + domainData)
    chrome.runtime.sendMessage(domainData);
}
*/