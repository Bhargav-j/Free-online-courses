import { auth, googleProvider } from "./Config";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";

import { store } from "../Globals/ReduxStore";
import {
  LoginRequest,
  LogoutRequest,
  userLogout,
} from "../Globals/actionTypes";
import { GetUserData } from "./CRUDoperations";
import { initialUserObject } from "../Globals/Reducers";

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // const uid = user.uid;
    // console.log(user.displayName)
    GetUserData({
      UID: user.uid,
      UserData: initialUserObject.UserData,
    });

    store.dispatch(LoginRequest(user));
  } else {
    // setUserUID(null);
    // setUserName("Hello User!");
    // store.dispatch(LogoutRequest());
  }
});

//signIn with userName and Password
export const handleLogin = async ({ email, password }) => {
  //   console.log(email);
  //   console.log(password);
  // const err = null
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // console.log(userCredential.UID)
    GetUserData({
      UID: userCredential.uid,
      UserData: initialUserObject.UserData,
    });

    store.dispatch(LoginRequest(userCredential));
  } catch (error) {
    // console.log(error.message)
    return error.message;

    // .then((userCredential) => {
    //     // console.log('success')
    //   //   setUserId(userCredential.UID);
    //   //   setUserName(userCredential.displayName);
    //   return null;
    // })

    // alert(error);
  }
};

//signIn with google
export const handleGoogleLogin = async () => {
  try {
    googleProvider.setCustomParameters({
      prompt: "select_account",
    });
    const userCredential = await signInWithPopup(auth, googleProvider);
    if (userCredential) {
      // alert("Logged In");
      GetUserData({
        UID: userCredential.uid,
        UserData: initialUserObject.UserData,
      });

      store.dispatch(LoginRequest(userCredential));
    }
    //   setUserId(userCredential.UID);
    //   setUserName(userCredential.displayName);
  } catch (error) {
    alert(error);
  }
};

//Register an account
export const handleRegister = async ({ userName, email, password }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    
    const user = userCredential.user;

    await updateProfile(user, { displayName: userName });

    GetUserData({
      UID: userCredential.uid,
      UserData: initialUserObject.UserData,
    });

    store.dispatch(LoginRequest(userCredential));

    // window.location.reload(false);
    return null;

    // Return user data or success indicator if needed
  } catch (error) {
    // Handle registration error
    // console.error("Registration error:", error.message);
    return error.message;
  }
};

// SignOut

export const handleSignOut = async () => {
  try {
    await signOut(auth).then(alert("Signed Out"));
    store.dispatch(LogoutRequest());
    store.dispatch(userLogout());
  } catch (error) {
    alert(error.message);
  }
};

// password reset email
export const handlePasswordReset = async ({ email }) => {
  // console.log(email);
  try {
    await sendPasswordResetEmail(auth, email);
    // .then(
    //   console.log("reset send")
    // )
    // .catch((err) => {
    //   console.log(err.message)
    // })
  } catch (error) {
    return error.message;
  }
};
