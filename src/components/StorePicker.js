import React from 'react';
import {getFunName} from '../helpers.js'

class StorePicker extends React.Component {
	goToStore(event) {
		event.preventDefault();
		console.log("im here");
		console.log(this.storeInput.value);
		//grab the text from the box (input)
		const storeID = this.storeInput.value;
		// change router 
		this.context.router.transitionTo(`/store/${storeID}`)
	}



	render(){
		return (
			 <form className="store-selector" onSubmit={(e) => this.goToStore(e)}>
			 	<h2>Pleace Enter A Store</h2>
			 	<input type = "text" required placeholder="Store Name" defaultValue={getFunName()}
			 	ref={(input) => {this.storeInput=input}} />

			 		<button type="submit">submit</button>
			 </form>
			)
	}
}

StorePicker.contextTypes = {
	router : React.PropTypes.object
}

export default StorePicker;
