package main

import (
	"fmt"
	"io"
	"os"
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
			answer: "4",
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
			answer: "18",
		},
		{
			name:  "Puzzle",
			debug: true,
			input: func() io.Reader {
				f, err := os.Open("inputs/puzzle.txt")
				if err != nil {
					t.Fatal(err)
				}
				return f
			}(),
			answer: "2642",
		},
	} {
		t.Run(tc.name, func(t *testing.T) {
			assert.Equal(t, tc.answer, run(tc.input, tc.debug))
		})
	}
}

func TestSearch(t *testing.T) {
	for _, tc := range []struct {
		XY    XY
		input io.Reader
		fn    string
	}{
		{
			XY: XY{2, 0},
			input: func() io.Reader {
				f, err := os.Open("inputs/test1.txt")
				if err != nil {
					t.Fatal(err)
				}
				return f
			}(),
			fn: "SearchDRDown",
		},
		{
			XY: XY{4, 1},
			input: func() io.Reader {
				f, err := os.Open("inputs/test1.txt")
				if err != nil {
					t.Fatal(err)
				}
				return f
			}(),
			fn: "SearchLeft",
		},
		{
			XY: XY{0, 3},
			input: func() io.Reader {
				f, err := os.Open("inputs/test1.txt")
				if err != nil {
					t.Fatal(err)
				}
				return f
			}(),
			fn: "SearchRight",
		},
		{
			XY: XY{1, 4},
			input: func() io.Reader {
				f, err := os.Open("inputs/test1.txt")
				if err != nil {
					t.Fatal(err)
				}
				return f
			}(),
			fn: "SearchTop",
		},
	} {
		t.Run(fmt.Sprintf("%d:%d", tc.XY.x, tc.XY.y), func(t *testing.T) {
			data, err := io.ReadAll(tc.input)
			require.NoError(t, err)

			system := NewXYSystem(string(data))

			var result int
			switch tc.fn {
			case "SearchDRDown":
				result = system.SearchDRDown(tc.XY, "XMAS")
			case "SearchLeft":
				result = system.SearchLeft(tc.XY, "XMAS")
			case "SearchRight":
				result = system.SearchRight(tc.XY, "XMAS")
			case "SearchTop":
				result = system.SearchTop(tc.XY, "XMAS")
			default:
				require.NoError(t, fmt.Errorf("unknown function %s", tc.fn))
			}

			assert.Equal(t, 1, result)
		})
	}
}
