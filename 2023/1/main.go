package main

import (
	"fmt"
	"os"
	"regexp"
	"strconv"
	"strings"
)

func main() {
	fmt.Println(day1())
}

func day1() any {
	bytes, err := os.ReadFile("input.txt")
	if err != nil {
		panic(err)
	}

	input := strings.Split(string(bytes), "\n")

	result := 0

	for _, line := range input {
		numbers := regexp.MustCompile("(\\d)").FindAllString(line, -1)

		lineNumberString := numbers[0] + numbers[len(numbers)-1]
		lineNumber, err := strconv.Atoi(lineNumberString)
		if err != nil {
			panic(err)
		}
		fmt.Println(lineNumber)
		result += lineNumber
	}

	return result
}
