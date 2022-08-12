# BandaPixel-nodejs-test
Published: https://bandapixel-test.herokuapp.com

## Need to create REST API server with bearer token auth.
- [x] Setup `CORS` to allow access from any domain. 
- [x] DB - any. (I chose MySQL)
- [ ] Token should have expiration time 10 mins and extend it on any user request (except `singin`/`logout`)
### --- API endpoints ---
- [x] /signin [POST] - request for bearer token by `id` and `password`
- [x] /signup [POST] - creation of new user
	- Fields `id` and `password`. `Id` - phone number or email. After signup add field `id_type` - phone or email
	-	In case of successful signup - return token
- [x] /info [GET] - returns user id and id type
- [x] /latency [GET] - returns service server latency for `google.com`
- [x] /logout [GET] - with param `all`:
    -	`true` - removes all users bearer tokens
    -	`false` - removes only current token
    
## Additional from myself
- [ ] TypeScript
- [ ] Accesses by token middleware
- [x] Error Handler Middleware
- [ ] Tests (jest + supertest)
- [ ] CI/CD
- [ ] Docker
- [x] Add monitoring app integration (Mezmo)
- [x] Auto publish from Github to Heroku

# How to start app from Docker
...

# Architecture
...

# Database diagram
...

# Monitoring by Mezmo
...
