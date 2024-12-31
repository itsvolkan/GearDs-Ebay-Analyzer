/*
  Author: Volkan Aydogdu
  Project: eBay Analyzer Chrome Extension
  Description: Handles product analysis and data extraction from eBay product pages.
  Date: 01/01/2025
  Contact: itswolkan@gmail.com
*/

// Save button functionality
document.getElementById('saveBtn').addEventListener('click', () => {
  const itemsPerPage = document.getElementById('itemsPerPage').value;

  // Get the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];

      // Update the URL with the selected items per page (_ipg parameter)
      const url = new URL(activeTab.url);
      url.searchParams.set('_ipg', itemsPerPage); // Set the items per page parameter

      // Redirect the active tab to the updated URL
      chrome.tabs.update(activeTab.id, { url: url.toString() });
  });
});

// Analyze button functionality
document.getElementById('analyzeBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;

      // Clear previous analysis results before starting the new analysis
      chrome.scripting.executeScript(
          {
              target: { tabId: tabId },
              func: clearPreviousResults, // Call the function to clear previous results
          },
          () => {
              console.log('Previous analysis results cleared');
              
              // Now execute the content script to perform the new analysis
              chrome.scripting.executeScript(
                  {
                      target: { tabId: tabId },
                      files: ['content.js'], // Ensure content.js is correctly set up to perform analysis
                  },
                  () => {
                      console.log('Content script executed on the current page for new analysis');
                  }
              );
          }
      );
  });
});


// Function to clear previous analysis results on the page
function clearPreviousResults() {
  // Clear any previous analysis results or tables
  const analysisResults = document.querySelectorAll('.analysis-result'); // Modify selector if needed
  analysisResults.forEach(result => result.remove()); // Remove all elements with the 'analysis-result' class

  // Reset any tables or progress bars if they exist
  const analysisTable = document.querySelector('#analysisTable');
  if (analysisTable) {
      analysisTable.innerHTML = ''; // Clear the table content
  }

  // Optionally, you can reset or clear other elements like progress bars, status messages, etc.
  const progressBar = document.querySelector('.progress-bar');
  if (progressBar) {
      progressBar.style.width = '0%'; // Reset the progress bar
  }

  // Clear any loading or status messages
  const loadingMessage = document.querySelector('.loading-message');
  if (loadingMessage) {
      loadingMessage.style.display = 'none';
  }

  console.log('Previous results cleared');
}
