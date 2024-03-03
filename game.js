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
caveTileset.src = "assets/terrain/cave.png";
playerTileset.src = "assets/player/lancelot.png";
swordTileset.src = "assets/player/excalibur.png";
ghostTileset.src = "assets/enemies/ghost.png";
skeletonTileset.src = "assets/enemies/skeleton.png";
slimeTileset.src = "assets/enemies/slime.png";
slimeBallTileset.src = "assets/enemies/slimeball.png";
fungantTileset.src = "assets/enemies/fungant.png";
fungiantTileset.src = "assets/enemies/fungiant.png";
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
