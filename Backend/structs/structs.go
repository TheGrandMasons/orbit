package structs

import (
	"encoding/json"
	"net/http"
)

// Response struct represents the structure of the response returned from the database API.
type Response struct {
	WFM       string                 // WFM (assumed to be some status or message from the API)
	UFM       string                 // UFM (another status or message)
	Fetched   map[string]interface{} // Fetched holds data retrieved from the database
	Additions map[string]interface{} // Additions stores any extra data added to the response
	FuncState bool                   // True means function completed successfully, False means failure
}

// JSONifyResponse converts the Response struct into a JSON format and writes it to the HTTP response.
func (r *Response) JSONifyResponse(w http.ResponseWriter) error {
	resp := map[string]interface{}{ // Creates a map with key-value pairs to be encoded into JSON
		"WFM":       r.WFM,       // Add the WFM field to the response
		"UFM":       r.UFM,       // Add the UFM field to the response
		"Fetched":   r.Fetched,   // Add the fetched data
		"Additions": r.Additions, // Add any additional data
		"FS":        r.FuncState, // Add the function state (true or false)
	}
	// Encodes the map into JSON and writes it to the HTTP response writer (w)
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		return err // Returns an error if the encoding or writing fails
	}
	return nil // Returns nil if everything is successful.
}

// User struct represents a user entity with various attributes.
type User struct {
	ID       uint         `gorm:"primaryKey;autoIncrement"`
	Username string       // Username of the user
	Visits   int32        // Number of visits made by the user
	Favs     []Favourites // List of the user's favorite NEOs
}

// Favourites struct represents the user's favorite NEOs.
type Favourites struct {
	NEOID uint32 // ID of the favorite NEO
}

// NEO struct represents a Near-Earth Object with relevant attributes.
type NEO struct {
	ID              uint32 `gorm:"primaryKey;autoIncrement"` // Unique NEO ID, auto-incremented
	Name            string // Name of the NEO
	Visits          uint32 // Number of visits to the NEO
	DistanceFromSun uint32
	OrbitTime       uint32
	NEOType         string
	Moons           uint
	Description     string // Description of the NEO
}

// Visit struct represents a visit by a user, with a UserID and RandomKey.
type Visit struct {
	UserID    uint  // ID of the user who made the visit
	RandomKey int64 // RandomKey could represent some form of session or visit identifier
}
