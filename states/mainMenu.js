var MainMenu = {
    create: function() {
        this.background = game.add.sprite(0, 0, "beach"), this.background.height = game.height, this.background.width = game.width
        this.background.inputEnabled = true
        this.background.events.onInputDown.add(function() {
            this.state.start("Game")
        }, this)
        this.logo = game.add.text(game.width / 2, game.height / 2, "Little PJ\n\n The Hero Of Guam\n\n   -kjdesigns-\n\nCLICK OR TOUCH TO START", {
            font: "30px Orbitron",
            fill: "#6cb3fe",
            align: "center"
        }), this.logo.anchor.setTo(.5)
    }
};