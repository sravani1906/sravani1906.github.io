import React, { Component } from 'react';
import Modal from 'react-modal'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const modalStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};


class Cart extends Component {

  render() {
    return (
      <div id="cart">
      <div className = "card">
      <span className="card-header text-center"><b>Total</b></span>
      <span className="card-body">
        <table className="table table-borderless">
          <tbody>
          <tr>
            <td className="col-sm-3">Items({this.props.itemQuantity})</td>
            <td>:</td>
            <td>{this.props.itemTotal} </td>
          </tr>
          <tr>
            <td>Discount</td>
            <td>:</td>
            <td>-{this.props.discount}</td>
          </tr>
          <tr>
            <td>Type Discount</td>
            <td>:</td>
            <td>-{this.props.typeDiscount}</td>
          </tr>
          <tr className="card-footer">
            <td >OrderTotal </td>
            <td>:</td>
            <td>{this.props.orderTotal}</td>
          </tr>
          </tbody>
        </table>
      </span>

        
      </div>
      </div>
    );
  }





}
class ProductList extends Component {
  constructor(props){
		super(props);
		this.state = {
      itemList:[],
      items : 0,
      itemTotal: 0,
      orderTotal : 0,
      discount : 0,
      itemsQuantity :{
        "9090": 0,
        "9091": 0,
        "9092": 0,
        "9093": 0,
        "9094": 0,
        "9095": 0,
        "9096": 0,
        "9097": 0
      }
		}
  }

  handleIncrement(id){
    //console.log(id);
    let itemsQuantity = this.state.itemsQuantity;
    itemsQuantity[id] = itemsQuantity[id] + 1
    this.setState({
      itemsQuantity :itemsQuantity
    });
    this.props.handleAddProductItem(id, itemsQuantity[id]);
  }
  handleDecrement(id){
    //console.log(id);
    let itemsQuantity = this.state.itemsQuantity;
    if(itemsQuantity[id]>0){
      itemsQuantity[id] = itemsQuantity[id] - 1;
      this.setState({
        itemsQuantity :itemsQuantity
      });
      this.props.handleRemoveProductItem(id, itemsQuantity[id]);
    }  
  }
  
  render() {
    let ProductList = this.props.items.map(product =>{
      //console.log(product);
      return (
        <tr key={product.id}>
          <td className="col-6"><div className="product">
            <img alt="i" className="product-image" src={product.img_url} />
            <div className="product-info">{product.name}</div>
            <a
            className="product-remove"
            href="#"
            onClick={()=>this.props.handleRemoveProduct(product.id)}
            >
            ×
          </a>
            </div>
          </td>
          <td className="col-3 counter">
            <a href="#" className="decrement" onClick={() => {this.handleDecrement(product.id)}}>
              –
            </a>
            <div className="counter-quantity">{this.state.itemsQuantity[product.id]}</div>
            <a href="#" className="increment" onClick={() => {this.handleIncrement(product.id)}}>
              +
            </a>
          </td>
          <td className="col-3">{product.price}</td>
        </tr>
      )
    })
    return (
      <div>
        <h2>Order Summary</h2>
        <table>
          <thead className="table-secondary">
            <tr>
              <th className="col-3">Items</th>
              <th className="col-3">Quantity</th>
              <th className="col-3">Price</th>
            </tr>
          </thead>
          <tbody>
              {ProductList}
          </tbody>
        </table>
        
      </div>
    );
  }

}

Modal.setAppElement('#alertmodal')
class App extends Component {
  constructor(props){
		super(props);
		this.state = {
      itemList:[],
      cartList:{},
      items : 0,
      itemTotal: 0,
      itemQuantity:0,
      orderTotal : 0,
      discount : 0,
      typeDiscount: 0,
      modalIsOpen:false
    }
    this.handleRemoveProduct = this.handleRemoveProduct.bind(this);
    this.handleAddProductItem = this.handleAddProductItem.bind(this);
    this.handleRemoveProductItem = this.handleRemoveProductItem.bind(this);
    this.calculateItemTotal = this.calculateItemTotal.bind(this);
    this.calculateItemQuantity = this.calculateItemQuantity.bind(this);
    this.reloadCart = this.reloadCart.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

  } 

  componentWillMount(){
    var itemList = getProducts();
    this.setState({
      itemList : itemList
    })

  }
  openModal() {
    //console.log("modal");
    this.setState({modalIsOpen: true});
  }
  closeModal() {
    this.setState({modalIsOpen: false});
  }
  reloadCart(){
    var itemList = getProducts();
    this.setState({
      itemList : itemList
    })

  }
  handleRemoveProduct(id) {
    //console.log("removing product")
    let items = this.state.itemList;
    let cart = this.state.cartList;
    let index = items.findIndex(x => x.id === id);
    items.splice(index, 1);
    delete cart[id];
    this.setState({
      cartList: cart,
      itemList : items
    });
    this.calculateItemTotal();
    this.calculateItemQuantity();
    this.openModal();
  }

  handleAddProductItem(id) {
    //console.log("@handleAddProductItem");
    let cartList = this.state.cartList;
    if(cartList[id]){
      cartList[id] = cartList[id]+1
    }else{
      cartList[id] = 1;
    }
    this.setState({
      cartList : cartList
    })
    this.calculateItemTotal();
    this.calculateItemQuantity();   
  }
  handleRemoveProductItem(id) {
    //console.log("@handleRemoveProductItem");
    let cartList = this.state.cartList;
    if(cartList[id]){
      cartList[id] = cartList[id]-1
    }else{
      delete cartList[id];
    }
    this.setState({
      cartList : cartList
    })
    this.calculateItemTotal();
    this.calculateItemQuantity();   
  }

  
  calculateItemQuantity(){
    let cartList = this.state.cartList;
    let itemQuantity = 0;
    for (let key in cartList) {
       itemQuantity += cartList[key];
    }
    this.setState({
      itemQuantity : itemQuantity
    })
  }
  calculateItemTotal(){
    let cartList = this.state.cartList;
    let itemList = this.state.itemList;
    let itemTotal = 0;
    let discount = 0;
    let orderTotal = 0;
    let typeDiscount = 0;
    for (let key in cartList) {
      let index = itemList.findIndex(x => x.id==key)
       itemTotal += cartList[key] * itemList[index]['price'];
       discount += cartList[key] * itemList[index]['discount'];
       if(itemList[index]['type']=="fiction"){
         let discount  = 0.15* cartList[key] * itemList[index]['price'];
         discount = (Math.round(discount*100)/100);
        typeDiscount += discount
       }
       orderTotal = (Math.round((itemTotal-discount-typeDiscount)*100)/100);
    }
    this.setState({
      itemTotal : itemTotal,
      discount : discount,
      orderTotal : orderTotal,
      typeDiscount: typeDiscount
    })
  }
  
  render() {  
    return (
      <div>
        <div className="page-header">
        </div>    
        <div className="container-fluid">
        <div className="row flex-row-reverse">
          <div className="col-md-3">
             <Cart
               itemList={this.state.itemList}
                itemTotal={this.state.itemTotal}
                itemQuantity = {this.state.itemQuantity} 
                discount = {this.state.discount}
                typeDiscount={this.state.typeDiscount}
                orderTotal={this.state.orderTotal}
              />
          </div>
          <div className="col-md-9">
            {this.state.itemList.length==0?
              <button onClick={this.reloadCart}>Reload cart</button>
                : <ProductList
                    items={this.state.itemList}
                    itemValues={this.state.itemValues}
                    handleRemoveProduct={this.handleRemoveProduct}
                    handleAddProductItem={this.handleAddProductItem}
                    handleRemoveProductItem={this.handleRemoveProductItem}
                  />
            }
          </div>
          
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            contentLabel="Example Modal"
            style={modalStyles}
          >
            <button onClick={this.closeModal} className="btn btn-danger float-right">x</button>
            <div>Item Removed Successfully</div>
          </Modal>
        </div>
      </div>
    </div>
    );
  }
}

function getProducts(){
  var items =  [ 
    { "id": 9090, "name": "Item1", "price": 200, "discount": 10, "type": "fiction", "img_url": "https://store.lexisnexis.com.au/__data/media/catalog/thumb//placeholder.jpg" }, 
    { "id": 9091, "name": "Item2", "price": 250, "discount": 15, "type": "literature", "img_url": "https://store.lexisnexis.com.au/__data/media/catalog/thumb//placeholder.jpg" }, 
    { "id": 9092, "name": "Item3", "price": 320, "discount": 5, "type": "literature", "img_url": "https://store.lexisnexis.com.au/__data/media/catalog/thumb//placeholder.jpg" }, 
    { "id": 9093, "name": "Item4", "price": 290, "discount": 0, "type": "thriller", "img_url": "https://store.lexisnexis.com.au/__data/media/catalog/thumb//placeholder.jpg" }, 
    { "id": 9094, "name": "Item5", "price": 500, "discount": 25, "type": "thriller", "img_url": "https://store.lexisnexis.com.au/__data/media/catalog/thumb//placeholder.jpg" }, 
    { "id": 9095, "name": "Item6", "price": 150, "discount": 5, "type": "literature", "img_url": "https://store.lexisnexis.com.au/__data/media/catalog/thumb//placeholder.jpg" }, 
    { "id": 9096, "name": "Item7", "price": 700, "discount": 22, "type": "literature", "img_url": "https://store.lexisnexis.com.au/__data/media/catalog/thumb//placeholder.jpg" }, 
    { "id": 9097, "name": "Item8", "price": 350, "discount": 18, "type": "fiction", "img_url": "https://store.lexisnexis.com.au/__data/media/catalog/thumb//placeholder.jpg" } ]
  return items;
}

export default App;
