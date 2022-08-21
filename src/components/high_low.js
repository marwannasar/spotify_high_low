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
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUp from '@mui/icons-material/VolumeUp';

function HighLow(props) {


  const GET_USER_PLAYLISTS_URL = "https://api.spotify.com/v1/users/" + props.accountID + "/playlists"

  const [token, setToken] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [tracksFlag, setTracksFlag] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [gameLoaded, setGameLoaded] = useState(false);
  const [leftTrack, setLeftTrack] = useState('');
  const [rightTrack, setRightTrack] = useState('');
  const [score, setScore] = useState(0);
  const [highscore, sethighscore] = useState(0);
  const [curSong, setCurSong] = useState('');
  const [volume, setVolume] = useState(0.4);
  const [transition, setTransition] = useState(false);


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
      Howler.volume(volume/divider);
      setGameActive(true)
      setGameLoaded(true)
      startGame(tracks) 
    }
  }, [tracksFlag]);

  const startGame = (songs) => {
    console.log("game started!");
    sethighscore(parseInt(localStorage.getItem("highscore")) ?? 0)
    setLeftTrack(getRandomTrack(songs))
    setRightTrack(getRandomTrack(songs))
    
  }

  const handleRestart = () => {
    updateHighScore(score)
    setScore(0)
    setGameActive(true)
    startGame(tracks)
  }

  const updateHighScore = (score) => {
    const highScore = parseInt(localStorage.getItem("highscore")) ?? 0;
    if (!highScore || score > highScore) {
      localStorage.setItem("highscore", score);
    }
  }

  const getRandomTrack = (songs) => {
    // console.log(songs)
 
    const minn = 0;
    var maxx = songs.length - 1;
    var randomNumber = Math.floor(minn + Math.random() * (maxx - minn));
    const randTrack = songs[randomNumber];

    return randTrack
  }

  const handleHigher = async(left, right) => {
    setTransition(true)
    await sleep(duration*1000 + 750)
    setTransition(false)
    if (right.track.popularity >= left.track.popularity){    
      setScore(score + 1)
      setLeftTrack(right)
      setRightTrack(getRandomTrack(tracks))
    }
    else{
      setGameActive(false)
    }
  }

  const handleLower = async(left, right) => {
    setTransition(true)
    await sleep(duration*1000 + 750)
    setTransition(false)
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

  const getTracks = async () =>  { 
    var trackParams = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }
    var PLAYLIST_ID;
    const GET_USER_TRACKS_URL = "https://api.spotify.com/v1/playlists/"

    let promises = []

    for (let i = 0; i < playlists.items.length; i++){
      let item = playlists.items[i]
      PLAYLIST_ID = item.id
      var OFFSET = 0

      if (item.tracks.total > 100) {
        const minn = 0;
        var maxx = item.tracks.total - 1 -100;
        OFFSET = Math.floor(minn + Math.random() * (maxx - minn));
      }

      promises.push(fetch(GET_USER_TRACKS_URL + PLAYLIST_ID + "/tracks?limit=100&offset=" + OFFSET, trackParams)
      .then((response) => response.json())
      //.then(data => console.log(data.items)) 
      .then(data => {
        for (let i = 0; i < data.items.length; i++){
          if (data.items[i].track.popularity >= 10) {
            setTracks(prevState => [...prevState, data.items[i]])
          }
          // console.log(data.items[i])
        }
      })
      .catch((err) => console.log(err))
      )
    }

    await Promise.all(promises)
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

  const isSomethingPlaying = () => {
    if (curSong === ''){
      return false
    }
    return true
  }

  const handleVolume = (newVolume) => {
    // console.log(newVolume)
    setVolume(newVolume)
    Howler.volume(newVolume/divider);
  }

  const bgColor = "#1A1A1A"; //#1A1A1A
  const heightt = "100vh";
  const duration = 0.5;
  const divider = 3;
  

  return (
    <div>
      {gameActive && gameLoaded &&
      <div className = "HighLow" style={{backgroundColor: bgColor, height: heightt}}>
        <Row >    
          <Col sm="1" style={{color:'white'}}> 
            <p>Score: {score}</p>
          </Col> 
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
          
          <Col sm="2" style={{backgroundColor: bgColor, color:'white', paddingTop:'2vh'}}>
            <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
              <VolumeOffIcon />
              <Slider
                aria-label="Volume"
                defaultValue={0.1}
                valueLabelDisplay="auto"
                step={0.1}
                marks
                min={0}
                max={1}
                value={volume}
                onChange = {(e) => handleVolume(e.target.value)}
              />
              <VolumeUp />
            </Stack>

            <h1 style={{position:'relative', top:'40vh'}}>VS</h1>
            
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
                
                <h4>Popularity Score: {transition ? <CountUp duration={duration} end={rightTrack.track.popularity}/> : '???'}</h4> <br/>  

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
                
                {!transition ? 
                <div>
                  <Button variant="contained" color="error" style={{width:'30%', marginLeft: '0%'}} onClick = {() => handleLower(leftTrack, rightTrack)} > 
                    Lower
                  </Button>
                  <Button variant="contained" color="success" style={{width:'30%', marginLeft: '0%'}} onClick = {() => handleHigher(leftTrack, rightTrack)}> 
                      Higher
                  </Button>
                </div>
                : null}
                 

              </CardText>
            </Card>
          </Col>
          <Col sm="1" style={{color:'white'}}>
            <p>Best: {highscore}</p>
          </Col> 
          
        </Row>
      </div> }

      {!gameActive && gameLoaded && 
      <div style={{backgroundColor: bgColor, color:'white', height: heightt, textAlign: 'center', paddingTop: '22%'}}>
        <h1>Your Score is: {score}</h1>
        <Button variant="contained" color="success" style={{width:'50%'}} onClick = {() => handleRestart()} >
                Play Again
        </Button> 
      </div>}

      {!gameLoaded && 
      <div style={{backgroundColor: bgColor, color:'white', height: heightt, textAlign: 'center', paddingTop: '26%'}}>
        Loading...
      </div>
      }

    </div>
  );
}

export default HighLow;

