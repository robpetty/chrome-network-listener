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
});