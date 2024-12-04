package main

import (
	"io"
	"iter"
	"log"
	"os"
	"strconv"
	"strings"
)

type report struct {
	order  int
	levels []int64
	safe   bool
}

func main() {
	file, err := os.Open("input.txt")
	if err != nil {
		log.Fatalln(err)
	}

	defer file.Close()

	log.Println(run(file, false))
}

func run(input io.Reader, debug bool) string {
	data, err := io.ReadAll(input)
	if err != nil {
		log.Fatal(err)
	}

	xySystem := NewXYSystem(string(data))
	aValueMatch := make([]XY, 0)

	for xy, value := range xySystem.Iterate() {
		if value == "A" {
			aValueMatch = append(aValueMatch, xy)
		}
	}

	var result int

	for _, xy := range aValueMatch {
		result += xySystem.isXMasShape(xy)
	}

	return strconv.FormatInt(int64(result), 10)
}

type XYSystem struct {
	system  [][]string
	xLength int
	yLength int
}

type XY struct {
	x int
	y int
}

func NewXYSystem(data string) XYSystem {
	var system [][]string
	for _, line := range strings.Split(strings.TrimSpace(data), "\n") {
		system = append(system, strings.Split(line, ""))
	}

	return XYSystem{system, len(system[0]), len(system)}
}

func (s XYSystem) Get(x, y int) string {
	if x < 0 || x >= s.xLength || y < 0 || y >= s.yLength {
		return ""
	}

	return s.system[y][x]
}

func (s XYSystem) Iterate() iter.Seq2[XY, string] {
	return func(yield func(XY, string) bool) {
		// we then loop continuously until we've gone through
		// our entire list of employees
		for y := range s.yLength {
			for x := range s.xLength {
				if !yield(XY{x, y}, s.Get(x, y)) {
					return
				}
			}
		}
	}
}

func (s XYSystem) SearchTop(xy XY, search string) int {
	search = search[1:]
	searchChars := strings.Split(search, "")

	for i := 0; i < len(searchChars); i++ {
		if s.Get(xy.x, xy.y-i-1) != searchChars[i] {
			return 0
		}
	}

	return 1
}

func (s XYSystem) SearchDown(xy XY, search string) int {
	search = search[1:]
	searchChars := strings.Split(search, "")

	for i := 0; i < len(searchChars); i++ {
		if s.Get(xy.x, xy.y+i+1) != searchChars[i] {
			return 0
		}
	}

	return 1
}

func (s XYSystem) SearchLeft(xy XY, search string) int {
	search = search[1:]
	searchChars := strings.Split(search, "")

	for i := 0; i < len(searchChars); i++ {
		if s.Get(xy.x-i-1, xy.y) != searchChars[i] {
			return 0
		}
	}

	return 1
}

func (s XYSystem) SearchRight(xy XY, search string) int {
	search = search[1:]
	searchChars := strings.Split(search, "")
	for i := 0; i < len(searchChars); i++ {
		if s.Get(xy.x+i+1, xy.y) != searchChars[i] {
			return 0
		}
	}

	return 1
}

func (s XYSystem) SearchDLTop(xy XY, search string) int {
	search = search[1:]
	searchChars := strings.Split(search, "")

	for i := 0; i < len(searchChars); i++ {
		if s.Get(xy.x-i-1, xy.y-i-1) != searchChars[i] {
			return 0
		}
	}

	return 1
}

func (s XYSystem) SearchDLDown(xy XY, search string) int {
	search = search[1:]
	searchChars := strings.Split(search, "")

	for i := 0; i < len(searchChars); i++ {
		if s.Get(xy.x-i-1, xy.y+i+1) != searchChars[i] {
			return 0
		}
	}

	return 1
}

func (s XYSystem) SearchDRTop(xy XY, search string) int {
	search = search[1:]
	searchChars := strings.Split(search, "")

	for i := 0; i < len(searchChars); i++ {
		if s.Get(xy.x+i+1, xy.y-i-1) != searchChars[i] {
			return 0
		}
	}

	return 1
}

func (s XYSystem) SearchDRDown(xy XY, search string) int {
	search = search[1:]
	searchChars := strings.Split(search, "")

	for i := 0; i < len(searchChars); i++ {
		if s.Get(xy.x+i+1, xy.y+i+1) != searchChars[i] {
			return 0
		}
	}

	return 1
}

func (s XYSystem) isXMasShape(xy XY) int {

	for _, searchChars := range []string{"SSMM", "MSSM", "MMSS", "SMMS"} {
		var subResult int
		subResult += s.SearchDRTop(xy, "A"+string(searchChars[0]))
		subResult += s.SearchDRDown(xy, "A"+string(searchChars[1]))
		subResult += s.SearchDLDown(xy, "A"+string(searchChars[2]))
		subResult += s.SearchDLTop(xy, "A"+string(searchChars[3]))

		if subResult == 4 {
			return 1
		}
	}

	return 0
}
