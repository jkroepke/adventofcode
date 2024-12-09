package main

import (
	"io"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestRun(t *testing.T) {
	for _, tc := range []struct {
		name   string
		debug  bool
		input  io.Reader
		answer string
	}{
		{
			name:  "Test1",
			debug: true,
			input: func() io.Reader {
				f, err := os.Open("inputs/test1.txt")
				if err != nil {
					t.Fatal(err)
				}
				return f
			}(),
			answer: "99",
		},
		{
			name:  "Test2",
			debug: true,
			input: func() io.Reader {
				f, err := os.Open("inputs/test2.txt")
				if err != nil {
					t.Fatal(err)
				}
				return f
			}(),
			answer: "1928",
		},
		{
			name:  "Puzzle",
			debug: false,
			input: func() io.Reader {
				f, err := os.Open("inputs/puzzle.txt")
				if err != nil {
					t.Fatal(err)
				}
				return f
			}(),
			answer: "6201130364722",
		},
	} {
		t.Run(tc.name, func(t *testing.T) {
			assert.Equal(t, tc.answer, run(tc.input, tc.debug))
		})
	}
}

func Test_GenerateDiskMap(t *testing.T) {
	for _, tc := range []struct {
		input  string
		answer []int
	}{
		{
			input: func() string {
				f, err := os.Open("inputs/test1.txt")
				if err != nil {
					t.Fatal(err)
				}

				data, err := io.ReadAll(f)
				if err != nil {
					t.Fatal(err)
				}

				return string(data)
			}(),
			answer: []int{1, 2, 3, 4, 5},
		},
		{
			input: func() string {
				f, err := os.Open("inputs/test2.txt")
				if err != nil {
					t.Fatal(err)
				}

				data, err := io.ReadAll(f)
				if err != nil {
					t.Fatal(err)
				}

				return string(data)
			}(),
			answer: []int{2, 3, 3, 3, 1, 3, 3, 1, 2, 1, 4, 1, 4, 1, 3, 1, 4, 0, 2},
		},
	} {
		t.Run(tc.input, func(t *testing.T) {
			assert.Equal(t, tc.answer, generateDiskMap(tc.input))
		})
	}
}

func Test_GenerateDiskLayout(t *testing.T) {
	for _, tc := range []struct {
		input  string
		answer []int
	}{
		{
			input: func() string {
				f, err := os.Open("inputs/test1.txt")
				if err != nil {
					t.Fatal(err)
				}

				data, err := io.ReadAll(f)
				if err != nil {
					t.Fatal(err)
				}

				return string(data)
			}(),
			answer: []int{
				0,
				-1, -1,
				1, 1, 1,
				-1, -1, -1, -1,
				2, 2, 2, 2, 2,
			},
		},
		{
			input: func() string {
				f, err := os.Open("inputs/test2.txt")
				if err != nil {
					t.Fatal(err)
				}

				data, err := io.ReadAll(f)
				if err != nil {
					t.Fatal(err)
				}

				return string(data)
			}(),
			answer: []int{
				0, 0,
				-1, -1, -1,
				1, 1, 1,
				-1, -1, -1,
				2,
				-1, -1, -1,
				3, 3, 3,
				-1,
				4, 4,
				-1,
				5, 5, 5, 5,
				-1,
				6, 6, 6, 6,
				-1,
				7, 7, 7,
				-1,
				8, 8, 8, 8,
				9, 9,
			},
		},
	} {
		t.Run(tc.input, func(t *testing.T) {
			assert.Equal(t, tc.answer, generateDiskLayout(generateDiskMap(tc.input)))
		})
	}
}

func Test_SortDisk(t *testing.T) {
	for _, tc := range []struct {
		name   string
		input  string
		answer []int
	}{
		{
			name: "Test1",
			input: func() string {
				f, err := os.Open("inputs/test1.txt")
				if err != nil {
					t.Fatal(err)
				}

				data, err := io.ReadAll(f)
				if err != nil {
					t.Fatal(err)
				}

				return string(data)
			}(),
			answer: []int{
				0,
				2, 2,
				1, 1, 1,
				2, 2, 2, -1,
				-1, -1, -1, -1, -1,
			},
		},
		{
			name: "Test2",
			input: func() string {
				f, err := os.Open("inputs/test2.txt")
				if err != nil {
					t.Fatal(err)
				}

				data, err := io.ReadAll(f)
				if err != nil {
					t.Fatal(err)
				}

				return string(data)
			}(),
			answer: []int{
				0, 0, 9, 9, 8, 1, 1, 1, 8, 8, 8, 2, 7, 7, 7, 3, 3, 3, 6, 4, 4, 6, 5, 5, 5, 5, 6, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
			},
		},
	} {
		t.Run(tc.name, func(t *testing.T) {
			assert.Equal(t, tc.answer, sortDisk(generateDiskLayout(generateDiskMap(tc.input))))
		})
	}
}
