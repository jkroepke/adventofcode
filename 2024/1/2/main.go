package main

import (
	"bufio"
	"bytes"
	"io"
	"log"
	"os"
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

	rightNumberCount := make(map[int64]int64, len(rightNumbers))
	for _, number := range rightNumbers {
		rightNumberCount[number]++
	}

	var score int64

	for _, leftNumber := range leftNumbers {
		score += leftNumber * rightNumberCount[leftNumber]
		if debug {
			log.Printf("leftNumber: %d, count: %d, score: %d\n", leftNumber, rightNumberCount[leftNumber], score)
		}
	}

	return strconv.FormatInt(score, 10)
}
