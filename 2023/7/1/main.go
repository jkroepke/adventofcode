package main

import (
	"fmt"
	"os"
	"sort"
	"strconv"
	"strings"
)

type Game struct {
	Winners    []Hand
	FiveKinds  []Hand
	FourKinds  []Hand
	FullHouses []Hand
	ThreeKinds []Hand
	TwoPairs   []Hand
	OnePair    []Hand
	HighCard   []Hand
}

type Hand struct {
	cards     string
	cardCount map[int]int
	value     int
	bid       int
}

const (
	_ = iota
	Card2
	Card3
	Card4
	Card5
	Card6
	Card7
	Card8
	Card9
	CardT
	CardJ
	CardQ
	CardK
	CardA
)

func NewCard(card string) int {
	switch card {
	case "A":
		return CardA
	case "K":
		return CardK
	case "Q":
		return CardQ
	case "J":
		return CardJ
	case "T":
		return CardT
	case "9":
		return Card9
	case "8":
		return Card8
	case "7":
		return Card7
	case "6":
		return Card6
	case "5":
		return Card5
	case "4":
		return Card4
	case "3":
		return Card3
	case "2":
		return Card2
	default:
		panic(card)
	}
}

func main() {
	fmt.Println(day7())
}

func day7() any {
	bytes, err := os.ReadFile("input.txt")
	if err != nil {
		panic(err)
	}

	var result int

	lines := strings.Split(string(bytes), "\n")

	game := Game{
		make([]Hand, 0),
		make([]Hand, 0),
		make([]Hand, 0),
		make([]Hand, 0),
		make([]Hand, 0),
		make([]Hand, 0),
		make([]Hand, 0),
		make([]Hand, 0),
	}

	for _, line := range lines {
		playerInfo := strings.Split(line, " ")
		hand := Hand{bid: StringToInt(playerInfo[1])}

		cards := strings.Split(playerInfo[0], "")
		hand.cards = playerInfo[0]
		hand.cardCount = make(map[int]int)
		hand.value = getCardValue(cards)

		for _, card := range cards {
			cardType := NewCard(card)
			if _, ok := hand.cardCount[cardType]; !ok {
				hand.cardCount[cardType] = 0
			}

			hand.cardCount[cardType]++
		}

		switch {
		case isFiveKind(hand.cardCount):
			game.FiveKinds = append(game.FiveKinds, hand)
		case isFourKind(hand.cardCount):
			game.FourKinds = append(game.FourKinds, hand)
		case isFullHouse(hand.cardCount):
			game.FullHouses = append(game.FullHouses, hand)
		case isThreeKind(hand.cardCount):
			game.ThreeKinds = append(game.ThreeKinds, hand)
		case isTwoPairs(hand.cardCount):
			game.TwoPairs = append(game.TwoPairs, hand)
		case isOnePair(hand.cardCount):
			game.OnePair = append(game.OnePair, hand)
		default:
			game.HighCard = append(game.HighCard, hand)
		}
	}

	sort.Slice(game.FiveKinds, func(i, j int) bool {
		return game.FiveKinds[i].value < game.FiveKinds[j].value
	})
	sort.Slice(game.FourKinds, func(i, j int) bool {
		return game.FourKinds[i].value < game.FourKinds[j].value
	})
	sort.Slice(game.FullHouses, func(i, j int) bool {
		return game.FullHouses[i].value < game.FullHouses[j].value
	})
	sort.Slice(game.ThreeKinds, func(i, j int) bool {
		return game.ThreeKinds[i].value < game.ThreeKinds[j].value
	})
	sort.Slice(game.TwoPairs, func(i, j int) bool {
		return game.TwoPairs[i].value < game.TwoPairs[j].value
	})
	sort.Slice(game.OnePair, func(i, j int) bool {
		return game.OnePair[i].value < game.OnePair[j].value
	})
	sort.Slice(game.HighCard, func(i, j int) bool {
		return game.HighCard[i].value < game.HighCard[j].value
	})

	game.Winners = append(game.Winners, game.HighCard...)
	game.Winners = append(game.Winners, game.OnePair...)
	game.Winners = append(game.Winners, game.TwoPairs...)
	game.Winners = append(game.Winners, game.ThreeKinds...)
	game.Winners = append(game.Winners, game.FullHouses...)
	game.Winners = append(game.Winners, game.FourKinds...)
	game.Winners = append(game.Winners, game.FiveKinds...)

	for place, hand := range game.Winners {
		result += (place + 1) * hand.bid
	}

	return result
}

func isFiveKind(cards map[int]int) bool {
	return len(cards) == 1
}

func isFourKind(cards map[int]int) bool {
	for _, count := range cards {
		if count == 4 {
			return true
		}
	}
	return false
}

func isFullHouse(cards map[int]int) bool {
	var (
		have2 bool
		have3 bool
	)
	for _, count := range cards {
		if count == 2 {
			have2 = true
			continue
		}
		if count == 3 {
			have3 = true
			continue
		}
	}
	return have3 && have2
}

func isThreeKind(cards map[int]int) bool {
	for _, count := range cards {
		if count == 3 {
			return true
		}
	}
	return false
}

func isTwoPairs(cards map[int]int) bool {
	return len(cards) == 3
}

func isOnePair(cards map[int]int) bool {
	return len(cards) == 4
}

func getCardValue(cards []string) int {
	sb := strings.Builder{}
	for _, card := range cards {
		card := NewCard(card)
		if card < 10 {
			sb.WriteString("0")
		}
		sb.WriteString(strconv.Itoa(card))
	}

	return StringToInt(sb.String())
}
