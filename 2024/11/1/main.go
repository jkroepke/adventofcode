package main

import (
	"io"
	"log"
	"os"
	"slices"
	"strconv"
	"strings"
)

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
	stones := make([]int, 0, len(inputData))

	for _, stone := range inputData {
		stone, err := strconv.ParseInt(stone, 10, 64)
		if err != nil {
			log.Fatal(err)
		}

		stones = append(stones, int(stone))
	}

	for range 25 {
		stones = blink(stones)
	}

	return strconv.FormatInt(int64(len(stones)), 10)
}

func blink(stones []int) []int {
	for i := 0; i < len(stones); i++ {
		switch {
		case stones[i] == 0:
			stones[i] = 1
		case len(strconv.Itoa(stones[i]))%2 == 0:
			stringStone := strconv.Itoa(stones[i])
			newStringStone1 := stringStone[:len(stringStone)/2]
			newStringStone2 := stringStone[len(stringStone)/2:]

			newStone1, err := strconv.ParseInt(newStringStone1, 10, 64)
			if err != nil {
				log.Fatal(err)
			}

			newStone2, err := strconv.ParseInt(newStringStone2, 10, 64)
			if err != nil {
				log.Fatal(err)
			}

			stones[i] = int(newStone1)
			stones = slices.Insert(stones, i+1, int(newStone2))
			i++
		default:
			stones[i] = stones[i] * 2024
		}
	}

	return stones
}
