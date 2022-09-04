import React, {useContext, useState} from 'react';
import classes from './Cart.module.css';
import Modal from "../UI/Modal";
import CartContext from "../../store/cart-context";
import CartItem from "./CartItem";
import Checkout from "./Checkout";

const Cart = (props) => {

  const [isCheckout, setIsCheckout] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const cartCtx = useContext(CartContext);
  const cartTotalAmount = cartCtx.totalAmount.toFixed(2);
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemovalHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem({...item, amount: 1});
  };

  const orderHandler = () => {
    setIsCheckout(true);
  }

  const submitOrderHandler = async (userData) => {

    console.log(JSON.stringify({
      user: userData,
      items: cartCtx.items
    }));

    const response = await fetch('http://localhost:8080/api/v1/saveOrder', {
      method: 'POST',
      body: JSON.stringify({
        user: userData,
        items: cartCtx.items
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Server Response = ' + response.status);

    if(response.ok){
      setHasSubmitted(true);
    }

  };

  const cartItems = <ul className={classes['cart-items']}>
    {
      cartCtx.items.map(
          item => <CartItem key={item.id}
                            name={item.name}
                            amount={item.amount}
                            price={item.price}
                            onRemove={cartItemRemovalHandler.bind(null,
                                item.id)}
                            onAdd={cartItemAddHandler.bind(null, item)}
          />
      )
    }
  </ul>;

  const modalActions = <div className={classes.actions}>
    <button className={classes['button--alt']}
            onClick={props.onClose}>Close
    </button>
    {hasItems && <button className={classes.button}
                         onClick={orderHandler}>Order</button>}
  </div>;

  const modalContent = <React.Fragment>
    {cartItems}
    <div className={classes.total}>
      <span>Total Amount</span>
      <span>${cartTotalAmount}</span>
    </div>
    {isCheckout && <Checkout onConfirm={submitOrderHandler}
                             onCancel={props.onClose}/>}
    {!isCheckout && modalActions}
  </React.Fragment>

  const modalOrderSubmittedContent = <React.Fragment>
    <p>Your Order is successfully submitted!</p>
    <div className={classes.actions}>
      <button className={classes.button}
              onClick={props.onClose}>Close
      </button>
    </div>
  </React.Fragment>;

  return (
      <Modal onClose={props.onClose}>
        {!hasSubmitted && modalContent}
        {hasSubmitted && modalOrderSubmittedContent}
      </Modal>
  );
}

export default Cart;