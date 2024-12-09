package main

import (
	"io"
	"log"
	"os"
	"slices"
	"strconv"
	"strings"
)

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

	inputData := strings.TrimSpace(string(data))
	diskMap := generateDiskMap(inputData)
	diskLayout := generateDiskLayout(diskMap)

	return strconv.FormatInt(int64(calculateChecksum(sortDisk(diskLayout))), 10)
}

func generateDiskMap(input string) []int {
	parts := strings.Split(input, "")
	diskMap := make([]int, len(parts))

	var err error

	for i, part := range parts {
		diskMap[i], err = strconv.Atoi(part)
		if err != nil {
			log.Fatal(err)
		}
	}

	return diskMap
}

func generateDiskLayout(diskMap []int) []int {
	var diskLayout []int

	var fileID int

	for i, entry := range diskMap {
		if i%2 == 0 {
			diskLayout = append(diskLayout, slices.Repeat([]int{fileID}, entry)...)
			fileID++
		} else {
			diskLayout = append(diskLayout, slices.Repeat([]int{-1}, entry)...)
		}
	}

	return diskLayout
}

func sortDisk(diskLayout []int) []int {
	var firstFreeSpace int

	for i := len(diskLayout) - 1; i >= 0; i-- {
		if diskLayout[i] == -1 {
			continue
		}

		if firstFreeSpace >= i {
			break
		}

		for j := firstFreeSpace; j < len(diskLayout); j++ {
			if j > i {
				break
			}

			if diskLayout[j] == -1 {
				firstFreeSpace = j
				diskLayout[j], diskLayout[i] = diskLayout[i], diskLayout[j]
				break
			}
		}
	}

	return diskLayout
}

func calculateChecksum(diskLayout []int) int {
	var checksum int

	for i, entry := range diskLayout {
		if entry == -1 {
			break
		}

		checksum += i * entry
	}

	return checksum
}
