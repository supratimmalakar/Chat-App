import React, { useState, useEffect, useRef } from 'react'
import SignOut from './SignOut'
import { db } from '../firebase'
import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import SendMessage from './SendMessage'

const useStyles = makeStyles({
    item: {
        padding: '2px 20px !important'
    }
})

const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
};

function Chat({ user }) {
    const classes = useStyles()
    const [messages, setMessages] = useState([])
    useEffect(() => {
        db.collection('messages').orderBy('createdAt').limit(50).onSnapshot(snapshot => {
            setMessages(snapshot.docs.map(doc => doc.data()))
        })
    }, []);


    return (
        <Grid container xs={12} justifyContent='center'>
            <Grid container xs={3} style={{ minWidth: '350px' }}>
                <Grid id="chat-window-container" container xs={12} style={{ height: '90vh', overflowY: 'scroll' }}>
                    {messages.map(({ text, uid, createdAt, photoURL }) => {
                        console.log(photoURL)
                        return (
                            <Grid container style={{ margin: '5px 0px' }} direction={uid == user.uid ? 'row-reverse' : 'row'} alignItems='center' spacing={2} alignContent='center'>
                                <Grid item>
                                    <img style={{ width: '25px', height: '25px', borderRadius: '50%', border: '1px solid rgba(0, 0, 0, 0.28)' }} src={photoURL} />
                                </Grid>
                                <Grid className={classes.item} item style={{ borderRadius: '25px', border: '1px solid rgba(0, 0, 0, 0.28)', maxWidth: '200px' }}>
                                    <Typography align='left' variant='subtitle1'>{text}</Typography>
                                </Grid>
                            </Grid>)
                    }
                    )}
                    <AlwaysScrollToBottom />
                </Grid>
                <SendMessage user={user} />
            </Grid>
        </Grid>
    )
}

export default Chat
