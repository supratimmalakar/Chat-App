import React, { useState, useEffect, useRef } from 'react'
import SignOut from './SignOut'
import { db } from '../firebase'
import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import SendMessage from './SendMessage'

const useStyles = makeStyles({
    item: {
        padding: '2px 20px !important'
    },
    messageContainer: {
        height: '85vh', 
        overflowY: 'auto'
    },
    image : {
        width: '25px', 
        height: '25px', 
        margin: '0 4px',
        borderRadius: '50%', 
        border: '1px solid rgba(0, 0, 0, 0.28)'
    }
})

const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
};

function Chat({ user, selectedChat }) {
    const classes = useStyles()
    const [messages, setMessages] = useState([])
    // useEffect(() => {
    //     db.collection('messages').orderBy('createdAt').limit(50).onSnapshot(snapshot => {
    //         setMessages(snapshot.docs.map(doc => doc.data()))
    //     })
    // }, []);
    useEffect(()=> {
        if (selectedChat) {
            db.collection('chats').doc(selectedChat.id).collection('messages').orderBy('createdAt')
            .onSnapshot(snapshot => {
                setMessages(snapshot.docs.map(doc => doc.data()))
            })
        }
    }, [selectedChat])
    return (
        <Grid container xs={12}>
            <Grid className={classes.messageContainer} id="chat-window-container" direction='column' justifyContent='flex-end' container xs={12}>
                {messages.map(({ text, uid, createdAt, photoURL }) => {
                    return (
                        <Grid container style={{ margin: '5px 0px' }} direction={uid == user.uid ? 'row-reverse' : 'row'} alignItems='center' alignContent='center'>
                            <Grid item>
                                <img className={classes.image} src={photoURL} />
                            </Grid>
                            <Grid className={classes.item} item style={{ borderRadius: '25px', border: '1px solid rgba(0, 0, 0, 0.28)', maxWidth: '200px' }}>
                                <Typography align='left' variant='subtitle1'>{text}</Typography>
                            </Grid>
                        </Grid>)
                }
                )}
                <AlwaysScrollToBottom />
            </Grid>
            <SendMessage selectedChat={selectedChat} user={user} />
        </Grid>
    )
}

export default Chat
