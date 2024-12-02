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
			name:  "Test",
			debug: true,
			input: func() io.Reader {
				f, err := os.Open("inputs/test1.txt")
				if err != nil {
					t.Fatal(err)
				}
				return f
			}(),
			answer: "2",
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
			answer: "1970720",
		},
	} {
		t.Run(tc.name, func(t *testing.T) {
			assert.Equal(t, tc.answer, run(tc.input, tc.debug))
		})
	}
}
