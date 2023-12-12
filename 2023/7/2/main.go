package main

import (
	"fmt"
	"os"
	"sort"
	"strconv"
	"strings"

	"golang.org/x/exp/maps"
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
	CardJ
	Card2
	Card3
	Card4
	Card5
	Card6
	Card7
	Card8
	Card9
	CardT
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
		case isFiveKind(hand):
			game.FiveKinds = append(game.FiveKinds, hand)
		case isFourKind(hand):
			game.FourKinds = append(game.FourKinds, hand)
		case isFullHouse(hand):
			game.FullHouses = append(game.FullHouses, hand)
		case isThreeKind(hand):
			game.ThreeKinds = append(game.ThreeKinds, hand)
		case isTwoPairs(hand):
			game.TwoPairs = append(game.TwoPairs, hand)
		case isOnePair(hand):
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

func isFiveKind(hand Hand) bool {
	var jokers int
	if jokerNum, ok := hand.cardCount[CardJ]; ok {
		jokers = jokerNum
	}
	if jokers == 5 {
		return true
	}

	for cardType, count := range hand.cardCount {
		if cardType == CardJ {
			continue
		}
		if count == 5-jokers {
			return true
		}
	}
	return false
}

func isFourKind(hand Hand) bool {
	var jokers int
	if jokerNum, ok := hand.cardCount[CardJ]; ok {
		jokers = jokerNum
	}

	for cardType, count := range hand.cardCount {
		if cardType == CardJ {
			continue
		}
		if count == 4-jokers {
			return true
		}
	}
	return false
}

func isFullHouse(hand Hand) bool {
	var jokers int
	if jokerNum, ok := hand.cardCount[CardJ]; ok {
		jokers = jokerNum
	}
	var (
		have2 bool
		have3 bool
	)

	switch jokers {
	case 0:
		for _, count := range hand.cardCount {
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
	case 1:
		copyHand := hand
		copyHand.cardCount = maps.Clone(copyHand.cardCount)
		copyHand.cardCount[CardJ] = 0
		return isTwoPairs(copyHand) || isThreeKind(copyHand)
	case 2:
		return false
	default:
		return true
	}
}

func isThreeKind(hand Hand) bool {
	var jokers int
	if jokerNum, ok := hand.cardCount[CardJ]; ok {
		jokers = jokerNum
	}

	for _, count := range hand.cardCount {
		if count == 3-jokers {
			return true
		}
	}
	return false
}

func isTwoPairs(hand Hand) bool {
	var jokers int
	if jokerNum, ok := hand.cardCount[CardJ]; ok {
		jokers = jokerNum
	}

	var pair int

	switch jokers {
	case 0:
		for _, count := range hand.cardCount {
			if count == 2 {
				pair++
			}
		}
		return pair == 2
	case 1:
		for _, count := range hand.cardCount {
			if count == 2 {
				pair++
			}
		}
		return pair == 1
	default:
		return true
	}

}

func isOnePair(hand Hand) bool {
	var jokers int
	if jokerNum, ok := hand.cardCount[CardJ]; ok {
		jokers = jokerNum
	}

	for _, count := range hand.cardCount {
		if count == 2-jokers {
			return true
		}
	}
	return false
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
