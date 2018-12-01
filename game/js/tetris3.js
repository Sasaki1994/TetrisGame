var COLS = 10, ROWS = 15;  // 盤面のマスの数
var board = [];  // 盤面の状態を保持する変数
var lose;  // 一番うえまで積み重なっちゃったフラグ
var interval;  // ゲームタイマー保持用変数
var current; // 現在操作しているブロック
var currentX, currentY; // 現在操作しているブロックの位置
var shapeNumber = [];　//保持しているブロックの数
var tempNumber = [0,0,0,0,0,0,0,0]; //現在操作しているブロックの数
var shapeID; //ブロックの種類を表す変数
var winLine; //ゲームクリアになる行数

//HTML上に表示する個数を格納する変数
var cyanNumber = document.getElementById('cyan');
var orangeNumber = document.getElementById('orange');
var blueNumber = document.getElementById('blue');
var yellowNumber = document.getElementById('yellow');
var redNumber = document.getElementById('red');
var greenNumber = document.getElementById('green');
var purpleNumber = document.getElementById('purple');

// ブロックのパターン
var shapes = [
  [ 1, 1, 1, 1 ],
  [ 1, 1, 1, 0,
    1 ],
  [ 1, 1, 1, 0,
    0, 0, 1 ],
  [ 1, 1, 0, 0,
    1, 1 ],
  [ 1, 1, 0, 0,
    0, 1, 1 ],
  [ 0, 1, 1, 0,
    1, 1 ],
  [ 0, 1, 0, 0,
    1, 1, 1 ]
];

// ブロックの色
var colors = [
  'cyan', 'orange', 'blue', 'yellow', 'red', 'green', 'purple','gray'
];

// 入力：ブロックの種類　出力：入力ブロックを操作盤に配置
function newShape(id) {
  var shape = shapes[ id ];
  // 操作ブロックへセットする
  current = [];
  for ( var y = 0; y < 4; ++y ) {
    current[ y ] = [];
    for ( var x = 0; x < 4; ++x ) {
      var i = 4 * y + x;  //4×4マスの位置
      if ( typeof shape[ i ] != 'undefined' && shape[ i ] ) {
        current[ y ][ x ] = id + 1;
      }
      else {
        current[ y ][ x ] = 0;
      }
    }
  }
  // ブロックを盤面の上のほうにセットする
  currentX = 3;
  currentY = 0;
  //操作ブロックの表示個数を１減らす
  tempNumber = [0,0,0,0,0,0,0,0];
  tempNumber[id]=1;
}

// 盤面を空にする
function init() {
  for ( var y = 0; y < ROWS; ++y ) {
    board[ y ] = [];
    for ( var x = 0; x < COLS; ++x ) {
      board[ y ][ x ] = 0;
    }
  }
}

// newGameで指定した秒数毎に呼び出される関数。
function tick() {
  clearLines();
  // １つ下へ移動する
//  if ( valid( 0, 1 ) ) {
//
//  }
  // もし着地していたら(１つしたにブロックがあったら)
//  else {
    if (lose) {
      // もしゲームオーバなら最初から始める
      newGame();
      return false;
    }
    // 新しい操作ブロックをセットする
//    newShape();
//  }
cyanNumber.innerHTML = shapeNumber[0] - tempNumber[0];
orangeNumber.innerHTML = shapeNumber[1] - tempNumber[1];
blueNumber.innerHTML = shapeNumber[2] - tempNumber[2];
yellowNumber.innerHTML = shapeNumber[3] - tempNumber[3];
redNumber.innerHTML = shapeNumber[4] - tempNumber[4];
greenNumber.innerHTML = shapeNumber[5] - tempNumber[5];
purpleNumber.innerHTML = shapeNumber[6] - tempNumber[6];

}

// 操作ブロックを盤面にセットする関数
function freeze() {
  for ( var y = 0; y < 4; ++y ) {
    for ( var x = 0; x < 4; ++x ) {
      if ( current[ y ][ x ] ) {
        board[ y + currentY ][ x + currentX ] = current[ y ][ x ];
        current[y][x]=0;
      }
    }
  }
}

// 操作ブロックを回す処理
function rotate( current ) {
  var newCurrent = [];
  for ( var y = 0; y < 4; ++y ) {
    newCurrent[ y ] = [];
    for ( var x = 0; x < 4; ++x ) {
      newCurrent[ y ][ x ] = current[ 3 - x ][ y ];
    }
  }
  return newCurrent;
}

//クリア条件を満たしているかの判定
function clearLines() {
  var rowFilled = true;
  //クリア条件を満たしているか調べる
  for ( var y = ROWS - 1; y >= ROWS - winLine; --y ) {
    for ( var x = 0; x < COLS; ++x ) {
      if ( board[ y ][ x ] == 0 ) {
        rowFilled = false;
        break;
      }
    }
  }

    // もしクリア条件を満たしていたら, サウンドを鳴らしてゲーム終了
    if ( rowFilled ) {
      document.getElementById( 'clearsound' ).play();  // 消滅サウンドを鳴らす
      console.log('Game Clear!');
      lose = true;
    }
}


// 各ボタンが押された時に呼び出される関数
function keyPress( key ) {
  switch ( key ) {
//各操作ボタン
  case 'left':
    if ( valid( -1 ) ) {
      --currentX;  // 左に一つずらす
    }
    break;
  case 'right':
    if ( valid( 1 ) ) {
      ++currentX;  // 右に一つずらす
    }
    break;
  case 'down':
    if ( valid( 0, 1 ) ) {
      ++currentY;  // 下に一つずらす
    }
    break;
  case 'up':
    if ( valid(0, -1) ){
      --currentY;　//上にずらす
    }
    break;
  case 'rotate':
    // 操作ブロックを回す
    var rotated = rotate( current );
    if ( valid( 0, 0, rotated ) ) {
      current = rotated;  // 回せる場合は回したあとの状態に操作ブロックをセットする
    }
    break;
  case 'enter':
    if (!valid( 0, 1 ) ){
      freeze();  // 操作ブロックを盤面へ固定する
      //操作状態から確定状態へ変更
      --tempNumber[shapeID];　
      --shapeNumber[shapeID];
    }
    break;
//各ブロック選択ボタン
  case 'cyan':
    if (shapeNumber[0] > 0){ //選択されたブロックがまだあれば
      newShape(0);
      shapeID = 0;
    }
    break;
  case 'orange':
    if (shapeNumber[1] > 0){
      newShape(1);
      shapeID = 1;
    }
  break;
  case 'blue':
    if (shapeNumber[2] > 0){
      newShape(2);
      shapeID = 2;
    }
  break;
  case 'yellow':
    if (shapeNumber[3] > 0){
      newShape(3);
      shapeID = 3;
    }
  break;
  case 'red':
    if (shapeNumber[4] > 0){
      newShape(4);
      shapeID = 4;
    }
  break;
  case 'green':
    if (shapeNumber[5] > 0){
      newShape(5);
      shapeID = 5;
    }
  break;
  case 'purple':
    if (shapeNumber[6] > 0){
      newShape(6);
      shapeID = 6;
    }
  break;
  }
}

// 指定された方向に、操作ブロックを動かせるかどうかチェックする
// ゲームオーバー判定もここで行う
function valid( offsetX, offsetY, newCurrent ) {
  offsetX = offsetX || 0;
  offsetY = offsetY || 0;
  offsetX = currentX + offsetX;
  offsetY = currentY + offsetY;
  newCurrent = newCurrent || current;
  for ( var y = 0; y < 4; ++y ) {
    for ( var x = 0; x < 4; ++x ) {
      if ( newCurrent[ y ][ x ] ) {
        if ( typeof board[ y + offsetY ] == 'undefined'
             || typeof board[ y + offsetY ][ x + offsetX ] == 'undefined'
             || board[ y + offsetY ][ x + offsetX ]
             || x + offsetX < 0
             || y + offsetY >= ROWS
             || x + offsetX >= COLS ) {
               if (offsetY == 1 && offsetX-currentX == 0 && offsetY-currentY == 1){
                 console.log('game over');
                 lose = true; // もし操作ブロックが盤面の上にあったらゲームオーバーにする
               }
               return false; //上記条件のどれかに当てはまったら動けない(false)
             }
      }
    }
  }
  return true;
}

function newGame() {
  shapeNumber = [1,1,2,2,2,2,2]; //初期持ちブロック
  winLine = 2; //クリアライン
  //clearInterval(interval);  // ゲームタイマーをクリア
  init();  // 盤面をまっさらにする
  lose = false;
  setInterval( tick, 250 );  // 250ミリ秒ごとにtickという関数を呼び出す
}

newGame();  // ゲームを開始する
