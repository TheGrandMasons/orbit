package neofuncs

import "net/http"

func ServicesTester(w http.ResponseWriter, r *http.Request) {
	r.Header.Set("Content-Type", "appliction/json")
}
