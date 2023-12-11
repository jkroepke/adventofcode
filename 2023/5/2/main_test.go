package main

import "testing"

func BenchmarkDay5(b *testing.B) {
	for i := 0; i < b.N; i++ {
		day5()
	}
}
