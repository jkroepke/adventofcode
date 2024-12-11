package main

import (
	"io"
	_ "net/http/pprof"
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
			name:  "Puzzle",
			debug: false,
			input: func() io.Reader {
				f, err := os.Open("inputs/puzzle.txt")
				if err != nil {
					t.Fatal(err)
				}
				return f
			}(),
			answer: "198075",
		},
	} {
		t.Run(tc.name, func(t *testing.T) {
			// go http.ListenAndServe(":6060", http.DefaultServeMux)

			assert.Equal(t, tc.answer, run(tc.input, tc.debug))
		})
	}
}
