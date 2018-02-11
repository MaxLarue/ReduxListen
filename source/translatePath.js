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
 * whereas using addAtPath(myObj, "sliceThree.subSliceOne.subSubSliceOne", "[]") will return the following
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
export function atPath(obj, path){
	if(path === ""){ return obj; }
	let road = path.split(".");
	actRoad = "";
	let prev = obj;
	let ret = undefined;
	for(var part in road){
		if(!prev.hasOwnProperty(part)){
			throw actRoad; 
		}
		prev = prev[part];
		actRoad += ".part";
	}
	return prev;
}