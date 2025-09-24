const destInput = document.getElementById("destination");
const dateInput = document.getElementById("startDate");
const daysInput = document.getElementById("numDays");
const styleInput = document.getElementById("style");
const budgetInput = document.getElementById("budget");
const interestsInput = document.getElementById("interests");
const generateBtn = document.getElementById("Generate");
const outputDiv = document.getElementById("output");
const itineraryArea = document.getElementById("itineraryArea");

async function generatetripplan() {
  generateBtn.disabled = true;
  generateBtn.textContent = "Generating…";
  itineraryArea.innerHTML = "";

  try {
    const response = await fetch("https://backend-1-tnng.onrender.com/generate", {  // corrected port
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Destination: destInput.value,
        Start_date: dateInput.value,
        Days: daysInput.value,
        Travel_style: styleInput.value,
        Budget: budgetInput.value,
        Interests: interestsInput.value,
      }),
    });

    if (!response.ok) {
      outputDiv.textContent = `Error ${response.status}: ${await response.text()}`;
      return;
    }

    const data = await response.json();

    if (data.itinerary) {
      renderItinerary(data.itinerary); // call the formatting function
    } else {
      itineraryArea.textContent = "No data returned.";
    }
  } catch (err) {
    itineraryArea.textContent = "Network error: " + err.message;
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "Generate Plan";
  }
}

// single renderItinerary function
function renderItinerary(itineraryText) {
  let sections = itineraryText.split("---"); // split by day separator
  let html = "";

  sections.forEach(section => {
    if (!section.trim()) return;
    const lines = section.trim().split("\n");
    const title = lines[0].trim();
    const content = lines.slice(1).join("<br>");
    html += `<div class="dayCard"><h2>${title}</h2><p>${content}</p></div>`;
  });

  itineraryArea.innerHTML = html;
}

generateBtn.addEventListener("click", generatetripplan);
