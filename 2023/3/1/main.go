package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	fmt.Println(day2())
}

func day2() any {
	bytes, err := os.ReadFile("input.txt")
	if err != nil {
		panic(err)
	}

	var chars [][]string
	var partNumbers []string
	var result int

	lines := strings.Split(string(bytes), "\n")
	for _, line := range lines {
		chars = append(chars, strings.Split(line, ""))
	}

	for line, charLine := range chars {
		var partNumberBuffer string
		var partNumber bool

		for i := 0; i < len(charLine); i++ {
			if isNumber(charLine[i]) {
				partNumberBuffer += charLine[i]
				if !partNumber {
					partNumber = isPartNumber(chars, line, i)
				}

				if i != len(charLine)-1 {
					continue
				}
			}

			if partNumberBuffer != "" && partNumber {
				partNumbers = append(partNumbers, partNumberBuffer)
				partNumberInt, err := strconv.Atoi(partNumberBuffer)
				if err != nil {
					panic(err)
				}

				result += partNumberInt
				partNumber = false
			}

			partNumberBuffer = ""
		}
	}

	return result
}

func isPartNumber(chars [][]string, lineIndex int, charIndex int) bool {
	var line []string
	if lineIndex != 0 {
		line = chars[lineIndex-1]
		if charIndex != 0 {
			if isSymbol(line[charIndex-1]) {
				return true
			}
		}

		if isSymbol(line[charIndex]) {
			return true
		}

		if charIndex != len(line)-1 {
			if isSymbol(line[charIndex+1]) {
				return true
			}
		}
	}

	line = chars[lineIndex]
	if charIndex != 0 {
		if isSymbol(line[charIndex-1]) {
			return true
		}
	}

	if isSymbol(line[charIndex]) {
		return true
	}

	if charIndex != len(line)-1 {
		if isSymbol(line[charIndex+1]) {
			return true
		}
	}

	if lineIndex != len(chars)-1 {
		line = chars[lineIndex+1]
		if charIndex != 0 {
			if isSymbol(line[charIndex-1]) {
				return true
			}
		}

		if isSymbol(line[charIndex]) {
			return true
		}

		if charIndex != len(line)-1 {
			if isSymbol(line[charIndex+1]) {
				return true
			}
		}
	}

	return false
}

func isSymbol(char string) bool {
	return char != "." && !isNumber(char)
}

func isNumber(char string) bool {
	return char == "0" ||
		char == "1" ||
		char == "2" ||
		char == "3" ||
		char == "4" ||
		char == "5" ||
		char == "6" ||
		char == "7" ||
		char == "8" ||
		char == "9"
}
