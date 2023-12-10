package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	fmt.Println(day2())
}

func day2() any {
	bytes, err := os.ReadFile("input.txt")
	if err != nil {
		panic(err)
	}

	input := strings.Split(string(bytes), "\n")

	var gamesFound []int
	var result int

	for _, line := range input {
		gameInfo := strings.Split(line, ":")
		if isPossible(gameInfo[1]) {
			gameNumber, err := strconv.Atoi(strings.Split(gameInfo[0], " ")[1])
			if err != nil {
				panic(err)
			}

			gamesFound = append(gamesFound, gameNumber)
			result += gameNumber
		}
	}

	return result
}

func isPossible(game string) bool {
	cubeSets := strings.Split(game, ";")

	for _, cubeSet := range cubeSets {
		cubes := strings.Split(cubeSet, ",")
		for _, cube := range cubes {
			cubeInfo := strings.Split(strings.TrimSpace(cube), " ")
			cubeCount, err := strconv.Atoi(cubeInfo[0])
			if err != nil {
				panic(err)
			}
			cubeColor := cubeInfo[1]

			if cubeColor == "red" && cubeCount > 12 {
				return false
			}

			if cubeColor == "green" && cubeCount > 13 {
				return false
			}

			if cubeColor == "blue" && cubeCount > 14 {
				return false
			}
		}
	}

	return true
}
