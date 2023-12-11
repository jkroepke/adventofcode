package main

import (
	"fmt"
	"os"
	"regexp"
	"strings"
)

type Race struct {
	time        int
	distance    int
	buttonTimes []int
}

func main() {
	fmt.Println(day6())
}

func day6() any {
	bytes, err := os.ReadFile("input.txt")
	if err != nil {
		panic(err)
	}

	var races []Race

	lines := strings.Split(string(bytes), "\n")
	matches := regexp.MustCompile(`(\d+)`).FindAllString(lines[0], -1)
	for _, match := range matches {
		races = append(races, Race{time: StringToInt(match)})
	}
	matches = regexp.MustCompile(`(\d+)`).FindAllString(lines[1], -1)
	for i, match := range matches {
		races[i].distance = StringToInt(match)
	}

	var distance int
	result := 1

	for i, race := range races {
		for buttonTime := 1; buttonTime <= race.time; buttonTime++ {
			distance = (race.time - buttonTime) * (buttonTime)
			if distance > race.distance {
				races[i].buttonTimes = append(races[i].buttonTimes, buttonTime)
			}
		}
		fmt.Println(races[i].buttonTimes)
		result *= len(races[i].buttonTimes)
	}

	return result
}
