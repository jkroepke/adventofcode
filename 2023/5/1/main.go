package main

import (
	"fmt"
	"os"
	"regexp"
	"strings"
)

type Map struct {
	next   string
	Ranges []Range
}

type Range struct {
	source      int
	destination int
	rangeLength int
}

var maps = map[string]Map{}

func main() {
	fmt.Println(day5())
}

func day5() any {
	bytes, err := os.ReadFile("input.txt")
	if err != nil {
		panic(err)
	}

	var result int
	var seeds []int
	var from string

	lines := strings.Split(string(bytes), "\n")
	for i, line := range lines {
		if line == "" {
			continue
		}

		if i == 0 {
			matches := regexp.MustCompile(`(\d+)`).FindAllString(line, -1)
			for _, match := range matches {
				seeds = append(seeds, StringToInt(match))
			}
			continue
		}

		if strings.Contains(line, "map:") {
			matches := regexp.MustCompile(`(\S+)-to-(\S+) map:`).FindAllStringSubmatch(line, -1)
			from = matches[0][1]
			maps[from] = Map{next: matches[0][2]}
			continue
		}

		matches := regexp.MustCompile(`(\d+)`).FindAllString(line, -1)
		entry := maps[from]
		entry.Ranges = append(entry.Ranges, Range{
			destination: StringToInt(matches[0]),
			source:      StringToInt(matches[1]),
			rangeLength: StringToInt(matches[2]),
		})
		maps[from] = entry
	}

	for _, seed := range seeds {
		seed = getLocation("seed", seed)
		if result == 0 || result > seed {
			result = seed
		}
	}

	return result
}

func getLocation(source string, number int) int {
	mapper := maps[source]

	for _, nextRange := range mapper.Ranges {
		if number >= nextRange.source && number < nextRange.source+nextRange.rangeLength {
			number = nextRange.destination + (number - nextRange.source)
			break
		}
	}

	if mapper.next == "location" {
		return number
	}

	return getLocation(mapper.next, number)
}
