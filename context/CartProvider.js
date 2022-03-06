// components/common/MenuProvider.js
import { createContext, useContext } from 'react'

// Create Context object.
const CartContext = createContext()

// Export Provider.
export function CartProvider(props) {
	const {value, children} = props
	
	return (
	   <CartContext.Provider value={value}>
		{children}
	   </CartContext.Provider>
	)
}

// Export useContext Hook.
export function useCartContext() {
	return useContext(CartContext);
}
