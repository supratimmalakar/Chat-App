import './App.css';
import SignIn from './components/SignIn';
import Chat from './components/Chat';
import { db, auth } from './firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import Main from './components/Main';
import { useEffect, useState } from 'react'

function App() {
  const [user] = useAuthState(auth)

  const createNewUser = async (user) => {
    console.log("createUser ran")
    const userData = {
      name: user.displayName,
      email: user.email,
      photoURL : user.photoURL,
    }
    await db.collection('all-users').doc(user.uid).set(userData)
  }

  const getAllUsers = async () => {
    const allUsers = []
    await db.collection("all-users").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        allUsers.push({
          uid: doc.id,
          ...doc.data()
        })
      });
    });
    return allUsers
  }

  useEffect(() => {
    if (user) {
      getAllUsers().then((data) => {
        const allUsers = [...data]
        const userExists = allUsers.length > 0 && !allUsers.some(eachUser => eachUser.uid === user.uid)
        if (userExists) {
          createNewUser(user)
        }
      })
    }
  }, [user])

  return (
    <>
      {user ? <Main user={user} /> : <SignIn />}
    </>
  );
}

export default App;
