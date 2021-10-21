function dataReducer(state, action) {
  switch(action.type) {
    case "UPDATE_DATA":
      return {...state, ...action.payload};
  }
}

export default dataReducer;