package main

import (
	"bufio"
	"bytes"
	"io"
	"log"
	"math"
	"os"
	"slices"
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

	slices.Sort(leftNumbers)
	slices.Sort(rightNumbers)

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
