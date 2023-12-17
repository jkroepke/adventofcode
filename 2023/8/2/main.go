package main

import (
	"fmt"
	"os"
	"regexp"
	"sort"
	"strings"
	"sync"
)

func main() {
	fmt.Println(day8())
}

type nodeType struct {
	left  string
	right string
}

func day8() any {
	bytes, err := os.ReadFile("input.txt")
	if err != nil {
		panic(err)
	}

	var steps []string

	nodes := map[string]nodeType{}
	var startNodes []string
	lines := strings.Split(strings.TrimSpace(string(bytes)), "\n")
	for i, line := range lines {
		if i == 0 {
			steps = strings.Split(line, "")
		} else if i >= 2 {
			matches := regexp.MustCompile(`(\S+) = \((\S+), (\S+)\)`).FindAllStringSubmatch(line, -1)

			nodes[matches[0][1]] = nodeType{left: matches[0][2], right: matches[0][3]}

			if strings.HasSuffix(matches[0][1], "A") {
				startNodes = append(startNodes, matches[0][1])
			}
		}
	}

	ch := make(chan int, len(startNodes))

	wg := sync.WaitGroup{}
	for _, startNode := range startNodes {
		wg.Add(1)
		go func(startNode string) {
			defer wg.Done()
			ch <- len(findNode(steps, 0, nodes, []string{startNode}))
		}(startNode)
	}
	wg.Wait()
	close(ch)

	var results []int

	for chResult := range ch {
		results = append(results, chResult)
	}

	sort.Ints(results)

	return LCM(results[0], results[1], results[2:]...)
}

func findNode(steps []string, stepCounter int, allNodes map[string]nodeType, nodes []string) string {
	direction := strings.Builder{}
	stepCount := len(steps) - 1
	var stepRounds int

	l := []byte("L")[0]
	r := []byte("R")[0]

	for {
		if allNodeFinished(nodes) {
			return strings.Repeat(strings.Join(steps, ""), stepRounds) + direction.String()
		}

		switch steps[stepCounter] {
		case "L":
			direction.WriteByte(l)
			for i, node := range nodes {
				nodes[i] = allNodes[node].left
			}
		case "R":
			direction.WriteByte(r)
			for i, node := range nodes {
				nodes[i] = allNodes[node].right
			}
		default:
			panic(stepCounter)
		}

		stepCounter += 1

		if stepCounter > stepCount {
			stepCounter = 0
			stepRounds += 1
			direction.Reset()
		}
	}
}

func allNodeFinished(nodes []string) bool {
	for _, node := range nodes {
		if !strings.HasSuffix(node, "Z") {
			return false
		}
	}
	return true
}
