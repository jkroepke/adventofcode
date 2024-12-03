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

	mulMatches := reMul.FindAllStringSubmatch(string(memory), -1)

	var result int64

	for _, mul := range mulMatches {
		left, right, _ := strings.Cut(mul[1], ",")

		leftInt, _ := strconv.ParseInt(left, 10, 64)
		rightInt, _ := strconv.ParseInt(right, 10, 64)

		result += leftInt * rightInt
	}

	return strconv.FormatInt(result, 10)
}
