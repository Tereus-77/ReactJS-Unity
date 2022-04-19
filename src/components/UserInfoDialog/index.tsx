import { Dialog, DialogTitle, DialogContent, DialogActions,
	Button, Box, IconButton, Typography, TextField, } from '@material-ui/core';
  import { Close } from '@material-ui/icons';
import React, { useState } from 'react';

const UserInfoDialog = () => {
	const [username, setUsername] = useState("111User");
	const [useremail, setUseremail] = useState("111Email");
	const nameChange = function(e) {
        setUsername(e.target.value);
    }
	const emailChange = function(e) {
        setUseremail(e.target.value);
    }
	return (
	  <Dialog open={true} maxWidth="sm" fullWidth>
		<DialogTitle>New wallet was detected, <br/>
			would you like to change user name?</DialogTitle>
		<Box position="absolute" top={0} right={0}>
		  <IconButton>
			<Close />
		  </IconButton>
		</Box>
		<DialogContent>
		  <Typography>UserName : </Typography>
		  <TextField value={username} inputProps={{min: 0, style: { textAlign: 'center' }}} onChange={nameChange}></TextField>
		</DialogContent>
		<DialogContent>
		  <Typography>User Email : </Typography>
		  <TextField value={useremail} inputProps={{min: 0, style: { textAlign: 'center' }}} onChange={emailChange}></TextField>
		</DialogContent>
		<DialogActions>
		  <Button color="primary" variant="contained">
			Cancel
		  </Button>
		  <Button color="secondary" variant="contained">
			Update
		  </Button>
		</DialogActions>
	  </Dialog>
	);
  };
  
  export default UserInfoDialog;