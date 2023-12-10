package main

import (
	"fmt"
	"os"
	"regexp"
	"slices"
)

type Card struct {
	number         int
	winningNumbers []int
	givenNumbers   []int
	rightNumbers   []int
	copies         int
}

func main() {
	fmt.Println(day4())
}

func day4() any {
	bytes, err := os.ReadFile("input.txt")
	if err != nil {
		panic(err)
	}

	var result int

	matches := regexp.MustCompile(`Card\s+(\d+): ([\d ]+) \| ([\d ]+)`).FindAllStringSubmatch(string(bytes), -1)
	cards := make([]Card, len(matches))
	for i, card := range matches {
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

		cards[i].number = StringToInt(card[1])
		cards[i].winningNumbers = winningNumbers
		cards[i].givenNumbers = givenNumbers
		cards[i].rightNumbers = rightNumbers

		if len(rightNumbers) >= 1 {
			for j := 1; j <= len(rightNumbers); j++ {
				cards[i+j].copies += 1 + cards[i].copies
			}
		}

		result += 1 + cards[i].copies
	}

	return result
}
