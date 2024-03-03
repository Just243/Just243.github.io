// UI textures by quintino pixels https://quintino-pixels.itch.io/
// Enemy, Player/Weapon, Font, and Terrain textures by analogStudios https://analogstudios.itch.io/
// Boss texture by https://elthen.itch.io/

//images, idk there's probably a better way to do this but it works for now
const caveTileset = new Image(), 
playerTileset = new Image(), 
swordTileset = new Image(), 
ghostTileset = new Image(), 
skeletonTileset = new Image(), 
slimeTileset = new Image(), 
slimeBallTileset = new Image(),
fungantTileset = new Image(), 
fungiantTileset = new Image(),
cacodaemonTileset = new Image();

//font & UI's, in a slightly different format that's slightly worse
const font = { NFlat: new Image(), NThick: new Image(), OFlat: new Image(), OThick: new Image() };
const UIArt = { ded: new Image() };

//load images
caveTileset.src = "data:image/png;base64,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";
playerTileset.src = "data:image/png;base64,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";
//caveTileset.src = "assets/terrain/cave.png";
//playerTileset.src = "assets/player/lancelot.png";
swordTileset.src = "assets/player/excalibur.png";
ghostTileset.src = "assets/enemies/ghost.png";
skeletonTileset.src = "assets/enemies/skeleton.png";
slimeTileset.src = "assets/enemies/slime.png";
slimeBallTileset.src = "assets/enemies/slimeball.png",
fungantTileset.src = "assets/enemies/fungant.png";
fungiantTileset.src = "assets/enemies/fungiant.png",
cacodaemonTileset.src = "assets/enemies/cacodaemon.png";

//load fonts & UI
font.NFlat.src = "assets/font/normal_flat.png";
font.NThick.src = "assets/font/normal_thicc.png";
font.OFlat.src = "assets/font/orange_flat.png";
font.OThick.src = "assets/font/orange_thicc.png";
UIArt.ded.src = "assets/UI/you_ded.png";

//connecting to the canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", {alpha: false});
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
ctx.imageSmoothingEnabled = false;

//event listeners
document.addEventListener("keydown", checkDown);
document.addEventListener("keyup", checkUp);
document.addEventListener("mousedown", checkMouse);

//key and mouse detection
const keys = [0, 0, 0, 0];
var mx = 0, my = 0, md = 0;

//constants, I like to use these
const sq2 = Math.sqrt(2);
const pi2 = 2*Math.PI
const metric = Math.min(ctx.canvas.width, ctx.canvas.height);

//UI stuff
const UI = { type: "", openTimer: 0, closeTimer: 0, meta: {} };
var inUI = false;

//timer
var dt = 0;

//world
var sizG = 10, sizP = 64, sizX = Math.ceil(ctx.canvas.width/sizP)+1, sizY = Math.ceil(ctx.canvas.height/sizP)+1;
var threshold = 0.4;
const grid = Array((sizX+1)*(sizY+1));
const tiles = Array(sizX*sizY);

//enemies
const enemies = [];
const spawnChance = [ // IF IT WORKS IT WORKS OK STFU
    "skeleton", "skeleton", "skeleton", "skeleton", "skeleton", 
    "ghost", "ghost", "ghost", "ghost", "ghost",
    "slime", "slime",
    "fungiant"
]; 

//player variables
const maxHealth = 25;
var playerX = 90, playerY = 90, playerD = 0, playerHP = 25;
var hurtDamage = 0, hurtTime = 0, knockX = 0, knockY = 0;
var xp = 0, nextLevel = 10;

//camera
var ScrX = playerX-ctx.canvas.width/(sizP<<1), ScrY = playerY-ctx.canvas.height/(sizP<<1)+1;

//sword variables
var swordDir = 0, swordPrevious= 0, swordSide = 0, swordD = 0, swordCooldown = 0;

//upgradeable stats
var swordSize = 1, swordDamage = 2, swordAttackSpeed = 20; movementSpeed = 0.08;

//upgrades
const upgrades = [
    {name:"Poisoning Blade"},
    {name:"Thunderous Blade"},
    {name:"Sweeping Grace"},
    {name:"Slicing Grace"},
    {name:"Powerful Punch"},
    {name:"Ferocious Bite"},
    {name:"Growth"},
    {name:"Shielding"},
    {name:"Overheal"},
    {name:"Swift Feet"},
    {name:"Vampirism"}
];

//input functions
function checkDown(e){
    switch (e.keyCode){
        case 87: keys[0] = 1; break; //up
        case 83: keys[1] = 1; break; //down
        case 65: keys[2] = 1; break; //left
        case 68: keys[3] = 1; break; //right
        case 80: //pause
            if(inUI) {
                if(UI.type == "pause" && UI.openTimer <= 0 && UI.closeTimer <= 0) {
                    UI.closeTimer = 30;
                }
            } else {
                inUI = true;
                UI.type = "pause";
                UI.openTimer = 30;
            }
            break;
        default: break;
    }
}
function checkUp(e){
    switch (e.keyCode){
        case 87: keys[0] = 0; break; //up
        case 83: keys[1] = 0; break; //down
        case 65: keys[2] = 0; break; //left
        case 68: keys[3] = 0; break; //right
        default: break;
    }
}
function checkMouse(e){
    mx = e.pageX;
    my = e.pageY;
    md = true;
}

//world gen functions
function prng(x, y){
    let a = x*396.73+y*795.21;
    return(a*a*a%a%1);
}
function noise(x, y, s){
    let xx = x/s+1;
    let yy = y/s+1;
    let a = xx%1;
    let b = yy%1;
    let r1 = prng(Math.floor(xx), Math.floor(yy));
    let r2 = prng(Math.ceil(xx), Math.floor(yy));
    let r3 = prng(Math.floor(xx), Math.ceil(yy));
    let r4 = prng(Math.ceil(xx), Math.ceil(yy));
    let c = r1+a*a*(3-2*a)*(r2-r1);
    let d = r3+a*a*(3-2*a)*(r4-r3);
    return(c+b*b*(3-2*b)*(d-c));
}

//collision functions
function checkTile(x, y, px, py){
    if(x >= 0 && x < sizX && y >= 0 && y < sizY){
        switch(tiles[x+y*sizX]){
            case 0: break; //lava
            case 1: if(px < x+0.5) playerX-=px-x-0.5; if(py < y+0.5) playerY-=py-y-0.5; break;
            case 2: if(px > x) playerX-=px-x; if(py < y+0.5) playerY-=py-y-0.5; break;
            case 3: if(py < y+0.5) playerY-=py-y-0.5; break;
            case 4: if(px < x+0.5) playerX-=px-x-0.5; if(py > y) playerY-=(py-y); break;
            case 5: if(px < x+0.5) playerX-=px-x-0.5; break;
            case 6: break; //no texture
            case 7: 
                if(px < x+0.5 && py < y+0.5){
                    if(Math.abs(px-x-0.5) < Math.abs(py-y-0.5)){
                        playerX-=px-x-0.5;
                    } else {
                        playerY-=py-y-0.5;
                    }
                } 
                break;
            case 8: if(px > x) playerX-=(px-x); if(py > y) playerY-=(py-y); break;
            case 9: break; //no texture
            case 10: if(px > x) playerX-=(px-x); break;
            case 11: 
                if(px > x && py < y+0.5){
                    if(Math.abs(px-x) < Math.abs(py-y-0.5)){
                        playerX-=px-x;
                    } else {
                        playerY-=py-y-0.5;
                    }
                }
                break;
            case 12: if(py > y) playerY-=(py-y); break;
            case 13: 
                if(px < x+0.5 && py > y){
                    if(Math.abs(px-x-0.5) < Math.abs(py-y)){
                        playerX-=px-x-0.5;
                    } else {
                        playerY-=py-y;
                    }
                }
                break;
            case 14: 
                if(px > x && py > y){
                    if(Math.abs(px-x) < Math.abs(py-y)){
                        playerX-=px-x;
                    } else {
                        playerY-=py-y;
                    }
                }
                break;
            case 15: break; //terrain
        }
    }
}
function checkEnemyTile(enemy, x, y, rx, ry){
    if(x >= 0 && x < sizX && y >= 0 && y < sizY){
        switch(tiles[x+y*sizX]){
            case 0: break; //lava
            case 1: if(rx < x+0.5) enemy.x-=rx-x-0.5; if(ry < y+0.5) enemy.y-=ry-y-0.5; break;
            case 2: if(rx > x) enemy.x-=rx-x; if(ry < y+0.5) enemy.y-=ry-y-0.5; break;
            case 3: if(ry < y+0.5) enemy.y-=ry-y-0.5; break;
            case 4: if(rx < x+0.5) enemy.x-=rx-x-0.5; if(ry > y) enemy.y-=(ry-y); break;
            case 5: if(rx < x+0.5) enemy.x-=rx-x-0.5; break;
            case 6: break; //no texture
            case 7: 
                if(rx < x+0.5 && ry < y+0.5){
                    if(Math.abs(rx-x-0.5) < Math.abs(ry-y-0.5)){
                        enemy.x-=rx-x-0.5;
                    } else {
                        enemy.y-=ry-y-0.5;
                    }
                } 
                break;
            case 8: if(rx > x) enemy.x-=(rx-x); if(ry > y) enemy.y-=(ry-y); break;
            case 9: break; //no texture
            case 10: if(rx > x) enemy.x-=(rx-x); break;
            case 11: 
                if(rx > x && ry < y+0.5){
                    if(Math.abs(rx-x) < Math.abs(ry-y-0.5)){
                        enemy.x-=rx-x;
                    } else {
                        enemy.y-=ry-y-0.5;
                    }
                }
                break;
            case 12: if(ry > y) enemy.y-=(ry-y); break;
            case 13: 
                if(rx < x+0.5 && ry > y){
                    if(Math.abs(rx-x-0.5) < Math.abs(ry-y)){
                        enemy.x-=rx-x-0.5;
                    } else {
                        enemy.y-=ry-y;
                    }
                }
                break;
            case 14: 
                if(rx > x && ry > y){
                    if(Math.abs(rx-x) < Math.abs(ry-y)){
                        enemy.x-=rx-x;
                    } else {
                        enemy.y-=ry-y;
                    }
                }
                break;
            case 15: break; //terrain
        }
    }
}

//utility functions, not necessary, but nice to have
function addEnemy(x, y, type){
    /* x = x position, y = y position, kx = x knockback, ky = y knockback
     * t = type, st = spawn timer, dir = direction (1 or 0)
     * hurtT = hurt timer, deathT = death animation timer, health = health
     * damage = attack damage, attackCd = attack cooldown, attackSpeed = interval between attacks
     * xp = xp granted on kill, col = collision, drag = friction 
    */

    // ngl this should be in a JSON file but whatever

    switch(type){
        case "ghost":
            enemies.push({ x:x, y:y, kx:0, ky:0, t:type, st:60, dir:1, hurtT:0, deathT:0, health:4, damage:2, attackCd:0, attackSpeed:30, xp:1, col:false, drag:0.9 });
            break;
        case "skeleton":
            enemies.push({ x:x, y:y, kx:0, ky:0, t:type, st:60, dir:1, hurtT:0, deathT:0, health:8, damage:1, attackCd:0, attackSpeed:20, xp:1, col:true, drag:0.95 });
            break;
        case "slime": 
            enemies.push({ x:x, y:y, kx:0, ky:0, t:type, st:60, dir:1, hurtT:0, deathT:0, health:24, damage:6, attackCd:200, attackSpeed:100, xp:4, col:true, drag:0.9 });
            break;
        case "slimeBall":
            enemies.push({ x:x, y:y, kx:0, ky:0, t:type, st:60, dir:1, hurtT:0, deathT:0, health:1, damage:3, attackCd:0, attackSpeed:20, xp:1, col:true, drag:0.8 });
            break;
        case "fungiant":
            enemies.push({ x:x, y:y, kx:0, ky:0, t:type, st:60, dir:1, hurtT:0, deathT:0, health:20, damage:1, attackCd:100, attackSpeed:160, xp:6, col:true, drag:0.6 });
            break;
        case "fungant":
            enemies.push({ x:x, y:y, kx:0, ky:0, t:type, st:60, dir:1, hurtT:0, deathT:0, health:1, damage:1, attackCd:0, attackSpeed:20, xp:0, col:true, drag:0.95 });
            break;
        default: break;
    }
}
function length(a, b){
    return Math.sqrt(a*a+b*b);
}

//main loop
function draw(e) {
    //js sucks
    ctx.save();

    //there's probably a better way to do this but IDGAF
    if(!inUI){ //unreadable code go brr
    //camera movememnt
    ScrX = Math.max(ScrX - (ScrX-(playerX-ctx.canvas.width/(sizP<<1)))/16, 0);
    ScrY = Math.max(ScrY - (ScrY-(playerY-ctx.canvas.height/(sizP<<1)))/16, 0);

    //world generation
    for(let y = 0; y<sizY+1; y+=1){
        for(let x = 0; x<sizX+1; x+=1){
            grid[x+y*(sizX+1)] = noise(x + Math.floor(ScrX), y + Math.floor(ScrY), sizG);
        }
    }

    //world rendering
    const dx = -Math.floor((ScrX%1)*sizP), dy = -Math.floor((ScrY%1)*sizP), aniD = (Math.floor(dt/30)%2)<<4;
    for(let y = 0; y<sizY; y+=1){
        for(let x = 0; x<sizX; x+=1){
            switch(tiles[x+y*sizX] = ((grid[x+y*(sizX+1)]>threshold)<<3)+((grid[x+1+y*(sizX+1)]>threshold)<<2)+((grid[x+(y+1)*(sizX+1)]>threshold)<<1)+(grid[x+1+(y+1)*(sizX+1)]>threshold)){
                case 15:
                    switch(Math.floor(prng(x + Math.floor(ScrX), y + Math.floor(ScrY))*10)){
                        case 7: ctx.drawImage(caveTileset, 256, 0, 16, 16, dx+x*sizP, dy+y*sizP, sizP, sizP); break;
                        case 8: ctx.drawImage(caveTileset, 272, 0, 16, 16, dx+x*sizP, dy+y*sizP, sizP, sizP); break;
                        case 9: ctx.drawImage(caveTileset, 288, 0, 16, 16, dx+x*sizP, dy+y*sizP, sizP, sizP); break;
                        default: ctx.drawImage(caveTileset, 240, 0, 16, 16, dx+x*sizP, dy+y*sizP, sizP, sizP); break;
                    }
                    break;
                case 6:
                    grid[x+(y+1)*(sizX+1)] = threshold*0.9; 
                    tiles[x+y*sizX] = 4;
                    ctx.drawImage(caveTileset, 64, aniD, 16, 16, dx+x*sizP, dy+y*sizP, sizP, sizP);
                    break;
                case 9:
                    grid[x+1+(y+1)*(sizX+1)] = threshold*0.9; 
                    tiles[x+y*sizX] = 8;
                    ctx.drawImage(caveTileset, 128, aniD, 16, 16, dx+x*sizP, dy+y*sizP, sizP, sizP);
                    break; 
                default:
                    ctx.drawImage(caveTileset, tiles[x+y*sizX]<<4, aniD, 16, 16, dx+x*sizP, dy+y*sizP, sizP, sizP);
                    break;
            }
        }
    }

    //constants for screenspace - worldspace conversion
    const ax = ScrX+dx/sizP, ay = ScrY+dy/sizP;

    //enemy spawning
    if(Math.random()>0.995){
        let type = spawnChance[Math.floor(Math.random()*spawnChance.length)]; //weighted selection
        for(let spawnCount = Math.ceil(Math.random()*4); spawnCount > 0; spawnCount--){
            for(let attempts = 0; attempts < 10; attempts++){ //10 attempts to spawn
                let randDir = Math.random()*Math.PI*2;
                let randDist = Math.random()*5+1;
                let testX = playerX + Math.sin(randDir)*randDist;
                let testY = playerY + Math.cos(randDir)*randDist;
                if(testX > ax && testX-ax < sizX && testY > ay && testY-ay < sizY){
                    if(tiles[Math.floor(testX-ax+0.5)+Math.floor(testY-ay+0.5)*sizX] === 15){
                        addEnemy(testX, testY, type);
                        break;
                    }
                }
            }
        }
    }

    //update enemies
    for(let i = 0; i < enemies.length; i++){
        //check if dead
        if(enemies[i].health < 0){
            enemies[i].deathT++;
            if(enemies[i].deathT > 47){
                xp += enemies[i].xp;
                enemies[i] = enemies[enemies.length-1];
                enemies.pop();
                i--;
                continue;
            }
        }

        //if the enemy is on the screen, it is updated
        if(enemies[i].x-ax > 0 && enemies[i].x-ax < sizX && enemies[i].y-ay > 0 && enemies[i].y-ay < sizY){
            //enemy - enemy collision (kinda slow)
            for(let a = i+1; a < enemies.length; a++){
                let distX = enemies[i].x - enemies[a].x;
                let distY = enemies[i].y - enemies[a].y;
                if(Math.abs(distX) > 1 || Math.abs(distY) > 1){
                    continue;
                }
                let dist = Math.sqrt(distX*distX+distY*distY);

                if(enemies[i].type == "fungiant" || enemies[i].type == "fungiant"){
                    if(dist < 1 && dist > 0.05){
                        enemies[i].x += (distX/dist)*(1-dist)*0.5;
                        enemies[i].y += (distY/dist)*(1-dist)*0.5;
                        enemies[a].x -= (distX/dist)*(1-dist)*0.5;
                        enemies[a].y -= (distY/dist)*(1-dist)*0.5;
                    }
                } else {
                    if(dist < 0.8 && dist > 0.05){
                        enemies[i].x += (distX/dist)*(0.8-dist)*0.5;
                        enemies[i].y += (distY/dist)*(0.8-dist)*0.5;
                        enemies[a].x -= (distX/dist)*(0.8-dist)*0.5;
                        enemies[a].y -= (distY/dist)*(0.8-dist)*0.5;
                    }
                }
            }

            //variables for movement
            const distX = playerX - enemies[i].x;
            const distY = playerY - enemies[i].y;
            const dist = Math.sqrt(distX*distX+distY*distY);

            //death animation
            if(enemies[i].health < 0){
                //movement
                enemies[i].x += enemies[i].kx *= enemies[i].drag;
                enemies[i].y += enemies[i].ky *= enemies[i].drag;
                //collision
                if(enemies[i].col){
                    checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax+0.5), Math.floor(enemies[i].y-ay+0.5), enemies[i].x-ax, enemies[i].y-ay);
                    checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax+0.5), Math.floor(enemies[i].y-ay-0.5), enemies[i].x-ax, enemies[i].y-ay);
                    checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax-0.5), Math.floor(enemies[i].y-ay+0.5), enemies[i].x-ax, enemies[i].y-ay);
                    checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax-0.5), Math.floor(enemies[i].y-ay-0.5), enemies[i].x-ax, enemies[i].y-ay);
                }

                switch(enemies[i].t){
                    case "ghost":
                        ctx.drawImage(ghostTileset, (Math.floor(enemies[i].deathT/12)%4+enemies[i].dir*4)*24, 120, 24, 24, Math.floor((enemies[i].x-ScrX-0.75)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.5), Math.floor(sizP*1.5));
                        break;
                    case "skeleton":
                        ctx.drawImage(skeletonTileset, (Math.floor(enemies[i].deathT/12)%4+enemies[i].dir*4)*24, 144, 24, 24, Math.floor((enemies[i].x-ScrX-0.75)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.5), Math.floor(sizP*1.5));
                        break;
                    case "slime":
                        ctx.drawImage(slimeTileset, (Math.floor(enemies[i].deathT/12)%4+enemies[i].dir*4)*24, 96, 24, 24, Math.floor((enemies[i].x-ScrX-0.75)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.5), Math.floor(sizP*1.5));
                        break;
                    case "slimeBall":
                        ctx.drawImage(slimeBallTileset, (Math.floor(enemies[i].deathT/12)%4+enemies[i].dir*4)*24, 144, 24, 24, Math.floor((enemies[i].x-ScrX-0.75)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.5), Math.floor(sizP*1.5));
                        break;
                    case "fungiant":
                        ctx.drawImage(fungiantTileset, (Math.floor(enemies[i].deathT/12)%4+enemies[i].dir*4)*28, 168, 28, 28, Math.floor((enemies[i].x-ScrX-0.75)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.75), Math.floor(sizP*1.75));
                        break;
                    case "fungant":
                        ctx.drawImage(fungantTileset, (Math.floor(enemies[i].deathT/12)%4+enemies[i].dir*4)*24, 144, 24, 24, Math.floor((enemies[i].x-ScrX-0.75)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.5), Math.floor(sizP*1.5));
                        break;
                    default: break;
                }
                continue;
            }

            //random timer update
            enemies[i].attackCd--;

            //hurt animations
            if(enemies[i].hurtT > 0){
                //hurt stuff
                enemies[i].hurtT--;

                //movement
                enemies[i].x += enemies[i].kx *= enemies[i].drag;
                enemies[i].y += enemies[i].ky *= enemies[i].drag;
                //collision
                if(enemies[i].col){
                    checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax+0.5), Math.floor(enemies[i].y-ay+0.5), enemies[i].x-ax, enemies[i].y-ay);
                    checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax+0.5), Math.floor(enemies[i].y-ay-0.5), enemies[i].x-ax, enemies[i].y-ay);
                    checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax-0.5), Math.floor(enemies[i].y-ay+0.5), enemies[i].x-ax, enemies[i].y-ay);
                    checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax-0.5), Math.floor(enemies[i].y-ay-0.5), enemies[i].x-ax, enemies[i].y-ay);
                }

                switch(enemies[i].t){
                    case "ghost":
                        ctx.drawImage(ghostTileset, (Math.floor(enemies[i].hurtT/6)%4+enemies[i].dir*4)*24, 96, 24, 24, Math.floor((enemies[i].x-ScrX-0.75)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.5), Math.floor(sizP*1.5));
                        break;
                    case "skeleton":
                        ctx.drawImage(skeletonTileset, (Math.floor(enemies[i].hurtT/6)%4+enemies[i].dir*4)*24, 120, 24, 24, Math.floor((enemies[i].x-ScrX-0.75)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.5), Math.floor(sizP*1.5));
                        break;
                    case "slime":
                        ctx.drawImage(slimeTileset, (Math.floor(enemies[i].hurtT/6)%4+enemies[i].dir*4)*24, 72, 24, 24, Math.floor((enemies[i].x-ScrX-0.75)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.5), Math.floor(sizP*1.5));
                        break;
                    case "slimeBall":
                        ctx.drawImage(slimeBallTileset, (Math.floor(enemies[i].hurtT/6)%4+enemies[i].dir*4)*24, 120, 24, 24, Math.floor((enemies[i].x-ScrX-0.75)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.5), Math.floor(sizP*1.5));
                        break;
                    case "fungiant":
                        ctx.drawImage(fungiantTileset, (Math.floor(enemies[i].hurtT/6)%4+enemies[i].dir*4)*28, 140, 28, 28, Math.floor((enemies[i].x-ScrX-0.75)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.75), Math.floor(sizP*1.75));
                        break;
                    case "fungant":
                        ctx.drawImage(fungantTileset, (Math.floor(enemies[i].hurtT/6)%4+enemies[i].dir*4)*24, 120, 24, 24, Math.floor((enemies[i].x-ScrX-0.75)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.5), Math.floor(sizP*1.5));
                        break;
                    default: break;
                }
                continue;
            }

            //AI's + rendering (spawming and everything else) (why did i do this)
            switch(enemies[i].t){
                case "ghost": 
                    if(enemies[i].st > 0){
                        ctx.drawImage(ghostTileset, Math.floor(4-enemies[i].st/15)*24, 0, 24, 24, Math.floor((enemies[i].x-ScrX-0.75)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.5), Math.floor(sizP*1.5));
                        enemies[i].st--;
                    } else {
                        if(dist > 0.6){
                            enemies[i].dir = distX < 0;
                            enemies[i].x += (distX/dist)*0.04;
                            enemies[i].y += (distY/dist)*0.04;
                        } else if(enemies[i].attackCd < 0){
                            if(hurtTime < 0 || enemies[i].damage > hurtDamage){
                                playerHP -= enemies[i].damage;
                                enemies[i].attackCd = enemies[i].attackSpeed;
                                hurtDamage = enemies[i].damage;
                                hurtTime = 24;
                                knockX = (distX/dist)*Math.sqrt(enemies[i].damage)/5;                                    
                                knockY = (distY/dist)*Math.sqrt(enemies[i].damage)/5;
                            }
                        }

                        ctx.drawImage(ghostTileset, (Math.floor(dt/6)%4+enemies[i].dir*4)*24, 24, 24, 24, Math.floor((enemies[i].x-ScrX-0.75)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.5), Math.floor(sizP*1.5));
                    }
                    break;
                case "skeleton":
                    if(enemies[i].st > 0){
                        ctx.drawImage(skeletonTileset, Math.floor(4-enemies[i].st/15)*24, 0, 24, 24, Math.floor((enemies[i].x-ScrX-0.75)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.5), Math.floor(sizP*1.5));
                        enemies[i].st--;
                    } else{
                        if(dist > 0.6){
                            enemies[i].dir = distX < 0;
                            enemies[i].x += (distX/dist)*0.06;
                            enemies[i].y += (distY/dist)*0.06;
                        } else if(enemies[i].attackCd < 0){
                            if(hurtTime < 0 || enemies[i].damage > hurtDamage){
                                playerHP -= enemies[i].damage;
                                enemies[i].attackCd = enemies[i].attackSpeed;
                                hurtDamage = enemies[i].damage;
                                hurtTime = 24;
                                knockX = (distX/dist)*Math.sqrt(enemies[i].damage)*0.2;
                                knockY = (distY/dist)*Math.sqrt(enemies[i].damage)*0.2;
                            }
                        }

                        checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax+0.5), Math.floor(enemies[i].y-ay+0.5), enemies[i].x-ax, enemies[i].y-ay);
                        checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax+0.5), Math.floor(enemies[i].y-ay-0.5), enemies[i].x-ax, enemies[i].y-ay);
                        checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax-0.5), Math.floor(enemies[i].y-ay+0.5), enemies[i].x-ax, enemies[i].y-ay);
                        checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax-0.5), Math.floor(enemies[i].y-ay-0.5), enemies[i].x-ax, enemies[i].y-ay);
    
                        ctx.drawImage(skeletonTileset, (Math.floor(dt/6)%4+enemies[i].dir*4)*24, (Math.floor(dt/24)%2+2)*24, 24, 24, Math.floor((enemies[i].x-ScrX-0.75)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.5), Math.floor(sizP*1.5));
                    }
                    break;
                case "slime":
                    if(enemies[i].st > 0){
                        ctx.drawImage(slimeTileset, Math.floor(4-enemies[i].st/15)*24, 0, 24, 24, Math.floor((enemies[i].x-ScrX-0.75)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.5), Math.floor(sizP*1.5));
                        enemies[i].st--;
                    } else{
                        if(dist > 0.6){
                            enemies[i].dir = distX < 0;
                            if(dist > 6){
                                enemies[i].x += (distX/dist)*0.03;
                                enemies[i].y += (distY/dist)*0.03;
                            } else {
                                if(enemies[i].attackCd < 0){
                                    addEnemy(enemies[i].x+Math.random()-0.5, enemies[i].y+Math.random()-0.5, "slimeBall");
                                    enemies[i].attackCd = enemies[i].attackSpeed;
                                    enemies[i].health--;
                                }
                            }
                        } else if(enemies[i].attackCd < 0){
                            if(hurtTime < 0 || enemies[i].damage > hurtDamage){
                                playerHP -= enemies[i].damage;
                                enemies[i].attackCd = enemies[i].attackSpeed;
                                hurtDamage = enemies[i].damage;
                                hurtTime = 24;
                                knockX = (distX/dist)*Math.sqrt(enemies[i].damage)*0.2;
                                knockY = (distY/dist)*Math.sqrt(enemies[i].damage)*0.2;
                            }
                        }

                        checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax+0.5), Math.floor(enemies[i].y-ay+0.5), enemies[i].x-ax, enemies[i].y-ay);
                        checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax+0.5), Math.floor(enemies[i].y-ay-0.5), enemies[i].x-ax, enemies[i].y-ay);
                        checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax-0.5), Math.floor(enemies[i].y-ay+0.5), enemies[i].x-ax, enemies[i].y-ay);
                        checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax-0.5), Math.floor(enemies[i].y-ay-0.5), enemies[i].x-ax, enemies[i].y-ay);
    
                        ctx.drawImage(slimeTileset, (Math.floor(dt/6)%4+enemies[i].dir*4)*24, 24, 24, 24, Math.floor((enemies[i].x-ScrX-0.75)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.5), Math.floor(sizP*1.5));
                    }
                    break;
                case "slimeBall":
                    if(enemies[i].st > 0){
                        ctx.drawImage(slimeBallTileset, Math.floor(4-enemies[i].st/15)*24, 0, 24, 24, Math.floor((enemies[i].x-ScrX-0.75)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.5), Math.floor(sizP*1.5));
                        enemies[i].st--;
                    } else{
                        if(dist > 0.6){
                            enemies[i].dir = distX < 0;
                            if(dist > 2){
                                enemies[i].x += (distX/dist)*0.06;
                                enemies[i].y += (distY/dist)*0.06;
                            } else {
                                enemies[i].x += (distX/dist)*0.03;
                                enemies[i].y += (distY/dist)*0.03;
                            }
                        } else if(enemies[i].attackCd < 0){
                            if(hurtTime < 0 || enemies[i].damage > hurtDamage){
                                playerHP -= enemies[i].damage;
                                enemies[i].attackCd = enemies[i].attackSpeed;
                                hurtDamage = enemies[i].damage;
                                hurtTime = 24;
                                knockX = (distX/dist)*Math.sqrt(enemies[i].damage)*0.2;
                                knockY = (distY/dist)*Math.sqrt(enemies[i].damage)*0.2;
                            }
                        }

                        checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax+0.5), Math.floor(enemies[i].y-ay+0.5), enemies[i].x-ax, enemies[i].y-ay);
                        checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax+0.5), Math.floor(enemies[i].y-ay-0.5), enemies[i].x-ax, enemies[i].y-ay);
                        checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax-0.5), Math.floor(enemies[i].y-ay+0.5), enemies[i].x-ax, enemies[i].y-ay);
                        checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax-0.5), Math.floor(enemies[i].y-ay-0.5), enemies[i].x-ax, enemies[i].y-ay);
    
                        ctx.drawImage(slimeBallTileset, (Math.floor(dt/6)%4+enemies[i].dir*4)*24, 24, 24, 24, Math.floor((enemies[i].x-ScrX-0.75)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.5), Math.floor(sizP*1.5));
                    }
                    break;
                case "fungiant":
                    if(enemies[i].st > 0){
                        ctx.drawImage(fungiantTileset, Math.floor(4-enemies[i].st/15)*28, 0, 28, 28, Math.floor((enemies[i].x-ScrX-0.75)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.75), Math.floor(sizP*1.75));
                        enemies[i].st--;
                    } else{
                        if(dist > 0.6){
                            enemies[i].dir = distX < 0;
                            if(dist > 7){
                                enemies[i].x += (distX/dist)*0.02;
                                enemies[i].y += (distY/dist)*0.02;
                            } else {
                                if(enemies[i].attackCd < 0){
                                    addEnemy(enemies[i].x+Math.random()-0.5, enemies[i].y+Math.random()-0.5, "fungant");
                                    enemies[i].attackCd = enemies[i].attackSpeed;
                                    enemies[i].health--;
                                }
                            }
                        }

                        checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax+0.5), Math.floor(enemies[i].y-ay+0.5), enemies[i].x-ax, enemies[i].y-ay);
                        checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax+0.5), Math.floor(enemies[i].y-ay-0.5), enemies[i].x-ax, enemies[i].y-ay);
                        checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax-0.5), Math.floor(enemies[i].y-ay+0.5), enemies[i].x-ax, enemies[i].y-ay);
                        checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax-0.5), Math.floor(enemies[i].y-ay-0.5), enemies[i].x-ax, enemies[i].y-ay);

                        ctx.drawImage(fungiantTileset, (Math.floor(dt/6)%4+enemies[i].dir*4)*28, 28, 28, 28, Math.floor((enemies[i].x-ScrX-0.75)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.75), Math.floor(sizP*1.75));
                    }
                    break;
                case "fungant":
                    if(enemies[i].st > 0){
                        ctx.drawImage(fungantTileset, Math.floor(4-enemies[i].st/15)*24, 0, 24, 24, Math.floor((enemies[i].x-ScrX-0.75)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.5), Math.floor(sizP*1.5));
                        enemies[i].st--;
                    } else{
                        enemies[i].dir = distX < 0;
                        if(dist > 0.6){
                            enemies[i].x += (distX/dist)*0.08;
                            enemies[i].y += (distY/dist)*0.08;
                        } else {

                        }

                        checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax+0.5), Math.floor(enemies[i].y-ay+0.5), enemies[i].x-ax, enemies[i].y-ay);
                        checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax+0.5), Math.floor(enemies[i].y-ay-0.5), enemies[i].x-ax, enemies[i].y-ay);
                        checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax-0.5), Math.floor(enemies[i].y-ay+0.5), enemies[i].x-ax, enemies[i].y-ay);
                        checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax-0.5), Math.floor(enemies[i].y-ay-0.5), enemies[i].x-ax, enemies[i].y-ay);

                        ctx.drawImage(fungantTileset, (Math.floor(dt/6)%4+enemies[i].dir*4)*24, 48, 24, 24, Math.floor((enemies[i].x-ScrX-0.75)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.5), Math.floor(sizP*1.5));
                    }
                    break;
                default: break;
            }
        } else {
            //despawning
            let distX = playerX - enemies[i].x;
            let distY = playerY - enemies[i].y;
            if(Math.sqrt(distX*distX+distY*distY) > Math.max(sizX, sizY)*1.5){
                enemies[i] = enemies[enemies.length-1];
                enemies.pop();
                i--;
            }
        }
    }

    //ctx.drawImage(cacodaemonTileset, 0, 0, 64, 64, Math.floor((90-ScrX-0.75)*sizP), Math.floor((90-ScrY-1.25)*sizP), sizP*4, sizP*4);

    //player movement
    if(hurtTime>0){
        playerX = Math.max(playerX+(knockX *= 0.95), 0);
        playerY = Math.max(playerY+(knockY *= 0.95), 0);
    } else {
        playerX = Math.max(playerX + (keys[3] - keys[2])* ((keys[0] || keys[1]) && (keys[2] || keys[3])? movementSpeed*sq2/2:movementSpeed), 0); 
        playerY = Math.max(playerY + (keys[1] - keys[0])* ((keys[0] || keys[1]) && (keys[2] || keys[3])? movementSpeed*sq2/2:movementSpeed), 0);
        if(keys[3] - keys[2] != 0 && keys[2] != playerD){
                playerD = keys[2];
        }
    }
    
    //player collison, checks 4 surrounding tiles
    checkTile(Math.floor(playerX-ax+0.5), Math.floor(playerY-ay+0.5), playerX-ax, playerY-ay);
    checkTile(Math.floor(playerX-ax+0.5), Math.floor(playerY-ay-0.5), playerX-ax, playerY-ay);
    checkTile(Math.floor(playerX-ax-0.5), Math.floor(playerY-ay+0.5), playerX-ax, playerY-ay);
    checkTile(Math.floor(playerX-ax-0.5), Math.floor(playerY-ay-0.5), playerX-ax, playerY-ay);

    //player display
    if(hurtTime>0){
        ctx.drawImage(playerTileset, Math.floor(hurtTime/6)<<5+(playerD<<7), 256, 32, 32, Math.floor((playerX-ScrX-1)*sizP), Math.floor((playerY-ScrY-1.5)*sizP), sizP<<1, sizP<<1);
    } else {
        if(keys[0] || keys[1] || keys[2] || keys[3]) {
            ctx.drawImage(playerTileset, (Math.floor(dt/6)%4<<5)+(playerD<<7), Math.floor(dt/24)%2+1<<5, 32, 32, Math.floor((playerX-ScrX-1)*sizP), Math.floor((playerY-ScrY-1.5)*sizP), sizP<<1, sizP<<1);
        } else {
            ctx.drawImage(playerTileset, (Math.floor(dt/12)%4<<5)+(playerD<<7), 0, 32, 32, Math.floor((playerX-ScrX-1)*sizP), Math.floor((playerY-ScrY-1.5)*sizP), sizP<<1, sizP<<1);
        }
    }

    //sword rotation (only gets called if the mouse is clicked) this stuff was a pain
    if(md){
        if(swordCooldown < 0){
            //reset inputs & cooldowns
            md = false;
            swordCooldown = swordAttackSpeed;

            //update direction (took ~1 day)
            swordPrevious = swordDir;
            swordDir = Math.atan((my-Math.floor((playerY-ScrY)*sizP))/(mx-Math.floor((playerX-ScrX)*sizP))) + ((mx < Math.floor((playerX-ScrX)*sizP))? Math.PI/2:3*Math.PI/2);
            swordD = Math.PI - Math.abs(Math.abs(swordPrevious%pi2 - swordDir%pi2)- Math.PI);
            swordSide = Math.abs(Math.abs(swordPrevious+swordD)%pi2-swordDir%pi2) < 0.05;

            //sword damage (took ~2, 3 days)
            //constants
            const dir = (swordPrevious+swordDir)/2 + ((Math.abs(Math.abs(swordDir-swordPrevious)-Math.abs(swordD)) < 0.05)? Math.PI:0);
            const sinR = Math.sin(dir);                 // rotation of the pi
            const cosR = -Math.cos(dir);                //idk if it works it works (took me way too long anyways)
            const sinD = Math.sin(Math.abs(swordD/2));  // angle of the >
            const cosD = Math.cos(Math.abs(swordD/2));
            const scaledSize = swordSize*1.5;

            for(let i = 0; i < enemies.length; i++){
                let tempX = enemies[i].x - playerX;
                let tempY = enemies[i].y-0.5 - playerY;

                //AABB check, ez optimization, can be optimized further tho
                if(Math.abs(tempX) > scaledSize+0.5 || Math.abs(tempY) > scaledSize+0.5){
                    continue;
                }

                //SDF TIME!!!! this took forever, yet is still kinda bad
                let temX = tempX*cosR-tempY*sinR;
                tempY = tempX*sinR+tempY*cosR;
                tempX = Math.abs(temX);
                
                let clamped = tempX * sinD + tempY * cosD;
                clamped = (clamped > 0)? ((clamped < scaledSize)? clamped:scaledSize):0;
                
                if(Math.max(Math.sqrt(tempX*tempX+tempY*tempY)-scaledSize, length(tempX - sinD*clamped, tempY-cosD*clamped)*Math.sign(cosD*tempX-sinD*tempY)) <= 0.5){
                    //deal damage
                    enemies[i].health -= swordDamage;
                    enemies[i].hurtT = 24;

                    //knockback
                    let dx = enemies[i].x - playerX;
                    let dy = enemies[i].y - playerY;
                    let dst = Math.sqrt(dx*dx+dy*dy);
                    enemies[i].kx = dx/dst*Math.sqrt(swordDamage)*0.08;
                    enemies[i].ky = dy/dst*Math.sqrt(swordDamage)*0.08;
                }
            }
        }
    }
    
    //sword render
    ctx.translate(Math.floor((playerX-ScrX)*sizP), Math.floor((playerY-ScrY)*sizP));
    ctx.rotate(swordDir+Math.PI);
    const scaledSize = Math.floor((sizP<<1)*swordSize);
    if(swordCooldown <= 0){
        ctx.drawImage(swordTileset, 0, 0, 32, 32, -sizP, -sizP*2, sizP<<1, sizP<<1);
    } else if(Math.abs(swordD) < Math.PI/8){
        ctx.drawImage(swordTileset, Math.floor(4-swordCooldown*4/swordAttackSpeed)<<5, 96, 32, 32, -Math.floor(sizP*swordSize), -scaledSize, scaledSize, scaledSize);
    } else if (swordSide){
        ctx.drawImage(swordTileset, Math.floor(4-swordCooldown*4/swordAttackSpeed)<<5, 32, 32, 32, -Math.floor(sizP*swordSize), -scaledSize, scaledSize, scaledSize);
    } else {
        ctx.drawImage(swordTileset, Math.floor(4-swordCooldown*4/swordAttackSpeed)<<5, 64, 32, 32, -Math.floor(sizP*swordSize), -scaledSize, scaledSize, scaledSize);
    }
    ctx.restore();

    //UI
    //health & xp bar
    ctx.fillStyle = `rgb(${53}, ${53}, ${63})`;
    ctx.fillRect(Math.floor(metric*0.05)-5, Math.floor(metric*0.05)-5, Math.floor(metric*0.75)+10, Math.floor(metric*0.04)+10);
    ctx.fillRect(Math.floor(metric*0.05)-5, Math.floor(metric*0.05)+Math.floor(metric*0.04)+5, Math.floor(metric*0.5)+10, Math.floor(metric*0.02)+5);

    ctx.fillStyle = `rgb(${235}, ${228}, ${219})`;
    ctx.fillRect(Math.floor(metric*0.05), Math.floor(metric*0.05), Math.floor(metric*0.75), Math.floor(metric*0.04));
    ctx.fillRect(Math.floor(metric*0.05), Math.floor(metric*0.05)+Math.floor(metric*0.04)+5, Math.floor(metric*0.5), Math.floor(metric*0.02));

    ctx.fillStyle = `rgb(${189}, ${96}, ${88})`;
    ctx.fillRect(Math.floor(metric*0.05)+5, Math.floor(metric*0.05)+5, Math.floor(metric*0.05)+Math.floor(metric*0.7*playerHP/maxHealth)-10, Math.floor(metric*0.04)-10);

    ctx.fillStyle = `rgb(${229}, ${183}, ${98})`;
    ctx.fillRect(Math.floor(metric*0.05)+5, Math.floor(metric*0.05)+Math.floor(metric*0.04)+10, Math.floor(metric*0.05)+Math.floor(metric*0.45*(xp > nextLevel? 1:xp/nextLevel))-10, Math.floor(metric*0.02)-10);

    ctx.drawImage(playerTileset, 0, 0, 32, 32, Math.floor(metric*-0.025), Math.floor(metric*-0.025), Math.floor(metric*0.2), Math.floor(metric*0.2));

    //player death cuz idk where else to put it
    if(playerHP < 0){
        inUI = true;
        UI.type = "ded";
        UI.openTimer = 60;
    }

    //player level up cuz idk where else to put it
    if(xp >= nextLevel){
        inUI = true;
        UI.type = "upgrade";
        UI.openTimer = 60;
        UI.meta = {
            0:{ID:Math.floor(Math.random()*upgrades.length), Val:Math.floor(Math.random()*Math.random()*100)/100}, 
            1:{ID:Math.floor(Math.random()*upgrades.length), Val:Math.floor(Math.random()*Math.random()*100)/100}, 
            2:{ID:Math.floor(Math.random()*upgrades.length), Val:Math.floor(Math.random()*Math.random()*100)/100}
        };
    }

    //updating timers
    dt++;
    hurtTime--;
    swordCooldown--;

    } else {
        //LMFAO THIS IS SO EFFICNENT
        switch(UI.type){
            case "ded":
                if(UI.openTimer > 0){
                    let dx = Math.floor(UI.openTimer * (Math.random()-0.5))-60;
                    let dy = Math.floor(UI.openTimer * (Math.random()-0.5))-60;
                    ctx.drawImage(UIArt.ded, dx, dy, ctx.canvas.width-dx, ctx.canvas.height-dy);
                    UI.openTimer--;
                } else {
                    ctx.drawImage(UIArt.ded, -60, -60, ctx.canvas.width+60, ctx.canvas.height+60);
                }
                break;
            case "pause":
                if(UI.openTimer > 0){
                    let dx = Math.floor(UI.openTimer * (Math.random()-0.5))-60;
                    let dy = Math.floor(UI.openTimer * (Math.random()-0.5))-60;

                    UI.openTimer--;
                } else if(UI.closeTimer > 0) {
                    let dx = Math.floor(30/UI.closeTimer * (Math.random()-0.5))-60;
                    let dy = Math.floor(30/UI.closeTimer * (Math.random()-0.5))-60;

                    UI.closeTimer--;
                    if(UI.closeTimer === 0){
                        inUI = false;
                    }
                } else {

                }
                break;
            case "upgrade":
                
                break;
            default: break;
        }
    }

    //next frame
    ctx.restore();
    window.requestAnimationFrame(draw);
}

//first frame
draw();
