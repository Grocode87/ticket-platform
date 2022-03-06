import { useReducer, createContext, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const initialState = {
  ticketData: {},
  accessCode: "",
};

export const CartStateContext = createContext();
export const CartDispatchContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
        console.log("SETTING CART")
        console.log(action.payload.ticketData)
      return {
          ...state,
          ticketData: action.payload.ticketData
      }
      
     
    case "SET_ACCESS_CODE":
      return {
        ...state,
        accessCode: action.payload.accessCode
      };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};


export const setCart = (dispatch, ticketData) => {
  return dispatch({
    type: "SET_CART",
    payload: {
        ticketData: ticketData.data
    }
  });
};

export const setAccessCode = (dispatch, accessCode) => {
    return dispatch({
      type: "SET_ACCESS_CODE",
      payload: {
        accessCode: accessCode
      }
    });
  };


const CartProvider = ({ children }) => {
    const [persistedTicketData, setPersistedTicketData] = useLocalStorage(
        "ticketData",
        {}
      );

      const [persistedAccessCode, setPersistedAccessCode] = useLocalStorage(
        "accessCode",
        ""
      );
      const persistedCartState = {
        ticketData: persistedTicketData || {},
        accessCode: persistedAccessCode || {}
      };

      const [state, dispatch] = useReducer(reducer, persistedCartState);
      useEffect(() => {
        setPersistedTicketData(state.ticketData);
      }, [JSON.stringify(state.ticketData)]);

      useEffect(() => {
        setPersistedAccessCode(state.accessCode);
      }, [JSON.stringify(state.accessCode)]);

  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>
        {children}
      </CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
};

export default CartProvider;