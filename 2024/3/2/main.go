package main

import (
	"io"
	"log"
	"os"
	"regexp"
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
	memory, err := io.ReadAll(input)
	if err != nil {
		log.Fatalln(err)
	}

	reMul := regexp.MustCompile(`mul\(([0-9]{1,3},[0-9]{1,3})\)`)

	mulMatches := reMul.FindAllStringSubmatchIndex(string(memory), -1)

	reDonts := regexp.MustCompile(`don't\(\)`)

	mulDonts := reDonts.FindAllStringSubmatchIndex(string(memory), -1)

	reDos := regexp.MustCompile(`do\(\)`)

	mulDos := reDos.FindAllStringSubmatchIndex(string(memory), -1)

	var result int64

	for _, mul := range mulMatches {
		start := mul[0]

		var lastDoStart, lastDontsStart int

		for _, do := range mulDos {
			if do[0] > start {
				break
			}

			lastDoStart = do[0]
		}

		for _, dont := range mulDonts {
			if dont[0] > start {
				break
			}

			lastDontsStart = dont[0]
		}

		if lastDoStart < lastDontsStart {
			continue
		}

		left, right, _ := strings.Cut(string(memory[mul[2]:mul[3]]), ",")

		leftInt, _ := strconv.ParseInt(left, 10, 64)
		rightInt, _ := strconv.ParseInt(right, 10, 64)

		result += leftInt * rightInt
	}

	return strconv.FormatInt(result, 10)
}
