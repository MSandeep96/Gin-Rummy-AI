const getCombinationsUtil = (arr, idx = 0, helper = [], output = []): void => {
  if (idx == arr.length) {
    if (helper.length == 3) {
      output.push([...helper]);
    }
    return;
  }
  const temp = [...helper, arr[idx]];
  getCombinationsUtil(arr, idx + 1, temp, output);
  getCombinationsUtil(arr, idx + 1, helper, output);
};

export const getCombinationsWith3Elements = (arr) => {
  const output = [];
  getCombinationsUtil(arr, 0, [], output);
  return output;
};
