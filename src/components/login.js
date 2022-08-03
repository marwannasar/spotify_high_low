import '../App.css';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Row } from 'reactstrap';
import { Card } from 'reactstrap';
import { Col } from 'reactstrap';
import { CardText } from 'reactstrap';

const SubmitButton = styled(Button) ({
    boxShadow: 'none',
    color: 'white',
    backgroundColor: 'black',
    lineHeight: 1.5,
    fontSize: 16,
})


function Login(props) {
    
    const [input, setInput] = useState("");
    const widthh = "30vw"
    const widthh2 = "10vw"

    const bgColor = "#1A1A1A"; //#1A1A1A
    const heightt = "100vh"

  return (
    <div className="Login"> 
      <Row style={{height: heightt, backgroundColor: bgColor}}>   
        <Col sm="4"> </Col> 
        <Col sm="4"> 
          <Card body style={{backgroundColor: 'white', marginTop: '30vh', border:'none'}}> 
            <CardText>
              <h2>Insert Your Spotify ID</h2>  
              <TextField id="outlined-basic" label="Spotify ID" variant="outlined" style = {{width: widthh}} onInput={e => setInput(e.target.value)} />
              <SubmitButton variant="contained" style = {{width: widthh2}} onClick={() => props.updateID(input)}>Submit</SubmitButton>
              <h2> OR </h2>
              <Button variant="contained" style = {{width: widthh, backgroundColor:'green'}} onClick={() => props.updateID("spotify")}>Use Random Songs</Button>
            </CardText>
          </Card>
        </Col> 
        <Col sm="4"> </Col> 

      </Row>
    </div>
  );
}

export default Login;