/*
 キーボードを入力した時に一番最初に呼び出される処理
 */


document.body.onkeydown = function( e ) {
  // キーに名前をセットする
  var keys = {
    37: 'left',
    39: 'right',
    40: 'down',
    38: 'up',
    13: 'enter',
    16: 'rotate',
    48: 'create0',
    49: 'create1',
    50: 'create2',
    51: 'create3',
    52: 'create4',
    53: 'create5',
    54: 'create6',
  };

  if ( typeof keys[ e.keyCode ] != 'undefined' ) {
    // セットされたキーの場合はtetris.jsに記述された処理を呼び出す
    keyPress( keys[ e.keyCode ] );
    // 描画処理を行う
    render();
  }
};
