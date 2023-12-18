package main

import (
	"fmt"
	"os"
	"slices"
	"strings"
)

func main() {
	fmt.Println(day10())
}

type cursorType struct {
	x int
	y int
}

func day10() any {
	var err error

	bytes, err := os.ReadFile("input.txt")
	if err != nil {
		panic(err)
	}

	lines := strings.Split(strings.TrimSpace(string(bytes)), "\n")
	pipes := make([][]string, len(lines))
	cursor := cursorType{}

	for i, line := range lines {
		pipes[i] = strings.Split(line, "")
		for j, pipe := range pipes[i] {
			if pipe == "S" {
				cursor.x = j
				cursor.y = i
			}
		}
	}

	var result int

	if cursor.y > 0 && slices.Contains([]string{"|", "L", "F"}, pipes[cursor.y-1][cursor.x]) {
		result = walk(pipes, "W", cursorType{cursor.x - 1, cursor.y})
	} else if cursor.y < len(pipes)-1 && slices.Contains([]string{"|", "J", "7"}, pipes[cursor.y+1][cursor.x]) {
		result = walk(pipes, "O", cursorType{cursor.x + 1, cursor.y})
	} else if cursor.x > 0 && slices.Contains([]string{"-", "L", "J"}, pipes[cursor.y][cursor.x-1]) {
		result = walk(pipes, "S", cursorType{cursor.x, cursor.y - 1})
	} else if cursor.x < len(pipes[cursor.x])-1 && slices.Contains([]string{"-", "F", "7"}, pipes[cursor.y][cursor.x+1]) {
		result = walk(pipes, "N", cursorType{cursor.x, cursor.y + 1})
	} else {
		panic(cursor)
	}

	return result / 2
}

func walk(pipes [][]string, direction string, cursor cursorType) int {
	if pipes[cursor.y][cursor.x] == "." {
		return -1
	}

	var (
		path []cursorType
		pipe string
	)

	for {
		path = append(path, cursor)
		pipe = pipes[cursor.y][cursor.x]
		switch pipe {
		case "|":
			switch direction {
			case "N":
				cursor.y -= 1
			case "S":
				cursor.y += 1
			default:
				panic(direction)
			}
		case "-":
			switch direction {
			case "O":
				cursor.x += 1
			case "W":
				cursor.x -= 1
			default:
				panic(direction)
			}
		case "L":
			switch direction {
			case "S":
				cursor.x += 1
				direction = "O"
			case "W":
				cursor.y -= 1
				direction = "N"
			default:
				panic(direction)
			}
		case "J":
			switch direction {
			case "S":
				cursor.x -= 1
				direction = "W"
			case "O":
				cursor.y -= 1
				direction = "N"
			default:
				panic(direction)
			}
		case "7":
			switch direction {
			case "N":
				cursor.x -= 1
				direction = "W"
			case "O":
				cursor.y += 1
				direction = "S"
			default:
				panic(direction)
			}
		case "F":
			switch direction {
			case "N":
				cursor.x += 1
				direction = "O"
			case "W":
				cursor.y += 1
				direction = "S"
			default:
				panic(direction)
			}
		case "S":
			return len(path)
		default:
			panic(direction)
		}
	}
}
