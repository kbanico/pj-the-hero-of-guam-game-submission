var BootState = {
    init:function(){
        this.game.stage.backgroundCOlor = "#fff";
        
        //scaling
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;      
        this.game.physics.startSystem(Phaser.Physics.ARCADE);    
    },
    create:function(){
        this.game.state.start("Preload")
    }
}