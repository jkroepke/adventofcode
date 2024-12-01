package math

import (
	"slices"
	"sort"
)

// SortAsc sorts the given slice in ascending order.
func SortAsc[T []E, E ~int | ~int64 | ~uint | ~uint64 | ~float64](a T) {
	sort.Slice(a, func(i, j int) bool {
		return a[i] < a[j]
	})
}

// SortDesc sorts the given slice in descending order.
func SortDesc[T []E, E ~int | ~int64 | ~uint | ~uint64 | ~float64](a T) {
	sort.Slice(a, func(i, j int) bool {
		return a[i] > a[j]
	})
}

// Min returns the smallest number from the given numbers.
func Min[E ~int | ~int64 | ~uint | ~uint64 | ~float64](numbers ...E) E {
	return slices.Min(numbers)
}

// Max returns the largest number from the given numbers.
func Max[E ~int | ~int64 | ~uint | ~uint64 | ~float64](numbers ...E) E {
	return slices.Max(numbers)
}

// CountValues counts the occurrences of each value in the given slice.
func CountValues[T []E, E ~int | ~int64 | ~uint | ~uint64 | ~float64](a T) map[E]E {
	counts := make(map[E]E)
	for _, v := range a {
		counts[v]++
	}

	return counts
}
