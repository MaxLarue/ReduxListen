/**
 * We are using dotted path to describe access to objects's parts
 * example :
 * 		let myObj = {
 * 			sliceOne: "xxxx",
 * 			sliceTwo: {
 * 				subSliceOne: "aaaaa",
 * 				subSliceTwo: "bbbbb"
 * 			}
 * 		}
 *
 * using atPath(myObj, "sliceTwo.subSliceOne") will return "bbbbb".
 * whereas using setAtPath(myObj, "sliceThree.subSliceOne.subSubSliceOne", "[]") will return the following
 * NEW object:
 * 		let myObj = {
 * 			sliceOne: "xxxx",
 * 			sliceTwo: {
 * 				subSliceOne: "aaaaa",
 * 				subSliceTwo: "bbbbb"
 * 			},
 * 			sliceThree: {
 * 				subSliceOne: {
 * 					subSubSliceOne: []
 * 				}
 * 			}
 * 		}
 * 	
 * 
 */

/**
 * Return what is at [path] in [obj]
 * @param  {object} obj  the object from which we want to access a slice
 * @param  {string} path dot separated keys to look inside of the object, if path === "", the same object is returned
 * @throws {string} if path could not be followed (key missing) we throw the largest part
 *         		    we could walk
 * @return {object}      wathever was found at that parh in the object
 */
export function atPath(obj, path=""){
	if(path === ""){ return obj; }
	let road = path.split(".");
	actRoad = "";
	let prev = obj;
	let ret = undefined;
	for(var part = 0; part < road.length ; part ++){
		if(!prev.hasOwnProperty(road[part])){
			throw actRoad; 
		}
		prev = prev[road[part]];
		actRoad += "."+road[part];
	}
	return prev;
}

/**
 * Walk obj according to path (creating if it doesn't exist) and insert value at the end
 * @param {object} obj   the object in which to set at path
 * @param {string} path  path with dot separator
 * @param {object} value whatever tyou want to put at path
 */
export function setAtPath(obj, path, value){
	if(path === "" ){ return value }
	let road = path.split(".");
	if(path.length === 1){
		let newObj = {};
		newObj[path[0]] = value;
		return Object.assign({}, newObj);
	}
	let newRoad = road.slice(1).join(".");
	let newObj = {};
	if(obj.hasOwnProperty(road[0])){
		newObj[road[0]] = setAtPath(obj[road[0]], newRoad, value);
	}else{
		newObj[road[0]] = setAtPath({}, newRoad, value);
	}
	return Object.assign({}, obj, newObj);
}