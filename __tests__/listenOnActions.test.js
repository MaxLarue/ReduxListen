import { createStore, combineReducers, applyMiddleware } from 'redux';
import listenOnAction, { actionListener } from "../source/listenOnAction";

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
	return state;
}

let store = undefined;

beforeAll(() => {
	store = createStore(dumbReducer, applyMiddleware(actionListener));
})

test("listening on type", () => {
	let action = {
		type: "dummy",
	}
	let action2 = {
		type: "other"
	}
	let listener = jest.fn();

	listenOnAction((act) => {return act.type === "dummy"}, listener);

	store.dispatch(action);
	store.dispatch(action2);
	store.dispatch(action);

	expect(listener.mock.calls.length).toBe(2);

})

test("with unsubscribing", () => {
	let action = {
		type: "dummy",
	}
	let action2 = {
		type: "other"
	}
	let listener = jest.fn();

	let sub = listenOnAction((act) => {return act.type === "dummy"}, listener);

	store.dispatch(action);
	store.dispatch(action2);
	store.dispatch(action);

	sub();

	store.dispatch(action);
	store.dispatch(action2);
	store.dispatch(action);	

	expect(listener.mock.calls.length).toBe(2);
})

test("with 2 listeners", () => {
	let action = {
		type: "dummy",
	}
	let action2 = {
		type: "other"
	}
	let listener = jest.fn();
	let listener2 = jest.fn();

	let sub = listenOnAction((act) => {return act.type === "dummy"}, listener);
	listenOnAction((act) => {return act.type === "other"}, listener2);

	store.dispatch(action);
	store.dispatch(action2);
	store.dispatch(action);

	sub();

	store.dispatch(action);
	store.dispatch(action2);
	store.dispatch(action);	

	expect(listener.mock.calls.length).toBe(2);
	expect(listener2.mock.calls.length).toBe(2);
})