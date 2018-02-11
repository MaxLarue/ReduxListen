import {atPath} from "./translatePath";

function defaultComp(a, b){
	if(a === b){
		return true;
	}
	if(typeof a === typeof b && typeof a === "object"){
		for(var aKey in a){
			if(!b.hasOwnProperty(aKey)){ return false; }
			if(a[aKey] !== b[aKey]){ return false; }
		}
		return true;
	}
	return false;
}

/**
 * Use this function to subscribe a state change listener
 * @param  {Redux store}   store    Your redux store
 * @param  {string}   path     the path to the slice you want to listen to
 * @param  {Function(slice)} callback function to call on state change (will receive the state slice which is listened to)
 * @param  {Fuction(a, b)}   comp     triggers the callback if comp(prevSate, nextState) is true (defaults to defaultComp)
 * @return {Function()}            call this function to unsubscribe
 */
export default function listenOnStateChange(store, path, callback, comp){
	if(comp === undefined){
		comp = defaultComp;
	}
	let prevState = atPath(store.getState(), path);
	let innerCallback = () => {
		if(! comp(atPath(store.getState(), path), prevState)){
			//there was a change
			prevState = atPath(store.getState(), path);
			callback(prevState);
		}
	}
	let unsubscribe = store.subscribe(innerCallback);
	return unsubscribe;
}