import '../App.css';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';

const SubmitButton = styled(Button) ({
    boxShadow: 'none',
    color: 'white',
    backgroundColor: 'black',
    lineHeight: 1.5,
    fontSize: 16,
})


function Login(props) {
    
    const [input, setInput] = useState("");

  return (
    <div className="Login">
        <Grid container spacing={0.3} style={{marginTop:'15%', backgroundColor:'white'}}>
            <Grid item xs={12}>
            <h2>Insert Your Spotify ID</h2>  
            <TextField id="outlined-basic" label="Spotify ID" variant="outlined" style = {{width: '500px'}} onInput={e => setInput(e.target.value)} />
            </Grid>

            <Grid item xs={12}>
            <SubmitButton variant="contained" style = {{width: '500px'}} onClick={() => props.updateID(input)}>Submit</SubmitButton>
            </Grid> 

            <br/> <br/>

            <Grid item xs={12}>
            <Button variant="contained" style = {{width: '500px', backgroundColor:'green'}} onClick={() => props.updateID("spotify")}>Use Random Songs</Button>
            </Grid>
            
      </Grid>
    </div>
  );
}

export default Login;