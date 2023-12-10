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
	regex := regexp.MustCompile(`(\d|one|two|three|four|five|six|seven|eight|nine)`)
	regexRev := regexp.MustCompile(`(\d|` + reverse(`one|two|three|four|five|six|seven|eight|nine`) + `)`)

	for _, line := range input {
		firstDigit := regex.FindAllString(line, 1)
		lastDigit := regexRev.FindAllString(reverse(line), 1)

		lineDigitsString := translateDigit(firstDigit[0]) + translateDigit(lastDigit[0])
		lineDigits, err := strconv.Atoi(lineDigitsString)
		if err != nil {
			panic(err)
		}

		result += lineDigits
	}

	return result
}

func translateDigit(number string) string {
	switch number {
	case "one":
		fallthrough
	case reverse("one"):
		return "1"
	case "two":
		fallthrough
	case reverse("two"):
		return "2"
	case "three":
		fallthrough
	case reverse("three"):
		return "3"
	case "four":
		fallthrough
	case reverse("four"):
		return "4"
	case "five":
		fallthrough
	case reverse("five"):
		return "5"
	case "six":
		fallthrough
	case reverse("six"):
		return "6"
	case "seven":
		fallthrough
	case reverse("seven"):
		return "7"
	case "eight":
		fallthrough
	case reverse("eight"):
		return "8"
	case "nine":
		fallthrough
	case reverse("nine"):
		return "9"
	default:
		return number
	}
}

func reverse(str string) (result string) {
	for _, v := range str {
		result = string(v) + result
	}
	return
}
