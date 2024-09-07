package neofuncs

import (
	"encoding/json"
	structures "main/structs"
	"net/http"

	"gorm.io/gorm"
)

func Register(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	defer r.Body.Close()
	var data map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		resp := structures.Response{
			WFM:       "BAD_BODY",
			UFM:       "Sorry, It's an internal error.",
			Fetched:   nil,
			Additions: nil,
			FuncState: false,
		}
		resp.JSONifyResponse(w)
		return
	}
	var existingUser structures.User
	if err := db.Where("username =  ?", data["username"].(string)).First(&existingUser).Error; err == nil {
		resp := structures.Response{
			WFM:       "USERNAME_EXISTS",
			UFM:       "Sorry, This username exists",
			Fetched:   nil,
			Additions: nil,
			FuncState: false,
		}
		resp.JSONifyResponse(w)
		return
	}
	db.Create(&structures.User{Username: data["username"].(string), Visits: 0})
	resp := structures.Response{
		WFM:       "USER_CREATED",
		UFM:       "",
		Fetched:   nil,
		Additions: nil,
		FuncState: true,
	}
	resp.JSONifyResponse(w)
}

func GetUserInfo(w http.ResponseWriter, r *http.Request, db gorm.DB) {
	defer r.Body.Close()
	var data map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		resp := structures.Response{
			WFM:       "BAD_BODY",
			UFM:       "Sorry, It's an internal error.",
			Fetched:   nil,
			Additions: nil,
			FuncState: false,
		}
		resp.JSONifyResponse(w)
		return
	}
	var user structures.User
	if err := db.First(user, data["id"]).Error; err != nil {
		resp := structures.Response{
			WFM:       "CANNOT_FIND_RECORD",
			UFM:       "Sorry, It's an internal error.",
			Fetched:   nil,
			Additions: nil,
			FuncState: false,
		}
		resp.JSONifyResponse(w)
		return
	}
	resp := structures.Response{
		WFM:       "DATA_RETURNED",
		UFM:       "",
		Fetched:   map[string]interface{}{"username": user.Username, "Visits": user.Visits, "Favourites": user.Favs},
		Additions: nil,
		FuncState: true,
	}
	resp.JSONifyResponse(w)
	return
}
