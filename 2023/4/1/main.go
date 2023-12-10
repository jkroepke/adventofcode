package main

import (
	"fmt"
	"math"
	"os"
	"regexp"
	"slices"
)

type Card struct {
	number         int
	winningNumbers []int
	givenNumbers   []int
	rightNumbers   []int
}

func main() {
	fmt.Println(day4())
}

func day4() any {
	bytes, err := os.ReadFile("input.txt")
	if err != nil {
		panic(err)
	}

	var cards []Card
	var result int

	matches := regexp.MustCompile(`Card\s+(\d+): ([\d ]+) \| ([\d ]+)`).FindAllStringSubmatch(string(bytes), -1)
	for _, card := range matches {
		var winningNumbers []int
		var givenNumbers []int
		var rightNumbers []int

		for _, number := range regexp.MustCompile(`(\d+)`).FindAllString(card[2], -1) {
			winningNumbers = append(winningNumbers, StringToInt(number))
		}

		for _, number := range regexp.MustCompile(`(\d+)`).FindAllString(card[3], -1) {
			givenNumbers = append(givenNumbers, StringToInt(number))
		}

		for _, number := range givenNumbers {
			if slices.Contains(winningNumbers, number) {
				rightNumbers = append(rightNumbers, number)
			}
		}

		cards = append(cards, Card{
			number:         StringToInt(card[1]),
			winningNumbers: winningNumbers,
			givenNumbers:   givenNumbers,
			rightNumbers:   rightNumbers,
		})

		cardValue := 0

		if len(rightNumbers) >= 1 {
			result += int(math.Pow(float64(2), float64(len(rightNumbers)-1)))
		}

		result += cardValue
	}

	return result
}
