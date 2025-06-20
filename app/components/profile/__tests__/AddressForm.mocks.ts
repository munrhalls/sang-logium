const correctAddresses = [
  {
    postcode: "SW1A 1AA",
    street: "Buckingham Palace Road",
    houseNumber: "1",
    city: "London",
  },
  {
    postcode: "M1 1AA",
    street: "Piccadilly",
    houseNumber: "1",
    city: "Manchester",
  },
  {
    postcode: "B1 1HQ",
    street: "Colmore Row",
    houseNumber: "1",
    city: "Birmingham",
  },
  {
    postcode: "LS1 1UR",
    street: "City Square",
    houseNumber: "1",
    city: "Leeds",
  },
  {
    postcode: "NE1 1EE",
    street: "Grey Street",
    houseNumber: "1",
    city: "Newcastle",
  },
  {
    postcode: "S1 1DA",
    street: "Howard Street",
    houseNumber: "1",
    city: "Sheffield",
  },
  {
    postcode: "CV1 1GN",
    street: "Broadgate",
    houseNumber: "1",
    city: "Coventry",
  },
  {
    postcode: "L1 1JQ",
    street: "Dale Street",
    houseNumber: "1",
    city: "Liverpool",
  },
  {
    postcode: "BS1 1DB",
    street: "Castle Street",
    houseNumber: "1",
    city: "Bristol",
  },
  { postcode: "OX1 1DP", street: "Carfax", houseNumber: "1", city: "Oxford" },
];

const slightlyIncorrectAddresses = [
  {
    postcode: "SW1A 1AB",
    street: "Buckingham Palace Road",
    houseNumber: "1",
    city: "London",
  },
  {
    postcode: "M1 1BA",
    street: "Piccadilly",
    houseNumber: "1",
    city: "Manchester",
  },
  {
    postcode: "B1 2HQ",
    street: "Colmore Row",
    houseNumber: "1",
    city: "Birmingham",
  },
  {
    postcode: "LS2 1UR",
    street: "City Square",
    houseNumber: "1",
    city: "Leeds",
  },
  {
    postcode: "NE1 1EF",
    street: "Grey Street",
    houseNumber: "1",
    city: "Newcastle",
  },
  {
    postcode: "S1 1DB",
    street: "Howard Street",
    houseNumber: "1",
    city: "Sheffield",
  },
  {
    postcode: "CV1 1GM",
    street: "Broadgate",
    houseNumber: "1",
    city: "Coventry",
  },
  {
    postcode: "L1 1JR",
    street: "Dale Street",
    houseNumber: "1",
    city: "Liverpool",
  },
  {
    postcode: "BS1 1DC",
    street: "Castle Street",
    houseNumber: "1",
    city: "Bristol",
  },
  { postcode: "OX1 1DQ", street: "Carfax", houseNumber: "1", city: "Oxford" },
];

const commonlyWrongAddresses = [
  {
    postcode: "NW1 6XE",
    street: "Main Street",
    houseNumber: "123",
    city: "London",
  },
  {
    postcode: "M1 1AA",
    street: "Piccadilly",
    houseNumber: "999",
    city: "Manchester",
  },
  {
    postcode: "B2 4QA",
    street: "Colmore Row",
    houseNumber: "1",
    city: "Birmingham",
  },
  {
    postcode: "LS1 1UR",
    street: "High Street",
    houseNumber: "1",
    city: "Leeds",
  },
  {
    postcode: "E1 6AN",
    street: "Grey Street",
    houseNumber: "1",
    city: "Newcastle",
  },
  {
    postcode: "S1 1DA",
    street: "Church Street",
    houseNumber: "1",
    city: "Sheffield",
  },
  {
    postcode: "SW1A 1AA",
    street: "Victoria Street",
    houseNumber: "10",
    city: "London",
  },
  {
    postcode: "M25 1AA",
    street: "Dale Street",
    houseNumber: "1",
    city: "Liverpool",
  },
  {
    postcode: "BS5 6TH",
    street: "Castle Street",
    houseNumber: "1",
    city: "Bristol",
  },
  {
    postcode: "OX2 8DP",
    street: "University Street",
    houseNumber: "1",
    city: "Oxford",
  },
];

const completelyIncorrectAddresses = [
  {
    postcode: "XX1 1XX",
    street: "Fake Street",
    houseNumber: "1",
    city: "London",
  },
  {
    postcode: "SW1A 1AA",
    street: "Nonexistent Road",
    houseNumber: "1",
    city: "Paris",
  },
  {
    postcode: "ABC 123",
    street: "Test Street",
    houseNumber: "1",
    city: "London",
  },
  {
    postcode: "M1 1AA",
    street: "Baker Street",
    houseNumber: "1",
    city: "Edinburgh",
  },
  {
    postcode: "12345",
    street: "Some Street",
    houseNumber: "1",
    city: "London",
  },
  {
    postcode: "B1 1HQ",
    street: "Mystery Lane",
    houseNumber: "0",
    city: "Birmingham",
  },
  {
    postcode: "ZZ9 9ZZ",
    street: "Imaginary Street",
    houseNumber: "1",
    city: "London",
  },
  {
    postcode: "NE1 1EE",
    street: "Random Road",
    houseNumber: "-5",
    city: "Newcastle",
  },
  { postcode: "S1 1DA", street: "", houseNumber: "1", city: "Sheffield" },
  {
    postcode: "",
    street: "Empty Postcode St",
    houseNumber: "1",
    city: "Oxford",
  },
];

export {
  correctAddresses,
  slightlyIncorrectAddresses,
  commonlyWrongAddresses,
  completelyIncorrectAddresses,
};
