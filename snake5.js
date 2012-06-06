

	var IE, isIE = true;
	if ( IE === undefined) isIE = false;


	
	function GridMap() {
		var that = {};
		that.map = [];
		that.update = function (x,y,value) {
		    if ( that.map[x] == undefined) {
		    	that.map[x] = []; 
		    	that.map[x][y] = value;
		    } else {
		    	that.map[x][y] = value;
		    }
		}
		that.getValue = function(x,y) {
			if ( that.map[x] == undefined) return false;
			else {
				if ( that.map[x][y] == undefined) return false;
				else return that.map[x][y];
			}
		}
	    that.deleteValue = function (x,y) {
	    	that.map[x].splice(y,1);
	    }
		that.reset = function() {
			that.map = [];
		}
		that.getList = function() {
			var list = [];
			for(var i in that.map) {
			    var t = that.map[i];
			    for(var j in t) {
			    	var obj = {x:i,y:j,val:t[j]};
			    	list.push(obj);
			    }
			}
			return list;
		}
		return that;
	}
	
	function SnakePart(x,y,dir){
		var that = {};

        that.x = x;
        that.y = y;
        that.dir = dir; // N,E,S,O
        var listPivots = []; // [ {"coord":{"x":0,"y":0},"dir":"N"} ... ]

        that.getFirstPivot = function() {
            if (listPivots.length>0) {
                return listPivots[0];
            } else {
                return -1;
            }
        };
        that.removeFirstPivot = function() {
            listPivots.splice(0,1);
        };
        that.addPivot = function(pivot) {
            listPivots[listPivots.length] = pivot;
        };
        that.getPivots = function() {
            return listPivots;
        };
        that.splicePivot = function(index) {
            listPivots.splice(j,1);
        };

        return that;
    }
	function Snake(n,W,H,i){
		var that = {};

		// private variable
		var listPart = [];
		var initSnakeSize = i;
        var size = n;
		that.appW = W;
		that.appH = H;

		// private methods
		function getLength() {
			return listPart.length;
		}

		function getDeltaPart(s)  {
			var ret = {x:0,y:0};

			ret = getDeltaDir(s);
			ret.x = -ret.x;
			ret.y = -ret.y;

			return ret;
		}

		function getDeltaDir(s)  {
			var ret = {x:0,y:0};
			if ( s == 'N' ) {
				ret.x = 0; ret.y = -size;
			} else if ( s == 'E' ) {
				ret.x = size; ret.y = 0;
			} else if ( s == 'S' ) {
				ret.x = 0; ret.y = size;
			} else if ( s == 'O' ) {
				ret.x = -size; ret.y = 0;
			}
			return ret;
		}
		
		// public methods
		that.resetApp = function(w,h) {
			that.appW = w;
			that.appH = h;
		};
		that.addParts = function(n) {
			for (i=0;i<n;i++) {

                var app = AppSnake.getAppSize();
				var newPart = SnakePart(app.w/2,app.h,'N');

				var snakeLen = getLength();
				if ( snakeLen > 0 ) {
					var lastPart = listPart[snakeLen-1];
					newPart.x = lastPart.x;
					newPart.y = lastPart.y;

					var dPos = getDeltaPart(lastPart.dir);

					newPart.x += dPos.x;
					newPart.y += dPos.y;
                    newPart.dir = lastPart.dir;

                    var newPivots = lastPart.getPivots();
                    for(j=0;j<newPivots.length;j++) {
                        var pTime = newPivots[j].time+1;
                        var pDir = newPivots[j].dir;
                        var pivot = {"time":pTime,"dir":pDir};
                        newPart.addPivot(pivot);
                    }

				}

				listPart[snakeLen] = newPart;
			}
		};
		that.move = function(time) {
			//log("move time :"+time);
			var nbParts = getLength();
			for(i=0;i<nbParts;i++) {
				var oPart = listPart[i];

				// is it time to change dir ?
				var partPivot = oPart.getFirstPivot();
				if (partPivot != - 1) {
					//log("...part["+i+"] :"+ partPivot.time) ;
					if ( partPivot.time == time ){
						oPart.dir = partPivot.dir;
						oPart.removeFirstPivot();
					}
				}

				var dPos = getDeltaDir(oPart.dir);
				var nX = listPart[i].x + dPos.x;
				var nY = listPart[i].y + dPos.y;

				if ( time > initSnakeSize) {
					if ( nX > that.appW-size) nX = 0;
					if ( nX < 0 ) nX = that.appW-size;
					if ( nY > that.appH-size) nY = 0;
					if ( nY < 0 ) nY = that.appH-size;
				}

				listPart[i].x = nX;
				listPart[i].y = nY;
			}
		};
		that.getLength = function() {
			return getLength();
		};
		that.getParts = function() {
			return listPart;
		};
		that.logSnake = function() {
            log("---- log snake ---")
			for(j=0;j<getLength();j++) {
				log("part "+j+"(x,y) :"+listPart[j].x+","+listPart[j].y+","+listPart[j].dir);
			}
		};
		that.changeHeadtDir = function(dir) {

			var sLen = getLength();
			if ( sLen>0) {
				listPart[0].dir = dir;
			}
		};
		that.getHeadPos = function() {
			var sLen = getLength();
			ret = {"x":0,"y":0};
			if ( sLen>0) {
				ret.x = listPart[0].x;
				ret.y = listPart[0].y;
			}
			return ret;
		};
		that.addPivotToParts = function(time,dir) {
			var nbParts = getLength();
			if ( nbParts>0) {
                var headPart = listPart[0];

                var doAddPivot = true;
                if ( ( headPart.dir == "N" && dir == "S" ) ||
                     ( headPart.dir == "S" && dir == "N" ) ||
                     ( headPart.dir == "E" && dir == "O" ) ||
                     ( headPart.dir == "O" && dir == "E" )
                ) {
                  doAddPivot = false;
                }
                if ( doAddPivot ) {
                    for(i=0;i<nbParts;i++) {
                        var timeP = time+i;
                        listPart[i].addPivot( {"time":timeP,"dir":dir} );
                    }
                }
			}
		};
		that.isHeadOnBody = function() {
			var nbParts = getLength();
			if ( nbParts>1) {
				var headPart = listPart[0];
				for(i=1;i<nbParts;i++) {
					var part = listPart[i];
					if ( (headPart.x == part.x) && (headPart.y == part.y) ) {
						return true;
					}
				}
			}
			return false;
		};
		that.moveBack = function() {
			var nbParts = getLength();
			if ( nbParts>0) {
				for(i=0;i<nbParts;i++) {
					var part = listPart[i];
					var dPos = getDeltaDir(part.dir);

					listPart[i].x -= dPos.x;
					listPart[i].y -= dPos.y;
				}
			}
		};
        that.hitObject = function(coord) {
            for(i=0;i<listPart.length;i++) {
				var part = listPart[i];
                if (part.x == coord.x && part.y == coord.y) {
                    return true;
                }
            }
            return false;
        };
		that.addParts(initSnakeSize);
		return that;
	}
	

	
	/* singleton to manage the game */
	var AppSnake = function() {
		
		// APP INIT
		var isReady=false
		var ctx;
		var snake;
		var blocSize = 13;
		var isPause = false;
		var appW = 468;
		var appH = 299;
		var currentTime = 0;
		var idMove = 0;
		var sMoveAction = "";
        var cycle1000 = 0;
        var cycle250 = 0;

        var appleList = [];
        var mouseList = [];
        var listBodyColor = ['rgb(124,213,64)','rgb(176,212,248)','rgb(62,165,248)','rgb(30,100,171)','rgb(246,165,245)'
        ,'rgb(249,102,176)','rgb(241,49,49)'];
        var nbBodyColor = listBodyColor.length;

        var NB_BASE_LEVEL = 3;
        var pendingParts = 0;
        var nbAppleEaten = 0;
        var nbMouseEaten = 0;
        var INIT_SPEED = 150
		var actionSpeed = 0;
        var numLevel = 1;
        var isGameOver = false;
        
        var appleMap = new GridMap();
        var mouseMap = new GridMap();
        
        var arrowSize = 80;
        var controlPos = {
			u:{x:appW/2-arrowSize/2,y:20} , 
			r:{x:appW-20-arrowSize,y:appH/2-arrowSize/2} , 
			d:{x:appW/2-arrowSize/2,y:appH-20-arrowSize} , 
			l:{x:20 ,y:appH/2-arrowSize/2} 
        };

		//private functions
        function initCanvas() {
        	$("#snakecontainer").attr("width", appW).attr("height", appH);
        	snake.resetApp(appW,appH);
        }
        function resetCanvas(w,h) {
            appW = w;
            appH = h;
            initCanvas();
        }
		function actionMove() {
			if (!isPause) onActionMove();
		}
		function onActionMove() {

            cycle1000 ++;
			cycle250 ++;

            var endCycle1000 = Math.floor(1000/actionSpeed);
            if ( cycle1000 == endCycle1000  ) {
                
				//snake.logSnake();
                cycle1000 = 0;
                // toute les secondes : 1 chance sur 5 de faire pousser une pomme
                var numApple = Math.floor( getRandom(1,5)/5 );
                addRandomApple(numApple);

                // toute les secondes : 1 chance sur 20 de faire pousser une souris
				var numMouse = Math.floor( getRandom(1,20)/20 );
				addRandomMouse(numMouse);
            }
            var endCycle250 = Math.floor(250/actionSpeed);
			if ( cycle250 == endCycle250  ) {
				cycle250 = 0;
				// move mice
				moveAllMouse();
			}

            // clear all
            ctx.clearRect(0, 0, appW, appH);
            
			if (sMoveAction != "") {
				snake.addPivotToParts(currentTime,sMoveAction);
				sMoveAction = "";
			}

            // move snake
            snake.move(currentTime);
            currentTime ++;

            // check for game over
            var isGameOver = false;
            var hPos = snake.getHeadPos();

			// hit a wall
            /*if ( hPos.x >= appW || hPos.x < 0 ||
				hPos.y >= appH || hPos.y < 0 ) {
                GameOver();snake.moveBack();isGameOver = true;
            }*/

            // eat myself ?
            if (!isGameOver) {
                if ( snake.isHeadOnBody() ) {
                    GameOver();
                    isGameOver = true;
                }
            }

            if (!isGameOver) {
                // eat an apple ?
            	if ( appleMap.getValue(hPos.x, hPos.y) ) {
            		onAppleEaten();
            		appleMap.deleteValue(hPos.x, hPos.y)
            	}
            	
                // eat an mouse ?
                for(j=0;j<mouseList.length;j++) {
                    var aM = mouseList[j];
                    var isMiam = false;
                    if      (aM.x==hPos.x && aM.y==hPos.y) isMiam = true;
                    else if (aM.x+blocSize==hPos.x && aM.y==hPos.y) isMiam = true;
                    else if (aM.x==hPos.x && aM.y+blocSize==hPos.y) isMiam = true;
                    else if (aM.x+blocSize==hPos.x && aM.y+blocSize==hPos.y) isMiam = true;

                    if (isMiam) {
                        mouseList.splice(j,1);
                        onMouseEaten();
                    }
                }
                // grow a part ?
                if ( pendingParts > 0 ) {
                    snake.addParts(1);
                    pendingParts -= 1;
                }
            }
            
            showGame();
		}
		function showGame() {

            showControls()	
            drawMouseList();
            drawAppleMap();
            showSnake();
		}
		function drawAppleMap() {
			var a = appleMap.getList();
			for (var i = 0; i < a.length; i++) {
				var o = a[i];
				drawApple({"x":o.x,"y":o.y});
			}
		}
        function moveAllMouse() {
            for (i=0;i<mouseList.length;i++) {

                var numChance = Math.floor( getRandom(1,5)/5 );
                if (numChance > 0 ) {
                    var newDir = "O"
                    var numDir = getRandom(1,4);
                    if (numDir==1) newDir = "N";
                    if (numDir==2) newDir = "S";
                    if (numDir==3) newDir = "E";
					mouseList[i].dir = newDir;
                }

				var cx = mouseList[i].x;
				var cy = mouseList[i].y;
				var mDir  = mouseList[i].dir;
                var ret = {"x":0,"y":0};

                if ( mDir == 'N' ) {
                    ret.x = 0; ret.y = -blocSize;
                } else if ( mDir == 'E' ) {
                    ret.x = blocSize; ret.y = 0;
                } else if ( mDir == 'S' ) {
                    ret.x = 0; ret.y = blocSize;
                } else if ( mDir == 'O' ) {
                    ret.x = -blocSize; ret.y = 0;
                }
                cx += ret.x; 
				cy += ret.y;

                var maxW = appW-blocSize, maxH = appH-blocSize;
                if ( cx > maxW) cx = 0;
                if ( cx < 0) cx = maxW;
                if ( cy > maxH ) cy = 0;
                if ( cy < 0 ) cy = maxH;

				mouseList[i].x = cx;
				mouseList[i].y = cy;

            }
        }
        function drawMouseList() {
            for(i=0;i<mouseList.length;i++) {
                drawMouse(mouseList[i]);
            }
        }

        function onMouseEaten() {
            pendingParts += 4;
            nbMouseEaten += 1; checkLevel();
            $("#snakemenu .nbmouse").html("<p>"+nbMouseEaten+"</p>");
        }
        function onAppleEaten() {
            pendingParts += 1;
            if (appleMap.getList.length<1) addRandomApple(1);

            nbAppleEaten += 1; checkLevel();
            $("#snakemenu .nbapple").html("<p>"+nbAppleEaten+"</p>");
        }
        function checkLevel() {
            var nextLevel = NB_BASE_LEVEL * Math.pow(numLevel,2);
            var testLevel = nbAppleEaten + nbMouseEaten*4;
            if (testLevel >= nextLevel) {
                numLevel += 1;
                restartMove(actionSpeed-10);
                

            }
        }
		function initMove() {
			if (idMove==0) {
				idMove = setInterval(actionMove, actionSpeed);
				return idMove;
			}
		}
        function restartMove(n) {
            clearInterval(idMove); idMove = 0;
            actionSpeed = n;
            initMove();
        }
		function actionTest() {
		   log("bip");
		}
		function showSnake() {
			var snakeParts = snake.getParts();
			for(j=snakeParts.length-1;j>=0;j--) drawSnakePart(j,snakeParts[j]) ;
		}
        function getRotationObj(rot,x,y,imgW,imgH) {

            var cw = imgW, ch = imgH, cx = 0, cy = 0;

            if ( rot == 90 ) {
                cx = 0+y;
                cy = (imgH + x)*-1;
                cw = imgW;
                ch = imgH;
            }else if (rot == 180) {
                cx = (imgW + x)* -1;
                cy = (imgH + y)* -1;
            }else if (rot == 270) {
                cw = imgW;
                ch = imgH;
                cx = (imgW+y) * -1;
                cy = 0 + x;
            }

            return {"x":cx,"y":cy,"w":cw,"h":ch};
        }
        function drawSnakePart(j,part) {

            if (j == 0 ) {
				drawHead(part);
            } else {
                drawPartBody(part);
            }
        }
		function drawHead(part) {
			
			drawSquare(part,"#1D9D41"); return;
			
			var img = Globals.Loader.getAsset('snakehead');

			var rot=0;
			if (part.dir == "E") {
				rot = 90;
			}else if (part.dir == "S") {
				rot = 180;
			}else if (part.dir == "O") {
				rot = 270;
			}
			
			if (rot>0) {
				var rO = getRotationObj(rot,part.x,part.y,img.width,img.height);
				ctx.save();
				ctx.rotate(rot*Math.PI/180);
				ctx.drawImage(img,rO.x,rO.y,rO.w,rO.h);
				ctx.restore();                    
			} else {
				ctx.drawImage(img,part.x,part.y,img.width,img.height);
			}
		}
        function drawPartBody(part) {

            var iColor = Math.min(nbBodyColor,numLevel)
            //drawBall(part,listBodyColor[iColor-1]);
            drawSquare(part,listBodyColor[0]);
        }
        function drawBall(coord,color) {
            var mid = blocSize/2;
            var ballSize = blocSize/2.2;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc((coord.x+mid), (coord.y+mid),ballSize , 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.arc((coord.x+mid), (coord.y+mid), ballSize, 0, Math.PI*2, true);
            ctx.stroke();
        }
        function drawSquare(coord,color) {
            ctx.fillStyle = color;
            ctx.fillRect(coord.x,coord.y,blocSize,blocSize)
            ctx.fill();
        }
        function drawBigBall(coord,color) {
            var mid = blocSize;
            var ballSize = 2*blocSize/2.2;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc((coord.x+mid), (coord.y+mid),ballSize , 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.arc((coord.x+mid), (coord.y+mid), ballSize, 0, Math.PI*2, true);
            ctx.stroke();
        }
        function addRandomApple(n){
        	
        	if ( n < 1 ) return;

        	if ( appleMap.getList().length > 19 ) return;

            var Ax = getRandom(0,(appW/blocSize)-1)*blocSize;
            var Ay = getRandom(0,(appH/blocSize)-1)*blocSize;
            var coord = {"x":Ax,"y":Ay};
        	
            if ( !snake.hitObject(coord) && !appleMap.getValue(Ax,Ay) ) {
            	
            	appleMap.update(Ax,Ay,"apple");
                drawApple(coord);

            }
        }
        function addRandomMouse(n){
        	
        	if ( n < 1 ) return;

			if ( mouseList.length > 4 ) return;
            Ax = getRandom(0,(appW/blocSize)-1)*blocSize;
            Ay = getRandom(0,(appH/blocSize)-1)*blocSize;
            
            var newDir = "O"
            var numDir = getRandom(1,4);
            if (numDir==1) newDir = "N";
            if (numDir==2) newDir = "S";
            if (numDir==3) newDir = "E";

            mouseList[mouseList.length] = {"x":Ax,"y":Ay,"dir":newDir};
        }
        function getRandom(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
        function drawAppleList() {
            //log("drawAppleList")
            for (i=0;i<appleList.length;i++) {
            	drawApple(appleList[i]);
                //log(appleList[i].x+","+appleList[i].y);
            }
        }
        function drawApple(coord) {
            //drawBall(coord,APPLE_COLOR);
            var img = Globals.Loader.getAsset('apple');
            ctx.drawImage(img,coord.x-blocSize/3,coord.y-blocSize/3,blocSize*1.5,blocSize*1.5);
        }
        function drawMouse(mouse) {

			if (isIE) {
				drawBigBall(mouse,"#BDBDBA"); return;
			}

            var num = Math.floor( getRandom(1,2)/2 )+1;
            var img = Globals.Loader.getAsset('mouse'+num);

            var rot=0;
            if (mouse.dir == "E") {
                rot = 90;
            }else if (mouse.dir == "S") {
                rot = 180;
            }else if (mouse.dir == "O") {
                rot = 270;
            }

            if (rot>0) {
                var rO = getRotationObj(rot,mouse.x,mouse.y,img.width,img.height);
                ctx.save();
                ctx.rotate(rot*Math.PI/180);
                ctx.drawImage(img,rO.x,rO.y,rO.w,rO.h);
                ctx.restore();
            } else {
                ctx.drawImage(img,mouse.x,mouse.y,img.width,img.height);
            }
        }
		function logSnake() {
			snake.logSnake();
		}

		function startPause() {
			if ( !isReady ) return; 
			if ( currentTime > 0 ) {
				isPause = !isPause;
			} else {
				AppSnake.startGame();
			}
		}
		function GameOver() {
			clearInterval(idMove);
			idMove = 0;
			currentTime = 0;

			var img = Globals.Loader.getAsset('gameover');
			
            var iX = (appW-img.width)/2;
            var iY = (appH-img.height)/2;

			ctx.save();
			ctx.globalAlpha = 0.3;
			ctx.drawImage(img,iX,iY,img.width,img.height);
			ctx.restore();

		}
		
		function showControls() {
			var img = Globals.Loader.getAsset('arrowup');
			var pos = controlPos ;	
			
			drawSquare(pos,'#000000');
			
			ctx.globalAlpha = 0.3;
			
			// arrow up
			ctx.drawImage(img,pos.u.x,pos.u.y,arrowSize,arrowSize);

			var rot,r0 ;
            // arrow right
            rot = 90; rO = getRotationObj(rot,pos.r.x,pos.r.y,arrowSize,arrowSize);
			ctx.save();
            ctx.rotate(rot*Math.PI/180);
            ctx.drawImage(img,rO.x,rO.y,rO.w,rO.h);
            ctx.restore();

            // arrow down
            rot = 180; rO = getRotationObj(rot,pos.d.x,pos.d.y,arrowSize,arrowSize);
            ctx.save();
            ctx.rotate(rot*Math.PI/180);
            ctx.drawImage(img,rO.x,rO.y,rO.w,rO.h);
            ctx.restore();

            // arrow left
            rot = 270 ; rO = getRotationObj(rot,pos.l.x,pos.l.y,arrowSize,arrowSize);
            ctx.save();
            ctx.rotate(rot*Math.PI/180);
            ctx.drawImage(img,rO.x,rO.y,rO.w,rO.h);
            ctx.restore();


			ctx.globalAlpha = 1;
			

		}
		
		function relMouseCoords(e){
		    var mouseX, mouseY;

		    if(e.offsetX) {
		        mouseX = e.offsetX;
		        mouseY = e.offsetY;
		    }
		    else if(e.layerX) {
		        mouseX = e.layerX;
		        mouseY = e.layerY;
		    }
		    return {x:mouseX, y:mouseY}
		}

		return {
			
			appReady : function () {
				isReady = true;
			},
			setApp:function(id){
				var app = $("#"+id);
				ctx = app[0].getContext("2d");
				$("#snakecontainer").attr("width", appW).attr("height", appH);
			},
			startGame: function() {
                appleList = [];
                mouseList = [];
                
                appleMap.reset();

				ctx.clearRect(0, 0, appW, appH);

                // init game variables
                isPause = false;
                actionSpeed = INIT_SPEED;
				cycle1000 = 0;
				cycle250 = 0;
                numLevel = 1;
                nbAppleEaten = 0;
                nbMouseEaten = 0;
                pendingParts = 0;
				sMoveAction = "";
				currentTime = 0;

                // init menu
                $("#snakemenu .nbapple").html("<p>0</p>");
                $("#snakemenu .nbmouse").html("<p>0</p>");

                // init snake
                snake = Snake(blocSize,appW,appH,6);
                addRandomApple(1);addRandomMouse(1);
                
                initCanvas();

				initMove();
				showGame();

			},
			onKeyDown: function(evt) {

				
				// arrows key : 38, 39, 40, 37
				// WASD : 87, 68, 83, 65

				var sDir = '';
				if		(evt.keyCode == 87) sDir = 'N';
				else if (evt.keyCode == 68) sDir = 'E';
				else if (evt.keyCode == 83) sDir = 'S';
				else if (evt.keyCode == 65) sDir = 'O';
				
				else if	(evt.keyCode == 38) sDir = 'N';
				else if (evt.keyCode == 39) sDir = 'E';
				else if (evt.keyCode == 40) sDir = 'S';
				else if (evt.keyCode == 37) sDir = 'O';
				else if (evt.keyCode == 32) startPause();

				if (sMoveAction == "" && sDir != "") sMoveAction = sDir; 
			},
			onClick: function(e) {
				var click = relMouseCoords(e);
				var sDir = '';
				if ( click.y < appH/3 && click.x > appW/3 && click.x < appW*2/3) {
					sDir = 'N';
				} else if ( click.y > appH*2/3 && click.x > appW/3 && click.x < appW*2/3) {
					sDir = 'S';			
				} else if ( click.x > appW*2/3) {
					sDir = 'E';
				} else if ( click.x < appW/3) {
					sDir = 'O';	
				}
				

				if (sMoveAction == "" && sDir != "") sMoveAction = sDir; 
				console.log(click.x + ", " + click.y + " dir :" + sDir);
			},
            getAppSize:function() {
              return {"w":appW,"h":appH};
            }
		};
		
	}(); 
	var Loader;

	Loader = (function() {

	  function Loader() {
	    this.progress = 0;
	    this.assets = {};
	    this.totalAssets = 0;
	    this.loadedAssets = 0;
	  }

	  Loader.prototype.load = function(assets) {
	    var asset, name, _results;
	    _results = [];
	    for (name in assets) {
	      asset = assets[name];
	      _results.push(this.loadAsset(name, asset));
	    }
	    return _results;
	  };

	  Loader.prototype.loadProgress = function(func) {
	    return this.onprogress = func;
	  };

	  Loader.prototype.loadComplete = function(func) {
	    return this.onload = func;
	  };

	  Loader.prototype.updateProgress = function() {
	    this.progress = this.loadedAssets / this.totalAssets;
	    if (this.onprogress) this.onprogress(this.progress);
	    if (this.progress === 1 && this.onload) return this.onload();
	  };

	  Loader.prototype.loadAsset = function(name, asset) {
	    var basePath, img, loader;
	    img = new Image();
	    loader = this;
	    img.onload = function() {
	      this.loaded = true;
	      loader.loadedAssets++;
	      return loader.updateProgress();
	    };
	    this.assets[name] = {
	      loader: this,
	      src: asset,
	      image: img
	    };
	    this.totalAssets++;
	    basePath = window && window.basePath ? window.basePath : '';
	    return img.src = basePath + asset;
	  };

	  Loader.prototype.getAsset = function(name) {
	    return this.assets[name]['image'];
	  };

	  return Loader;

	})();

	var Globals;

	Globals = {
	  Loader: new Loader()
	};
	
	// do something when all your images are loaded ... 
	Globals.Loader.loadComplete(function(progress) {
	    console.log(" app ready");
	    $("#controls").show();
	    AppSnake.appReady();

	});
	var Constants;

	Constants = {
	    ASSETS: {
	        snakehead: 'snakehead.png',
	        mouse1: 'mouse1.png',
	        mouse2: 'mouse2.png',
	        apple: 'apple.png',
	        arrowup: 'arrowup.png',
	        gameover: 'game_over.jpg',
	    }
	}
	Globals.Loader.load(Constants.ASSETS);
	