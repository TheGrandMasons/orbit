package main

import (
	"fmt"
	structures "main/structs"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func main() {
	db, err := gorm.Open(sqlite.Open("orbit_data.db"), &gorm.Config{})
	if err != nil {
		fmt.Println("Running Error . Error ['Cannot open database'].")
		fmt.Println("Mango Juice")
		return
	}
	db.AutoMigrate(&structures.User{}, &structures.Favourites{}, &structures.NEO{}, &structures.Visit{})
}
