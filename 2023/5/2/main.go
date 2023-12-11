package main

import (
	"fmt"
	"os"
	"regexp"
	"slices"
	"strconv"
	"strings"
	"sync"
)

type Map struct {
	next   string
	Ranges []Range
}

type Range struct {
	sourceMin   int
	sourceMax   int
	destination int
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
			sourceMin:   StringToInt(matches[1]),
			sourceMax:   StringToInt(matches[1]) + StringToInt(matches[2]) - 1,
		})

		maps[from] = entry
	}

	shards := 4
	results := make([]int, len(seeds)/2*shards)

	wg := sync.WaitGroup{}
	for j := 0; j < len(seeds); j += 2 {
		j := j
		wg.Add(shards)
		for k := 0; k < shards; k++ {
			k := k

			go func() {
				defer wg.Done()
				start := seeds[j] + seeds[j+1]/shards*k
				until := seeds[j] + seeds[j+1]/shards*(k+1)
				index := j/2*shards + k

				var seed int
				for l := start; l < until; l++ {
					seed = getLocation("seed", l)

					if seed <= 1 {
						fmt.Println(l, seed, seeds[j], seeds[j+1], start, until)
					}
					if results[index] == 0 || results[index] > seed {
						results[index] = seed
					}
				}
			}()
		}
	}

	wg.Wait()

	return slices.Min(results)
}

func getLocation(source string, number int) int {
	for _, nextRange := range maps[source].Ranges {
		if number >= nextRange.sourceMin && number <= nextRange.sourceMax {
			number = nextRange.destination + (number - nextRange.sourceMin)
			break
		}
	}

	if maps[source].next == "location" {
		return number
	}

	return getLocation(maps[source].next, number)
}

func StringToInt(s string) int {
	i, err := strconv.Atoi(s)
	if err != nil {
		panic(err)
	}
	return i
}
