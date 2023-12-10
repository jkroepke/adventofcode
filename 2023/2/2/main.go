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

	var result int

	for _, line := range input {
		gameInfo := strings.Split(line, ":")
		colors := getMinimumCubeColors(gameInfo[1])
		result += colors.Blue * colors.Green * colors.Red
	}

	return result
}

type Cubes struct {
	Green int
	Blue  int
	Red   int
}

func getMinimumCubeColors(game string) Cubes {
	colors := Cubes{}

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

			if cubeColor == "red" && cubeCount > colors.Red {
				colors.Red = cubeCount
			}

			if cubeColor == "green" && cubeCount > colors.Green {
				colors.Green = cubeCount
			}

			if cubeColor == "blue" && cubeCount > colors.Blue {
				colors.Blue = cubeCount
			}
		}
	}

	return colors
}
