package structs

import (
	"encoding/json"
	"net/http"
)

type Response struct {
	WFM       string
	UFM       string
	Fetched   map[string]interface{}
	Additions map[string]interface{}
	FuncState bool // True done, False not.
}

func (r *Response) JSONifyResponse(w http.ResponseWriter) error {
	resp := map[string]interface{}{
		"WFM":       r.WFM,
		"UFM":       r.UFM,
		"Fetched":   r.Fetched,
		"Additions": r.Additions,
		"FS":        r.FuncState,
	}
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		return err
	}
	return nil
}
