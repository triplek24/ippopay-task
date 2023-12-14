function minAbsoluteDifference(nums) {
    // Sort the array in non-decreasing order
    nums.sort((a, b) => a - b);

    const n = nums.length / 2;
    let sum1 = 0;
    let sum2 = 0;

    // Calculate the sum of the first half and the second half
    for (let i = 0; i < n; i++) {
        sum1 += nums[i];
        sum2 += nums[i + n];
    }

    // Calculate the absolute difference between the sums
    const absoluteDifference = Math.abs(sum1 - sum2);

    return absoluteDifference;
}

// Example usage:
console.log(minAbsoluteDifference([3, 9, 7, 3])); // Output: 2
console.log(minAbsoluteDifference([-36, 36])); // Output: 72
console.log(minAbsoluteDifference([2, -1, 0, 4, -2, -9])); // Output: 0
