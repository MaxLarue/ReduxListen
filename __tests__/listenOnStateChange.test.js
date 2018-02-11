import listenOnStateChange from "../source/listenOnStateChange";
import { createStore, combineReducers, applyMiddleware } from 'redux';
import {setAtPath} from "../source/translatePath";

const initialState = {
	"a": 1,
	"b": 2,
	"c": 3,
	"d":{
		"a": 1,
		"b": 2
	}
}

function dumbReducer(state=initialState, action){
	if(action.type === "set"){
		let newObj = {};
		newObj[action.path] = action.value;
		return Object.assign({}, state, newObj);
	}
	return state;
}

function action(path, value){
	return {
		type: "set",
		path: path,
		value: value,
	}
}

let store = undefined;

beforeEach(() => {
	store = createStore(dumbReducer);
})

test("listening on the whole state", () => {
	let listener = jest.fn();
	let un = listenOnStateChange(store, "", listener);
	store.dispatch(action("a", 11));
	store.dispatch(action("b", 22));
	store.dispatch(action("c", 33));
	expect(listener.mock.calls.length).toBe(3);
	un();
})

test("listening on the c slice", () => {
	let listener = jest.fn();
	let un = listenOnStateChange(store, "c", listener);
	store.dispatch(action("a", 11));
	store.dispatch(action("b", 22));
	store.dispatch(action("c", 33));
	expect(listener.mock.calls.length).toBe(1);
	un();
})

test("listening on both a and b slice", () => {
	let listener = jest.fn();
	listenOnStateChange(store, "a", listener);
	listenOnStateChange(store, "b", listener);
	store.dispatch(action("a", 11));
	expect(listener.mock.calls.length).toBe(1);
	store.dispatch(action("b", 22));
	expect(listener.mock.calls.length).toBe(2);
	store.dispatch(action("c", 33));
	expect(listener.mock.calls.length).toBe(2);
})

test("listening then stopping to listen", () => {
	let listener = jest.fn();
	let l1 = listenOnStateChange(store, "a", listener);
	let l2 = listenOnStateChange(store, "b", listener);
	expect(listener.mock.calls.length).toBe(0);
	store.dispatch(action("a", 11));
	expect(listener.mock.calls.length).toBe(1);
	l1();
	l2();
	store.dispatch(action("b", 22));
	expect(listener.mock.calls.length).toBe(1);
	store.dispatch(action("c", 33));
	expect(listener.mock.calls.length).toBe(1);
})