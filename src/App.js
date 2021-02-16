import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';

const tileSideLengthPx = 20;
const gridHeightSquares = 20;
const gridWidthSquares = 20;

function Square(props) {
  const color = props.color || "green";
  const top = props.top === undefined ? 0 : props.top;
  const left = props.left === undefined ? 0 : props.left;
  return (
    <div style = {{top: top, left: left, height: tileSideLengthPx, width: tileSideLengthPx, background: (props.color || "white"), position: "absolute"}} />
  )
}

function Grid(props) {
  var gridSquares = [];
  for (var y = 0; y < gridHeightSquares; y++) {
    var row = []
    for (var x = 0; x < gridWidthSquares; x++) {
      const xCoordPx = x * tileSideLengthPx;
      const yCoordPx = y * tileSideLengthPx;
      const color = props.gridColors[x][y];
      row.push(<Square top={yCoordPx} left={xCoordPx} color={color}/>);
    }
    gridSquares.push(row);
  }

  return gridSquares.flat();
}

function App() {
  // defined as px/sec?

  const [snakeLength, setSnakeLength] = useState(1);
  const [snakeVelocity, setSnakeVelocity] = useState({x: 1, y: 0});
  const [snakePositions, setSnakePositions] = useState([{x: 5, y: 5}]);
  const [foodPosition, setFoodPosition] = useState({x: 10, y: 10});
  const [keyPressed, setKeyPressed] = useState('');

  useEffect(() => {
    window.addEventListener('keydown', downHandle);
    return () => {
      window.removeEventListener('keydown', downHandle);
    }
  }, [snakePositions]);

  function downHandle({ key }) {
    if (key == 'w') {
      console.log('w pressed');
      setSnakeVelocity({x: 0, y: -1});
    } else if (key == 'a') {
      setSnakeVelocity({x: -1, y: 0});
    } else if (key == 's') {
      setSnakeVelocity({x: 0, y: 1});
    } else if (key == 'd') {
      setSnakeVelocity({x: 1, y: 0});
    }
    console.log("snakevelocity after press: ", key, snakeVelocity);
 }

  function stepGame() {
    const oldSnakePositions = snakePositions;
    var newSnakePositions = oldSnakePositions.slice();

    for (var i = oldSnakePositions.length - 1; i > 0; i--) {
      newSnakePositions[i] = oldSnakePositions[i-1];
    }

    // Treat head separate
    newSnakePositions[0].x += snakeVelocity.x;
    newSnakePositions[0].y += snakeVelocity.y;

    if (newSnakePositions[0].x < 0) {
      newSnakePositions[0].x = gridWidthSquares - 1;
    } else if (newSnakePositions[0].x >= gridWidthSquares) {
      newSnakePositions[0].x = 0;
    }

    if (newSnakePositions[0].y < 0) {
      newSnakePositions[0].y = gridHeightSquares - 1;
    } else if (newSnakePositions[0].y >= gridHeightSquares) {
      newSnakePositions[0].y = 0;
    }

    if (newSnakePositions[0].x == foodPosition.x && newSnakePositions[0].y == foodPosition.y) {
      const oldSnakeTail = oldSnakePositions[oldSnakePositions.length - 1];
      newSnakePositions.push({x: oldSnakeTail.x, y: oldSnakeTail.y});
      setFoodPosition({x: (foodPosition.x + 1203124) % 20, y: (foodPosition.y + 1290380123) % 20});
      console.log(newSnakePositions);
    }

    setSnakePositions(newSnakePositions);
  };

  var gridColors = [];
  for (var y = 0; y < gridHeightSquares; y++) {
    var row = [];
    for (var x = 0; x < gridWidthSquares; x++) {
      row.push("grey");
    }
    gridColors.push(row);
  }

  gridColors[foodPosition.y][foodPosition.x] = "brown";

  for (var i = 0; i < snakePositions.length; i++) {
    console.log(snakePositions[i].x, snakePositions[i].y);
    gridColors[snakePositions[i].x][snakePositions[i].y] = "lightgreen";
  }

  useEffect(() => {
    const timer = setInterval(() => {
      stepGame();
    }, 500);
    return () => clearInterval(timer);
  }, [snakeVelocity]);

  return (
    <Grid gridColors={gridColors} onKeyPress={(e) => console.log('on key press', e)} />
  );
}


export default App;
