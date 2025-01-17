# Dev_Tinder APIs

## Auth_Router
- POST / signup
- POST /login
- POST /logout

## Profile_Router
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password //forgot password

## connection Request Routhe
<!-- - POST /request/send/interested/:userId
- POST /request/send/ignored/:userId -->

- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId

<!-- - POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId -->

### Status : ignored , interested , accepted , rejected

## user Router
- GET /user/connections
- GET /user/requests/received
- GET /feed - Gets you the profiles of other users on platform