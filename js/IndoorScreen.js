function IndoorScreen(ctx, messagePanel, inventoryBag){
    this.visible = false;
    this.timeStatus = 0;

    this.currentlySelected = null;

    this.interior = [];

    this.initRoom = function(interior){
        this.interior = interior
    };

    this.show = function(){
        this.visible = true;
        this.currentlySelected = 0;
    };

    this.hide = function(){
        ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
        this.visible = false;
    };

    this.isIndoors = true;
    this.side = 1;

    this.draw = function(){
        this.timeStatus = (this.timeStatus + 1)%40;

        ctx.fillStyle = "black";
        ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
        var barStart = 48*4;

        ctx.drawImage(sprites,65,64,1,24,0,0,4,24*4);
        ctx.drawImage(sprites,66,64,1,24,4,0,WIDTH-2*4,24*4);
        ctx.drawImage(sprites,65,64,1,24,WIDTH-4,0,4,24*4);

        ctx.drawImage(sprites,14,64,7,6,barStart,2*4,7*4,6*4);
        ctx.drawImage(sprites,0,87,1,6,barStart+8*4,2*4,4,6*4);

        ctx.drawImage(sprites,1,87,1,6,barStart+(8+1)*4,2*4,91*4,6*4);

        var conditionBarLength = Math.ceil(Game.player.status.condition*91/100);
        ctx.drawImage(sprites,0,89,1,2,barStart+(8+2)*4,4*4,(conditionBarLength-2)*4,2*4);
        ctx.drawImage(sprites,0,87,1,6,barStart+100*4,2*4,4,6*4);

        var conditionPercentage = "  "+Math.ceil(Game.player.status.condition)+"%";
        conditionPercentage = conditionPercentage.substring(conditionPercentage.length-4,conditionPercentage.length);
        textPainter.drawText(conditionPercentage,ctx,barStart+102*4,4);

        var h = "00"+Math.floor(Game.dayTime.minutes/60);
        h = h.substring(h.length-2,h.length);
        var m = "00"+(Game.dayTime.minutes%60);
        m = m.substring(m.length-2,m.length);
        textPainter.drawText("TIME: "+h+":"+m,ctx,2*4,4);

        var symbols = [box(3,129,7,12),box(10,129,7,12),box(18,129,7,12),box(47,129,7,12)];
        var places = [p(2,9),p(43,9),p(84,9),p(125,9)];
        var values = [[Game.player.status.thirst,Game.player.status.thresholds.thirst],[Game.player.status.hunger,Game.player.status.thresholds.hunger],[Game.player.status.temperature,Game.player.status.thresholds.temperature],[Game.player.status.fatigue,Game.player.status.thresholds.fatigue]];
        for(var n=0; n<4; n++){
            var shift = places[n].x*4;
            var yShift = places[n].y*4;
            var symbol = symbols[n];
            var data = values[n];
            ctx.drawImage(sprites,0,129,2,12,shift,yShift,2*4,12*4);
            shift += 2*4;
            ctx.drawImage(sprites,symbol.x,symbol.y,symbol.width,symbol.height,shift,yShift,symbol.width*4,symbol.height*4);
            shift += symbol.width*4;
            var scaleShiftStart = shift;
            ctx.drawImage(sprites,2,129,1,12,shift,yShift,28*4,12*4);
            shift += 28*4;
            ctx.drawImage(sprites,44,129,3,12,shift,yShift,3*4,12*4);

            var severity = 0;

            var status = data[0];
            var threshold = data[1];

            if(status >= threshold[0]){
                if(status < threshold[1]){
                    ctx.drawImage(sprites,0,117,5,12,(places[n].x+symbol.width+20)*4,yShift+10*4,5*4,12*4)
                }else if(status < threshold[2]){
                    ctx.drawImage(sprites,5,117,9,12,(places[n].x+symbol.width+20)*4,yShift+10*4,9*4,12*4);
                    severity = 1;
                }else{
                    ctx.drawImage(sprites,14,117,11,12,(places[n].x+symbol.width+20)*4,yShift+10*4,11*4,12*4);
                    severity = 2;
                }
            }

            for(var i=0; i<Math.floor(Math.min(status,threshold[3]) * 25 /threshold[3]); i++){
                ctx.drawImage(sprites,severity*2,93,2,4,scaleShiftStart+(2+i)*4,yShift+4*4,2*4,4*4)
            }


            ctx.drawImage(sprites,27,87,1,6,scaleShiftStart+(2+Math.floor(threshold[0] * 25 /threshold[3]))*4,yShift+3*4,4,6*4);
            ctx.drawImage(sprites,27,87,1,6,scaleShiftStart+(2+Math.floor(threshold[1] * 25 /threshold[3]))*4,yShift+3*4,4,6*4);
            ctx.drawImage(sprites,27,87,1,6,scaleShiftStart+(2+Math.floor(threshold[2] * 25 /threshold[3]))*4,yShift+3*4,4,6*4);

            ctx.drawImage(sprites,0,87,27,6,scaleShiftStart+4,yShift+3*4,27*4,6*4)
        }


        inventoryBag.drawLeft(Game.player.inventory,ctx,this.side == 0,-56,-32);

        if(Game.looting.unit){
            inventoryBag.drawRight(Game.looting.unit.inventory,ctx,this.side == 1,+56,-32);

            var message = new Message("_");
            messagePanel.drawOn(message,ctx);

            var currentInterior = this.interior[this.currentlySelected];
            currentInterior.interior.draw(ctx,p(330-Math.floor(currentInterior.interior.bounding.width/2)*4,260-Math.floor(currentInterior.interior.bounding.height/2)*4));

            var slot;

            if(this.side == 1){
                slot = Game.looting.unit.inventory.getSlot(Game.selectedInventorySlot)
            }else{
                slot = Game.player.inventory.getSlot(Game.selectedInventorySlot)
            }

            message = null;
            if(Game.looting.pickUpInProgress){
                if(this.side == 1){
                    message = new Message("I THINK I WILL TAKE _\n< "+Game.looting.currentPickUpNumber+" >");
                }else{
                    message = new Message("I WILL STASH _\n< "+Game.looting.currentPickUpNumber+" >");
                }
                drawButton(ctx,32*2,16*32,'(X) CANCEL');
            }else{
                message = new Message(slot.getText());
                drawButton(ctx,32*2,16*32,'(X) CLOSE');
            }

            messagePanel.drawOn(message,ctx,Game.looting.pickUpInProgress);

            if(slot.item.id != Item.all.nothing.id && (!Game.looting.pickUpInProgress || Game.looting.currentPickUpNumber != 0)) drawButton(ctx,32*12,16*32,this.side == 1 ? '(C) PICK UP':'(C) STASH');
        }else{
            var interiorViewField = p(7*32+8,4*32-16);
            Indoor.viewField.draw(ctx,interiorViewField);
            for(var interiorPiece of this.interior){
                interiorPiece.draw(ctx,interiorViewField)
            }
            var currentInterior = this.interior[this.currentlySelected];
            Indoor.pointer.draw(ctx,interiorViewField.add(currentInterior.x+Math.floor(this.timeStatus/20),currentInterior.y+4*Math.floor(currentInterior.interior.bounding.height/3)));

            var message = new Message(currentInterior.interior.name);
            messagePanel.drawOn(message,ctx);

            drawButton(ctx,32*2-16,16*32,'(X) EXIT');
            drawButton(ctx,32*13,16*32,'(C) SEARCH');
            //drawButton(ctx,32*5,18*32,'(S) SWITCH ROOM');
        }
    };


    this.onKeyDown = function(key){
        if(!this.visible) return;

        if(Game.looting.unit){
            if(key == KeyCode.LEFT){
                if(Game.looting.pickUpInProgress){
                    Game.looting.currentPickUpNumber = Math.max(1,Game.looting.currentPickUpNumber-1)
                } else if(Game.selectedInventorySlot % 2) {
                    Game.selectedInventorySlot -= 1;
                } else if(!(Game.selectedInventorySlot % 2) && this.side == 1){
                    Game.selectedInventorySlot += 1;
                    this.side = 0;
                }
            }else if(key == KeyCode.RIGHT){
                if(Game.looting.pickUpInProgress){
                    var slot = Game.looting.sourceInventory.getSlot(Game.selectedInventorySlot);
                    var max = slot.stackSize;
                    var playerCanPickUpMore = Game.looting.targetInventory.hasSpaceLeft() || Game.looting.targetInventory.canBeStacked(slot.item,Math.min(max,Game.looting.currentPickUpNumber+1));
                    if(playerCanPickUpMore){
                        Game.looting.currentPickUpNumber = Math.min(max, Game.looting.currentPickUpNumber+1)
                    }
                }else if(!(Game.selectedInventorySlot % 2)) {
                    Game.selectedInventorySlot += 1;
                }else if(Game.selectedInventorySlot % 2 && this.side == 0){
                    Game.selectedInventorySlot -= 1;
                    this.side = 1;
                }
            }else if(key == KeyCode.UP){
                if(Game.selectedInventorySlot > 1){
                    Game.selectedInventorySlot -= 2
                }
            }else if(key == KeyCode.DOWN){
                if(Game.selectedInventorySlot < 4){
                    Game.selectedInventorySlot += 2
                }
            }else if(key == KeyCode.X){
                if(Game.looting.pickUpInProgress){
                    Game.stopLooting()
                }else{
                    Game.hideLootingDialog();
                    this.side = 1;
                }
            }else if(key == KeyCode.C){
                if(Game.looting.pickUpInProgress){
                    if(Game.looting.currentPickUpNumber > 0){
                        Game.looting.pickUp();
                        Game.stopLooting()
                    }
                }else{
                    if(this.side == 1 && Game.looting.unit.inventory.getSlot(Game.selectedInventorySlot).item != Item.all.nothing){
                        Game.startLootingToInventory(Game.looting.unit.inventory, Game.player.inventory)
                    }else if(this.side == 0 && Game.player.inventory.getSlot(Game.selectedInventorySlot).item != Item.all.nothing){
                        Game.startLootingToInventory(Game.player.inventory, Game.looting.unit.inventory)
                    }
                }
            }
        }else{
            var currentInterior = this.interior[this.currentlySelected];
            var shift = 1;
            if(key == KeyCode.LEFT){
                if(currentInterior.type == InteriorPiece.TYPE.smallTop){
                    shift = 1;
                }else if(currentInterior.type == InteriorPiece.TYPE.smallBottom){
                    shift = 2;
                }

                if(this.interior[(this.interior.length+this.currentlySelected-shift)%this.interior.length].type == InteriorPiece.TYPE.smallBottom){
                    shift = 2;
                }

                this.currentlySelected = (this.interior.length+this.currentlySelected-shift)%this.interior.length;
            }else if(key == KeyCode.RIGHT){
                if(currentInterior.type == InteriorPiece.TYPE.smallTop){
                    shift = 2;
                }else if(currentInterior.type == InteriorPiece.TYPE.smallBottom){
                    if(this.interior[(this.interior.length+this.currentlySelected+shift)%this.interior.length].type == InteriorPiece.TYPE.smallTop){
                        shift = 2;
                    }else{
                        shift = 1;
                    }
                }

                this.currentlySelected = (this.currentlySelected+shift)%this.interior.length;
            }else if(key == KeyCode.UP){
                if(currentInterior.type == InteriorPiece.TYPE.smallBottom){
                    shift = 1;
                }else{
                    shift = 0;
                }
                this.currentlySelected = (this.interior.length+this.currentlySelected-shift)%this.interior.length;
            }else if(key == KeyCode.DOWN){
                if(currentInterior.type == InteriorPiece.TYPE.smallTop){
                    shift = 1;
                }else{
                    shift = 0;
                }
                this.currentlySelected = (this.currentlySelected+shift)%this.interior.length;
            }else if(key == KeyCode.S){
                //this.initRoom()
            }else if(key == KeyCode.C){
                currentInterior.interior.search();
            }else if(key == KeyCode.X){
                Game.hideCurrentScreen();
            }
        }
    }
}
