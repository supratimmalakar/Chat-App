import React, { useState, useEffect } from 'react'
import {
    Grid,
    Typography,
    Dialog,
    DialogTitle,
    makeStyles,
    IconButton,
    Button,
    TextField,
    Card,
    Snackbar
} from '@material-ui/core'
import { Request, Cross } from '../assets/CustomIcons'
import { db } from '../firebase'

const useStyles = makeStyles({
    dialog: {
        '& .MuiPaper-root': {
            padding: '5px 30px'
        }
    },
    image: {
        width: '25px',
        height: '25px',
        borderRadius: '50%',
        border: '2px solid rgba(0,0,0,0.28)',
        display: 'block'
    }
})

function Requests({ user }) {
    const classes = useStyles()
    const [open, setOpen] = useState(false)
    const [reqs, setReqs] = useState([])
    const [toastVariant, setToastVariant] = useState("success")
    const [toastOpen, setToastOpen] = useState(false)

    const handleAcceptReq = async (req) => {
        var sentDeleted = false;
        var recievedDeleted = false;
        var contactAdded1 = false;
        var contactAdded2 = false;
        var sentReqArr = []
        await db.collection("all-users").doc(req.from.uid).collection("sent-requests").where("to.uid", "==", user.uid)
        .get()
        .then(res => {
            res.forEach(doc => {
                sentReqArr.push({
                    id : doc.id,
                    ...doc.data()
                })
            })
        })
        await db.collection("all-users").doc(req.from.uid).collection("sent-requests").doc(sentReqArr[0].id)
        .delete()
        .then(res => {
            sentDeleted = true;
        })
        .catch(err => {
            console.log(err).
            sentDeleted = false
        })
        await db.collection("all-users").doc(user.uid).collection("recieved-requests").doc(req.id)
        .delete()
        .then(res => {
            recievedDeleted = true;
        })
        .catch(err => {
            console.log(err)
            recievedDeleted = false;
        })
        await db.collection("all-users").doc(user.uid).collection("contacts").doc(req.from.uid).set({
            ...req.from
        })
        .then(res => {
            contactAdded1 = true;
        })
        .catch(err => {
            console.log(err)
            contactAdded1 = false
        })

        await db.collection("all-users").doc(req.from.uid).collection("contacts").doc(user.uid).set({
            name : user.displayName,
            email : user.email,
            photoURL : user.photoURL,
            uid : user.uid
        })
            .then(res => {
                contactAdded2 = true;
            })
            .catch(err => {
                console.log(err)
                contactAdded2 = false
            })

        if (sentDeleted && recievedDeleted && contactAdded1 && contactAdded2) {
            setToastOpen(true)
            setToastVariant("success")
        } else {
            setToastOpen(true)
            setToastVariant("error")
        }
    }

    useEffect(()=> {
        // getAllReqs()
        db.collection("all-users").doc(user.uid).collection("recieved-requests").orderBy('createdAt')
        .onSnapshot(snapshot => {
            setReqs(snapshot.docs.map(doc => (
                {
                    id : doc.id
                    , ...doc.data()
                })
            ))
        })
    },[])

    return (
        <>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={toastOpen}
                autoHideDuration={3000}
                onClose={() => setToastOpen(false)}
                message={toastVariant === 'success' ? 'Request Accepted' : 'Error'}
                action={[
                    <IconButton onClick={() => setToastOpen(false)}>
                        <Cross color="#fff"/>
                    </IconButton>
                ]}
            />
            <IconButton onClick={() => setOpen(true)}><Request color="#fff" /></IconButton>
            <Dialog className={classes.dialog} open={open}>
                <DialogTitle>
                    <Typography variant='h6'>Requests</Typography>
                </DialogTitle>
                <Grid container direction='column' alignItems='center'>
                    {
                        reqs.length > 0 && 
                        reqs.map(req => (
                            <Grid container item direction='row'>
                                <img className={classes.image} src={req.from.photoURL}/>
                                <Typography>
                                    {req.from.name}({req.from.email})
                                </Typography>
                                <Button onClick={() => handleAcceptReq(req)}>
                                    Accept
                                </Button>
                            </Grid>
                        )) 
                    }
                </Grid>
                <Button
                    onClick={() => {
                        setOpen(false);
                    }}
                >
                    Close
                </Button>
            </Dialog>
        </>
    )
}

export default Requests
