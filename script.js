document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const miniField = document.querySelector('.miniField');
  const userScoreHtml = document.querySelector('#scoreBitch');
  const pause = document.querySelector('#pause');
  const MINILAYOUT = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
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
  const miniSquares = [];
  const leftAngle = 9;
  const rightAngle = 11;
  const returnate = 10; // this delta for moving ball row by row
  const width = 8;
  const height = 18;
  let userCount = 0;
  let BOARD_CURRENT_INDEX = 197;
  let ballDirection = -1; //-1 - ball move up //1 -ball move down
  let ballAngle = 9; //9 -ball move to left// 11-ball move to right
  let ballSpeed = 150;
  let currentKey = 0;
  let gameStarted = false;
  let timerId = NaN;
  let ballDefaultIndex = BOARD_CURRENT_INDEX - 10;
  let STONES_INDEX_ARRAY = [90, 30, 45, 23, 67];
  let TEST_STONE = [133, 135];
  let WALL_INDEX_ARRAY = [10, 50, 90];

  function renderBattleField(array, element, storeArr) {
    for (let i = 0; i < array.length; i++) {
      const square = document.createElement('div');
      element.appendChild(square);
      //square.innerText = i;

      storeArr.push(square);
      if (array[i] === 1) {
        storeArr[i].classList.add('wall');
      }
    }
  }
  function updateScore(score) {
    userScoreHtml.innerText = score;
  }
  function setPause(className) {
    pause.classList.remove('active');
    pause.classList.add(className);
  }

  renderBattleField(LAYOUT, grid, squares);
  renderBattleField(MINILAYOUT, miniField, miniSquares);

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

  const topBorder = createBorders(1, 1, width);
  const leftBorder = createBorders(10, returnate, height);
  const rightBorder = createBorders(19, returnate, height);
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

  function whereBallCollide(stoneArea) {
    let {
      right,
      left,
      top,
      bottom,
      rightTop,
      leftTop,
      rightBottom,
      leftBottom,
    } = stoneArea;

    // console.log('right-:' + right);
    // console.log('left-' + left);
    // console.log('top-:' + top);
    // console.log('bottom-' + bottom);
    // console.log('rightTop-:' + rightTop);
    // console.log('leftTop-' + leftTop);
    // console.log('rightBottom-:' + rightBottom);
    // console.log('leftBottom-' + leftBottom);

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
    if (ballIndex > 9 && ballIndex < 129) {
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

      let collidePlace = null;

      if (ballAngle === 11 && ballDirection === -1) {
        collidePlace = whereBallCollide({
          right: false,
          left: leftStone,
          top: topStone,
          bottom: false,
          rightTop: false,
          leftTop: leftTopStone,
          rightBottom: false,
          leftBottom: false,
        });
      }
      if (ballAngle === 9 && ballDirection === -1) {
        collidePlace = whereBallCollide({
          right: rightStone,
          left: false,
          top: topStone,
          bottom: false,
          rightTop: rightTopStone,
          leftTop: false,
          rightBottom: false,
          leftBottom: false,
        });
      }
      if (ballAngle === 11 && ballDirection === 1) {
        collidePlace = whereBallCollide({
          right: rightStone,
          left: false,
          top: false,
          bottom: bottomStone,
          rightTop: false,
          leftTop: false,
          rightBottom: rightBottomStone,
          leftBottom: false,
        });
      }
      if (ballAngle === 9 && ballDirection === 1) {
        collidePlace = whereBallCollide({
          right: false,
          left: leftStone,
          top: false,
          bottom: bottomStone,
          rightTop: false,
          leftTop: false,
          rightBottom: false,
          leftBottom: leftBottomStone,
        });
      }

      //console.log('collidePlace:-' + collidePlace);
      switch (collidePlace) {
        case 'right': {
          squares[rightSide].classList.remove('stone');
          squares[rightSide].classList.add('wall');
          userCount += 1;
          updateScore(userCount);
          changeAngle = true;
          break;
        }
        case 'rightAndTop': {
          squares[rightSide].classList.remove('stone');
          squares[rightSide].classList.add('wall');
          squares[topSide].classList.remove('stone');
          squares[topSide].classList.add('wall');
          userCount += 2;
          updateScore(userCount);
          changeDirection = true;
          break;
        }
        case 'leftAndTop': {
          squares[leftSide].classList.remove('stone');
          squares[leftSide].classList.add('wall');
          squares[topSide].classList.remove('stone');
          squares[topSide].classList.add('wall');
          userCount += 2;
          updateScore(userCount);
          changeDirection = true;
          break;
        }
        case 'rightAndBottom': {
          squares[rightSide].classList.remove('stone');
          squares[rightSide].classList.add('wall');
          squares[bottomSide].classList.remove('stone');
          squares[bottomSide].classList.add('wall');
          userCount += 2;
          updateScore(userCount);
          changeDirection = true;
          break;
        }
        case 'leftAndBottom': {
          squares[leftSide].classList.remove('stone');
          squares[leftSide].classList.add('wall');
          squares[bottomSide].classList.remove('stone');
          squares[bottomSide].classList.add('wall');
          userCount += 2;
          updateScore(userCount);
          changeDirection = true;
          break;
        }

        case 'left': {
          squares[leftSide].classList.remove('stone');
          squares[leftSide].classList.add('wall');
          userCount += 1;
          updateScore(userCount);
          changeAngle = true;
          break;
        }
        case 'top': {
          squares[topSide].classList.remove('stone');
          squares[topSide].classList.add('wall');
          userCount += 1;
          updateScore(userCount);
          changeDirection = true;
          changeAngle = true;
          break;
        }
        case 'bottom': {
          squares[bottomSide].classList.remove('stone');
          squares[bottomSide].classList.add('wall');
          userCount += 1;
          updateScore(userCount);
          changeDirection = true;
          changeAngle = true;
          break;
        }
        case 'rightTop': {
          if (ballDirection === -1 && ballAngle === leftAngle) {
            squares[rightTopSide].classList.remove('stone');
            squares[rightTopSide].classList.add('wall');
            userCount += 1;
            updateScore(userCount);
            changeDirection = true;
            break;
          }
          break;
        }
        case 'leftTop': {
          if (ballDirection === -1 && ballAngle === rightAngle) {
            squares[leftTopSide].classList.remove('stone');
            squares[leftTopSide].classList.add('wall');
            userCount += 1;
            updateScore(userCount);
            changeDirection = true;
            break;
          }
          break;
        }
        case 'rightBottom': {
          if (ballDirection === 1 && ballAngle === rightAngle) {
            squares[rightBottomSide].classList.remove('stone');
            squares[rightBottomSide].classList.add('wall');
            userCount += 1;
            updateScore(userCount);
            changeDirection = true;
            break;
          }
          break;
        }
        case 'leftBottom': {
          if (ballDirection === 1 && ballAngle === leftAngle) {
            squares[leftBottomSide].classList.remove('stone');
            squares[leftBottomSide].classList.add('wall');
            userCount += 1;
            updateScore(userCount);
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
    let downBoard = null;
    let rightBoard = null;
    let leftBoard = null;
    if (ballIndex === 189) {
      return 0;
    }
    if (ballIndex === 180) {
      return 0;
    }
    if (ballIndex < 189) {
      downBoard = squares[ballIndex + returnate].classList.contains('board');
      leftBoard = squares[ballIndex + leftAngle].classList.contains('board');
      rightBoard = squares[ballIndex + rightAngle].classList.contains('board');
    }

    if (rightBoard && !downBoard && !leftBoard && ballAngle === rightAngle) {
      return -1;
    }
    if (leftBoard && !downBoard && !rightBoard && ballAngle === leftAngle) {
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
      console.log(ballDefaultIndex);
      //clearBall for normal view
      if (ballDefaultIndex === 9) {
        console.log('leftAnCatch');
        ballDirection = 1;
      }
      if (ballDefaultIndex === 0) {
        console.log('rightAnCatch');
        ballDirection = 1;
      }
      if (topBorder.includes(ballDefaultIndex)) {
        ballDirection = changeBallDirection(ballDirection);
        ballAngle = changeBallAngle(ballAngle);
      }
      if (bottomBorder.includes(ballDefaultIndex + returnate)) {
        if (checkCollideBoardBorderAndBall(ballDefaultIndex) != 0) {
          ballDirection = -1;
        } else {
          if (checkCollideBoardAndBall(ballDefaultIndex) === true) {
            console.log('board');
            if (
              currentKey === 32 &&
              BOARD_CURRENT_INDEX != 199 &&
              BOARD_CURRENT_INDEX != 193
            ) {
              slideBallAndBoard(ballAngle);
            }
            ballDirection = -1;
            if (ballDefaultIndex === 180) {
              ballAngle = changeBallAngle(ballAngle);
            }
            if (ballDefaultIndex > 180 && ballDefaultIndex < 189) {
              ballAngle = changeBallAngle(ballAngle);
            }
          }
        }
      }
      if (leftBorder.includes(ballDefaultIndex) == true) {
        console.log('leftBorderCatch');
        ballAngle = changeBallAngle(ballAngle);
      }
      if (rightBorder.includes(ballDefaultIndex) == true) {
        console.log('rightBorderCatch');
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
  function reloadGame() {
    return window.location.reload();
  }

  function setBoardDirection(e) {
    console.log(e.keyCode);
    if (e.keyCode === 13) {
      reloadGame();
    }
    if (e.keyCode === 27) {
      clearInterval(timerId);
      setPause('active');
    }
    currentKey = e.keyCode;
    if (e.keyCode === 40) {
      boostTheBall(ballSpeed);
    }

    if (e.keyCode === 38) {
      gameStarted = true;
      setPause('hidden');
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
  renderSquareStones(STONES_INDEX_ARRAY);
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
