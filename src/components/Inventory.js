import React from 'react'
import AddFishForm from './AddFishForm'
import base from '../base'
class Inventory extends React.Component{
	constructor(){
		super();
		this.renderLogin = this.renderLogin.bind(this);
		this.authenticate = this.authenticate.bind(this);
		this.authHandler = this.authHandler.bind(this);
		this.logout = this.logout.bind(this);
		this.renderInventory = this.renderInventory.bind(this);
		this.handleChange = this.handleChange.bind(this)
		this.state = {
			uid: null,
			owner: null
		}
	}

	componentDidMount(){
		base.onAuth((user) => {
			if(user){
				this.authHandler(null, { user })
			}
		})
	}


	handleChange(e, key){
		const fish=this.props.fishes[key];
		// copy fish
		const updatedFish = {...fish, [e.target.name]: e.target.value}
		this.props.updateFish(key, updatedFish)
	}

	authenticate(provider){
		console.log(`trying to connect to ${provider}`)
		base.authWithOAuthPopup(provider , this.authHandler)
	}

	logout(){
		base.unauth();
		this.setState({uid: null})
	}

	authHandler(err , authData){
		if(err){
			console.log(err)
			return;
		}
		//grab info
		const storeRef=base.database().ref(this.props.storeID)

		//query the firebase once for the store data

		storeRef.once('value', (snapshot) => {
			const data = snapshot.val()|| {}
			if(!data.owner){

			storeRef.set({
				owner: authData.user.uid
			});
			}
			
			this.setState({
				uid: authData.user.uid,
				owner: data.owner || authData.user.uid
			})
		})

		console.log(authData)
	}

	renderLogin(){
		return(
				<nav className="login">
					<h2>Inventory</h2>
					<p>Sign in in your store's Inventory</p>
					<button className="github" onClick={() => this.authenticate('github')}>
					Log In With Github</button>
					<button className="facebook" onClick={() => this.authenticate('facebook')}>
					Log In With Facebook</button>
					<button className="twitter" onClick={() => this.authenticate('twitter')}>
					Log In With Twitter</button>
				</nav>
			)
	}


	renderInventory(key){

		const fish = this.props.fishes[key];


		return(
			<div className="fish-edit" key={key}>
				 <input type='text' name="name" value={fish.name} placeholder="Fish name"  onChange={(e) => this.handleChange(e, key)}/>
				 <input type='text' name="price" value={fish.price} placeholder="Fish price" onChange={(e) => this.handleChange(e, key)} />
				 <select type='text' name="status" value={fish.status} placeholder="Fish status"  onChange={(e) => this.handleChange(e, key)}>
				 	<option value="available">Fresh</option>
		      		<option value="unavailable">Sold out</option>
		         </select>
				 <textarea type='text' name="desc" value={fish.desc} placeholder="desc"  onChange={(e) => this.handleChange(e, key)}></textarea>
				 <input type='text' name="image" value={fish.image} placeholder="Fish image"  onChange={(e) => this.handleChange(e, key)}/>
				<button onClick={()=> this.props.removeFish(key)}>Remove fish</button>
				</div>
			)
	}
  render(){
  	const logout=<button onClick={this.logout}>Log out</button>

  		
  		if(!this.state.uid){
  			return (<div>{this.renderLogin()}</div>)
  		}

  		//if they are owner of the current store
  		if(this.state.uid !== this.state.owner){
  			return (
  					<div>
  						<p> Sorry you are not owner of the store!</p>
  						{logout}
  					</div>
  				)
  		}

      return (

		<div>
		 <h2>inventory</h2>
		 {logout}
		 {Object.keys(this.props.fishes).map(this.renderInventory)}
		 <AddFishForm addFish={this.props.addFish} />
		 <button onClick={this.props.loadSamples}>Load sample fishes</button>
		</div>

	)
  }
}

Inventory.propTypes = {
	fishes: React.PropTypes.object.isRequired,
	removeFish: React.PropTypes.func.isRequired,
	updateFish: React.PropTypes.func.isRequired ,
	storeID: React.PropTypes.string.isRequired,
	addFish: React.PropTypes.func.isRequired,
	loadSamples: React.PropTypes.func.isRequired
	
}


export default Inventory;
