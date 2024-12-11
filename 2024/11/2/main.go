package main

import (
	"io"
	"log"
	"math"
	"os"
	"strconv"
	"strings"
)

var cache = map[int]map[int]int{}

func main() {
	file, err := os.Open("input.txt")
	if err != nil {
		log.Fatalln(err)
	}

	defer file.Close()

	log.Println(run(file, false))
}

func run(input io.Reader, debug bool) string {
	data, err := io.ReadAll(input)
	if err != nil {
		log.Fatal(err)
	}

	inputData := strings.Split(strings.TrimSpace(string(data)), " ")

	var numberOfStones int

	for _, stoneString := range inputData {
		stoneNumber, err := strconv.ParseInt(stoneString, 10, 32)
		if err != nil {
			log.Fatal(err)
		}

		numberOfStones += blink(0, int(stoneNumber))
	}

	return strconv.FormatInt(int64(numberOfStones), 10)
}

func blink(numBlink, stone int) int {
	if numBlink == 25 {
		return 1
	}

	if val, ok := cache[numBlink]; ok {
		if val, ok := val[stone]; ok {
			return val
		}
	} else {
		cache[numBlink] = map[int]int{}
	}

	var sum int

	if stone == 0 {
		sum = blink(numBlink+1, 1)
	} else if numDigits := lenLoop(stone); numDigits%2 == 0 {
		newStone1, newStone2 := splitNumber(stone, numDigits)

		sum = blink(numBlink+1, newStone1) + blink(numBlink+1, newStone2)
	} else {
		sum = blink(numBlink+1, stone*2024)
	}

	cache[numBlink][stone] = sum

	return sum
}

func lenLoop(i int) int {
	if i == 0 {
		return 1
	}
	count := 0
	for i != 0 {
		i /= 10
		count++
	}
	return count
}

func splitNumber(stone int, digitCount int) (int, int) {
	splitPoint := digitCount / 2
	splitDivisor := int(math.Pow10(splitPoint))
	return stone / splitDivisor, stone % splitDivisor
}
