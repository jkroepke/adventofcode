package main

import (
	"io"
	"log"
	"os"
	"strconv"
	"strings"
)

type pageOrderRule struct {
	page1 int
	page2 int
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
	data, err := io.ReadAll(input)
	if err != nil {
		log.Fatal(err)
	}

	parts := strings.Split(strings.TrimSpace(string(data)), "\n\n")
	pageOrderRulesInputLines := strings.Split(parts[0], "\n")
	updatesInputLines := strings.Split(parts[1], "\n")

	orderRules := make([]pageOrderRule, 0, len(pageOrderRulesInputLines))

	for _, rule := range pageOrderRulesInputLines {
		page1String, page2String, _ := strings.Cut(rule, "|")
		page1, err := strconv.Atoi(page1String)
		if err != nil {
			log.Fatal(err)
		}
		page2, err := strconv.Atoi(page2String)
		if err != nil {
			log.Fatal(err)
		}

		orderRules = append(orderRules, pageOrderRule{page1: page1, page2: page2})
	}

	pageUpdates := make([][]int, 0, len(updatesInputLines))

	for _, updates := range updatesInputLines {
		pages := strings.Split(updates, ",")
		pageUpdates = append(pageUpdates, make([]int, len(pages)))

		for i, page := range pages {
			pageInt, err := strconv.Atoi(page)
			if err != nil {
				log.Fatal(err)
			}

			pageUpdates[len(pageUpdates)-1][i] = pageInt
		}
	}

	var result int

	for _, updates := range pageUpdates {
		if isUpdateRuleCorrect(updates, orderRules) {
			if debug {
				log.Println("Correct order:", updates)
				log.Printf("Middle page: %d\n", updates[len(updates)/2])
			}
			result += updates[len(updates)/2]
		}
	}

	return strconv.FormatInt(int64(result), 10)
}

func isUpdateRuleCorrect(pageUpdates []int, orderRules []pageOrderRule) bool {
	for i := range len(pageUpdates) - 1 {
		correctOrder := false
		for _, rule := range orderRules {
			if pageUpdates[i] == rule.page1 && pageUpdates[i+1] == rule.page2 {
				correctOrder = true
				break
			}
		}

		if !correctOrder {
			return false
		}
	}

	return true
}
