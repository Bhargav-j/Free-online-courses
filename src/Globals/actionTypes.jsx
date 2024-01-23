export const LoginRequest = (user) => {
  return {
    type: "login",
    payload: {
      userlogin: true,
      userUID: user.uid,
      userName: user.displayName ? user.displayName : "U",
    },
  };
};

export const LogoutRequest = () => {
  return {
    type: "logout",
  };
};

export const userLogout = () => {
  return {
    type: "userLogout",
  };
};

export const addUserObject = (UserObject) => {
  return {
    type: "newUserObject",
    payload: UserObject,
  };
};

export const updateUserObject = (modificationKey, NewUserData) => {
  return {
    type: "UpdateUserObject",
    payload: {
      modificationKey: modificationKey,
      NewUserData: NewUserData,
    },
  };
};
