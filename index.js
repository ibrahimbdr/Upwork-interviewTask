const getTagCombinations = (metaValue) => {
  const tags = metaValue
    .split(/(Group_|Category_|Subcategory_|Make_|Model_|Diagram_)/)
    .filter((tag) => tag !== "");
  const categories = {
    Group: [],
    Category: [],
    Subcategory: [],
    Make: [],
    Model: [],
    Diagram: [],
  };

  for (let index = 0; index < tags.length - 1; index += 2) {
    if (tags[index] === "Group_") {
      categories.Group.push(tags[index] + tags[index + 1]);
    } else if (tags[index] === "Category_") {
      categories.Category.push(tags[index] + tags[index + 1]);
    } else if (tags[index] === "Subcategory_") {
      categories.Subcategory.push(tags[index] + tags[index + 1]);
    } else if (tags[index] === "Make_") {
      categories.Make.push(tags[index] + tags[index + 1]);
    } else if (tags[index] === "Model_") {
      categories.Model.push(tags[index] + tags[index + 1]);
    } else if (tags[index] === "Diagram_") {
      categories.Diagram.push(tags[index] + tags[index + 1]);
    }
  }

  let combinations = [];

  categories.Group.forEach((groupTag) => {
    if (categories.Category.length === 0) {
      categories.Category.push("");
    }
    categories.Category.forEach((categoryTag) => {
      if (categories.Subcategory.length === 0) {
        categories.Subcategory.push("");
      }
      categories.Subcategory.forEach((subcategoryTag) => {
        if (categories.Make.length === 0) {
          categories.Make.push("");
        }
        categories.Make.forEach((makeTag) => {
          if (categories.Model.length === 0) {
            categories.Model.push("");
          }
          categories.Model.forEach((modelTag) => {
            if (categories.Diagram.length === 0) {
              categories.Diagram.push("");
            }
            categories.Diagram.forEach((diagramTag) => {
              const combination = `${groupTag}${categoryTag}${subcategoryTag}${makeTag}${modelTag}${diagramTag}`;
              combinations.push(combination);
            });
          });
        });
      });
    });
  });

  return combinations;
};

// Test case 1
const metaValue1 = "Group_Electric-Pallet-Jack-Parts-Make_BT-Prime-Mover";
const combinations1 = getTagCombinations(metaValue1);
console.log(combinations1);

// Test case 2
const metaValue2 =
  "Group_Electric-Pallet-Jack-Parts-Category_Switches-Subcategory_Ignition-Switch";
const combinations2 = getTagCombinations(metaValue2);
console.log(combinations2);

////////////////////////////////////////////////////////////////////////

function findCombinationsFromText(combinationString) {
  let combinations = [];
  const filteredCombiationText = filterText(combinationString);
  let combinationsArr = combinationTextToArray(filteredCombiationText);
  combinationsArr.forEach((combinationElement, i) => {
    let combinationElementsArr = [];
    Array.from({ length: i + 1 }).forEach((ele, index) => {
      combinationElementsArr.push(combinationsArr[index]);
    });
    combinations.push(combinationElementsArr);
  });
  return combinations.reverse();
}

// Helper function

function filterText(string) {
  let specialCharsArr = ["--", "@", "%", "!", ")", "(", " ", ",", "&-", "&"];
  let filteredText = specialCharsArr.reduce((text, specialChar) => {
    return text.split(specialChar).join("");
  }, string);
  return filteredText;
}

// Helper function

function combinationTextToArray(combinationText) {
  const combinationTextArr = getCombinationTextArray(combinationText);

  const elementSet = new Set();
  let isRepeated = false;

  for (let i = 0; i < combinationTextArr.length; i++) {
    const element = combinationTextArr[i];

    if (elementSet.has(element)) {
      isRepeated = true;
      break;
    }

    elementSet.add(element);
  }

  if (isRepeated) {
    return [];
  }

  let joinedText = [];

  for (let i = 0; i < combinationTextArr.length - 1; i += 2) {
    const tag = combinationTextArr[i];
    const value = combinationTextArr[i + 1].replace(/(-)$/, "");

    const regex = /(Group_|Category_|Subcategory_|Make_|Model_|Diagram_)/;
    if (!regex.test(tag)) {
      joinedText = [];
      break;
    }

    joinedText.push(tag + value);
  }

  const orderMap = {
    Group_: 0,
    Category_: 1,
    Subcategory_: 2,
    Make_: 3,
    Model_: 4,
    Diagram_: 5,
  };

  joinedText.sort((a, b) => {
    const tagA = a.match(
      /(Group_|Category_|Subcategory_|Make_|Model_|Diagram_)/
    )?.[0];
    const tagB = b.match(
      /(Group_|Category_|Subcategory_|Make_|Model_|Diagram_)/
    )?.[0];
    return orderMap[tagA] - orderMap[tagB];
  });
  return joinedText;
}

// Helper function

function getCombinationTextArray(combinationText) {
  const result = splitTextByUnderscore(combinationText);
  let newText = combinationText;
  let arr = [];
  result.forEach((r) => {
    newText = newText.replace(r, "replacedText");
  });
  const result2 = newText.split("replacedText").splice(1);

  const combinedArray = [];
  const maxLength = Math.max(result.length, result2.length);

  for (let i = 0; i < maxLength; i++) {
    if (i < result.length) {
      combinedArray.push(result[i]);
    }
    if (i < result2.length) {
      combinedArray.push(result2[i]);
    }
  }

  return combinedArray;
}

// Test case 3

const textCombinations1 = findCombinationsFromText(
  "Group_Electric-Pallet-Jack-Parts, Category_Switches, Subcategory_Ignition-Switch"
);

console.log(textCombinations1);

// Test case 4

const textCombinations2 = findCombinationsFromText(
  "--Group_Electric-Pallet-Jack-Parts, Category_Switche@%s-!!, Subcategory_Ignition-Switch))@!%"
);

console.log(textCombinations2);

//Test case 5

const textCombinations3 = findCombinationsFromText(
  "Category_Switches-Group_Electric-Pallet-Jack-Parts-Subcategory_Ignition-Switch"
);

console.log(textCombinations3);

//Test case 6

const textCombinations4 = findCombinationsFromText(
  "Group_Tools-Hardware-Category_Roll-Pin-Make_Atlas"
);

console.log(textCombinations4);

//Test case 7

const textCombinations5 = findCombinationsFromText(
  "Group_Tools-Hardware-Category_Roll-Pin-Make_Atlas-Group_Test"
);

console.log(textCombinations5);

//Test case 8

const textCombinations6 = findCombinationsFromText(
  "Group_Tools-Hardware-Category_Roll-Pin-Make_Atlas-WrongPrefix_Test"
);

console.log(textCombinations6);

//Test case 9

const textCombinations7 = findCombinationsFromText(
  "Group_Tools-Hardware-Category_Roll-Pin-Make_U-Line-Model_H-1193"
);

console.log(textCombinations7);

//Test case 10

const textCombinations8 = findCombinationsFromText(
  "Group_Tools-Hardware-Category_Roll-Pin-Make_Multiton-Model_J"
);

console.log(textCombinations8);

//Test case 11

const textCombinations9 = findCombinationsFromText(
  "Make_Atlas-Model_Zenith-Type9-Diagram_Frame"
);

console.log(textCombinations9);

//Test case 12

const textCombinations10 = findCombinationsFromText("Group_Tools-&-Hardware");

console.log(textCombinations10);

//Test case 13

const textCombinations11 = findCombinationsFromText(
  "Group_Electric-Pallet-Jack-Parts-Category_Battery-Subcategory_Battery-Charger-Make_Hyster-Model_B218N26949L-UP"
);

console.log(textCombinations11);

//Test case 14

const textCombinations12 = findCombinationsFromText(
  "Group_Electric-Pallet-Jack-Parts-Category_Electric-Pallet-Jack-Lift-Parts-Subcategory_Yoke"
);

console.log(textCombinations12);

//Test case 15

const textCombinations13 = findCombinationsFromText(
  "Group_Industrial-Seal-Kits-Make_Yutani"
);

console.log(textCombinations13);

//Test case 16

const textCombinations14 = findCombinationsFromText(
  "Make_Atlas-Model_Zenith-Type9"
);

console.log(textCombinations14);

//Test case 17

const textCombinations15 = findCombinationsFromText(
  "Group_Wheel-Bearings-Category_Bearing-Wiper"
);

console.log(textCombinations15);

function splitTextByUnderscore(text) {
  const regex = /[^_-]+_/g;

  return text.match(regex);
}
