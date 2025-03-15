// Sample flight data (from the first table)
// Total Fare (lowest fare first).
//If two flights have the same fare, the one with the shortest duration is selected.
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
  { legId: 'cb345693479e84838dfaac346b8e8d6a', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT5H39M', isNonStop: false, totalFare: 290.58, totalTravelDistance: 1462 },
  { legId: 'e1b95e4e6c997517f64ba5ea712bda22', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT2H38M', isNonStop: true, totalFare: 300.1, totalTravelDistance: 947 },
  { legId: 'eaf033a044596f0a76b132a490927524', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT4H17M', isNonStop: false, totalFare: 302.11, totalTravelDistance: 956 },
  { legId: '721d9a2f66fe479e7c17b13e7ae0bb15', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT4H36M', isNonStop: false, totalFare: 302.11, totalTravelDistance: 956 },
  { legId: 'a9f012defb9227f69bf76617b47f4c51', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT4H45M', isNonStop: false, totalFare: 302.11, totalTravelDistance: 956 },
  { legId: '676e25bb0ec021d335241354b668c674', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT6H2M', isNonStop: false, totalFare: 302.11, totalTravelDistance: 956 },
  { legId: '712a4b5789013e5a4a3e499164309da8', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT6H14M', isNonStop: false, totalFare: 302.11, totalTravelDistance: 956 },
  { legId: 'a6a69aee2e8f75f9b12a5f6b60e65b59', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT9H46M', isNonStop: false, totalFare: 307.2, totalTravelDistance: 947 },
  { legId: 'fcf84a2b44a9fe185a4cebf5cee2e704', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT11H1M', isNonStop: false, totalFare: 307.2, totalTravelDistance: 947 },
  { legId: '178742e9c46c9627147449926f997622', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT11H17M', isNonStop: false, totalFare: 307.2, totalTravelDistance: 947 },
  { legId: '912ef0fbca3f88a86af24bdc1c1c6c0a', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT12H19M', isNonStop: false, totalFare: 311.58, totalTravelDistance: 947 },
  { legId: '79c4a172ab07916313f5e8abec0bb1db', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT6H17M', isNonStop: false, totalFare: 318.6, totalTravelDistance: 1462 },
  { legId: '9863a0e6a923c09fab658b038299c8d5', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT6H25M', isNonStop: false, totalFare: 318.6, totalTravelDistance: 1462 },
  { legId: '9401afa39f1ad4275c73a66786500992', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT2H32M', isNonStop: true, totalFare: 328.6, totalTravelDistance: 947 },
  { legId: '24c07cf38de8a7a0ed2d7709168042a8', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT2H44M', isNonStop: true, totalFare: 355.09, totalTravelDistance: 947 },
  { legId: '5c132806994b4b0c7c87b90a7d1dfa2c', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT2H33M', isNonStop: true, totalFare: 398.6, totalTravelDistance: 947 },
  { legId: '43eaa7e045b3e8a3157e5e38a31696c9', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT2H35M', isNonStop: true, totalFare: 398.6, totalTravelDistance: 947 },
  { legId: '4228d70f70f9ebd1f8cbea9bda172e74', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT2H38M', isNonStop: true, totalFare: 398.6, totalTravelDistance: 947 },
  { legId: 'f089dc3fa43d8a196213d2140b766d55', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT4H40M', isNonStop: false, totalFare: 406.6, totalTravelDistance: 947 },
  { legId: '15ba869216430a466549c8efcd3bb109', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT5H25M', isNonStop: false, totalFare: 406.6, totalTravelDistance: 947 },
  { legId: '68063b78f62c81ac88820015908ac208', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT2H44M', isNonStop: true, totalFare: 410.18, totalTravelDistance: 947 },
  { legId: '758560f5ea68263f52f418286c8d6b7d', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT5H26M', isNonStop: false, totalFare: 511.6, totalTravelDistance: 947 },
  { legId: 'd3f144017875166ea860f4929a528fed', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'CLT', travelDuration: 'PT6H25M', isNonStop: false, totalFare: 387.6, totalTravelDistance: 1192 },
  { legId: '8a6ab300fc0b1f1aa1da065091f878fb', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'CLT', travelDuration: 'PT4H23M', isNonStop: false, totalFare: 388.6, totalTravelDistance: 868 },
  { legId: '33dba4888a3a68195d53ec2cc8b0a2d6', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'CLT', travelDuration: 'PT1H8M', isNonStop: true, totalFare: 398.6, totalTravelDistance: 228 },
  { legId: 'c845939967043028ed636265d9858c98', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'CLT', travelDuration: 'PT1H10M', isNonStop: true, totalFare: 398.6, totalTravelDistance: 228 },
  { legId: 'ce7fc430dda2de28280b107bbd9bdde9', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'CLT', travelDuration: 'PT1H11M', isNonStop: true, totalFare: 398.6, totalTravelDistance: 228 },
  { legId: 'd3f144017875166ea860f4929a528fed', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'CLT', travelDuration: 'PT6H25M', isNonStop: false, totalFare: 387.6, totalTravelDistance: 1192 },
  { legId: '8a6ab300fc0b1f1aa1da065091f878fb', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'CLT', travelDuration: 'PT4H23M', isNonStop: false, totalFare: 388.6, totalTravelDistance: 868 },
  { legId: '33dba4888a3a68195d53ec2cc8b0a2d6', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'CLT', travelDuration: 'PT1H8M', isNonStop: true, totalFare: 398.6, totalTravelDistance: 228 },
  { legId: 'c845939967043028ed636265d9858c98', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'CLT', travelDuration: 'PT1H10M', isNonStop: true, totalFare: 398.6, totalTravelDistance: 228 },
  { legId: 'ce7fc430dda2de28280b107bbd9bdde9', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'CLT', travelDuration: 'PT1H11M', isNonStop: true, totalFare: 398.6, totalTravelDistance: 228 },
  { legId: '755bc876091cb5997260bd99361b9e8e', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'CLT', travelDuration: 'PT1H11M', isNonStop: true, totalFare: 398.6, totalTravelDistance: 228 },
  { legId: '37fa5869a691efc56a308dc636280c68', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'CLT', travelDuration: 'PT1H13M', isNonStop: true, totalFare: 398.6, totalTravelDistance: 228 },
  { legId: 'e121392f988f65cb003643978e5c68d8', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'CLT', travelDuration: 'PT1H14M', isNonStop: true, totalFare: 398.6, totalTravelDistance: 228 },
  { legId: '0f4f714611896ddd63accedfa9050cd9', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'CLT', travelDuration: 'PT1H14M', isNonStop: true, totalFare: 398.6, totalTravelDistance: 228 },
  { legId: '270a3e706e403f1d6d383c127d1647e9', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'CLT', travelDuration: 'PT1H17M', isNonStop: true, totalFare: 398.6, totalTravelDistance: 228 },
  { legId: '99666577c217e0a6b54a17e2f8ab9a7b', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'CLT', travelDuration: 'PT1H21M', isNonStop: true, totalFare: 398.6, totalTravelDistance: 228 },
  { legId: 'dc2eda19b0499170f1f7f8c5a179ac07', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'CLT', travelDuration: 'PT1H22M', isNonStop: true, totalFare: 398.6, totalTravelDistance: 228 },
  { legId: 'a3538341dedeb12798f130dd6c1e1e01', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'CLT', travelDuration: 'PT1H26M', isNonStop: true, totalFare: 398.6, totalTravelDistance: 228 },
  { legId: 'c1b459e641c768522054510f828fef9c', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'CLT', travelDuration: 'PT1H30M', isNonStop: true, totalFare: 398.6, totalTravelDistance: 228 },
  { legId: 'eb1f503b7ddf16f50c7214ed53fa9409', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'CLT', travelDuration: 'PT10H57M', isNonStop: false, totalFare: 405.19, totalTravelDistance: 1192 },
  { legId: '2f16eb22d9347d4122949c3fb0a93445', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'CLT', travelDuration: 'PT5H6M', isNonStop: false, totalFare: 492.6, totalTravelDistance: 1307 },
  { legId: 'cc7ca757dcd0ff76b2f0b4eb37419886', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'CLT', travelDuration: 'PT5H52M', isNonStop: false, totalFare: 492.6, totalTravelDistance: 1307 },
  { legId: '530b3a529421fba4f8b0acea9ecd03b0', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'CLT', travelDuration: 'PT8H28M', isNonStop: false, totalFare: 492.6, totalTravelDistance: 1307 },
  { legId: 'adf4519f6153567d3fc4631363fb669a', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'CLT', travelDuration: 'PT9H48M', isNonStop: false, totalFare: 498.2, totalTravelDistance: 1307 },
  { legId: '1b2084397393607a0944ac52ea3f3075', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'CLT', travelDuration: 'PT12H11M', isNonStop: false, totalFare: 498.2, totalTravelDistance: 1307 },
  { legId: 'a291a2b5ac19223c3407cfec58d1fc24', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'CLT', travelDuration: 'PT8H48M', isNonStop: false, totalFare: 542.6, totalTravelDistance: 1675 },
  { legId: '010e9d6cf62242862111a515d5f47f5d', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'CLT', travelDuration: 'PT1H26M', isNonStop: true, totalFare: 559.6, totalTravelDistance: 228 },
  { legId: '3a3a69378bf84af8c2bbd5363f9e6641', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'CLT', travelDuration: 'PT12H', isNonStop: false, totalFare: 597.2, totalTravelDistance: 1307 },
  { legId: '5dcea6820b64516095a8fa4fcc987015', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'DEN', travelDuration: 'PT3H28M', isNonStop: true, totalFare: 133.98, totalTravelDistance: 1207 },
  { legId: '688b7651cc04606ca1d1a903753aa3ca', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'DEN', travelDuration: 'PT10H32M', isNonStop: false, totalFare: 194.58, totalTravelDistance: null },
  { legId: '60cde6285cef2ea1bf0bc492e5ea7d74', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'DEN', travelDuration: 'PT3H12M', isNonStop: true, totalFare: 296.61, totalTravelDistance: 1207 },
  { legId: '23120be745e40290c1fe4171c9d9e570', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'DEN', travelDuration: 'PT3H14M', isNonStop: true, totalFare: 296.61, totalTravelDistance: 1207 },
  { legId: '0b6c1dd547bb971cdc51b2ba090602de', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'DEN', travelDuration: 'PT3H17M', isNonStop: true, totalFare: 296.61, totalTravelDistance: 1207 },
  { legId: '4cf3ae8112e707a55d98c1fcd488c7b4', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'DEN', travelDuration: 'PT3H17M', isNonStop: true, totalFare: 296.61, totalTravelDistance: 1207 },
  { legId: 'e3ca34d6bf56e8178f4ad2e98c49beb8', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'DEN', travelDuration: 'PT3H17M', isNonStop: true, totalFare: 296.61, totalTravelDistance: 1207 },
  { legId: '7b9ffdda44b4772fa52108242efecc93', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'DEN', travelDuration: 'PT3H18M', isNonStop: true, totalFare: 296.61, totalTravelDistance: 1207 },
  { legId: '5261b16bb4ce9202a740a593e39e72da', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'DEN', travelDuration: 'PT3H19M', isNonStop: true, totalFare: 296.61, totalTravelDistance: 1207 },
  { legId: '9ca0e81111c683bec1012473feefd28f', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT2H29M', isNonStop: true, totalFare: 248.6, totalTravelDistance: 947 },
  { legId: '98685953630e772a098941b71906592b', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT2H30M', isNonStop: true, totalFare: 248.6, totalTravelDistance: 947 },
  { legId: '98d90cbc32bfbb05c2fc32897c7c1087', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT2H30M', isNonStop: true, totalFare: 248.6, totalTravelDistance: 947 },
  { legId: '969a269d38eae583f455486fa90877b4', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT2H32M', isNonStop: true, totalFare: 248.6, totalTravelDistance: 947 },
  { legId: '980370cf27c89b40d2833a1d5afc9751', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT2H34M', isNonStop: true, totalFare: 248.6, totalTravelDistance: 947 },
  { legId: '79eda9f841e226a1e2121d74211e595c', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT2H38M', isNonStop: true, totalFare: 248.6, totalTravelDistance: 947 },
  { legId: '9335fae376c38bb61263281779f469ec', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT4H12M', isNonStop: false, totalFare: 251.1, totalTravelDistance: 956 },
  { legId: '3904bf87f2d1daf334f1ae7e3b876028', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT5H18M', isNonStop: false, totalFare: 251.1, totalTravelDistance: 956 },
  { legId: 'd93988734c44a3c075d9efe373352507', searchDate: '2022-04-16', flightDate: '2022-04-17', startingAirport: 'ATL', destinationAirport: 'BOS', travelDuration: 'PT5H32M', isNonStop: false, totalFare: 251.1, totalTravelDistance: 956 }
];

// Function to populate the flights table with filtered flights
function populateFlightsTable(filteredFlights) {
  const flightsTable = document.getElementById('flightsTable').getElementsByTagName('tbody')[0];
  flightsTable.innerHTML = ''; // Clear existing rows

  filteredFlights.forEach(flight => {
    const row = flightsTable.insertRow();
    row.insertCell(0).textContent = flight.startingAirport; // From
    row.insertCell(1).textContent = flight.destinationAirport; // To
    row.insertCell(2).textContent = flight.travelDuration; // Duration
    row.insertCell(3).textContent = `$${flight.totalFare.toFixed(2)}`; // Fare
  });
}

// Function to filter flights based on user input
function filterFlights(from, to, date) {
  return flights.filter(
    flight => flight.startingAirport.toUpperCase() === from.toUpperCase() &&
      flight.destinationAirport.toUpperCase() === to.toUpperCase() &&
      flight.flightDate === date
  );
}

// Function to convert ISO 8601 duration to minutes
function parseDuration(duration) {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?/;
  const matches = duration.match(regex);
  const hours = parseInt(matches[1] || 0);
  const minutes = parseInt(matches[2] || 0);
  return hours * 60 + minutes;
}

// Function to predict the best flight based on sorting preference
function predictBestFlight(filteredFlights, sortBy) {
  if (filteredFlights.length === 0) {
    return null; // No flights found
  }

  // Sort flights based on the selected criteria
  switch (sortBy) {
    case 'fare':
      filteredFlights.sort((a, b) => a.totalFare - b.totalFare);
      break;
    case 'duration':
      filteredFlights.sort((a, b) => parseDuration(a.travelDuration) - parseDuration(b.travelDuration));
      break;
    case 'distance':
      filteredFlights.sort((a, b) => (a.totalTravelDistance || Infinity) - (b.totalTravelDistance || Infinity));
      break;
    case 'nonStop':
      filteredFlights.sort((a, b) => b.isNonStop - a.isNonStop); // Non-stop flights first
      break;
    default:
      // Default sorting by fare
      filteredFlights.sort((a, b) => a.totalFare - b.totalFare);
  }

  // Return the first flight in the sorted list (best flight)
  return filteredFlights[0];
}

// Event listener for the predict button
document.getElementById('predictButton').addEventListener('click', () => {
  const from = document.getElementById('from').value.trim();
  const to = document.getElementById('to').value.trim();
  const date = document.getElementById('date').value;
  const sortBy = document.getElementById('sortBy').value;

  if (!from || !to || !date) {
    alert('Please enter departure, arrival, and date.');
    return;
  }

  // Filter flights based on user input
  const filteredFlights = filterFlights(from, to, date);


  document.getElementById('form-container').style.display = "none"
  document.getElementById('result-container').style.display = "block"
  // Display filtered flights in the table
  populateFlightsTable(filteredFlights);


  // Predict and display the best flight based on sorting preference
  const bestFlight = predictBestFlight(filteredFlights, sortBy);

  if (bestFlight) {
    document.getElementById('resultText').innerHTML = `
    <strong>Best Flight Found:</strong><br>
      From: ${bestFlight.startingAirport}<br>
      To: ${bestFlight.destinationAirport}<br>
      Date: ${bestFlight.flightDate}<br>
      Duration: ${bestFlight.travelDuration}<br>
      Fare: $${bestFlight.totalFare.toFixed(2)}<br>
      Distance: ${bestFlight.totalTravelDistance || 'N/A'} miles
    `;
  } else {
    document.getElementById('resultText').textContent = 'No flights found for the given route and date.';
  }
});

// Populate the flights table with all flights on page load (optional)
populateFlightsTable(flights);