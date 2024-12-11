package main

import (
	"io"
	"os"
	"strconv"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
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

func Test_blink(t *testing.T) {
	for _, tc := range []struct {
		name   string
		input  string
		num    int
		answer []int
	}{
		{
			name: "test1",
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
			num:    1,
			answer: []int{253000, 1, 7},
		},
	} {
		t.Run(tc.name, func(t *testing.T) {
			inputData := strings.Split(strings.TrimSpace(string(tc.input)), " ")
			stones := make([]int, 0, len(inputData))

			for _, stone := range inputData {
				stone, err := strconv.ParseInt(stone, 10, 64)
				require.NoError(t, err)

				stones = append(stones, int(stone))
			}

			for range tc.num {
				stones = blink(stones)
			}

			assert.Equal(t, tc.answer, stones)
		})
	}
}
