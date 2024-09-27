package neofuncs
import (
	structures "main/structs"
	"net/http"
	"gorm.io/gorm"
	"encoding/json"
       )



func GetObjectInfo(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	defer r.Body.Close()
	// ["id / Name"] -> db > .First(&struct.NEO, {"id"})
	// struct.Response{Fetched : JSON>NEO}
	// for range [ENO]/
	// return JSON{reponse {NEO}}/
	// if err := json.NewEncoder(w).Encode(response); err != nil {print ...}
}

func AddObject(w http.ResponseWriter, r *http.Request, db *gorm.DB){
	// defer r.Body.Close()
	// var data map[string]interface{}
	// if err := json.NewDecoder().Decode(r.Body); err != nil {
	// }
	// struct.NEO{name data["name"].(string), moons.(float64).(uint)}
}
