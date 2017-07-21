//scaling
var getGameLandscapeDimensions = function(max_w,max_h){
    var w = window.innerWidth * window.devicePixelRatio
    var h = window.innerHeight * window.devicePixelRatio;
    var landW = Math.max(w,h);
    var landH = Math.min(w,h);
    if(landW > max_w){
        var ratioW = max_w / landW;
        landW *= ratioW;
        landH *= ratioW;
    }
    if(landH > max_h){
        var ratioH = max_h / landH;
        landW*= ratioH;
        landH*= ratioH;
    }
    return {w:landW,h:landH}
}
var dim = getGameLandscapeDimensions(640,360);
var game = new Phaser.Game(dim.w,dim.h, Phaser.CANVAS);
//var game = new Phaser.Game(640,360, Phaser.CANVAS);
game.state.add("Boot", BootState);
game.state.add("Preload", PreloadState);
game.state.add("Game", Game)
game.state.add("MainMenu", MainMenu)
game.state.start("Boot")