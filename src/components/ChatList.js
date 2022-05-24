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
        height : '74px',
        display : 'flex',
        flexDirection :'row',
        alignItems : 'center',
        justifyContent : 'center'
    },
    container: {
        overflowY: 'auto',
        padding : '0 10px'
    },
    dp: {
        width: '50px',
        height: '50px',
        borderRadius: '50%'
    },
    paper: {
        margin: '5px 0',
        padding: '3px',
        cursor : 'pointer',
    },
})

function ChatList({ user, selectedChat, setSelectedChat, selectedContact, setSelectedContact }) {
    const classes = useStyles()
    const [chats, setChats] = useState([])
    const [contact, setContact] = useState(null)
    const [lastMsg, setLastMsg] = useState({})
    useEffect(() => {
        db.collection("chats").where("idArray","array-contains",user.uid)
            .onSnapshot(snapshot => {
                setChats(snapshot.docs.map(doc => doc.data()))
            })
    }, [])
    useEffect(()=> {
        setSelectedChat(chats[0])
    }, [chats])

    useEffect(()=> {

    }, [chats,lastMsg])

    const getLastMsg = (chatId) => {
        db.collection('chats').doc(chatId).collection('messages').orderBy('createdAt', "desc").limit(1)
            .onSnapshot(snapshot => {
                console.log("chatId " + chatId)
                setLastMsg(snapshot.docs.map(doc => doc.data())[0])
            })
        return lastMsg.text
    }
    // useEffect(()=> {
    //     setSelectedContact(contact)
    // },[contact])

    return (
        <>
            <AppBar className={classes.heading} position='static'>
                <Typography style={{ fontFamily: 'Montserrat', fontWeight : '700' }} variant='h4' align='center'>
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
                        // var lastMessage = []
                        // db.collection('chats').doc(chat.id).collection('messages').orderBy('createdAt', "desc").limit(1)
                        // .onSnapshot(snapshot => {
                        //         console.log("chatId " + chat.id)
                        //         console.log(snapshot.docs.map(doc => doc.data())[0])
                        // })
                        // console.log(lastMessage)
                        return (
                            <Paper className={classes.paper} style={{ backgroundColor: selectedChat && selectedChat.id === chat.id ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.09)'}} raised onClick={()=> {setSelectedChat(chat)}}>
                            <Grid container direction='row' alignItems='center'>
                                <Grid item xs={2}>
                                    <img className={classes.dp} src={contact.photoURL} />
                                </Grid>
                                <Grid container item xs={10} direction='column'>
                                    <Typography style={{ fontFamily: 'Montserrat' }} variant='subtitle2'>{contact.name}</Typography>
                                    <Typography style={{ fontFamily: 'Montserrat' }} variant='caption'>{() => getLastMsg(chat.id)}</Typography>
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
