package structs
import "time"

type User struct {
	UserID       uint   `gorm:"primaryKey;autoIncrement"`
	Username     string `gorm:"unique"`
	Password     string
	GainedPoints string
	Badges       []Badge `gorm:"foreignKey:UserID"`
	TimeCreated	 time.Time `gorm:"autoCreateTime"` //the exact time user created the account [OPTIONAL]
}

type Badge struct {
	BadgeID   uint `gorm:"primaryKey;autoIncrement"`
	BadgeName string
	Points    uint
}

type Stat struct {
    StatID      uint   `gorm:"primaryKey;autoIncrement"`
	User        User   `gorm:"foreignKey:UserID"`
    UserID      uint   
    BadgeIDs    string 
	NumBadges	uint
	Rank		uint
	TimeSpent	string // a function will calc the time now - time created [OPTIONAL]
}

// recAction user interacts most with wich planet
type recAction struct{
	User        User   `gorm:"foreignKey:UserID"`
	UserID		uint
	VistedPlanets []NEOs `gorm:"foreignKey:PlanetID"`
}
type NEOs struct{
	PlanetID	uint	`gorm:"primaryKey;autoIncrement"`
	PlanetName	string
	Description string	
}
// Tierlist replaced with badges slice in user table
// idk what will u do with LOGs and idk understand what is it
// comment