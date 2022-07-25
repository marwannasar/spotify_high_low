import Button from '@mui/material/Button';
import '../App.css';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row } from 'reactstrap';
import { Card } from 'reactstrap';
import { Col } from 'reactstrap';
import { CardTitle } from 'reactstrap';
import { CardText } from 'reactstrap';

function HighLow(props) {


  const GET_USER_PLAYLISTS_URL = "https://api.spotify.com/v1/users/" + props.accountID + "/playlists"

  const [token, setToken] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [tracksFlag, setTracksFlag] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [leftTrack, setLeftTrack] = useState('');
  const [rightTrack, setRightTrack] = useState('');
  const [score, setScore] = useState(0);

  useEffect (() => {

    var authParams = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + process.env.REACT_APP_CLIENT_ID + '&client_secret=' + process.env.REACT_APP_CLIENT_SECRET
    }

    fetch('https://accounts.spotify.com/api/token', authParams) 
      .then(result => result.json())
      .then(data => setToken(data.access_token))
      .catch((err) => console.log(err))
  }, []);

  useEffect (() => {
    if (token !== "") {
      getPlaylists(props.accountID)
    }
  }, [token]);

  useEffect (() => {
    if (playlists !== [] && token !== "") {
      getTracks(playlists)
    }
  }, [playlists]);

  useEffect (() => {
    if (tracksFlag === true && playlists !== [] && token !== "") {
      //console.log("tracks: " + tracks.length, tracks)
      setGameActive(true)
      startGame(tracks)
    }
  }, [tracksFlag]);


  const startGame = (songs) => {
    console.log("game started");

    setLeftTrack(getRandomTrack(songs))
    setRightTrack(getRandomTrack(songs))
    
  }

  const handleRestart = () => {
    setScore(0)
    setGameActive(true)
    startGame(tracks)
  }

  const getRandomTrack = (songs) => {
    const minn = 0;
    var maxx = songs.length - 1;
    var randomNumber = Math.floor(minn + Math.random() * (maxx - minn));
    const randPlaylist = songs[randomNumber];

    maxx = randPlaylist.length - 1
    randomNumber = Math.floor(minn + Math.random() * (maxx - minn));
    const randTrack = randPlaylist[randomNumber]

    // console.log(randTrack)
    return randTrack
  }

  const handleHigher = (left, right) => {
    if (right.track.popularity >= left.track.popularity){    
      setScore(score + 1)
      setLeftTrack(right)
      setRightTrack(getRandomTrack(tracks))
    }
    else{
      setGameActive(false)
    }
  }

  const handleLower = (left, right) => {
    if (right.track.popularity <= left.track.popularity){    
      setScore(score + 1)
      setLeftTrack(right)
      setRightTrack(getRandomTrack(tracks))
    }
    else{
      setGameActive(false)
    }
  }


  function getPlaylists(id) {
    var playlistParams = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }

    fetch(GET_USER_PLAYLISTS_URL + "?limit=50", playlistParams)
      .then((response) => response.json())
      // .then (data => console.log(data))
      .then(data => setPlaylists(data))
      .catch((err) => console.log(err))

  }

  async function getTracks() { 
    var trackParams = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }
    var PLAYLIST_ID;
    // const GET_USER_TRACKS_URL = "https://api.spotify.com/v1/playlists/2UDgWc41JpM2Y2ZYTQ8M3d/tracks"
    const GET_USER_TRACKS_URL = "https://api.spotify.com/v1/playlists/"

    playlists.items.map ((item) => {
      PLAYLIST_ID = item.id

      fetch(GET_USER_TRACKS_URL + PLAYLIST_ID + "/tracks", trackParams)
      .then((response) => response.json())
      // .then(data => console.log(data.items)) overhere
      .then(data => setTracks(prevState => [...prevState, data.items]))
      .catch((err) => console.log(err))
    })
    await sleep(400) // find a better way this is garbage
    setTracksFlag(true) 
  }

  function sleep(time){
    return new Promise((resolve)=>setTimeout(resolve,time)
  )
}


  return (
    <div className="HighLow">
      {/* {props.accountID} */}

      {gameActive ? 
      <div>
        <Row style={{height: '100vh', backgroundColor: '#050524'}}>
          <Col sm="1"></Col>
          <Col sm="4">
            <Card body style={{backgroundColor: '#050524', marginTop: '30%', color:'white'}}> 
              <CardTitle tag="h1">
                <img src={leftTrack?.track?.album.images[1].url} alt=""/> <br/>
                {leftTrack?.track?.name} 
              </CardTitle>
              <CardText>
                by <br/>
                <h3>{leftTrack?.track?.artists[0]?.name}</h3> <br/>
                <h4>Popularity Score: {leftTrack.track.popularity}</h4> <br/>                
              </CardText>
            </Card>
          </Col>
          
          <Col sm="2"><h5 style={{color:'white'}}>Score: {score}</h5></Col>

          <Col sm="4">
            <Card body style={{backgroundColor: '#050524', marginTop: '30%', color:'white'}}>
              <CardTitle tag="h1">
                <img src={rightTrack?.track?.album.images[1].url} alt=""/> <br/>
                {rightTrack?.track?.name}
              </CardTitle>
              <CardText> 
                by <br/>
                  <h3>{rightTrack?.track?.artists[0]?.name}</h3> <br/>

                  {/* <h4>Popularity Score: {rightTrack.track.popularity}</h4> */}
              </CardText>
              <Button variant="contained" color="success" style={{width:'50%', marginLeft: '25%'}} onClick = {() => handleHigher(leftTrack, rightTrack)}> 
                Higher
              </Button>
              <Button variant="contained" color="error" style={{width:'50%', marginLeft: '25%'}} onClick = {() => handleLower(leftTrack, rightTrack)} >
                Lower
              </Button> 
            </Card>
          </Col>
          <Col sm="1"></Col>
          
        </Row>
      </div> : 
      <div style={{height: '100vh', backgroundColor: '#050524', color:'white'}}>
        <h1>Your Score is: {score}</h1>
        <Button variant="contained" color="success" style={{width:'50%'}} onClick = {() => handleRestart()} >
                Play Again
        </Button> 
       
      </div>}

      {/* {playlists?.items ? playlists.items.map((item) => <p>{item.name}</p>): <p>wownotthere</p>} */}
    </div>
  );
}

export default HighLow;

