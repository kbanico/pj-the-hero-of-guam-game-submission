Game = {
    preload:function(){
        
    },
    create:function(){
        this.background = this.game.add.sprite(0,0,"beach")
        this.background.width = this.game.width;
        this.background.height = this.game.height;
        this.spider = this.game.add.sprite(100,100,"spider")
        this.spider.scale.setTo(0.3)
        this.spider.anchor.setTo(0.5)
        this.game.physics.arcade.enable(this.spider)
        this.spider.body.allowGravity = false;
        this.spider.body.setSize(150,150,80,100);
        this.spider.health = 200;                        
        this.huts = this.game.add.group();
        this.huts.enableBody = true;
        this.house1 = game.add.sprite(100,300-10,"hut")
        this.huts.add(this.house1)    
        this.house2 = game.add.sprite(300,300-10,"hut")
        this.huts.add(this.house2)      
        this.house3 = game.add.sprite(500,300-10,"hut")
        this.huts.add(this.house3) 
        this.huts.enableBody = true;
        this.huts.setAll("body.allowGravity",false)   
        this.performTween()
        this.getRandomFirstAlive(this.huts); 
        //cursor
        this.cursors = game.input.keyboard.createCursorKeys();      
        //bullets
        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.nextBullet = 0;              
        // add a new graphics object at the center of the world
        var circles = game.add.graphics(this.spider.x-100,this.spider.y-100);
        // add first 1px wide unfilled red circle with a radius of 50 at the center (0, 0) of the graphics object
        circles.lineStyle(5, 0xff0000);
        circles.drawCircle(0, 0, 50);
        // add the second 1px wide unfilled green circle with a radius of 100
        circles.lineStyle(5, 0x00ff00);
        circles.drawCircle(0, 0, 100);
        // and finally add the third 1px wide unfilled blue circle with a radius of 150
        circles.lineStyle(5, 0x0000ff);
        circles.drawCircle(0, 0, 150);    
        var circleTween = game.add.tween(circles).to({alpha:0})
        circleTween.yoyo(true).loop()
        circleTween.start()   
        this.spider.addChild(circles);     
        //health bar
        this.bmd = game.add.bitmapData(200,40);
        this.bmd.ctx.beginPath();
        this.bmd.ctx.rect(0,0,180,30)
        this.bmd.ctx.fillStyle = "#00685e";
        this.bmd.ctx.fill();
        this.healthBar = game.add.sprite(-100,game.world.centerY-500,this.bmd)
        this.healthBar.anchor.y = 0.5;    
        this.spider.addChild(this.healthBar)      
        //bonus
        this.bmd2 = game.add.bitmapData(200,40);
        this.bmd2.ctx.beginPath();
        this.bmd2.ctx.rect(0,0,180,30)
        this.bmd2.ctx.fillStyle= "#800080"
        this.bmd2.ctx.fill();    
        this.bonusBar = game.add.sprite(game.world.centerX,20,this.bmd2)
        this.bonusBar.scale.setTo(0,1)
        this.bonuses = this.game.add.group();
        this.bonuses.enableBody = true;
        this.bonus = 1;    
        this.game.time.events.loop(12000,this.newBonus,this);      
        this.questText = game.add.text(20,20,"Defeat The Spider Before He Steals All The Huts",{font:"20px Orbitron",fill:"#ff8d4f"})
        game.time.events.add(7000,function(){
            game.add.tween(this.questText).to({alpha:0}).start()
            if(game.device.desktop){
               game.add.tween(this.howToPlay).to({alpha:0}).start() 
            }
            
        },this)    
        //sounds
        this.pew = game.add.audio("pew")  
        this.song = game.add.audio("song")
        this.song.volume = 0.3
        this.song.loopFull()
        this.song.play()

        //add the player
        this.player = this.game.add.sprite(100,330,"player")
        this.player.scale.setTo(0.3);
        this.player.anchor.setTo(0.5)
        this.game.physics.arcade.enable(this.player)
        this.player.body.allowGravity = false;
        this.player.body.collideWorldBounds = true;
        this.player.animations.add("walking",[0,1,2],10,true)  
        this.player.customProperties = {} 
        if (!game.device.desktop) {
            this.createOnScreenControls();
        }else{
            this.howToPlay = game.add.text(game.world.centerX,100,"Use Up arrow to shoot,\n Left and Right arrow to run",{font:"20px Orbitron",fill:"#ff8d4f",align:"center"})
            this.howToPlay.anchor.setTo(0.5)
        }
        
        //this.guam = game.add.text(game.width/2-50,game.height/2,"GUAM")

             
        
    },update:function(){
        //overlaps
        this.game.physics.arcade.overlap(this.spider,this.bullets,this.hitSpider,null,this)
        this.game.physics.arcade.overlap(this.player,this.bonuses,this.takeBonus,null,this) 
        //check the count of alive huts
        this.countAlive = 0
        this.huts.forEach(function(e){
            if(!e.alive){
                this.countAlive++
            }
        },this)  
        //moving player 
        this.player.body.velocity.x = 0;
        if(this.cursors.right.isDown || this.player.customProperties.goRight){
            this.player.body.velocity.x = 300;
            this.player.scale.setTo(0.3)
            this.player.animations.play("walking")
        }
        else if(this.cursors.left.isDown || this.player.customProperties.goLeft){
            this.player.body.velocity.x = -300
            this.player.scale.setTo(-0.3,0.3)
            this.player.animations.play("walking")
        }else{
            this.player.animations.stop()
        }
        //the bullet
        if((this.cursors.up.isDown || this.player.customProperties.attack) && this.game.time.now > this.nextBullet){
            
            this.fireBullet();
            if(this.bonus != 1){
                this.nextBullet = game.time.now + 15;
                
            }else{
               this.nextBullet = this.game.time.now + 200; 
            }
        }
    },
    
    performTween:function(){
        var randomTime = Math.floor(Math.random() * 3) * Math.floor(Math.random()) *1000
        if(this.spider.alive){
            this.chance = game.rnd.integerInRange(1,10)
            this.spider.tween1 = this.game.add.tween(this.spider)    
            if(this.chance <= 3 && this.getRandomFirstAlive(this.huts) != undefined){
                this.house = this.getRandomFirstAlive(this.huts)
                console.log(this.house + "is this.house")
                this.yPos = this.house.y;
                this.xPos = this.house.x
                this.spider.tween1.to({x:this.xPos,y:this.yPos},game.rnd.integerInRange(1,3) * 1000)
                this.spider.tween1.start()
                this.spider.tween1.onComplete.addOnce(function(){
                    var newHouse = game.add.sprite(this.house.x,this.house.y,"hut");
                    this.house.kill();
                    newHouse.x = game.rnd.integerInRange(this.spider.x-450, this.spider.x -200)
                    newHouse.y = this.spider.y - 600
                    this.spider.addChild(newHouse)
                    this.spider.tween1.to({y:0}).start();
                    this.spider.tween1.onComplete.addOnce(this.performTween,this)            
                },this)
            }else if(this.countAlive == this.huts.length){
                //we lose
                  if(this.spider.tween1){
                        this.spider.tween1.stop();
                   } 
                    if(this.spider.tween2){
                        this.spider.tween2.stop();
                   } 
                    if(this.spider.tween3){
                        this.spider.tween3.stop();
                   }
            this.spider.body = false;
                this.spider.tween3 = game.add.tween(this.spider)
                this.spider.tween3.to({x:game.world.centerX,y:game.world.centerY}).start()
                this.spider.tween3.onComplete.addOnce(function(){
                    this.spider.tween2 = game.add.tween(this.spider.scale).to({x:2,y:2}).start();
                    this.spider.tween2.onComplete.addOnce(function(){
                        if(this.spider.tween1){
                            this.spider.tween1.stop();
                       } 
                        if(this.spider.tween2){
                            this.spider.tween2.stop();
                       } 
                        if(this.spider.tween3){
                            this.spider.tween3.stop();
                       }
                        this.song.stop();
                        game.time.events.add(3000,function(){game.state.start("MainMenu");})

                    },this)
                },this)         
            }
            else{
                this.spider.tween2 = this.game.add.tween(this.spider)    
                for(var i = 0; i < 3; i++){
                    this.spider.tween2.to({y:game.rnd.integerInRange(50,300)},randomTime)
                    this.spider.tween2.to({x:game.rnd.integerInRange(0,game.width-(this.spider.width / 2))},randomTime)
                    this.spider.tween2.to({x:game.rnd.integerInRange(0,game.width-(this.spider.width / 2)),y:100},randomTime)      
                }       
                this.spider.tween2.start();
                this.spider.tween2.onComplete.addOnce(this.performTween,this)           
            }
        }         
    },
       getRandomFirstAlive:function(group){
        var arr = [];
        group.children.forEach(function(element){
            if(element.alive){
                arr.push(element);
            }       
        },this)   
        random = Math.floor(Math.random() * arr.length)
        return arr[random]
    },
    
    fireBullet:function(){
        var bullet = this.bullets.getFirstDead();
        random = Math.floor(Math.random()*3) + 1
        if(!bullet){
            bullet = this.game.add.sprite(this.player.x-20,this.player.y-this.player.height,"shell"+random)
        }else{
            bullet.reset(this.player.x-20,this.player.y-this.player.height)
        }
        this.bullets.add(bullet)
        bullet.body.allowGravity = false
        bullet.body.velocity.y = -700;
        bullet.scale.setTo(0.5)
        // Kill the bullet when out of the world
        bullet.checkWorldBounds = true; 
        bullet.outOfBoundsKill = true;
        bullet.body.setSize(50,50,bullet.width / 3 + 20,bullet.height / 3 + 10)
        //will only play the duk duk sound with single bullets
        if(this.bonus === 1){
            this.pew.volume = 0.5
            shouldplay = Math.floor(Math.random()*10)
            if(shouldplay==5){
                this.pew.play()
            }         
        }
    },
    hitSpider:function(spider,bullet){
        if(this.spider.health > 0){
            console.log("hit spider")
            bullet.kill();
            this.spider.health -= 1;
            barWidth = this.healthBar.width;
            this.healthBar.width = barWidth - barWidth/this.spider.health
            console.log(this.spider.health)  
        }else{
            //remove physics
            this.spider.body = false;
            //remove any tweens
            if(this.spider.tween1){
                this.spider.tween1.stop();
           } 
            if(this.spider.tween2){
                this.spider.tween2.stop();
           } 
            if(this.spider.tween3){
                this.spider.tween3.stop();
           }
            this.healthBar.kill();
            var deathTween = game.add.tween(this.spider).to({angle: "+180"},850,Phaser.Easing.Linear.None).to({y:game.world.height-100}).to({y:game.world.height - 150}).to({y:game.world.height-100}).start();
            //this.spider.animations.stop()
            this.game.time.events.add(3000,function(){
                this.song.stop();
                var goodJob = this.game.add.text(this.game.world.centerX,this.game.world.centerY,"YOU WIN",{font:"40px Orbitron",fill:"#fff"})
                goodJob.anchor.setTo(0.5)
            },this);
            
            //restart
            game.time.events.add(5000,function(){
                if(this.spider.tween1){
                    this.spider.tween1.stop();
               } 
                if(this.spider.tween2){
                    this.spider.tween2.stop();
               } 
                if(this.spider.tween3){
                    this.spider.tween3.stop();
               }
                game.state.start("MainMenu");
            },this)
        }   
    },
    render:function(){
        /*this.game.debug.body(this.house1)
        this.game.debug.body(this.house2)
        this.game.debug.body(this.spider)
        this.bullets.forEachAlive(function(element){
            this.game.debug.body(element)
        },this);*/
    },
    newBonus:function(){
        var bonus = this.bonuses.getFirstDead();
        random = Math.floor(Math.random()*3) + 1
        if(!bonus){
            bonus = game.add.sprite(game.rnd.integerInRange(20,game.width - 50),0,"shell"+random);
        }else{
            bonus.reset(game.rnd.integerInRange(20,game.width - 50),0)
        }
        bonus.alpha = 0.1
        var tween = game.add.tween(bonus)
        tween.to({alpha:1},800,"Linear",true).loop(true).yoyo(true)
        this.bonuses.add(bonus)
        bonus.body.allowGravity = false
        bonus.body.velocity.y = 100;
        bonus.anchor.setTo(0.5)
        bonus.checkWorldBounds = true;  
        bonus.outOfBoundsKill = true; 
    },
    takeBonus:function(player,bonus){
        this.bonus+=1;
        bonus.kill();
        this.bonusBar.scale.setTo(1,1)
        game.add.tween(this.bonusBar.scale).to({x:0},4000).start();
        game.time.events.add(4000,function(){
            this.bonus = 1;
        },this)
    },
    createOnScreenControls:function(){
        this.right = game.add.button(100,game.height - 150,"right")
        this.left = game.add.button(0,game.height - 150,"left")
        this.a = game.add.button(game.width -150,game.height-120,"a")
        
        this.left.events.onInputDown.add(function(){
        this.player.customProperties.goLeft = true
    },this) 
    
        this.left.events.onInputUp.add(function(){
        this.player.customProperties.goLeft = false
    },this) 
        
        
        this.left.events.onInputOver.add(function(){
        this.player.customProperties.goLeft = true
    },this) 
    
        this.left.events.onInputOut.add(function(){
        this.player.customProperties.goLeft = false
    },this) 
        
    
        this.right.events.onInputDown.add(function(){
        this.player.customProperties.goRight = true
    },this) 
    
        this.right.events.onInputUp.add(function(){
        this.player.customProperties.goRight = false
    },this) 
        
        this.right.events.onInputOver.add(function(){
        this.player.customProperties.goRight = true
    },this) 
    
        this.right.events.onInputOut.add(function(){
        this.player.customProperties.goRight = false
    },this) 
        
        
        this.a.events.onInputDown.add(function(){
        this.player.customProperties.attack = true
    },this) 
    
        this.a.events.onInputUp.add(function(){
        this.player.customProperties.attack = false
    },this) 
        
        
         this.a.events.onInputOver.add(function(){
        this.player.customProperties.attack = true
    },this) 
    
        this.a.events.onInputOut.add(function(){
        this.player.customProperties.attack = false
    },this) 
    
        
    }
    
}

