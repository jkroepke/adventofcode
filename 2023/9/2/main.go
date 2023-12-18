package main

import (
	"fmt"
	"os"
	"strings"
)

func main() {
	fmt.Println(day9())
}

func day9() any {
	var err error

	bytes, err := os.ReadFile("input.txt")
	if err != nil {
		panic(err)
	}

	lines := strings.Split(strings.TrimSpace(string(bytes)), "\n")
	sequences := make([][][]int, len(lines))

	for i, line := range lines {
		numbers := strings.Split(line, " ")
		sequences[i] = make([][]int, 1)
		sequences[i][0] = make([]int, len(numbers))

		for j, num := range numbers {
			sequences[i][0][j] = StringToInt(num)
		}
	}

	for i, sequence := range sequences {
		seq := 1

		dataset := sequence[0]

		for {
			sequences[i] = append(sequences[i], make([]int, len(dataset)-1))

			for j, _ := range dataset {
				if j != 0 {
					sequences[i][seq][j-1] = dataset[j] - dataset[j-1]
				}
			}

			dataset = sequences[i][seq]
			if AllZeros(dataset) {
				break
			}

			seq += 1
		}
	}

	var (
		result int
	)

	for i, sequence := range sequences {
		var calc int
		for j := len(sequence) - 2; j >= 0; j-- {
			a := sequences[i][j][0]
			b := sequences[i][j+1][0]
			calc = a - b
			sequences[i][j] = append([]int{calc}, sequences[i][j]...)
		}
		result += calc
	}

	return result
}

func AllZeros(input []int) bool {
	for _, num := range input {
		if num != 0 {
			return false
		}
	}
	return true
}
