// src/utilities/conversion.ts

export function stringToFloatArray(input: string) {
  try {
    return input.split(',').map((element) => {
      if (element.toUpperCase() != element) {
        throw new Error();
      }
      return parseFloat(element);
    });
  } catch {
    return [];
  }
}
