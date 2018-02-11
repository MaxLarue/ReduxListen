let ACTION_LISTENERS = {
	act: 0,
	content: {}
}

/**
 * creates a new action listener 
 * @param  {Function(action)}   actionMatcher function used to check ifthis listener should be called on this action 
 * @param  {Function(action)}   callback   function to call if the action was matched
 * @return {Function()}         call this function to unsubscribe
 */
export default function listenOnAction(actionMatcher, callback){
	let id = ACTION_LISTENERS.act;
	ACTION_LISTENERS.act += 1;
	ACTION_LISTENERS.content[id] = {
		matcher: actionMatcher,
		callback: callback,
	}
	const innerUnsubscribe = () => {
		delete ACTION_LISTENERS.content[id];
	}
	return innerUnsubscribe;
}

/**
 * actionListener middleware
 * 	apply to your store to make action listenning possible
 * 
 */
export const actionListener = store => next => action => {
	for(var id in ACTION_LISTENERS.content){
		if(ACTION_LISTENERS.content[id].matcher(action)){
			ACTION_LISTENERS.content[id].callback(action);
		}
	}
	return next(action);
}