// Sample flight data (from the first table)
const flights = [
  { legId: '9ca0e81111c683bec1012473feefd28f', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT2H29M', isNonStop: true, totalFare: 248.6, totalTravelDistance: 947 },
  { legId: '98685953630e772a098941b71906592b', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT2H30M', isNonStop: true, totalFare: 248.6, totalTravelDistance: 947 },
  { legId: '98d90cbc32bfbb05c2fc32897c7c1087', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT2H30M', isNonStop: true, totalFare: 248.6, totalTravelDistance: 947 },
  { legId: '969a269d38eae583f455486fa90877b4', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT2H32M', isNonStop: true, totalFare: 248.6, totalTravelDistance: 947 },
  { legId: '980370cf27c89b40d2833a1d5afc9751', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT2H34M', isNonStop: true, totalFare: 248.6, totalTravelDistance: 947 },
  { legId: '79eda9f841e226a1e2121d74211e595c', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT2H38M', isNonStop: true, totalFare: 248.6, totalTravelDistance: 947 },
  { legId: '9335fae376c38bb61263281779f469ec', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT4H12M', isNonStop: false, totalFare: 251.1, totalTravelDistance: 956 },
  { legId: '3904bf87f2d1daf334f1ae7e3b876028', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT5H18M', isNonStop: false, totalFare: 251.1, totalTravelDistance: 956 },
  { legId: 'd93988734c44a3c075d9efe373352507', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT5H32M', isNonStop: false, totalFare: 251.1, totalTravelDistance: 956 },
  { legId: '562e7d5dd6ecbf1509c0c19711dbdca9', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT6H38M', isNonStop: false, totalFare: 251.1, totalTravelDistance: 956 },
  { legId: 'c38a6e4b807d15541e5866676febcbec', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT4H46M', isNonStop: false, totalFare: 252.6, totalTravelDistance: 947 },
  { legId: 'f66d72ba3a526576608b8402b5720726', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT5H45M', isNonStop: false, totalFare: 252.6, totalTravelDistance: 1462 },
  { legId: 'e7c4054e85cca9bc7134b3cc93deaf7c', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT5H59M', isNonStop: false, totalFare: 252.6, totalTravelDistance: 1462 },
  { legId: '5fa8c0f8b25eb24bf2ddc39a498bcc37', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT7H18M', isNonStop: false, totalFare: 252.6, totalTravelDistance: 1462 },
  { legId: '948d26b3e5658762cd62f842c87ae46e', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT8H10M', isNonStop: false, totalFare: 252.6, totalTravelDistance: 1462 },
  { legId: 'cb345693479e84838dfaac346b8e8d6a', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT5H39M', isNonStop: false, totalFare: 290.58, totalTravelDistance: null },
  { legId: 'e1b95e4e6c997517f64ba5ea712bda22', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT2H38M', isNonStop: true, totalFare: 300.1, totalTravelDistance: 947 },
  { legId: 'eaf033a044596f0a76b132a490927524', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT4H17M', isNonStop: false, totalFare: 302.11, totalTravelDistance: 956 },
  { legId: '721d9a2f66fe479e7c17b13e7ae0bb15', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT4H36M', isNonStop: false, totalFare: 302.11, totalTravelDistance: 956 },
  { legId: 'a9f012defb9227f69bf76617b47f4c51', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT4H45M', isNonStop: false, totalFare: 302.11, totalTravelDistance: 956 },
  { legId: '676e25bb0ec021d335241354b668c674', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT6H2M', isNonStop: false, totalFare: 302.11, totalTravelDistance: 956 },
];

// Populate the flights table
const flightsTable = document.getElementById('flightsTable').getElementsByTagName('tbody')[0];
flights.forEach(flight => {
  const row = flightsTable.insertRow();
  row.insertCell(0).textContent = flight.legId;
  row.insertCell(1).textContent = flight.flightDate;
  row.insertCell(2).textContent = flight.startingAirport;
  row.insertCell(3).textContent = flight.destinationAirport;
  row.insertCell(4).textContent = flight.travelDuration;
  row.insertCell(5).textContent = flight.isNonStop ? 'Yes' : 'No';
  row.insertCell(6).textContent = `$${flight.totalFare}`;
  row.insertCell(7).textContent = flight.totalTravelDistance || 'N/A';
});

// Function to convert ISO 8601 duration to minutes
function parseDuration(duration) {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?/;
  const matches = duration.match(regex);
  const hours = parseInt(matches[1] || 0);
  const minutes = parseInt(matches[2] || 0);
  return hours * 60 + minutes;
}

// Function to predict the best flight
function predictBestFlight(from, to, date) {
  // Filter flights by departure, arrival, and date
  const filteredFlights = flights.filter(
    flight => flight.startingAirport.toUpperCase() === from.toUpperCase() &&
              flight.destinationAirport.toUpperCase() === to.toUpperCase() &&
              flight.flightDate === date
  );

  if (filteredFlights.length === 0) {
    return null; // No flights found
  }

  // Find the flight with the lowest fare and shortest duration
  let bestFlight = filteredFlights[0];
  filteredFlights.forEach(flight => {
    const currentDuration = parseDuration(flight.travelDuration);
    const bestDuration = parseDuration(bestFlight.travelDuration);

    if (flight.totalFare < bestFlight.totalFare ||
        (flight.totalFare === bestFlight.totalFare && currentDuration < bestDuration)) {
      bestFlight = flight;
    }
  });

  return bestFlight;
}

// Event listener for the predict button
document.getElementById('predictButton').addEventListener('click', () => {
  const from = document.getElementById('from').value.trim();
  const to = document.getElementById('to').value.trim();
  const date = document.getElementById('date').value; // Corrected ID

  if (!from || !to || !date) {
    alert('Please enter departure, arrival, and date.');
    return;
  }

  const bestFlight = predictBestFlight(from, to, date);

  if (bestFlight) {
    document.getElementById('resultText').innerHTML = `
      <strong>Best Flight Found:</strong><br>
      From: ${bestFlight.startingAirport}<br>
      To: ${bestFlight.destinationAirport}<br>
      Date: ${bestFlight.flightDate}<br>
      Duration: ${bestFlight.travelDuration}<br>
      Fare: $${bestFlight.totalFare}<br>
      Distance: ${bestFlight.totalTravelDistance || 'N/A'} miles
    `;
  } else {
    document.getElementById('resultText').textContent = 'No flights found for the given route and date.';
  }
});