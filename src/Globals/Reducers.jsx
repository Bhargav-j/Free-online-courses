const initialUserState = {
  userlogin: false,
  userUID: null,
  userName: "User!",
};

export const loginReducer = (state = initialUserState, action) => {
  switch (action.type) {
    case "login":
      return {
        ...state,
        userlogin: action.payload.userlogin,
        userUID: action.payload.userUID,
        userName: action.payload.userName,
      };
    case "logout":
      return {
        ...state,
        userlogin: false,
        userUID: null,
        userName: "User!",
      };
    default:
      return state;
  }
};

export const initialUserObject = {
  UID: null,
  UserData: { wishlist: [], enrolled: [], status: [], updatedStatus : [] },
};

export const UpdateUserReducer = (state = initialUserObject, action) => {
  switch (action.type) {
    case "newUserObject":
      return {
        ...action.payload,
      };
    case "UpdateUserObject":
      return {
        ...state,
        UserData: {
          ...state.UserData,
          [action.payload.modificationKey]: action.payload.NewUserData,
        },
      };
    case "userLogout":
      return {
        ...initialUserObject,
      };
    default:
      return state;
  }
};
