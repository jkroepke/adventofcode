package main

import (
	"fmt"
	"io"
	"log"
	"math"
	"os"
	"strconv"
	"strings"
	"time"
)

type stonePair struct {
	stone1 int
	stone2 int
}

var cache = map[int]stonePair{}

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

	stones := make([]int, len(inputData))

	for _, stoneString := range inputData {
		stoneNumber, err := strconv.ParseInt(stoneString, 10, 32)
		if err != nil {
			log.Fatal(err)
		}

		stones = append(stones, int(stoneNumber))
	}

	for i := range 75 {
		start := time.Now()

		blink(&stones)

		fmt.Printf("Iteration %d took %v\n", i, time.Since(start))
	}

	return strconv.FormatInt(int64(len(stones)), 10)
}

func blink(stones *[]int) {
	for i, stone := range *stones {
		if stone == 0 {
			(*stones)[i] = 1
		} else if cache, ok := cache[stone]; ok {
			newStone1, newStone2 := cache.stone1, cache.stone2
			(*stones)[i] = newStone1

			if newStone2 != -1 {
				*stones = append(*stones, newStone2)
			}
		} else if numDigits := lenLoop(stone); numDigits%2 == 0 {
			newStone1, newStone2 := splitNumber(stone, numDigits)

			(*stones)[i] = newStone1
			*stones = append(*stones, newStone2)
		} else {
			(*stones)[i] *= 2024
		}
	}
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
