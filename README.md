# ReduxListen
Let you subscribe some callbacks on specific change on the state, or on specific action dispatching

### Specifying parts of a nested object
In order to target a specific part of a nested object (such as store's state), use a string whith each step's key joined with a dot
Example:
```javascript
const initialState = {
  auth: {
    login: "xxxx",
    token: "yyyyy",
    userData: {
      urlToAvatar: "https://blablabla.jpg",
      nbPoints: 300,
    }
  }
  newComment: {
    content: "",
    target: -1,
  }
}
```
to acces the urlToAvatar the path will be "auth.userData.urlToAvatar". If the path is invalid a string will be thrown with the largest subpath that was accessible
Example:
accessing "auth.userData.userBio" will throw "auth.userData".
Specifying an empty string will return the whole object.

### Listening on state change
```javascript
 const initialState = {
  auth: {
    login: "xxxx",
    token: "yyyyy",
    userData: {
      urlToAvatar: "https://blablabla.jpg",
      nbPoints: 300,
    }
  }
  newComment: {
    content: "",
    target: -1,
  }
}
.
.
.
let store = createStore(myReducer);
let listener = (newStateSlice) => {
  console.log("nbPoints changed", newStateSlice);
}
listenOnStateChange(store, "auth.userData.nbPoints", listener);
```
listenOnStateChange has the following signature :
```javascript
  listenOnStateChange(store, path, callback, comp=shallow)
```
* store : your redux store (returned by createStore)
* path : str path to the part of the state you want to listen on
* callback : function (newStateSlice) : function called when the listened-to part changes
* comp : function (a, b) : function used to check if the val actually changed, default to shallow equality 

### Listening on action dispatching
In order to listen on actions, you should apply the actionListener middleware on your store
```javascript
import {createStore, applyMiddleware} from 'redux';
import {actionListener, listenOnAction} from 'redux-listen';
.
.
.
let store = createStore(myReducer, applyMiddleware(listenOnAction));
const loggedCallback = (action) => {
  console.log("Logged in!");
}
listenOnAction((action) => {
  return action.type === TRY_LOGIN && action.payload === "SUCCESS";
},  loggedCallback);
```

listenOnAction has the following signature
```javascript
  listenOnAction(actionMatcher, listener)
```
* actionMatcher : function (action) : this function is given every action that's dispatched, if the function returns true, the listener will be called
* listener : function (action) : callback that is called when an action match the corresonding actionMatcher.

### Removing listener's
Wether you have created an action listener or a state listener, both function return a callable, simply call it to remove your listener

### Danger of calling store.dispatch in your listener
If you are dispatching an action in one of your listener watch out that that don't trigger again your listener. This would cause an infinite call cycle which will crash your app

### Do not mutate state
As redux recommends it, don't mutate the state in your reducer's. This is especially true if you listen on some slice of the state, your listeners won't be called.
