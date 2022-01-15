import React, { useState } from 'react'
import firebase from 'firebase'
import { TextField, IconButton, Grid } from '@material-ui/core'
import { Send } from '../assets/CustomIcons'
import { db, auth } from '../firebase'

function SendMessage({ user }) {
    const [message, setMessage] = useState("")


    const handleSubmit = async (e) => {
        e.preventDefault()
        const { uid, photoURL, displayName } = user;

        await db.collection('messages').add({
            uid,
            name: displayName,
            text: message,
            photoURL,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })

        await db.collection('xyz').add({
            uid,
            name: displayName,
            text: message,
            photoURL,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })

        setMessage('')
    }
    return (
        <Grid container xs={12}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                <TextField fullWidth value={message} onChange={(e) => setMessage(e.target.value)} label='Message' variant='standard' />
                <IconButton disabled={!message} type="submit"><Send color={message ? null : 'grey'} /></IconButton>
            </form>
        </Grid>
    )
}

export default SendMessage