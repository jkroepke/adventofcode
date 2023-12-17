package main

import (
	"fmt"
	"os"
	"regexp"
	"strings"
)

func main() {
	fmt.Println(day8())
}

type node struct {
	left  string
	right string
}

func day8() any {
	bytes, err := os.ReadFile("input.txt")
	if err != nil {
		panic(err)
	}

	var steps []string

	nodes := map[string]node{}
	lines := strings.Split(strings.TrimSpace(string(bytes)), "\n")
	for i, line := range lines {
		if i == 0 {
			steps = strings.Split(line, "")
		} else if i >= 2 {
			matches := regexp.MustCompile(`([A-Z]+) = \(([A-Z]+), ([A-Z]+)\)`).FindAllStringSubmatch(line, -1)

			nodes[matches[0][1]] = node{left: matches[0][2], right: matches[0][3]}
		}
	}

	return len(findNode(steps, 0, nodes, "AAA", ""))
}

func findNode(steps []string, stepCounter int, nodes map[string]node, node, direction string) string {
	if node == "ZZZ" {
		return direction
	}

	if stepCounter > len(steps)-1 {
		stepCounter = 0
	}

	var nextNode string

	if steps[stepCounter] == "L" {
		nextNode = nodes[node].left
		direction += "L"
	} else if steps[stepCounter] == "R" {
		nextNode = nodes[node].right
		direction += "R"
	} else {
		panic(stepCounter)
	}

	stepCounter += 1

	return findNode(steps, stepCounter, nodes, nextNode, direction)
}
