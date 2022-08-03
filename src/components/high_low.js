import Button from '@mui/material/Button';
import '../App.css';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row } from 'reactstrap';
import { Card } from 'reactstrap';
import { Col } from 'reactstrap';
import { CardTitle } from 'reactstrap';
import { CardText } from 'reactstrap';
import {Howl, Howler} from "howler";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import CountUp from 'react-countup';

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
  const [curSong, setCurSong] = useState('');


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
    // console.log(songs)
 
    const minn = 0;
    var maxx = songs.length - 1;
    var randomNumber = Math.floor(minn + Math.random() * (maxx - minn));
    const randTrack = songs[randomNumber];

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
    const GET_USER_TRACKS_URL = "https://api.spotify.com/v1/playlists/"

    playlists.items.map ((item) => { 
      PLAYLIST_ID = item.id
      var OFFSET = 0

      if (item.tracks.total > 100) {
        const minn = 0;
        var maxx = item.tracks.total - 1 -100;
        OFFSET = Math.floor(minn + Math.random() * (maxx - minn));
      }

      fetch(GET_USER_TRACKS_URL + PLAYLIST_ID + "/tracks?limit=100&offset=" + OFFSET, trackParams)  
      .then((response) => response.json())
      // .then(data => console.log(data.items)) 
      .then(data => {
        for (let i = 0; i < data.items.length; i++){
          if (data.items[i].track.popularity >= 10) {
            setTracks(prevState => [...prevState, data.items[i]])
          }
          // console.log(data.items[i])
        }
      })
      .catch((err) => console.log(err))
    })
    await sleep(1000) // find a better way this is garbage
    setTracksFlag(true) 
  }

  function sleep(time){
    return new Promise((resolve)=>setTimeout(resolve,time))
  }

  const handlePlay = (src) => {
    const sound = new Howl ({
      src,
      html5: true,
    });
    sound.play();
    setCurSong(sound);
  }

  const handlePause = () => {
    curSong.pause()
    setCurSong('');
  }

  Howler.volume(0.05);

  const isSomethingPlaying = () => {
    if (curSong === ''){
      return false
    }
    return true
  }

  const bgColor = "#1A1A1A"; //#1A1A1A
  const transition = false;
  const heightt = "100vh"


  return (
    <div className="HighLow">
      {/* {props.accountID} */}

      {gameActive ? 
      <div>
        <Row style={{height: heightt, backgroundColor: bgColor}}>    
          <Col sm="1"> </Col> 
          <Col sm="4">
            <Card body style={{backgroundColor: bgColor, marginTop: '30%', color:'white', border:'none'}}> 
              <CardTitle tag="h1">
                <img src={leftTrack?.track?.album.images[1].url} alt=""/> <br/>
                {leftTrack?.track?.name} 
              </CardTitle>
              <CardText>
                by <br/>
                <h3>{leftTrack?.track?.artists[0]?.name}</h3> <br/> 

                <h4>Popularity Score: {leftTrack.track.popularity}</h4> <br/>  

                {leftTrack?.track?.preview_url && !(isSomethingPlaying()) && 
                <PlayCircleOutlineIcon onClick = {() => handlePlay(leftTrack?.track?.preview_url)}/>     
                }

                {leftTrack?.track?.preview_url && isSomethingPlaying() &&  
                <PauseCircleOutlineIcon onClick = {() => handlePause()}/>
                }  

              </CardText>
            </Card>
          </Col>
          
          <Col sm="2" style={{backgroundColor: bgColor, color:'white'}}>
            <h5>Score: {score}</h5>
            <h1 style={{position:'relative', top:'45%'}}>VS</h1>
          </Col>

          <Col sm="4">
            <Card body style={{backgroundColor: bgColor, marginTop: '30%', color:'white', border:'none'}}>
              <CardTitle tag="h1">
                <img src={rightTrack?.track?.album.images[1].url} alt=""/> <br/>
                {rightTrack?.track?.name}
              </CardTitle>
              <CardText> 
                by <br/>
                <h3>{rightTrack?.track?.artists[0]?.name}</h3> <br/>
                
                <h4>Popularity Score: {transition ? <CountUp end={rightTrack.track.popularity}/> : '???'}</h4> <br/>  

                {rightTrack?.track?.preview_url && !(isSomethingPlaying()) && 
                <PlayCircleOutlineIcon onClick = {() => handlePlay(rightTrack?.track?.preview_url)}/> 
                }

                {rightTrack?.track?.preview_url && isSomethingPlaying() &&  
                <PauseCircleOutlineIcon onClick = {() => handlePause()}/>     
                }

                {!rightTrack?.track?.preview_url &&  
                <PauseCircleOutlineIcon style={{color:bgColor}}/>     
                }

                <br />
                <br />

                <Button variant="contained" color="error" style={{width:'30%', marginLeft: '0%'}} onClick = {() => handleLower(leftTrack, rightTrack)} > 
                  Lower
                </Button>
                <Button variant="contained" color="success" style={{width:'30%', marginLeft: '0%'}} onClick = {() => handleHigher(leftTrack, rightTrack)}> 
                    Higher
                </Button>
                 

              </CardText>
            </Card>
          </Col>
          <Col sm="1"> </Col> 
          
        </Row>
      </div> 
      : 
      <div style={{backgroundColor: bgColor, color:'white', height: heightt}}>
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

