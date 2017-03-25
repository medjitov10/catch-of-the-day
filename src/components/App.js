import React from 'react';
import Header from './Header'
import Order from './Order'
import Inventory from './Inventory'
import sampleFishes from '../sample-fishes'
import Fish from './Fish'
import base from '../base.js'
// import


class App extends React.Component{
  constructor(){
    super();
       this.addFish = this.addFish.bind(this);
       this.loadSamples = this.loadSamples.bind(this);
       this.addToOrder = this.addToOrder.bind(this);
       this.updateFish = this.updateFish.bind(this);
       this.removeFish = this.removeFish.bind(this);
       this.removeOrder = this.removeOrder.bind(this);
    //get state
    this.state={
      fishes:{},
      order:{}    
    };  
  }

   componentWillMount(){
      this.ref = base.syncState(`${this.props.params.storeID}/fishes`,
      {
        context: this,
        state: 'fishes'
      });


          const localStorageRef= localStorage.getItem(`order-${this.props.params.storeID}`)
      if(localStorageRef){
        this.setState({
          order: JSON.parse(localStorageRef)
        })
      }

         }

   componentWillUnmount(){
    base.removeBinding(this.ref);
   }

   componentWillUpdate(nextProps, nextState){
    localStorage.setItem(`order-${this.props.params.storeID}` , JSON.stringify(nextState.order)); 
   }

  addFish(fish){
    const fishes={...this.state.fishes};
    // add new fish
    const timestamp = Date.now();
    fishes[`fish-${timestamp}`]=fish;
    //set
    this.setState({ fishes })
  }

  updateFish(key, updatedFish){
      const fishes = {...this.state.fishes}
      fishes[key]=updatedFish;
      this.setState({fishes})


  }

  removeFish(key){
    const fishes = {...this.state.fishes}
    fishes[key]=null;
    this.setState({fishes})
  }

  loadSamples(){
      this.setState({
        fishes: sampleFishes
      })
  }


  addToOrder(key){
    const order ={...this.state.order};
    order[key] = order[key]+1 || 1;
    this.setState({ order })
  }

  removeOrder(key){
    const order = {...this.state.order}
    delete order[key];
    this.setState({order})
  }
    render(){
      return (
        <div className="catch-of-the-day">
          <div className="menu">
          <Header tagline="Fresh seafood market"/>
            <ul className="list-of-fish">
              
               {Object.keys(this.state.fishes)
                  .map(key => <Fish key={key} index={key} details={this.state.fishes[key]}
                    addToOrder={this.addToOrder}/>)  
               }    
            </ul>
          </div>
          <Order fishes={this.state.fishes} order={this.state.order} params={this.props.params} 
          removeOrder={this.removeOrder}/>
          <Inventory 
          addFish={this.addFish} 
          loadSamples={this.loadSamples} 
          fishes={this.state.fishes}
          updateFish={this.updateFish} 
          removeFish={this.removeFish} 
          storeID={this.props.params.storeID}
          />
        </div>
      )
    }
}

App.propTypes = {
  params:React.PropTypes.object.isRequired
}




export default App;
