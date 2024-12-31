/*
  Author: Volkan Aydogdu
  Project: eBay Analyzer Chrome Extension
  Description: Handles product analysis and data extraction from eBay product pages.
  Date: 01/01/2025
  Contact: itswolkan@gmail.com
*/

(async function () {
  // Remove any existing panel to avoid duplicates
  const existingPanel = document.getElementById('analysisPanel');
  if (existingPanel) {
    existingPanel.remove();
  }



  // Create a container for the results
  const panel = document.createElement('div');
  panel.id = 'analysisPanel';
  panel.style.position = 'fixed';
  panel.style.bottom = '0';
  panel.style.left = '0';
  panel.style.width = '100%';
  panel.style.maxHeight = '400px';
  panel.style.overflowY = 'auto';
  panel.style.backgroundColor = '#333';
  panel.style.border = '20px solid #333';
  panel.style.zIndex = '10000';
  panel.style.boxShadow = '0px -2px 5px rgba(0,0,0,0.1)';
  panel.style.padding = '10px';
  panel.style.fontFamily = 'Arial, sans-serif';
  panel.style.fontSize = '14px';

  // Add a close button
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.style.float = 'right';
  closeButton.style.marginBottom = '10px';
  closeButton.style.backgroundColor = '#d9534f';
  closeButton.style.color = '#fff';
  closeButton.style.border = 'none';
  closeButton.style.padding = '10px 30px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.borderRadius = '20px';
  closeButton.style.transition = 'background-color 0.3s ease, transform 0.2s ease';


  // Hover effect for the close button
  closeButton.addEventListener('mouseover', () => {
    closeButton.style.backgroundColor = '#c9302c'; // Darker red on hover
    closeButton.style.transform = 'scale(1.1)'; // Slightly enlarge the button on hover
  });

  closeButton.addEventListener('mouseout', () => {
    closeButton.style.backgroundColor = '#d9534f'; // Original color
    closeButton.style.transform = 'scale(1)'; // Reset to original size
  });

  // Event to remove panel when the close button is clicked
  closeButton.addEventListener('click', () => {
    panel.remove();
  });

  // Append the close button to the panel
  panel.appendChild(closeButton);


  // Add a label and dropdown for selecting the number of products to analyze
  const label = document.createElement('label');
  label.textContent = 'Select number of products to analyze: ';
  label.style.fontSize = '16px';
  label.style.fontWeight = 'bold';
  label.style.color = 'white';
  label.style.marginRight = '10px';
  label.style.padding = '8px';
  label.style.backgroundColor = '#ff6600';
  label.style.borderRadius = '5px';
  label.style.border = '1px solid #ccc';
  label.style.transition = 'all 0.3s ease';

  label.addEventListener('mouseover', function () {
    label.style.backgroundColor = '#f1f1f1';
    label.style.color = '#333';
  });

  label.addEventListener('mouseout', function () {
    label.style.backgroundColor = '#ff6600';
    label.style.color = 'white';
  });

  document.body.appendChild(label);

  const select = document.createElement('select');
  select.id = 'numProducts';
  const options = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  options.forEach(num => {
    const option = document.createElement('option');
    option.value = num;
    option.textContent = num;
    select.appendChild(option);
  });
  select.value = 10; // Set default to 10
  select.style.padding = '10px';
  select.style.fontSize = '14px';
  select.style.backgroundColor = '#ffffff';
  select.style.border = '2px solid #333';
  select.style.borderRadius = '5px';
  select.style.color = '#333';
  panel.appendChild(select);


  // Add input fields for price range
  const minPriceInput = document.createElement('input');
  minPriceInput.id = 'minPrice';
  minPriceInput.type = 'number';
  minPriceInput.placeholder = 'Min Price';
  minPriceInput.style.marginLeft = '10px';
  minPriceInput.style.padding = '10px';
  minPriceInput.style.fontSize = '14px';
  minPriceInput.style.border = '1px solid #ccc';
  minPriceInput.style.borderRadius = '5px';

  const maxPriceInput = document.createElement('input');
  maxPriceInput.id = 'maxPrice';
  maxPriceInput.type = 'number';
  maxPriceInput.placeholder = 'Max Price';
  maxPriceInput.style.marginLeft = '10px';
  maxPriceInput.style.padding = '10px';
  maxPriceInput.style.fontSize = '14px';
  maxPriceInput.style.border = '1px solid #ccc';
  maxPriceInput.style.borderRadius = '5px';

  panel.appendChild(minPriceInput);
  panel.appendChild(maxPriceInput);


  // Add a dropdown for condition selection
  const conditionSelect = document.createElement('select');
  conditionSelect.id = 'conditionFilter';
  conditionSelect.style.marginLeft = '10px';
  conditionSelect.style.padding = '10px';
  conditionSelect.style.fontSize = '14px';
  conditionSelect.style.border = '1px solid #ccc';
  conditionSelect.style.borderRadius = '5px';

  // Define condition options
  const conditionOptions = [
    { value: '', text: 'All Conditions' },
    { value: 'New', text: 'New' },
    { value: 'Open box', text: 'Open Box' },
    { value: 'Excellent - Refurbished', text: 'Excellent - Refurbished' },
    { value: 'Very Good - Refurbished', text: 'Very Good - Refurbished' },
    { value: 'Good - Refurbished', text: 'Good - Refurbished' },
    { value: 'Used', text: 'Used' },
    { value: 'For parts or not working', text: 'For Parts or Not Working' },
  ];

  conditionOptions.forEach(option => {
    const opt = document.createElement('option');
    opt.value = option.value;
    opt.textContent = option.text;
    conditionSelect.appendChild(opt);
  });

  panel.appendChild(conditionSelect);


  // Add a button to apply the selection
  const analyzeButton = document.createElement('button');
  analyzeButton.textContent = 'Analyze';
  analyzeButton.style.backgroundColor = '#28a745';
  analyzeButton.style.color = '#fff';
  analyzeButton.style.border = 'none';
  analyzeButton.style.padding = '10px 30px';
  analyzeButton.style.cursor = 'pointer';
  analyzeButton.style.marginLeft = '10px';
  analyzeButton.style.borderRadius = '20px';
  analyzeButton.style.fontSize = '16px';

  analyzeButton.addEventListener('click', () => {
    // Trigger the analysis based on the selected number of products
    const numToAnalyze = parseInt(select.value);
    renderTable(numToAnalyze);
  });

  panel.appendChild(analyzeButton);

  // Paneli ekleyelim (panel daha önce tanımlandı)
  panel.appendChild(analyzeButton);










  // Show a "Please wait" message with animation
  const loadingMessage = document.createElement('div');
  loadingMessage.textContent = "Please wait, analysis is in progress...";
  loadingMessage.style.textAlign = 'center';
  loadingMessage.style.padding = '20px';
  loadingMessage.style.fontSize = '18px';
  loadingMessage.style.color = '#ff6600';
  loadingMessage.style.fontWeight = 'bold';
  loadingMessage.style.opacity = '0'; // Initially hidden for animation
  loadingMessage.style.transition = 'opacity 1s ease-in-out';
  panel.appendChild(loadingMessage);

  // Animating the loading message
  setTimeout(() => {
    loadingMessage.style.opacity = '1'; // Fade in the message after 1 second
  }, 500);

  // Motivating phrases
  const phrases = [
    "Stay patient, success is on the way...",
    "Good things come to those who wait...",
    "Your analysis is working its magic...",
    "Almost there, just a little more...",
    "Patience is a virtue, results are near..."
  ];

  let phraseIndex = 0;

  // Display random motivating phrases while waiting
  const phraseDisplay = document.createElement('div');
  phraseDisplay.textContent = phrases[phraseIndex];
  phraseDisplay.style.textAlign = 'center';
  phraseDisplay.style.fontSize = '20px';
  phraseDisplay.style.fontStyle = 'italic';
  phraseDisplay.style.color = '#555';
  phraseDisplay.style.marginTop = '20px';
  phraseDisplay.style.opacity = '0';
  phraseDisplay.style.transition = 'opacity 1s ease-in-out';
  panel.appendChild(phraseDisplay);

  // Function to change the phrase every 2 seconds
  const changePhrase = () => {
    phraseIndex = (phraseIndex + 1) % phrases.length;
    phraseDisplay.textContent = phrases[phraseIndex];
    phraseDisplay.style.opacity = '0';
    setTimeout(() => {
      phraseDisplay.style.opacity = '1'; // Fade in the new phrase
    }, 500);
  };

  // Change phrase every 2 seconds
  const phraseInterval = setInterval(changePhrase, 2000);

  // Create a progress bar
  const progressBarContainer = document.createElement('div');
  progressBarContainer.style.width = '100%';
  progressBarContainer.style.height = '20px';
  progressBarContainer.style.backgroundColor = '#ddd';
  progressBarContainer.style.borderRadius = '5px';
  progressBarContainer.style.marginTop = '20px';
  panel.appendChild(progressBarContainer);

  // Create the progress bar (this will fill as the analysis progresses)
  const progressBar = document.createElement('div');
  progressBar.style.height = '100%';
  progressBar.style.width = '0%'; // Initial width is 0%
  progressBar.style.backgroundColor = '#ff6600';
  progressBar.style.borderRadius = '5px';
  progressBarContainer.appendChild(progressBar);

  // Function to simulate progress (you can replace this with actual progress logic if needed)
  let progress = 0;
  const progressInterval = setInterval(() => {
    if (progress < 100) {
      progress += 1; // Increment the progress by 2% every interval
      progressBar.style.width = progress + '%'; // Update the progress bar width
    } else {
      clearInterval(progressInterval); // Stop the progress bar when it's complete
      clearInterval(phraseInterval); // Stop changing phrases once analysis is complete
      hideLoadingAnimation(); // Hide the loading animation after the analysis is complete
    }
  }, 100); // Interval of 100ms for updating the progress

  // Function to hide the loading message and phrases after analysis completion
  function hideLoadingAnimation() {
    loadingMessage.style.opacity = '0'; // Fade out the loading message
    phraseDisplay.style.opacity = '0'; // Fade out the phrase display
    setTimeout(() => {
      loadingMessage.style.display = 'none'; // Remove from the DOM after the fade-out
      phraseDisplay.style.display = 'none'; // Remove from the DOM after the fade-out
    }, 1000); // Wait 1 second for the fade-out before hiding them
  }


  // Create a table for results (hidden initially)
  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.marginTop = '10px';
  table.style.boxShadow = '0px 2px 5px rgba(0,0,0,0.1)';
  table.style.display = 'none'; // Hide the table initially


  const header = `
    <thead>
    <tr style="background-color: #ff6600; color: white; text-align: left; position: sticky; top: 0; z-index: 1;">
        <th style="padding: 10px; border: 1px solid #ddd;" data-sort="index">#</th>
        <th style="padding: 10px; border: 1px solid #ddd;">Image</th>
        <th style="padding: 10px; border: 1px solid #ddd;">Item ID</th>
        <th style="padding: 10px; border: 1px solid #ddd;" data-sort="condition">Condition <span class="sort-arrow">▼</span></th>
        <th style="padding: 10px; border: 1px solid #ddd;" data-sort="brand">Brand <span class="sort-arrow">▼</span></th>
        <th style="padding: 10px; border: 1px solid #ddd;" data-sort="title">Title <span class="sort-arrow">▼</span></th>
        <th style="padding: 10px; border: 1px solid #ddd;" data-sort="price">Price <span class="sort-arrow">▼</span></th>
        <th style="padding: 10px; border: 1px solid #ddd;" data-sort="soldText">Sold <span class="sort-arrow">▼</span></th>
        <th style="padding: 10px; border: 1px solid #ddd;" data-sort="watchers">Watch Count <span class="sort-arrow">▼</span></th>
        <th style="padding: 10px; border: 1px solid #ddd;" data-sort="rating">Rating <span class="sort-arrow">▼</span></th>
        <th style="padding: 10px; border: 1px solid #ddd;" data-sort="reviewsCount">Review Count <span class="sort-arrow">▼</span></th>
        <th style="padding: 10px; border: 1px solid #ddd;" data-sort="revenue">Total Revenue <span class="sort-arrow">▼</span></th>
        <th style="padding: 10px; border: 1px solid #ddd;" data-sort="stock">Stock <span class="sort-arrow">▼</span></th>
        <th style="padding: 10px; border: 1px solid #ddd;" data-sort="seller">Seller <span class="sort-arrow">▼</span></th>
        <th style="padding: 10px; border: 1px solid #ddd;" data-sort="sellerRating">Seller Rating <span class="sort-arrow">▼</span></th>
        <th style="padding: 10px; border: 1px solid #ddd;" data-sort="views">Last 24 Hours Views <span class="sort-arrow">▼</span></th>
        <th style="padding: 10px; border: 1px solid #ddd;" data-sort="carts">In Carts <span class="sort-arrow">▼</span></th>
        <th style="padding: 10px; border: 1px solid #ddd;" data-sort="soldInLast24Hours">Sold in Last 24 Hours <span class="sort-arrow">▼</span></th>

      </tr>
    </thead>
  `;
  table.innerHTML = header;

  // Store all product data (do not clear this data when filtering)
  let products = [];

  async function fetchProductDetails(link) {
    try {
      const response = await fetch(link);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

       // Fetch the Item ID
    const itemId = doc.querySelector(
      '.ux-layout-section__textual-display--itemId .ux-textspans--BOLD'
    )?.textContent.trim() || "No Item ID";


      // Fetch stock information
      let stock = doc.querySelector('.x-quantity__availability .ux-textspans--SECONDARY')?.textContent.trim() || "No Data";

      // Modify the stock information to show "10+" if the text contains "More than 10 available"
      if (stock.includes("More than")) {
        stock = "10+";
      }


      // Fetch seller details
      const sellerName = doc.querySelector(".x-sellercard-atf__info .ux-textspans--BOLD")?.textContent || "No Data"; // Display "No Data" if no seller name
      const sellerRating = doc.querySelector(".x-sellercard-atf__data-item span")?.textContent || "No Data"; // Display "No Data" if no seller rating

      // Initialize variables to hold the counts
      let views = "No Data", carts = "No Data";

      // Check for 'viewed' information in last 24 hours
      const viewsText = doc.querySelector('.x-ebay-signal .signal--time-sensitive .ux-textspans')?.textContent.trim();
      if (viewsText && viewsText.includes('viewed in the last 24 hours')) {
        views = parseInt(viewsText.split(' ')[0]);
      }

      // Check for 'In X carts' information
      const cartsText = doc.querySelector('.x-ebay-signal .ux-textspans')?.textContent.trim();
      if (cartsText && cartsText.includes('In')) {
        carts = parseInt(cartsText.split(' ')[1]);
      }

      // Check for 'sold in last 24 hours'
      const soldInLast24HoursText = doc.querySelector('.x-ebay-signal .ux-textspans')?.textContent.trim();
      const soldInLast24Hours = soldInLast24HoursText ? soldInLast24HoursText.split(' ')[0] : "No data"; // Extract the number before 'sold'

      // Check for Total Sold

      const soldText = doc.querySelector('.x-quantity__availability .ux-textspans--BOLD')?.textContent.trim();
      let sold = soldText ? soldText.replace(/[^0-9]/g, '') : "No data"; // Remove any non-numeric characters
      sold = parseInt(sold); // Convert to integer, without commas or non-numeric characters

      return { itemId, stock, sellerName, sellerRating, views, carts, soldInLast24Hours, soldText };
    } catch (error) {
      console.error("Error fetching product details:", error);
      return { itemId: "No Item ID", stock: "No Data", sellerName: "No Data", sellerRating: "No Data", views: "No Data", carts: "No Data", soldInLast24Hours: "No Data" };
    }
  }




  // Fetch and analyze the product data
  let productsData = Array.from(document.querySelectorAll('.srp-river.srp-layout-inner .s-item')).map((item) => {
    const title = item.querySelector('.s-item__title')?.textContent.trim();
    const condition = item.querySelector('.SECONDARY_INFO')?.textContent.trim() || "Unknown Condition";
    const brand = item.querySelector('.s-item__subtitle')?.textContent.split('·')[1]?.trim() || "Unknown Brand";
    const priceText = item.querySelector('.s-item__price')?.textContent.trim();
    const price = priceText ? parseFloat(priceText.replace(/[^0-9.]/g, '')) : 0;
    const soldText = item.querySelector('.s-item__dynamic.s-item__quantitySold')?.textContent.trim();
    const sold = soldText ? parseInt(soldText.replace(/[^0-9]/g, '')) : 0;
    const watchText = item.querySelector('.s-item__dynamic.s-item__watchCountTotal')?.textContent.trim();
    const watchers = watchText ? parseInt(watchText.replace(/[^0-9]/g, '')) : 0;
    const image = item.querySelector('.s-item__image-wrapper img')?.src;
    const link = item.querySelector('.s-item__link')?.href;
    const ratingText = item.querySelector('.x-star-rating span.clipped')?.textContent.trim();
    const reviewsCountText = item.querySelector('.s-item__reviews-count span[aria-hidden="true"]')?.textContent.trim();
    const reviewsCount = reviewsCountText ? parseInt(reviewsCountText.replace(/[^0-9]/g, '')) : 0;

    // Calculate total revenue
    const revenue = price * sold;

    return {
      condition: condition || "Unknown",
      brand: brand || "Unknown",
      title: title || "Unknown",
      price: price || 0,
      sold: sold || 0,
      watchers: watchers || 0,
      image: image || "",
      link: link || "#",
      rating: parseFloat(ratingText?.match(/[\d.]+/)?.[0]) || 0,
      reviewsCount: reviewsCount || 0,
      revenue: revenue || 0,
    };
  });

  // Default sort by "Sold" column in descending order
  productsData.sort((a, b) => b.sold - a.sold);
  products = [...productsData]; // Store the data for filtering

  // Function to handle sorting by column
  const sortTable = (column) => {
    const ascending = column.getAttribute('data-order') === 'asc';
    column.setAttribute('data-order', ascending ? 'desc' : 'asc');
    const arrow = column.querySelector('.sort-arrow');
    arrow.textContent = ascending ? '▲' : '▼';

    const sortKey = column.getAttribute('data-sort');
    products.sort((a, b) => {
      if (typeof a[sortKey] === 'string') {
        return ascending
          ? a[sortKey].localeCompare(b[sortKey])
          : b[sortKey].localeCompare(a[sortKey]);
      }
      return ascending ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
    });

    renderTable();
  };

  // Add event listeners for sorting
  table.querySelectorAll('[data-sort]').forEach((header) => {
    header.addEventListener('click', () => sortTable(header));
  });

  // Render the table with the selected number of products when the page loads
  const renderTable = async () => {
    tbody.innerHTML = ''; // Clear the table rows

    // Get the selected price range and condition
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
    const selectedCondition = document.getElementById('conditionFilter').value;

    // Filter products based on the price range and condition
    const filteredProducts = products.filter(product => {
      const matchesCondition = selectedCondition === '' || product.condition === selectedCondition;
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
      return matchesCondition && matchesPrice;
    });

    const numToAnalyze = parseInt(select.value); // Get the number of products to analyze
    let count = 0;

    for (const [index, product] of filteredProducts.entries()) {
      if (count >= numToAnalyze) break;
      const details = await fetchProductDetails(product.link);

      const row = document.createElement('tr');
      row.style.border = '1px solid #ddd';
      row.style.textAlign = 'left';
      row.style.backgroundColor = index % 2 === 0 ? '#fff' : '#ffcc99'; // Alternate row colors
      row.style.color = '#333';

      row.innerHTML = `
        <td style="padding: 10px; border: 1px solid #ddd;">${index + 1}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">
          <a href="${product.link}" target="_blank">
            <img src="${product.image}" alt="${product.title}" style="width: 50px; height: auto;"/>
          </a>
        </td>
        <td style="padding: 10px; border: 1px solid #ddd;">${details.itemId}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${product.condition}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${product.brand}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">
          <a href="${product.link}" target="_blank" style="text-decoration: none; color: #007bff;">
            ${product.title}
          </a>
        </td>
        <td style="padding: 10px; border: 1px solid #ddd;">$${product.price.toFixed(2)}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${details.soldText}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${product.watchers}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${product.rating}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${product.reviewsCount}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">$${product.revenue.toFixed(2)}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${details.stock}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${details.sellerName}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${details.sellerRating}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${details.views}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${details.carts}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${details.soldInLast24Hours}</td>
      `;
      tbody.appendChild(row);
      count++;
    }

    // Once the results are ready, hide the loading message and show the table
    loadingMessage.style.display = 'none';
    table.style.display = 'table';
  };



  const tbody = document.createElement('tbody');
  table.appendChild(tbody);
  panel.appendChild(table);
  document.body.appendChild(panel);

  // Initial rendering
  renderTable();
})();
