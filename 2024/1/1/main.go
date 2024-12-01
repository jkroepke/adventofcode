package main

import (
	"bufio"
	"bytes"
	"io"
	"log"
	"math"
	"os"
	"sort"
	"strconv"
)

type numberPair struct {
	left  int64
	right int64
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
	scanner := bufio.NewScanner(input)

	var leftNumbers []int64
	var rightNumbers []int64

	for scanner.Scan() {
		line := scanner.Bytes()

		numbers := bytes.Split(line, []byte("   "))
		if len(numbers) != 2 {
			log.Fatalf("invalid input: %s", string(line))
		}

		leftNumber, err := strconv.ParseInt(string(numbers[0]), 10, 64)
		if err != nil {
			log.Fatalf("invalid input: %s", string(line))
		}

		rightNumber, err := strconv.ParseInt(string(numbers[1]), 10, 64)
		if err != nil {
			log.Fatalf("invalid input: %s", string(line))
		}

		leftNumbers = append(leftNumbers, leftNumber)
		rightNumbers = append(rightNumbers, rightNumber)
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}

	sort.Slice(leftNumbers, func(i, j int) bool {
		return leftNumbers[i] < leftNumbers[j]
	})
	sort.Slice(rightNumbers, func(i, j int) bool {
		return rightNumbers[i] < rightNumbers[j]
	})

	smallestNumber := make([]numberPair, len(leftNumbers))

	for i := range len(smallestNumber) {
		leftNumber := leftNumbers[i]
		rightNumber := rightNumbers[i]

		smallestNumber[i] = numberPair{leftNumber, rightNumber}
	}

	var distance int64

	for _, pair := range smallestNumber {
		distance += int64(math.Abs(float64(pair.left - pair.right)))
	}

	return strconv.FormatInt(distance, 10)
}

func findSmallestNumber(numbers []int64) int64 {
	smallestNumber := numbers[0]
	var smallestNumberIndex int

	for i, number := range numbers {
		if number < smallestNumber {
			smallestNumber = number
			smallestNumberIndex = i
		}
	}

	numbers[smallestNumberIndex] = math.MaxInt64

	return smallestNumber
}
