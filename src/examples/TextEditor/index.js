import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { EditorState,ContentState  } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Modal from 'react-modal';
import {IconButton,Box} from '@mui/material'
import {EditOutlined} from '@mui/icons-material'
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import Typography from '@mui/material/Typography';



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PopupModel({item}) {
  const [open, setOpen] = React.useState(false);
  const [pop, setPop] = React.useState(false);
  const initialContent = ContentState.createFromText("Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica.They vary greatly in size, shape, and color, from the tiny dwarf geckos that can fit on a penny to the massive Komodo dragons that can grow up to 10 feet long. Lizards are known for their ability to regenerate lost body parts and their unique defense mechanisms, such as the ability to detach their tails or change color to blend into their surroundings. Many lizards are also popular pets, but its important to do thorough research and provide proper care for their specific species needs.");

  const [editorState, setEditorState] = useState(EditorState.createWithContent(initialContent));

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [maxWidth, setMaxWidth] = React.useState('lg');
  const handleEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickPop = () => {
    setPop(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClose2 = () => {
    setPop(false);
  };

  return (
    <div>
        

            <MDButton variant="gradient" onClick={handleClickPop} color="info">
          
          &nbsp;view
        </MDButton>
     {
      pop && !open?(
        <Dialog
        open={pop}
        TransitionComponent={Transition}
        keepMounted
        maxWidth = {maxWidth}
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Requested NFT Details"}</DialogTitle>
        <DialogContent>
        <Card sx={{ maxWidth: 600,maxHeight:700 }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image={item.metadata.images[0]}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {item.metadata.propertyName}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Type: {item.metadata.propertyType} | Address: {item.metadata.propertyAddress} | Location: {item.metadata.propertyLocation}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Owner: {item.metadata.propertyOwner} | Price: {item.metadata.price} ETH | Status: {item.metadata.propertyStatus}
        </Typography>
      </CardContent>
   
    </Card>
        </DialogContent>
        <DialogActions>
          <Button sx={{color:'black'}} onClick={handleClose2}>Close</Button>
          <MDButton variant="gradient" onClick={handleClickOpen} color="success">
         
          &nbsp;Edit
        </MDButton>
        </DialogActions>
      </Dialog>
      ):(
        <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        fullScreen
        onClose={handleClose2}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Edit News"}</DialogTitle>
        <DialogContent>
      
        </DialogContent>
        <DialogActions>
          <Button sx={{color:'black'}} onClick={handleClose}>Cancel</Button>
          <MDButton variant="gradient" onClick={handleClose} color="success">
          <Icon sx={{ fontWeight: "bold" }}>update</Icon>
          &nbsp;Update
        </MDButton>
        </DialogActions>
      </Dialog>
      )
     }
    </div>
  );
}