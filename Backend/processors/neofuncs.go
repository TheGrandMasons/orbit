package neofuncs

import (
	"encoding/json"
	"gorm.io/gorm"
	"log"
	structures "main/structs"
	"net/http"
	"strings"
)

// ["id / Name"] -> db > .First(&struct.NEO, {"id"})
// struct.Response{Fetched : JSON>NEO}
// for range [ENO]/
// return JSON{reponse {NEO}}/
// if err := json.NewEncoder(w).Encode(response); err != nil {print ...}

func GetObjectInfo(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	defer r.Body.Close()
	// parse id
	objectID := r.URL.Query().Get("id")
	if objectID == "" {
		http.Error(w, "Missing ID", http.StatusBadGateway)
		return
	}
	// Spliting ids then storing it as slice
	ids := strings.Split(objectID, ",")

	// Slice to store the fetched NEOs
	var neos []structures.NEO

	// Looping within each ID and fetch the corresponding NEO from the database
	for _, id := range ids {
		var neo structures.NEO
		if err := db.First(&neo, id).Error; err != nil {
			log.Println("Error fetching NEO with ID:", id, "Error:", err)
			http.Error(w, "NEO not found: "+id, http.StatusNotFound)
			return
		}
		// Appending NEO to the slice
		neos = append(neos, neo)
	}

	// Setting the Content-Type header to json
	w.Header().Set("Content-Type", "application/json")

	// Encoding  slice of NEOs into JSON and send response
	if err := json.NewEncoder(w).Encode(neos); err != nil {
		http.Error(w, "encoding response Error", http.StatusInternalServerError)
		return
	}

}
func AddObject(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	defer r.Body.Close()
	// making map for the data
	var data map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, "error while decoding", http.StatusBadRequest)
		return
	}

	// Initializing NEO struct using values from the data map and truncate any decimal point of float to uint for needed values
	neo := structures.NEO{
		Name:            data["name"].(string),                               // Matches json:"name"
		Visits:          uint32(data["visits"].(float64)),                   // Matches json:"visits"
		DistanceFromSun: uint32(data["distanceFromSun"].(float64)),          // Matches json:"distanceFromSun"
		OrbitTime:       uint32(data["orbitTime"].(float64)),                // Matches json:"orbitTime"
		NEOType:         data["neoType"].(string),                           // Matches json:"neoType"
		Moons:           uint(data["moons"].(float64)),                      // Matches json:"moons"
		Description:     data["description"].(string),                       // Matches json:"description"
	}

	// Checking required fields as name because its mandatory for object as it can be an identifier for it 
	// some other feilds may be without data as visits/moons of a Neo may be 0 as no one visit it or no moons 
	if neo.Name == "" {
		http.Error(w, "Name is required", http.StatusBadRequest)
		return
	}
	if neo.Description == "" {
		http.Error(w, "Description is required", http.StatusBadRequest)
		return
	}
	if neo.NEOType == "" {
		http.Error(w, "Type is required", http.StatusBadRequest)
		return
	}
	if neo.DistanceFromSun ==0 {
		http.Error(w, "distance cant be zero", http.StatusBadRequest)
		return
	}
	if neo.OrbitTime ==0 {
		http.Error(w, "invalid value for Orbit time", http.StatusBadRequest)
		return
	}

	// Create the object in database
	if result := db.Create(&neo); result.Error != nil {
		http.Error(w, "Error creating object", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(neo)
}

// defer r.Body.Close()
// var data map[string]interface{}
// if err := json.NewDecoder().Decode(r.Body); err != nil {
// }
// struct.NEO{name data["name"].(string), moons.(float64).(uint)}
