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
			answer: "1",
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
			answer: "9",
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

func Test_isXMasShape(t *testing.T) {
	for _, tc := range []struct {
		XY    XY
		input io.Reader
	}{
		{
			XY: XY{1, 1},
			input: func() io.Reader {
				f, err := os.Open("inputs/test1.txt")
				if err != nil {
					t.Fatal(err)
				}
				return f
			}(),
		},
		{
			XY: XY{6, 2},
			input: func() io.Reader {
				f, err := os.Open("inputs/test2.txt")
				if err != nil {
					t.Fatal(err)
				}
				return f
			}(),
		},
		{
			XY: XY{7, 2},
			input: func() io.Reader {
				f, err := os.Open("inputs/test2.txt")
				if err != nil {
					t.Fatal(err)
				}
				return f
			}(),
		},
	} {
		t.Run(fmt.Sprintf("%d:%d", tc.XY.x, tc.XY.y), func(t *testing.T) {
			data, err := io.ReadAll(tc.input)
			require.NoError(t, err)

			system := NewXYSystem(string(data))
			result := system.isXMasShape(tc.XY)

			assert.Equal(t, 1, result)
		})
	}
}
