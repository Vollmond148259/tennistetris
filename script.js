document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const LAYOUT = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ];
  const squares = [];
  const leftAngle = 9;
  const rightAngle = 11;
  const returnate = 10;
  const width = 10;
  const height = 20;
  let BOARD_CURRENT_INDEX = 197;
  let ballDirection = -1;
  let ballAngle = 9;
  let ballSpeed = 750;
  let currentKey = 0;
  let gameStarted = false;
  let timerId = NaN;
  let ballDefaultIndex = BOARD_CURRENT_INDEX - 11;
  let STONES_INDEX_ARRAY = [90, 30, 45, 23, 67];
  let TEST_STONE = [42, 44];
  //let WALL_INDEX_ARRAY = [10, 50, 90];
  function renderBattleField(array) {
    for (let i = 0; i < array.length; i++) {
      const square = document.createElement('div');
      grid.appendChild(square);
      square.innerText = i;

      squares.push(square);
      if (array[i] === 1) {
        squares[i].classList.add('wall');
      }
    }
  }
  renderBattleField(LAYOUT);
  console.log(squares);

  function renderSquareStones(stonesArray) {
    for (let index of stonesArray) {
      squares[index].classList.add('stone');
      squares[index + 1].classList.add('stone');
      squares[index + returnate].classList.add('stone');
      squares[index + rightAngle].classList.add('stone');
    }
  }
  function renderTestStones(stonesArray) {
    for (let index of stonesArray) {
      squares[index].classList.add('stone');
    }
  }
  function renderWallOfStones(stonesArray) {
    for (let index of stonesArray) {
      squares[index].classList.add('stone');
      squares[index + 1].classList.add('stone');
      squares[index + 2].classList.add('stone');
      squares[index + 3].classList.add('stone');
      squares[index + 4].classList.add('stone');
      squares[index + 5].classList.add('stone');
      squares[index + 6].classList.add('stone');
      squares[index + 7].classList.add('stone');
      squares[index + 8].classList.add('stone');
      squares[index + 9].classList.add('stone');
    }
  }

  function createBorders(startPoint, delta, length) {
    let iteration = 0;
    let value = startPoint;
    let borderArray = [];
    while (iteration < length) {
      borderArray.push(value);
      value += delta;
      iteration++;
    }
    return borderArray;
  }

  const topBorder = createBorders(0, 1, width);
  const leftBorder = createBorders(10, returnate, height);
  const rightBorder = createBorders(leftAngle + returnate, returnate, height);
  const bottomBorder = createBorders(190, 1, width);
  console.log(topBorder);
  console.log(leftBorder);
  console.log(rightBorder);
  console.log(bottomBorder);

  squares[ballDefaultIndex].classList.add('ball');

  function renderBoard() {
    squares[BOARD_CURRENT_INDEX].classList.add('board');
    squares[BOARD_CURRENT_INDEX - 1].classList.add('board');
    squares[BOARD_CURRENT_INDEX - 2].classList.add('board');
    squares[BOARD_CURRENT_INDEX - 3].classList.add('board');
  }

  function clearBoard() {
    squares[BOARD_CURRENT_INDEX].classList.remove('board');
    squares[BOARD_CURRENT_INDEX - 1].classList.remove('board');
    squares[BOARD_CURRENT_INDEX - 2].classList.remove('board');
    squares[BOARD_CURRENT_INDEX - 3].classList.remove('board');
  }

  function clearBall() {
    squares[ballDefaultIndex].classList.remove('ball');
  }
  function renderBall() {
    squares[ballDefaultIndex].classList.add('ball');
  }

  function changeBallAngle(angle) {
    if (angle === leftAngle) {
      return rightAngle;
    }
    if (angle === rightAngle) {
      return leftAngle;
    }
  }

  function changeBallDirection(direction) {
    if (direction === 1) {
      return -1;
    }
    if (direction === -1) {
      return 1;
    }
  }

  function whereBallCollide(
    right,
    left,
    top,
    bottom,
    rightTop,
    leftTop,
    rightBottom,
    leftBottom
  ) {
    if (right && bottom) {
      return 'rightAndBottom';
    }
    if (left && bottom) {
      return 'leftAndBottom';
    }
    if (right && top) {
      return 'rightAndTop';
    }
    if (left && top) {
      return 'leftAndTop';
    }
    if (right) {
      return 'right';
    }
    if (left) {
      return 'left';
    }
    if (top) {
      return 'top';
    }
    if (bottom) {
      return 'bottom';
    }
    if (rightTop) {
      return 'rightTop';
    }
    if (leftTop) {
      return 'leftTop';
    }

    if (leftBottom) {
      return 'leftBottom';
    }
    if (rightBottom) {
      return 'rightBottom';
    }
  }
  function checkCollideBallAndStone(ballIndex) {
    if (ballIndex >= 9) {
      console.log('start collide ball and stone' + ballIndex);
      let changeAngle = false;
      let changeDirection = false;
      let rightSide = ballIndex + 1;
      let leftSide = ballIndex - 1;
      let topSide = ballIndex - returnate;
      let bottomSide = ballIndex + returnate;
      let leftTopSide = ballIndex - rightAngle;
      let rightTopSide = ballIndex - leftAngle;
      let leftBottomSide = ballIndex + leftAngle;
      let rightBottomSide = ballIndex + rightAngle;

      let rightStone = squares[rightSide].classList.contains('stone');
      let leftStone = squares[leftSide].classList.contains('stone');
      let topStone = squares[topSide].classList.contains('stone');
      let bottomStone = squares[bottomSide].classList.contains('stone');
      let rightTopStone = squares[rightTopSide].classList.contains('stone');
      let leftTopStone = squares[leftTopSide].classList.contains('stone');
      let rightBottomStone =
        squares[rightBottomSide].classList.contains('stone');
      let leftBottomStone = squares[leftBottomSide].classList.contains('stone');

      let collidePlace = whereBallCollide(
        rightStone,
        leftStone,
        topStone,
        bottomStone,
        rightTopStone,
        leftTopStone,
        rightBottomStone,
        leftBottomStone
      );

      switch (collidePlace) {
        case 'right': {
          squares[rightSide].classList.remove('stone');
          squares[rightSide].classList.add('wall');
          changeAngle = true;
          break;
        }
        case 'rightAndTop': {
          squares[rightSide].classList.remove('stone');
          squares[rightSide].classList.add('wall');
          squares[topSide].classList.remove('stone');
          squares[topSide].classList.add('wall');
          changeDirection = true;
          break;
        }
        case 'leftAndTop': {
          squares[leftSide].classList.remove('stone');
          squares[leftSide].classList.add('wall');
          squares[topSide].classList.remove('stone');
          squares[topSide].classList.add('wall');
          changeDirection = true;
          break;
        }
        case 'rightAndBottom': {
          squares[rightSide].classList.remove('stone');
          squares[rightSide].classList.add('wall');
          squares[bottomSide].classList.remove('stone');
          squares[bottomSide].classList.add('wall');
          changeDirection = true;
          break;
        }
        case 'leftAndBottom': {
          squares[leftSide].classList.remove('stone');
          squares[leftSide].classList.add('wall');
          squares[bottomSide].classList.remove('stone');
          squares[bottomSide].classList.add('wall');
          changeDirection = true;
          break;
        }

        case 'left': {
          squares[leftSide].classList.remove('stone');
          squares[leftSide].classList.add('wall');
          changeAngle = true;
          break;
        }
        case 'top': {
          squares[topSide].classList.remove('stone');
          squares[topSide].classList.add('wall');
          changeDirection = true;
          changeAngle = true;
          break;
        }
        case 'bottom': {
          squares[bottomSide].classList.remove('stone');
          squares[bottomSide].classList.add('wall');
          changeDirection = true;
          changeAngle = true;
          break;
        }
        case 'rightTop': {
          if (ballDirection === -1 && ballAngle === leftAngle) {
            squares[rightTopSide].classList.remove('stone');
            squares[rightTopSide].classList.add('wall');
            changeDirection = true;
            break;
          }
          break;
        }
        case 'leftTop': {
          if (ballDirection === -1 && ballAngle === rightAngle) {
            squares[leftTopSide].classList.remove('stone');
            squares[leftTopSide].classList.add('wall');
            changeDirection = true;
            break;
          }
          break;
        }
        case 'rightBottom': {
          if (ballDirection === 1 && ballAngle === rightAngle) {
            squares[rightBottomSide].classList.remove('stone');
            squares[rightBottomSide].classList.add('wall');
            changeDirection = true;
            break;
          }
          break;
        }
        case 'leftBottom': {
          if (ballDirection === 1 && ballAngle === leftAngle) {
            squares[leftBottomSide].classList.remove('stone');
            squares[leftBottomSide].classList.add('wall');
            changeDirection = true;
            break;
          }
          break;
        }
      }
      return [changeDirection, changeAngle];
    } else {
      return [false, false];
    }
  }

  function checkCollideBoardBorderAndBall(ballIndex) {
    let rightBoard = squares[ballIndex + leftAngle].classList.contains('board');
    let downBoard = squares[ballIndex + returnate].classList.contains('board');
    let leftBoard = squares[ballIndex + rightAngle].classList.contains('board');
    if (rightBoard && !downBoard && !leftBoard && ballAngle === leftAngle) {
      return -1;
    }
    if (leftBoard && !downBoard && !rightBoard && ballAngle === rightAngle) {
      return -1;
    }
    return 0;
  }
  function checkCollideBoardAndBall(ballIndex) {
    let temp = squares[ballIndex + returnate].classList.contains('board');
    return temp;
  }
  function slideBallAndBoard(angle) {
    if (angle === rightAngle) {
      clearBoard();
      BOARD_CURRENT_INDEX += 1;
      ballDefaultIndex += 1;
      renderBoard();
      currentKey = 0;
    }
    if (angle === leftAngle) {
      clearBoard();
      BOARD_CURRENT_INDEX -= 1;
      ballDefaultIndex -= 1;
      renderBoard();
      currentKey = 0;
    }
  }

  function moveBall(speed) {
    timerId = setInterval(() => {
      clearBall();
      //clearBall for normal view
      if (topBorder.includes(ballDefaultIndex) == true) {
        ballDirection = changeBallDirection(ballDirection);
        ballAngle = changeBallAngle(ballAngle);
      }
      if (bottomBorder.includes(ballDefaultIndex + returnate) == true) {
        if (checkCollideBoardBorderAndBall(ballDefaultIndex) !== 0) {
          ballDirection = checkCollideBoardBorderAndBall(ballDefaultIndex);
        }
        if (checkCollideBoardAndBall(ballDefaultIndex) === true) {
          // if (
          //   currentKey === 32 &&
          //   BOARD_CURRENT_INDEX != 199 &&
          //   BOARD_CURRENT_INDEX != 193
          // ) {
          //   slideBallAndBoard(ballAngle);
          // }
          ballDirection = -1;
          ballAngle = changeBallAngle(ballAngle);
        }
      }
      if (leftBorder.includes(ballDefaultIndex) == true) {
        ballAngle = changeBallAngle(ballAngle);
      }
      if (rightBorder.includes(ballDefaultIndex) == true) {
        ballAngle = changeBallAngle(ballAngle);
      }
      if (
        !rightBorder.includes(ballDefaultIndex) ||
        !leftBorder.includes(ballDefaultIndex) ||
        !topBorder.includes(ballDefaultIndex) ||
        !bottomBorder.includes(ballDefaultIndex)
      ) {
        let actionArray = checkCollideBallAndStone(ballDefaultIndex);
        if (actionArray[0] === true) {
          ballDirection = changeBallDirection(ballDirection);
        }
        if (actionArray[1] === true) {
          ballAngle = changeBallAngle(ballAngle);
        }
      }

      ballDefaultIndex = ballDefaultIndex + ballAngle * ballDirection;

      //put in this place clearBall for trace
      renderBall();
    }, speed);
  }

  function moveBoard(delta) {
    clearBoard();
    BOARD_CURRENT_INDEX += 1 * delta;
    renderBoard();
  }

  function setBoardDirection(e) {
    console.log(e.keyCode);
    if (e.keyCode === 27) {
      clearInterval(timerId);
      return window.location.reload();
    }
    currentKey = e.keyCode;
    if (e.keyCode === 40) {
      boostTheBall(ballSpeed);
    }

    if (e.keyCode === 38) {
      gameStarted = true;
      moveBall(ballSpeed, e.keyCode);
    }
    if (e.keyCode === 37 && BOARD_CURRENT_INDEX != 193) {
      if (gameStarted === false) {
        clearBall();
        ballDefaultIndex -= 1;
        renderBall();
      }
      moveBoard(-1);
    }

    if (e.keyCode === 39 && BOARD_CURRENT_INDEX != 199) {
      if (gameStarted === false) {
        clearBall();
        ballDefaultIndex += 1;
        renderBall();
      }
      moveBoard(1);
    }
  }

  function boostTheBall(speed) {
    console.log('boost' + speed);
    speed /= 2;
    console.log('boost' + speed);
  }
  function slowTheBall(speed) {
    console.log('slow');
    speed *= 2;
  }

  renderBoard();
  //renderSquareStones(STONES_INDEX_ARRAY);
  //renderTestStones(TEST_STONE);
  //renderWallOfStones(WALL_INDEX_ARRAY);
  function startGame(event) {
    console.log(event.keyCode);
    if (event.keyCode === 13) {
      document.removeEventListener('keydown', startGame);
      //remove start screen
      //document.getElementById('start-screen').style.display = 'none';
      //set pacman velocity and enable movement
      document.addEventListener('keydown', setBoardDirection);

      //moveBoard();
      // move the Ghosts randomly
    }
  }
  document.addEventListener('keydown', startGame);
});
