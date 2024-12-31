/*
  Author: Volkan Aydogdu
  Project: eBay Analyzer Chrome Extension
  Description: Handles product analysis and data extraction from eBay product pages.
  Date: 01/01/2025
  Contact: itswolkan@gmail.com
*/

// purchaseHistory.js

export async function fetchPurchaseHistory(itemId) {
    const url = `https://www.ebay.com/bin/purchaseHistory?item=${itemId}`;
    try {
      const response = await fetch(url);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
  
      // Extract purchase history table rows
      const rows = doc.querySelectorAll(".app-table__row");
      const purchaseHistory = Array.from(rows).map(row => {
        const userId = row.querySelector("td:nth-child(1) span")?.textContent.trim();
        const price = row.querySelector("td:nth-child(2) span")?.textContent.trim();
        const quantity = row.querySelector("td:nth-child(3) span")?.textContent.trim();
        const date = row.querySelector("td:nth-child(4) span")?.textContent.trim();
        return { userId, price, quantity, date };
      });
  
      return purchaseHistory;
    } catch (error) {
      console.error("Error fetching purchase history:", error);
      return [];
    }
  }
  
  export function displayPurchaseHistory(container, purchaseHistory) {
    // Clear the container
    container.innerHTML = "";
  
    if (purchaseHistory.length === 0) {
      container.textContent = "No purchase history available.";
      return;
    }
  
    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.marginTop = "10px";
    table.style.border = "1px solid #ddd";
  
    const headerRow = `
      <thead>
        <tr style="background-color: #f4f4f4; text-align: left;">
          <th style="padding: 10px; border: 1px solid #ddd;">User ID</th>
          <th style="padding: 10px; border: 1px solid #ddd;">Price</th>
          <th style="padding: 10px; border: 1px solid #ddd;">Quantity</th>
          <th style="padding: 10px; border: 1px solid #ddd;">Date of Purchase</th>
        </tr>
      </thead>
    `;
    table.innerHTML = headerRow;
  
    const tbody = document.createElement("tbody");
    purchaseHistory.forEach(record => {
      const row = document.createElement("tr");
      row.style.border = "1px solid #ddd";
      row.style.backgroundColor = "#fff";
      row.style.color = "#333";
  
      row.innerHTML = `
        <td style="padding: 10px; border: 1px solid #ddd;">${record.userId}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${record.price}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${record.quantity}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${record.date}</td>
      `;
      tbody.appendChild(row);
    });
  
    table.appendChild(tbody);
    container.appendChild(table);
  }
  