import React from 'react'
import firebase from 'firebase'
import { Button } from '@material-ui/core'
import { auth } from '../firebase'

function SignIn() {
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider()
        auth.signInWithPopup(provider)
    }

    return (
        <div>
            <Button onClick={signInWithGoogle}>Sign In</Button>
        </div>
    )
}

export default SignIn
