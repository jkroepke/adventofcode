package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Pos struct {
	Line int
	Char int
}

type Gear struct {
	Pos   Pos
	Parts []int
}

type Symbol struct {
	Pos    Pos
	Symbol string
}

type PartNumber struct {
	Number  int
	Symbols []Symbol
}

func main() {
	fmt.Println(day2())
}

func day2() any {
	bytes, err := os.ReadFile("input.txt")
	if err != nil {
		panic(err)
	}

	var chars [][]string
	var partNumbers []PartNumber
	var gears []Gear
	var result int

	lines := strings.Split(string(bytes), "\n")
	for _, line := range lines {
		chars = append(chars, strings.Split(line, ""))
	}

	for lineIndex, charLine := range chars {
		for charIndex, char := range charLine {
			if char == "*" {
				gears = append(gears, Gear{Pos: Pos{Line: lineIndex, Char: charIndex}})
			}
		}
	}

	for line, charLine := range chars {
		var partNumberBuffer string
		var symbolBuffer []Symbol

		for i := 0; i < len(charLine); i++ {
			if isNumber(charLine[i]) {
				partNumberBuffer += charLine[i]
				symbol := isPartNumber(chars, line, i)
				if symbol != nil {
					symbolBuffer = append(symbolBuffer, *symbol)
				}

				if i != len(charLine)-1 {
					continue
				}
			}

			if partNumberBuffer != "" && len(symbolBuffer) > 0 {
				partNumberInt, err := strconv.Atoi(partNumberBuffer)
				if err != nil {
					panic(err)
				}
				partNumbers = append(partNumbers, PartNumber{
					Number:  partNumberInt,
					Symbols: symbolBuffer,
				})
			}

			partNumberBuffer = ""
			symbolBuffer = []Symbol{}
		}
	}

	for i, gear := range gears {
		for _, partNumber := range partNumbers {
			for _, symbol := range partNumber.Symbols {
				if symbol.Symbol != "*" {
					continue
				}

				if symbol.Pos.Char == gear.Pos.Char && symbol.Pos.Line == gear.Pos.Line {
					gears[i].Parts = append(gears[i].Parts, partNumber.Number)
					break
				}
			}
		}
	}

	for _, gear := range gears {
		if len(gear.Parts) == 2 {
			result += gear.Parts[0] * gear.Parts[1]
		}
	}

	return result
}

func isPartNumber(chars [][]string, lineIndex int, charIndex int) *Symbol {
	var line []string
	if lineIndex != 0 {
		line = chars[lineIndex-1]
		if charIndex != 0 {
			if isSymbol(line[charIndex-1]) {
				return &Symbol{Symbol: line[charIndex-1], Pos: Pos{Line: lineIndex - 1, Char: charIndex - 1}}
			}
		}

		if isSymbol(line[charIndex]) {
			return &Symbol{Symbol: line[charIndex], Pos: Pos{Line: lineIndex - 1, Char: charIndex}}
		}

		if charIndex != len(line)-1 {
			if isSymbol(line[charIndex+1]) {
				return &Symbol{Symbol: line[charIndex+1], Pos: Pos{Line: lineIndex - 1, Char: charIndex + 1}}
			}
		}
	}

	line = chars[lineIndex]
	if charIndex != 0 {
		if isSymbol(line[charIndex-1]) {
			return &Symbol{Symbol: line[charIndex-1], Pos: Pos{Line: lineIndex, Char: charIndex - 1}}
		}
	}

	if isSymbol(line[charIndex]) {
		return &Symbol{Symbol: line[charIndex], Pos: Pos{Line: lineIndex, Char: charIndex}}
	}

	if charIndex != len(line)-1 {
		if isSymbol(line[charIndex+1]) {
			return &Symbol{Symbol: line[charIndex+1], Pos: Pos{Line: lineIndex, Char: charIndex + 1}}
		}
	}

	if lineIndex != len(chars)-1 {
		line = chars[lineIndex+1]
		if charIndex != 0 {
			if isSymbol(line[charIndex-1]) {
				return &Symbol{Symbol: line[charIndex-1], Pos: Pos{Line: lineIndex + 1, Char: charIndex - 1}}
			}
		}

		if isSymbol(line[charIndex]) {
			return &Symbol{Symbol: line[charIndex], Pos: Pos{Line: lineIndex + 1, Char: charIndex}}
		}

		if charIndex != len(line)-1 {
			if isSymbol(line[charIndex+1]) {
				return &Symbol{Symbol: line[charIndex+1], Pos: Pos{Line: lineIndex + 1, Char: charIndex + 1}}
			}
		}
	}

	return nil
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
