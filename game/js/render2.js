/*
 現在の盤面の状態を描画する処理
 */
var canvas = document.getElementsByTagName( 'canvas' )[ 0 ];  // キャンバス
var ctx = canvas.getContext( '2d' ); // コンテクスト
var W = 260, H = 390;  // キャンバスのサイズ
var BLOCK_W = W / COLS, BLOCK_H = H / ROWS;  // マスの幅を設定



// x, yの部分へマスを描画する処理
function drawBlock( x, y ) {
  ctx.fillRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
  ctx.strokeRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1 );
}

function imageBlock(x, y, n){
  var img = new Image();
  img.onload = function onImageLoad(){
    ctx.drawImage(img,BLOCK_W * x , BLOCK_H * y , BLOCK_W  , BLOCK_H );
  }
  img.src = 'block/' + colors[n] + '.svg';
}

function drawStage(){
  // 盤面を描画する
  for ( var x = 0; x < COLS; ++x ) {
    for ( var y = 0; y < ROWS; ++y ) {
      ctx.strokeRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1 );
      if ( board[ y ][ x ] ) {  // マスが空、つまり0ゃなかったら
        //ctx.fillStyle = colors[ board[ y ][ x ] - 1 ];  // マスの種類に合わせて塗りつぶす色を設定
        imageBlock( x, y, board[y][x]-1 );  // マスを描画
      }
    }
  }
}

function drawHandle(){
  // 操作ブロックを描画する
  for ( var y = 0; y < 4; ++y ) {
    for ( var x = 0; x < 4; ++x ) {
      if ( current[ y ][ x ] ) {
        imageBlock( currentX + x, currentY + y, 7 );  // マスを描画
      }
    }
  }
}


function deleteHandle(){
  //操作ブロックと既置ブロック以外の描画クリア
  for ( var y = ROWS - 1; y >= 0; --y ) {
    for ( var x = 0; x < COLS; ++x ) {
      if (board[ y ][ x ] == 0){
        if( y-currentY >= 0 && y-currentY <= 3 && x-currentX >= 0 && x-currentX <= 3 && current[y-currentY][x-currentX]){
           continue;
        }
        ctx.clearRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1 );
      }
    }
  }
 }


// 盤面と操作ブロックを描画する
function render() {
//  ctx.clearRect( 0, 0, W, H );  // 一度キャンバスを真っさらにする
  ctx.strokeStyle = 'black';  // えんぴつの色を黒にする
  deleteHandle();
  drawStage();
  drawHandle();
}
// 30ミリ秒ごとに状態を描画する関数を呼び出す
setInterval( render, 30 );
