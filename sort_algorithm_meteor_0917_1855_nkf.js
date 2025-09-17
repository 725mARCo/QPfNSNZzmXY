// 代码生成时间: 2025-09-17 18:55:35
// Import Meteor's core functionality
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

/**
 * Function to sort an array of numbers using the bubble sort algorithm.
 * @param {Array} arr - The array of numbers to sort.
 * @returns {Array} The sorted array.
 */
function bubbleSort(arr) {
  // Check if the input is an array
  if (!Array.isArray(arr)) {
    throw new Error('Input must be an array.');
  }

  // Check if all elements are numbers
  for (let i = 0; i < arr.length; i++) {
    check(arr[i], Number);
  }

  let swapped;
  do {
    swapped = false;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        let temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        swapped = true;
      }
    }
  } while (swapped);

  return arr;
}

// Example usage and error handling for the sort function
try {
  const unsortedArray = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
  const sortedArray = bubbleSort(unsortedArray);
  console.log('Sorted array:', sortedArray);
} catch (error) {
  console.error('Error:', error.message);
}

// Meteor method to allow server-side sorting
Meteor.methods({
  'sortArray': function(arr) {
    check(arr, [Number]); // Ensure the argument is an array of numbers
    return bubbleSort(arr);
  }
});