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

const useStyles = makeStyles({
    heading: {
        padding: '10px',
    },
    container: {
        overflowY: 'auto'
    },
    dp: {
        width: '50px',
        height: '50px',
        borderRadius: '50%'
    },
    paper: {
        margin: '5px 0',
        padding: '3px',
        cursor : 'pointer'
    },
})

function ChatList({ user, selectedChat, setSelectedChat }) {
    const classes = useStyles()
    const [chats, setChats] = useState([])
    useEffect(() => {
        db.collection("chats").where("idArray","array-contains",user.uid)
            .onSnapshot(snapshot => {
                setChats(snapshot.docs.map(doc => doc.data()))
            })
    }, [])
    useEffect(()=> {
        setSelectedChat(chats[0])
    }, [chats])
    return (
        <>
            <AppBar className={classes.heading} position='static'>
                <Typography variant='h4' align='center'>
                    Chats
                </Typography>
            </AppBar>
            <Grid className={classes.container} xs={12} container direction='column'>
                {
                    chats && chats.map(chat =>
                    {   
                        var participants = [...chat.participants];
                        var removeIndex = participants.map(participant => participant.uid).indexOf(user.uid)
                        participants.splice(removeIndex, 1);
                        const contact = participants[0]
                        return (
                            <Paper className={classes.paper} style={{ backgroundColor: selectedChat && selectedChat.id === chat.id ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.04)'}} raised onClick={()=> {setSelectedChat(chat)}}>
                            <Grid container direction='row' alignItems='center'>
                                <Grid item xs={2}>
                                    <img className={classes.dp} src={contact.photoURL} />
                                </Grid>
                                <Grid container item xs={10} direction='column'>
                                    <Typography variant='subtitle2'>{contact.name}</Typography>
                                    <Typography variant='caption'>{contact.email}</Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    )}
                    )}
            </Grid>
        </>
    )
}

export default ChatList
