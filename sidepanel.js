// This script will populate the side panel table with the data received from the background script.
console.log('sidepanel.js loaded')

// request analyzing
chrome.runtime.onMessage.addListener((message) => {
    // console.log(message)

    // Find table in the sidepanel.html
    const table = document.querySelector("table");

    // reset table
    table.innerHTML = `
      <tr>
        <th>Domain</th>
        <th>Hit Count</th>
      </tr>
    `;

    // append the data sent from background.js
    for (var key in message) {
        const row = table.insertRow();

        var count = message[key].count;

        const domainUrl = row.insertCell();
        const domainCount = row.insertCell();

        domainUrl.innerText = truncateDomain(key);
        domainCount.innerText = count;
    }
});

// Truncate domains that blow out the horizontal space of the sidepanel. 
// Just a visual change
function truncateDomain(domain) {
    const maxLength = 30;
    const parts = domain.split(".");

    console.log(domain.length)

    if (parts.length > 2 && domain.length > maxLength) {
        const subdomain = parts.slice(0, 1).join(".");
        const basedomain = parts.slice(1).join(".")

        // grab last five characters of subdomain
        const truncatedSubdomain = subdomain.slice(-5);

        return `...${truncatedSubdomain}.${basedomain}`;
    }

    return domain;
}