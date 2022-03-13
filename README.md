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
- subscribe to other's posts and view your posts' subscribers information 🔔

### App screens

<p float='left'>
<img  src="/assets/screens/login.jpeg"  width="200" height="420">
<img  src="/assets/screens/home.jpeg"  width="200" height="420">
<img  src="/assets/screens/drawer.jpeg"  width="200" height="420">
<img  src="/assets/screens/upload.jpeg"  width="200" height="420">
<img  src="/assets/screens/map-listing.jpeg"  width="200" height="420">
<img  src="/assets/screens/single.jpeg"  width="200" height="420">
<img  src="/assets/screens/chat.jpeg"  width="200" height="420">
</p>

### [Screen recording on iOS]()

### [Screen recording on Android]()

## Installation

- Clone the project

```
git clone https://github.com/dieu-vu/wbma-project-pawsitive.git pawsitive-app
cd pawsitive-app
```

- Install [Expo CLI](https://docs.expo.dev/workflow/expo-cli/?redirected): `npm install -g expo-cli`

- Install npm packages: `npm install`

- Run Project Locally: `expo start` or `npm start`

## Backend:

[Metropolia's Media API docs](https://media.mw.metropolia.fi/wbma/docs/)

## Bugs reported and fixed from demo session

_on 9th March 2022 at Metropolia, Karamalmi campus_

1.  Chat:

- Refresh Chat FlatList on pull action.
- Fix positioning so that use's own messages will always be on the right.
- Prevent chat menu being crashed due to user's comment on another app.
- There can be some delay in retrieving chat threads from backend, but the receiver and sender should both see the threads in the chat menu.

2. Upload and Edit Post:

- Show error message when price input is in the wrong format

3. Favorites list:

- Fix the issue of the media from other apps that have issues in JSON parse.
- When user has not favourited any post, show animation and have a button that takes to all listings where they can find posts that they might like.

4. Single Media view:

- Bookmark/Favourite animation button change play to black color after saving favorites. Allow user to click again to remove favorite and reset animation bookmark button’s color.

5. My Posts list:

- When user has no uploaded posts of their own, show animation and have a button that takes to upload new post.

6. Issue with Android in the Chat view's input box was fixed

## Current issues/known bugs

- The app requires the user to enable Location service to avoid issues with Map related features.
- `PayloadTooLargeError: request entity too large` when loading the app. Several filtering operations with payload from the shared backend make the app slow down. Depending on the network situation, the user will need to wait for some time for the media to load.
- **Different Android devices can have some unexpected issues with some views**, which the team has not been able to control of. However, the app should work normally in iOS for all the features in a good network condition.
- **Map search**: Currently, we only implemented Google Places API in the map search box, Geocoding API is not used. Therefore, the app cannot automatically retrieve the address text from the user location's coordinates. The user need to select a result from the search box in MapSearch in order to add the address text to the post. Otherwise, the app will save the current location as post's location, and address text will be an empty string.

## Contributors

[Dieu Vu](https://github.com/dieu-vu), [Sam Hämälainen](https://github.com/SamHamalainen), [Mikko Suhonen](https://github.com/miksunGitHub)

With guidance and teaching from teachers: Ilkka Kylmäniemi, Ulla Sederlöf, Matti Peltoniemi, Janne Valkeapää.
