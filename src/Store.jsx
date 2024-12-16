import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  fullBox: false,
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,

  cart: {
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : { location: {} },
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : '',
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
  },
  invoice: {
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : { location: {} },
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : '',
    orderItems: localStorage.getItem('orderItems')
      ? JSON.parse(localStorage.getItem('orderItems'))
      : [],
  },
  receipt: {
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : { location: {} },
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : '',
    receiptItems: localStorage.getItem('receiptItems')
      ? JSON.parse(localStorage.getItem('receiptItems'))
      : [],
  },
};
function reducer(state, action) {
  switch (action.type) {
    case 'SET_FULLBOX_ON':
      return { ...state, fullBox: true };
    case 'SET_FULLBOX_OFF':
      return { ...state, fullBox: false };

    case 'CART_ADD_ITEM':
      // add to cart
      action.payload.image = action.payload.images[0];
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_CLEAR':
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    case 'INVOICE_ADD_ITEM':
      // add to cart
      const newItemInv = action.payload;
      const existItemInv = state.invoice.orderItems.find(
        (itemInv) => itemInv._id === newItemInv._id
      );
      const orderItems = existItemInv
        ? state.invoice.orderItems.map((itemInv) =>
            itemInv._id === existItemInv._id ? newItemInv : itemInv
          )
        : [...state.invoice.orderItems, newItemInv];
      localStorage.setItem('orderItems', JSON.stringify(orderItems));
      return { ...state, invoice: { ...state.invoice, orderItems } };
    case 'INVOICE_REMOVE_ITEM': {
      const orderItems = state.invoice.orderItems.filter(
        (itemInv) => itemInv._id !== action.payload._id
      );
      localStorage.setItem('orderItems', JSON.stringify(orderItems));
      return { ...state, invoice: { ...state.invoice, orderItems } };
    }
    case 'INVOICE_CLEAR':
      return { ...state, invoice: { ...state.invoice, orderItems: [] } };

    case 'RECEIPT_ADD_ITEM':
      // add to cart
      const newItemVal = action.payload;
      const existItemVal = state.receipt.receiptItems.find(
        (itemVal) => itemVal._id === newItemVal._id
      );
      const receiptItems = existItemVal
        ? state.receipt.receiptItems.map((itemVal) =>
            itemVal._id === existItemVal._id ? newItemVal : itemVal
          )
        : [...state.receipt.receiptItems, newItemVal];
      localStorage.setItem('receiptItems', JSON.stringify(receiptItems));
      return { ...state, receipt: { ...state.receipt, receiptItems } };
    case 'RECEIPT_REMOVE_ITEM': {
      const receiptItems = state.receipt.receiptItems.filter(
        (itemVal) => itemVal._id !== action.payload._id
      );
      localStorage.setItem('receiptItems', JSON.stringify(receiptItems));
      return { ...state, receipt: { ...state.receipt, receiptItems } };
    }
    case 'RECEIPT_CLEAR':
      return { ...state, receipt: { ...state.receipt, receiptItems: [] } };

    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };
    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: '',
        },
        invoice: {
          orderItems: [],
          shippingAddress: {},
          paymentMethod: '',
        },
        receipt: {
          receiptItems: [],
          paymentMethod: '',
        },
      };
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };
    case 'SAVE_SHIPPING_ADDRESS_MAP_LOCATION':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: {
            ...state.cart.shippingAddress,
            location: action.payload,
          },
        },
      };

    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children} </Store.Provider>;
}
