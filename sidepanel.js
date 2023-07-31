// This script will populate the side panel table with the data received from the background script.
console.log('sidepanel.js loaded')

/*
// side panel activity notifications to background
// Send a message to the background script to notify that the side panel is active
chrome.runtime.sendMessage("sidePanelStatus", (response) => {
    // Handle the response from the background script, if needed
    console.log("Side Panel Active: ", response.isSidePanelActive);
});

// Optionally, you can send another message to the background script when the side panel is closed.
// For example, you can use the window.unload event to detect when the side panel is closed and notify the background script.

window.addEventListener("unload", () => {
    // Send a message to the background script to notify that the side panel is closed
    chrome.runtime.sendMessage("sidePanelStatus", { isSidePanelActive: false });
});
*/

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


// Trigger the initial request to the background script to populate the table on extension load.
// Unsure about this, and need to add validation to not send messages when sidepanel not open.
//chrome.runtime.sendMessage({});

/*
chrome.runtime.onMessage.addListener((message) => {
    const table = document.querySelector("table");
    table.innerHTML = `
      <tr>
        <th>Domain</th>
        <th>Hit Count</th>
        <th>Total Size (bytes)</th>
      </tr>
    `;
    for (const [domain, data] of Object.entries(message)) {
      const row = table.insertRow();
      const domainCell = row.insertCell();
      const countCell = row.insertCell();
      const sizeCell = row.insertCell();
  
      domainCell.innerText = domain;
      countCell.innerText = data.count;
      sizeCell.innerText = data.size;
    }
  });
  
  // Trigger the initial request to the background script to populate the table on extension load.
  chrome.runtime.sendMessage({});
  */