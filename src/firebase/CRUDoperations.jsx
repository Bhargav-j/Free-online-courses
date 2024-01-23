import { db } from "./Config";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";

import { store } from "../Globals/ReduxStore";
import { addUserObject } from "../Globals/actionTypes";

// TO Add the data we need only collectionRef means only the colleciton level  (addDoc)
// addDoc(collection(db, "collectionname"), dataObject);   ==> CollectionRef = collection(db, "collectionname")

// TO Update or Delete the data, we need the document level reference (doc, updateDoc or DeleteDoc)
// docRef = doc(db, collectionName, doc.id);  ==> CollectionRef = collection(db, collectionName) & documentRef = doc.id
// updateDoc(docRef, updatedData);
// deleteDoc(docRef)

// For Deleting items obtained using query, we can directly use deleteDoc(doc.ref) where mapping over that array forEach doc

// query & getDocs & querySnapshot.forEach(doc => {})
//getDocs to get the array of documents inside the collection. for this collectioRef is enough.
// const querySnapshot =  getDocs(db, collectionName)  collectionRef = collection(db, collectionName)

// But before that we need to query the collection to get that collection object if any condition need to be applied
// q = query(collectionRef, where("name", "==", projectName));
// const querySnapshot = getDocs(q)

// export const listenToFirestoreSnapshot = (userUID) => {
//   let collectionRef;

//   if (userUID) {
//     collectionRef = collection(db, userUID);
//   } else {
//     return;
//   }

//   onSnapshot(collectionRef, (snapshot) => {
//     try {
//       const fetchedData = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(), // Use doc.data() to get the document's data
//       }));

//       const userData = fetchedData;

//       store.dispatch({
//         type: "update",
//         payload: userData,
//       });
//     } catch (err) {
//       console.error("Error in fetching users data", err);
//     }
//   });
// };

// Get Courses Database on Page load only once
export const CoursesDatabaseFetch = async () => {
  try {
    const collectionRef = collection(db, "Courses Database");

    const querySnapshot = await getDocs(collectionRef);

    const coursesData = querySnapshot.docs.map((doc) => ({
      // id: doc.id,
      ...doc.data(),
    }));

    const AllCourses = coursesData[0]["All Courses"]

    return(AllCourses)

  } catch (error) {
    console.error("Error fetching data from Firestore", error);
    return null
  }
};

//Get User Data if new user add basic data
export const GetUserData = async (UserObject) => {
  const userUID = UserObject.UID;
  let collectionRef;
  let NewUserObject;
  try {
    if (userUID) {
      collectionRef = collection(db, userUID);
    } else {
      return;
    }

    const q = query(collectionRef);
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size === 0) {
      addDoc(collectionRef, UserObject.UserData);

      NewUserObject = { UID: userUID, UserData: UserObject.UserData };
      store.dispatch(addUserObject(NewUserObject));
    } else {
      const UserData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
      }));

      NewUserObject = { UID: userUID, UserData: UserData[0] };
      store.dispatch(addUserObject(NewUserObject));
      // console.log(NewUserObject);
    }
  } catch (err) {
    console.log(err);
    alert(err.message);
  }
};

export const manageUpdateUser = async (uid, key, value) => {
  const userUID = uid;
  let collectionRef;
  let documentID;

  try {
    if (userUID) {
      collectionRef = collection(db, userUID);
    } else {
      return;
    }

    const querySnapshot = await getDocs(query(collectionRef));

    querySnapshot.forEach((doc) => {
      documentID = doc.id;
      // console.log(documentID);
    });

    const documentRef = doc(collectionRef, documentID);
    updateDoc(documentRef, { [key]: value });
  } catch (err) {
    alert(err.message);
  }
};
