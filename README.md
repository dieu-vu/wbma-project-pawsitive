# Welcome to Pawsitive app!

Pawsitive app - group project in Web-based mobile App course at Metropolia.

🐾 Every pet parent wants the absolute best for their pets. Pawsitive provides a platform where the pet owners can find trustworthy pet sitters nearby when they need.

## Idea:

A mobile app to connect pet owners and pet sitters.

Users can:

- share media with location [📍](https://emojipedia.org/round-pushpin/)
- browse listings with map [🗺️](https://emojipedia.org/world-map/)
- search by multiple criteria [🐕](https://emojipedia.org/dog/)
- contact each other [💬](https://emojipedia.org/speech-balloon/)
- give ratings 📱
- subscribe to other's posts and view own posts' subscribers information 🔔

### App screens

<img  src="/assets/login.jpeg"  width="100" height="210">
<img  src="/assets/home.jpeg"  width="100" height="210">
<img  src="/assets/upload.jpeg"  width="100" height="210">
<img  src="/assets/single.jpeg"  width="100" height="210">
<img  src="/assets/map-listing.jpeg"  width="100" height="210">

## Installation

Clone the project

```
git clone https://github.com/dieu-vu/wbma-project-pawsitive.git pawsitive-app
cd pawsitive-app
```

Install [Expo CLI](https://docs.expo.dev/workflow/expo-cli/?redirected): `npm install -g expo-cli`

Install: `npm install`

Run Project Locally: `expo start` or `npm start`

## Backend:

[Metropolia's Media API docs](https://media.mw.metropolia.fi/wbma/docs/)

## Bugs reported and fixed from demo session on 9th March 2022 at Metropolia, Karamalmi campus:

1.  Chat: Refresh Chat FlatList on pull action
2.  Upload: Show error message when price input is in the wrong format
3.  Favorites list: Fix the issue of the media from other apps that have issues in JSON parse
4.  Single Media view: Bookmark/Favourite animation button change play to black color after saving favorites. Allow user to click again to remove favorite and reset animation bookmark button’s color.

## Current issues

`PayloadTooLargeError: request entity too large` when loading the app. Several filtering operations with payload from the shared backend make the app slow down.

## Contributors

[Dieu Vu](https://github.com/dieu-vu), [Sam Hämälainen](https://github.com/SamHamalainen), [Mikko Suhonen](https://github.com/miksunGitHub)

With guidance and teaching from teachers: Ilkka Kylmäniemi, Ulla Sederlöf, Matti Peltoniemi, Janne Valkeapää.
