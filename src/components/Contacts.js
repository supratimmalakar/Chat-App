import React, { useState, useEffect } from 'react'
import {
    Grid,
    Typography,
    Dialog,
    AppBar,
    Toolbar,
    DialogTitle,
    makeStyles,
    IconButton,
    Button,
    TextField,
    Snackbar,
    Paper
} from '@material-ui/core'
import { db } from '../firebase'
import {ChatIcon} from '../assets/CustomIcons'

const useStyles = makeStyles({
    heading: {
        padding: '10px',
        height : 74,
    },
    dp : {
        width : '50px',
        height : '50px',
        borderRadius : '50%'
    },
    paper : {
        margin : '5px 0',
        background : 'rgba(0,0,0,0.09)',
        padding : '3px'
    },
    container : {
        overflowY : 'auto',
        padding : '0 10px',
    }
})

function Contacts({user, setSelectedChat}) {
    const classes = useStyles()
    const [contacts, setContacts] = useState([])

    const handleChat = async (contact) => {
        const chatID = contact.uid[0] > user.uid[0] ? contact.uid + user.uid : user.uid + contact.uid
        const chatRef = db.collection("chats")
        await chatRef.doc(chatID).get()
        .then(doc => {
            if (!doc.exists) {
                chatRef.doc(chatID).set({
                    id: chatID,
                    idArray : [
                        contact.uid,
                        user.uid
                    ],
                    participants : [
                        {
                            ...contact
                        },
                        {
                            name : user.displayName,
                            email : user.email,
                            photoURL : user.photoURL,
                            uid : user.uid
                        }
                    ]
                })
            } else {
                setSelectedChat(doc.data())
            }
        })

    }

    useEffect(()=> {
        db.collection("all-users").doc(user.uid).collection("contacts")
        .onSnapshot(snapshot => {
            setContacts(snapshot.docs.map(doc => doc.data()))
        })
    },[])

    return (
        <>
            <AppBar className={classes.heading} position='static'>
                <Typography style={{ fontFamily: 'Montserrat', fontWeight: '700' }} variant='h4' align='center'>
                    Contacts
                </Typography>
            </AppBar>
            <Grid className={classes.container} xs={12} container direction='column'>
                {
                    contacts && contacts.map(contact => 
                        (
                            <Paper className={classes.paper} raised>
                                <Grid container direction='row' alignItems='center'>
                                    <Grid item xs={2}>
                                        <img className={classes.dp} src={contact.photoURL}/>
                                    </Grid>
                                    <Grid container item xs={8} direction='column'>
                                        <Typography style={{ fontFamily: 'Montserrat'}} variant='subtitle2'>{contact.name}</Typography>
                                        <Typography style={{ fontFamily: 'Montserrat'}} variant='caption'>{contact.email}</Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <IconButton onClick={()=> {handleChat(contact)}}><ChatIcon/></IconButton>
                                    </Grid>
                                </Grid>
                            </Paper>
                        )
                )}
            </Grid>
        </>
    )
}

export default Contacts
