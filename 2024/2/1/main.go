package main

import (
	"bufio"
	"bytes"
	"io"
	"log"
	"os"
	"strconv"
)

type report struct {
	order  int
	levels []int64
	safe   bool
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

	reports := make([]report, 0)

	for scanner.Scan() {
		line := scanner.Bytes()

		numbers := bytes.Split(line, []byte(" "))
		if len(numbers) == 1 {
			log.Fatalf("invalid input: %s", string(line))
		}

		levels := make([]int64, 0, len(numbers))
		for _, number := range numbers {
			level, err := strconv.ParseInt(string(number), 10, 64)
			if err != nil {
				log.Fatalf("invalid input: %s", string(line))
			}

			levels = append(levels, level)
		}

		reports = append(reports, report{
			levels: levels,
		})
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}

	var result int64

	for j, report := range reports {
		for i := range len(report.levels) - 1 {
			if report.levels[i] < report.levels[i+1] {
				reports[j].order = 1
			} else if report.levels[i] > report.levels[i+1] {
				reports[j].order = -1
			}

			break
		}
	}

	for j, report := range reports {
		for i := range len(report.levels) - 1 {
			if report.order == 1 {
				if report.levels[i] > report.levels[i+1] {
					break
				}

				diff := report.levels[i+1] - report.levels[i]

				if diff < 1 || diff > 3 {
					break
				}
			} else if report.order == -1 {
				if report.levels[i] < report.levels[i+1] {
					break
				}

				diff := report.levels[i] - report.levels[i+1]

				if diff < 1 || diff > 3 {
					break
				}
			} else {
				break
			}

			if i == len(report.levels)-2 {
				reports[j].safe = true
				result++

				if debug {
					log.Printf("safe: %v", report.levels)
				}
			}
		}
	}

	return strconv.FormatInt(result, 10)
}
