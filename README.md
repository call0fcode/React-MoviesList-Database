# Communicating frontend and a database

Small practice created with [create-react-app](https://create-react-app.dev/) that showcases how
the comunication between the frontend (React) and a database ([Firebase Realtime Database](https://firebase.google.com/docs/database) in this case)
through the Firebase API takes place.

For the development of the app the following React features have been implemented:
- React hooks:
  - useState
  - useEffect
  - useCallback (improvement to avoid functions declaration on each component re-render)
- Conditional rendering
- Styling with CSS modules
- Fragments

The native JavaScript [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) has been used in order to communicate with the database (for fetching, adding o deleting data).

See working app:
[ReactMeals](https://c0c-reactmeals.netlify.app/)

## Instructions to start the development environment:

Once the project is downloaded, in the root folder of the project run:

1.Install the necessary dependencies:

```shell
npm install
```

2.Start the local server to view the project in the browser.

```shell
npm run start
```

### Notes
Production deployment of the application is done through [Netlify's continuous deployment](https://docs.netlify.com/site-deploys/create-deploys/#deploy-with-git) feature.
