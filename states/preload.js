var PreloadState = {
    init:function(){
      this.game.physics.arcade.gravity.y = 1000;  
    },
    preload:function(){
        this.game.load.spritesheet("player","assets/player.png",130,170);
        this.game.load.image("hut","assets/hut.png")
        this.game.load.image("beach","assets/beach.png")
        this.game.load.image("spider","assets/spider1.png") 
        //controls
        this.game.load.image("left","assets/left.png")
        this.game.load.image("right","assets/right.png")
        this.game.load.image("a","assets/a.png")
        this.game.load.image("shell1","assets/shell1.png")
        this.game.load.image("shell2","assets/shell2.png")
        this.game.load.image("shell3","assets/shell3.png")
         //sounds 
        this.game.load.audio("drill","assets/sounds/drill.ogg");   
    },
    create:function(){
        this.game.state.start("MainMenu");
    }
}