// Enemy, Player/Weapon, Font, and Terrain textures by analogStudios https://analogstudios.itch.io/
// Original boss texture by https://elthen.itch.io/
// Upgrade icons by quintino pixels https://quintino-pixels.itch.io/

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
devilTileset = new Image(),
cacodaemonTileset = new Image(),
explosionTileset = new Image();

//font & UI's, in a slightly different format that's slightly worse
const font = { NFlat: new Image(), NThick: new Image(), OFlat: new Image(), OThick: new Image() };
const UIArt = { ded: new Image(), pause: new Image(), icons: new Image() };

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
devilTileset.src = "assets/enemies/devil.png";
cacodaemonTileset.src = "assets/enemies/cacodaemon.png";
explosionTileset.src = "assets/particles/explosion.png"

//load fonts & UI
font.NFlat.src = "assets/font/normal_flat.png";
font.NThick.src = "assets/font/normal_thicc.png";
font.OFlat.src = "assets/font/orange_flat.png";
font.OThick.src = "assets/font/orange_thicc.png";
UIArt.ded.src = "assets/UI/you_ded.png";
UIArt.pause.src = "assets/UI/pause.png";
UIArt.icons.src = "assets/UI/skill_icons.png";

//connecting to the canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", {alpha: false});

//canvas options
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
ctx.imageSmoothingEnabled = false;

//event listeners
document.addEventListener("keydown", (e) => {
    switch (e.key.toLowerCase()){
        case "w": keys[0] = 1; break; //up
        case "s": keys[1] = 1; break; //down
        case "a": keys[2] = 1; break; //left
        case "d": keys[3] = 1; break; //right
        case "p": //pause
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
        case " ": if(!inUI) md = true; break;
        default: break;
    }
});
document.addEventListener("keyup", (e) => {
    switch (e.key.toLowerCase()){
        case "w": keys[0] = 0; break; //up
        case "s": keys[1] = 0; break; //down
        case "a": keys[2] = 0; break; //left
        case "d": keys[3] = 0; break; //right
        default: break;
    }
});
document.addEventListener("mousedown", (e) => {
    mx = e.pageX;
    my = e.pageY;
    md = true;
});
document.addEventListener("mousemove", (e) => {
    mx = e.pageX;
    my = e.pageY;
});

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

//particles
const particles = [];

//enemies
const enemies = [];
const spawnList = [
    [{type:"skeleton", count:6}, {type:"ghost", count:4}, {type:"slime", count:3}], 
    [{type:"skeleton", count:4}, {type:"slime", count:6}, {type:"fungiant", count:3}], 
    [{type:"skeleton", count:2}, {type:"slime", count:2}, {type:"fungiant", count:3}], 
    [{type:"skeleton", count:1}, {type:"slime", count:4}, {type:"fungiant", count:2}], 
    [{type:"skeleton", count:2}, {type:"ghost", count:2}, {type:"slime", count:2}, {type:"devil", count:1}], 
    [{type:"skeleton", count:1}, {type:"slime", count:2}, {type:"fungiant", count:2}, {type:"devil", count:4}], 
    [{type:"slime", count:1}, {type:"fungiant", count:2}, {type:"devil", count:3}], 
    [{type:"devil", count:4}, {type:"ghost", count:2}],
    [{type:"skeleton", count:4}],
    [{type:"devil", count:8}]
];
let spawnPhase = -1;
const spawnBucket =[];
let spawnDelay = 0;

//boss
const boss = { hp:150, damage:10, atkSpeed:30, atkCooldown:0, x:100, y:100, vx:0, vy:0, hx:0, hy:0, dashCooldown:0, state:"idle", aniT:0, dir:1};
let bossActive = false;

//player variables
var maxHealth = 25;
var playerX = 90, playerY = 90, playerD = 0, playerHP = 25;
var hurtDamage = 0, hurtTime = 0, knockX = 0, knockY = 0;
var xp = 0, nextLevel = 10;

//camera
var ScrX = playerX-ctx.canvas.width/(sizP<<1), ScrY = playerY-ctx.canvas.height/(sizP<<1)+1;
var CamShakeX = 0, CamShakeY = 0;

//sword variables
var swordDir = 0, swordPrevious= 0, swordSide = 0, swordD = 0, swordCooldown = 0;

//upgradeable stats
var swordSize = 1, swordDamage = 2, swordAttackSpeed = 20, 
movementSpeed = 0.08, 
ferocity = 0, absorption = 0, vampChance = 0;

//upgrades
const upgrades = [
    {name:"Poisoning Blade"}, //not used
    {name:"Thunderous Blade"}, //not used
    {name:"Sweeping Grace", text:["Increases attack range by ", "x"], statMin:0.3, statMax:1, digitMult:100},
    {name:"Slicing Grace", text:["Decreases attack delay by ", " ticks"], statMin:1, statMax:4, digitMult:1},
    {name:"Powerful Punch", text:["Increases attack damage by "], statMin:0.5, statMax:4, digitMult:10},
    {name:"Ferocious Bite", text:["Increases double-hit chance by ", "x"], statMin:0.1, statMax:0.3, digitMult:1000},
    {name:"Growth", text:["Increases max health by ", " health"], statMin:3, statMax:8, digitMult:1},
    {name:"Shielding", text:["Grants an absorption shield worth ", " health"], statMin:5, statMax:9, digitMult:1},
    {name:"Overheal", text:["Regenerate ", " health (overflow will become absorption)"], statMin:3, statMax:7, digitMult:1},
    {name:"Swift Feet", text:["Increases movement speed by ", " tiles-per-tick"], statMin:0.015, statMax:0.05, digitMult:1000},
    {name:"Vampirism", text:["Increases a chance to regenerate 1 health by ", "x"], statMin:0.05, statMax:0.25, digitMult:1000}
];

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
            enemies.push({ x:x, y:y, kx:0, ky:0, t:type, st:60, dir:1, hurtT:0, deathT:0, health:1, damage:4, attackCd:0, attackSpeed:20, xp:2, col:true, drag:0.95 });
            break;
        case "devil":
            enemies.push({ x:x, y:y, kx:0, ky:0, t:type, st:60, dir:1, hurtT:0, deathT:0, health:12, damage:6, attackCd:0, attackSpeed:20, xp:16, col:true, drag:0.9 });
        default: break;
    }
}
function plsDoDamage(i, k, distX, distY, dist){
    if(hurtTime < 0 || enemies[i].damage > hurtDamage){
        CamShakeX += (Math.random()-0.5)*2;
        CamShakeY += (Math.random()-0.5)*2;

        if(absorption > 0){
            absorption -= enemies[i].damage;
            playerHP += Math.min(absorption, 0);
        } else {
            playerHP -= enemies[i].damage;
        }
        
        enemies[i].attackCd = enemies[i].attackSpeed;
        hurtDamage = enemies[i].damage;
        hurtTime = 24;
        knockX = k*distX/dist;                                    
        knockY = k*distY/dist;
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
    ScrX = Math.max(ScrX - (ScrX-(playerX-ctx.canvas.width/(sizP<<1)))/16, -CamShakeX+0.01);
    ScrY = Math.max(ScrY - (ScrY-(playerY-ctx.canvas.height/(sizP<<1)))/16, -CamShakeX+0.01);
    ScrX += CamShakeX;
    ScrY += CamShakeY;

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
    if(spawnDelay < 0){
        spawnDelay = Math.floor(60*Math.random()+100000/(dt+256)+20);

        if(spawnBucket.length == 0){
            spawnDelay = 600;
            spawnPhase++;
            for(const element of spawnList[Math.min(spawnPhase, spawnList.length-1)]){
                for(let i = 0; i < element.count; i++){
                    spawnBucket.push(element.type);
                }
            }
        } else {
             //weighted selection from the spawn bucket
            let i = Math.floor(Math.random()*spawnBucket.length);
            let type = spawnBucket[i];
            spawnBucket[i] = spawnBucket[spawnBucket.length-1];
            spawnBucket.pop();

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
    }

    //boss spawning
    if(!bossActive){
        if(spawnPhase > spawnList.length && Math.random() > 0.99){
            let angle = Math.random() * pi2;
            boss.x = playerX + Math.sin(angle)*Math.max(ctx.canvas.width, ctx.canvas.height);
            boss.y = playerY + Math.cos(angle)*Math.max(ctx.canvas.width, ctx.canvas.height);
            bossActive = true;
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

                if(enemies[i].type == "fungiant" || enemies[a].type == "fungiant" || enemies[i].type == "devil" || enemies[a].type == "devil"){
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
                    case "devil":
                        ctx.drawImage(devilTileset, (Math.floor(enemies[i].deathT/12)%4+enemies[i].dir*4)*28, 140, 28, 28, Math.floor((enemies[i].x-ScrX-0.75)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.75), Math.floor(sizP*1.75));
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
                    case "devil":
                        ctx.drawImage(devilTileset, (Math.floor(enemies[i].hurtT/6)%4+enemies[i].dir*4)*28, 112, 28, 28, Math.floor((enemies[i].x-ScrX-0.75)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.75), Math.floor(sizP*1.75))
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
                        enemies[i].dir = distX < 0;
                        if(dist > 0.6){
                            enemies[i].x += (distX/dist)*0.04;
                            enemies[i].y += (distY/dist)*0.04;
                        } else if(enemies[i].attackCd < 0){
                            plsDoDamage(i, 0.2, distX, distY, dist);
                        }

                        ctx.drawImage(ghostTileset, (Math.floor(dt/6)%4+enemies[i].dir*4)*24, 24, 24, 24, Math.floor((enemies[i].x-ScrX-0.75)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.5), Math.floor(sizP*1.5));
                    }
                    break;
                case "skeleton":
                    if(enemies[i].st > 0){
                        ctx.drawImage(skeletonTileset, Math.floor(4-enemies[i].st/15)*24, 0, 24, 24, Math.floor((enemies[i].x-ScrX-0.75)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.5), Math.floor(sizP*1.5));
                        enemies[i].st--;
                    } else{
                        enemies[i].dir = distX < 0;
                        if(dist > 0.6){
                            enemies[i].x += (distX/dist)*0.06;
                            enemies[i].y += (distY/dist)*0.06;
                        } else if(enemies[i].attackCd < 0){
                            plsDoDamage(i, 0.2, distX, distY, dist);
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
                        enemies[i].dir = distX < 0;
                        if(dist > 0.6){
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
                            plsDoDamage(i, 0.4, distX, distY, dist);
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
                        enemies[i].dir = distX < 0;
                        if(dist > 0.6){
                            if(dist > 2){
                                enemies[i].x += (distX/dist)*0.06;
                                enemies[i].y += (distY/dist)*0.06;
                            } else {
                                enemies[i].x += (distX/dist)*0.04;
                                enemies[i].y += (distY/dist)*0.04;
                            }
                        } else if(enemies[i].attackCd < 0){
                            plsDoDamage(i, 0.15, distX, distY, dist);
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
                        ctx.drawImage(fungiantTileset, Math.floor(4-enemies[i].st/15)*28, 0, 28, 28, Math.floor((enemies[i].x-ScrX-0.875)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.75), Math.floor(sizP*1.75));
                        enemies[i].st--;
                    } else{
                        enemies[i].dir = distX < 0;
                        if(dist > 0.6){
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
                        if(dist > 1.5){
                            enemies[i].x += (distX/dist)*0.08;
                            enemies[i].y += (distY/dist)*0.08;
                        } else {
                            particles.push({type:"explosion", x:enemies[i].x, y:enemies[i].y, timer:0, tMax:26});
                            plsDoDamage(i, 0.35, distX, distY, dist);
                            enemies[i] = enemies[enemies.length-1];
                            enemies.pop();
                            i--;
                            continue;
                        }

                        checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax+0.5), Math.floor(enemies[i].y-ay+0.5), enemies[i].x-ax, enemies[i].y-ay);
                        checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax+0.5), Math.floor(enemies[i].y-ay-0.5), enemies[i].x-ax, enemies[i].y-ay);
                        checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax-0.5), Math.floor(enemies[i].y-ay+0.5), enemies[i].x-ax, enemies[i].y-ay);
                        checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax-0.5), Math.floor(enemies[i].y-ay-0.5), enemies[i].x-ax, enemies[i].y-ay);

                        ctx.drawImage(fungantTileset, (Math.floor(dt/6)%4+enemies[i].dir*4)*24, 48, 24, 24, Math.floor((enemies[i].x-ScrX-0.75)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.5), Math.floor(sizP*1.5));
                    }
                    break;
                case "devil":
                    if(enemies[i].st > 0){
                        ctx.drawImage(devilTileset, Math.floor(4-enemies[i].st/15)*28, 0, 28, 28, Math.floor((enemies[i].x-ScrX-0.875)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.75), Math.floor(sizP*1.75));
                        enemies[i].st--;
                    } else{
                        enemies[i].dir = distX < 0;
                        if(dist > 3){
                            enemies[i].x += (distX/dist)*0.03;
                            enemies[i].y += (distY/dist)*0.03;
                        } else {
                            if(dist < 0.8){
                                plsDoDamage(i, 0.4, distX, distY, dist);
                            } else {
                                enemies[i].x += (distX/dist)*0.12;
                                enemies[i].y += (distY/dist)*0.12;
                            }
                        }

                        checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax+0.5), Math.floor(enemies[i].y-ay+0.5), enemies[i].x-ax, enemies[i].y-ay);
                        checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax+0.5), Math.floor(enemies[i].y-ay-0.5), enemies[i].x-ax, enemies[i].y-ay);
                        checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax-0.5), Math.floor(enemies[i].y-ay+0.5), enemies[i].x-ax, enemies[i].y-ay);
                        checkEnemyTile(enemies[i], Math.floor(enemies[i].x-ax-0.5), Math.floor(enemies[i].y-ay-0.5), enemies[i].x-ax, enemies[i].y-ay);

                        ctx.drawImage(devilTileset, (Math.floor(dt/6)%4+enemies[i].dir*4)*28, 28, 28, 28, Math.floor((enemies[i].x-ScrX-0.75)*sizP), Math.floor((enemies[i].y-ScrY-1.25)*sizP), Math.floor(sizP*1.75), Math.floor(sizP*1.75));
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

    if(bossActive){
        let dx = boss.x-playerX;
        let dy = boss.y-playerY;
        let d = Math.sqrt(dx*dx+dy*dy);
        switch(boss.state){
            case "idle":
                boss.dashCooldown--;
                boss.dir = dx > 0;
                boss.x -= 0.04*dx/d;
                boss.y -= 0.04*dy/d;
                if(boss.dashCooldown == 20){
                    //calc stuff
                    boss.vx = (dx+Math.sign(dx)*4)*Math.log10(0.96)/Math.LOG10E;
                    boss.vy = (dy+Math.sign(dy)*4)*Math.log10(0.96)/Math.LOG10E;
                }
                if((boss.dashCooldown < 0 && Math.random() > 0.95) || boss.dashCooldown < -30){
                    boss.state = "dash";
                    boss.dashCooldown = 300;
                }
                break;
            case "dash":
                boss.x += boss.vx *= 0.96;
                boss.y += boss.vy *= 0.96;
                if(Math.abs(boss.vx) + Math.abs(boss.vy) < 0.05 && Math.random() > 0.9){
                    boss.state = "idle";
                }
                break;
            case "burp":
                break;
            case "death":
                if(boss.aniT > 3199){
                    bossActive = false;
                }
                xp += 100;o
                break;
            default: break;
        }

        if(boss.health <= 0){
            boss.state = "death";
            boss.aniT = 0;
        }

        if(boss.state != "death"){
            boss.atkCooldown--;
            if(d < 2 && boss.atkCooldown < 0){
                CamShakeX += (Math.random()-0.5)*3;
                CamShakeY += (Math.random()-0.5)*3;
            
                if(absorption > 0){
                    absorption -= boss.damage;
                    playerHP += Math.min(absorption, 0);
                } else {
                    playerHP -= boss.damage;
                }
                
                boss.atkCooldown = boss.atkSpeed;
                hurtDamage = boss.damage;
                hurtTime = 24;
                knockX = -0.4*dx/d;                                    
                knockY = -0.4*dy/d;
            }
        }

        boss.hx *= -0.9;
        boss.hy *= -0.9;
        switch(boss.state){
            case "idle":
                if(boss.dashCooldown < 20){
                    ctx.drawImage(cacodaemonTileset, (Math.floor(boss.aniT/6)%6)*64, boss.dir*256, 64, 64, Math.floor((boss.x-ScrX-2+(Math.random()-0.5)*0.2)*sizP), Math.floor((boss.y-ScrY-2+(Math.random()-0.5)*0.2)*sizP), sizP*4, sizP*4);
                } else {
                    ctx.drawImage(cacodaemonTileset, (Math.floor(boss.aniT/10)%6)*64, boss.dir*256, 64, 64, Math.floor((boss.x-ScrX-2+boss.hx)*sizP), Math.floor((boss.y-ScrY-2+boss.hy)*sizP), sizP*4, sizP*4);
                }
                break;
            case "dash":
                ctx.drawImage(cacodaemonTileset, (Math.floor(boss.aniT/4)%6)*64, 64+boss.dir*256, 64, 64, Math.floor((boss.x-ScrX-2)*sizP), Math.floor((boss.y-ScrY-2)*sizP), sizP*4, sizP*4);
                break;
            case "burp":
                ctx.drawImage(cacodaemonTileset, (Math.floor(boss.aniT/10)%4)*64, 128+boss.dir*256, 64, 64, Math.floor((boss.x-ScrX-2)*sizP), Math.floor((boss.y-ScrY-2)*sizP), sizP*4, sizP*4);
                break;
            case "death":
                ctx.drawImage(cacodaemonTileset, (Math.floor(boss.aniT/20)%8)*64, 192+boss.dir*256, 64, 64, Math.floor((boss.x-ScrX-2)*sizP), Math.floor((boss.y-ScrY-2)*sizP), sizP*4, sizP*4);
                break;
            default: break;
        }
        boss.aniT++;        
    }

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
            swordCooldown = Math.floor(swordAttackSpeed);

            //update direction (took ~1 day)
            swordPrevious = swordDir;
            swordDir = Math.atan((my-Math.floor((playerY-ScrY)*sizP))/(mx-Math.floor((playerX-ScrX)*sizP))) + ((mx < Math.floor((playerX-ScrX)*sizP))? Math.PI/2:3*Math.PI/2);
            swordD = Math.PI - Math.abs(Math.abs(swordPrevious%pi2 - swordDir%pi2)- Math.PI);
            swordSide = Math.abs(Math.abs(swordPrevious+swordD)%pi2-swordDir%pi2) < 0.05;
        }
    }
    //sword damage (took ~2, 3 days)
    if(swordCooldown == Math.floor(swordAttackSpeed) || (swordCooldown == Math.max(Math.floor(swordAttackSpeed/2), 0) && Math.random() < ferocity)){
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

                //vampirism
                if(Math.random() < vampChance && playerHP < maxHealth){
                    playerHP++;
                }

                //knockback
                let dx = enemies[i].x - playerX;
                let dy = enemies[i].y - playerY;
                let dst = Math.sqrt(dx*dx+dy*dy);
                enemies[i].kx = dx/dst*Math.sqrt(swordDamage)*0.08;
                enemies[i].ky = dy/dst*Math.sqrt(swordDamage)*0.08;
            }
        }

        if(bossActive){
            //SDF... again
            let tempX = boss.x - playerX;
            let tempY = boss.y - playerY;

            let temX = tempX*cosR-tempY*sinR;
            tempY = tempX*sinR+tempY*cosR;
            tempX = Math.abs(temX);
            
            let clamped = tempX * sinD + tempY * cosD;
            clamped = (clamped > 0)? ((clamped < scaledSize)? clamped:scaledSize):0;
                
            if(Math.max(Math.sqrt(tempX*tempX+tempY*tempY)-scaledSize, length(tempX - sinD*clamped, tempY-cosD*clamped)*Math.sign(cosD*tempX-sinD*tempY)) <= 1.5){
                //deal damage
                boss.health-= swordDamage;
                boss.hx = Math.random()*0.3-0.15;
                boss.hy = Math.random()*0.3-0.15;

                //vampirism
                if(Math.random() < vampChance && playerHP < maxHealth){
                    playerHP++;
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
        ctx.drawImage(swordTileset, Math.floor(4-swordCooldown*4/Math.floor(swordAttackSpeed))<<5, 96, 32, 32, -Math.floor(sizP*swordSize), -scaledSize, scaledSize, scaledSize);
    } else if (swordSide){
        ctx.drawImage(swordTileset, Math.floor(4-swordCooldown*4/Math.floor(swordAttackSpeed))<<5, 32, 32, 32, -Math.floor(sizP*swordSize), -scaledSize, scaledSize, scaledSize);
    } else {
        ctx.drawImage(swordTileset, Math.floor(4-swordCooldown*4/Math.floor(swordAttackSpeed))<<5, 64, 32, 32, -Math.floor(sizP*swordSize), -scaledSize, scaledSize, scaledSize);
    }
    ctx.restore();
3
    //particles
    for(let i = 0; i < particles.length; i++){
        switch(particles[i].type){
            case "explosion":
                ctx.drawImage(explosionTileset, Math.floor((particles[i].timer)/2)*32, 0, 32, 32, Math.floor((particles[i].x-ScrX-1)*sizP), Math.floor((particles[i].y-ScrY-1)*sizP), sizP*2, sizP*2);
                break;
            default: break;
        }

        particles[i].timer++;
        if(particles[i].timer > particles[i].tMax){
            particles[i] = particles[particles.length - 1];
            particles.pop();
            i--;
        }
    }

    //UI
    //health & xp bar
    ctx.fillStyle = `rgb(${53}, ${53}, ${63})`;
    ctx.fillRect(Math.floor(metric*0.05)-5, Math.floor(metric*0.05)-5, Math.floor(metric*0.75)+10, Math.floor(metric*0.04)+10);
    ctx.fillRect(Math.floor(metric*0.05)-5, Math.floor(metric*0.05)+Math.floor(metric*0.04)+5, Math.floor(metric*0.5)+10, Math.floor(metric*0.02)+5);

    ctx.fillStyle = `rgb(${235}, ${228}, ${219})`;
    ctx.fillRect(Math.floor(metric*0.05), Math.floor(metric*0.05), Math.floor(metric*0.75), Math.floor(metric*0.04));
    ctx.fillRect(Math.floor(metric*0.05), Math.floor(metric*0.05)+Math.floor(metric*0.04)+5, Math.floor(metric*0.5), Math.floor(metric*0.02));

    ctx.fillStyle = `rgb(${189}, ${96}, ${88})`;
    ctx.fillRect(Math.floor(metric*0.05)+5, Math.floor(metric*0.05)+5, Math.floor(metric*0.05)+Math.floor(metric*0.7*Math.min(playerHP/maxHealth, 1))-10, Math.floor(metric*0.04)-10);

    ctx.fillStyle = `rgb(${229}, ${183}, ${98})`;
    ctx.fillRect(Math.floor(metric*0.05)+5, Math.floor(metric*0.05)+Math.floor(metric*0.04)+10, Math.floor(metric*0.05)+Math.floor(metric*0.45*(xp > nextLevel? 1:xp/nextLevel))-10, Math.floor(metric*0.02)-10);
    ctx.fillRect(Math.floor(metric*0.05)+Math.floor(metric*0.05)+Math.floor(metric*0.7*playerHP/maxHealth)-5, Math.floor(metric*0.05)+5, Math.floor(metric*0.7*(absorption + playerHP < maxHealth? absorption/maxHealth:1-playerHP/maxHealth)), Math.floor(metric*0.04)-10);

    ctx.drawImage(playerTileset, 0, 0, 32, 32, Math.floor(metric*-0.025), Math.floor(metric*-0.025), Math.floor(metric*0.2), Math.floor(metric*0.2));

    ctx.fillStyle = `rgb(${0}, ${0}, ${0})`;
    ctx.textBaseline = "top";
    ctx.textAlign = "right";
    ctx.font = "80px Courier";
    ctx.fillText(Math.floor(dt/3600) + ":" + (Math.floor(dt/60)%60 < 10? "0":"") + Math.floor(dt/60)%60, Math.floor(ctx.canvas.width*0.975), Math.floor(ctx.canvas.height*0.025));
    ctx.font = "40px Courier";
    ctx.fillText("Wave: " + (spawnPhase + 1), Math.floor(ctx.canvas.width*0.975), Math.floor(ctx.canvas.height*0.025)+80);

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
        UI.openTimer = 120;
        let id0 = Math.floor(Math.random()*(upgrades.length-2)+2), 
        id1 = Math.floor(Math.random()*(upgrades.length-2)+2), 
        id2 = Math.floor(Math.random()*(upgrades.length-2)+2);
        UI.meta = {
            0:{ID:id0, Val:Math.round(upgrades[id0].statMin+Math.random()*Math.random()*upgrades[id0].statMax*upgrades[id0].digitMult)/upgrades[id0].digitMult}, 
            1:{ID:id1, Val:Math.round(upgrades[id1].statMin+Math.random()*Math.random()*upgrades[id1].statMax*upgrades[id1].digitMult)/upgrades[id1].digitMult}, 
            2:{ID:id2, Val:Math.round(upgrades[id2].statMin+Math.random()*Math.random()*upgrades[id2].statMax*upgrades[id2].digitMult)/upgrades[id2].digitMult}
        };
    }

    //updating timers
    dt++;
    hurtTime--;
    swordCooldown--;
    spawnDelay--;

    //absolutely scuffed as hell camera shake
    ScrX -= CamShakeX;
    ScrY -= CamShakeY;
    CamShakeX *= -0.8;
    CamShakeY *= -0.8;

    } else {
        //best ui ever
        switch(UI.type){
            case "ded":
                if(UI.openTimer > 0){
                    let dx = Math.floor(UI.openTimer * -Math.random());
                    let dy = Math.floor(UI.openTimer * -Math.random());
                    ctx.drawImage(UIArt.ded, dx, dy, ctx.canvas.width-2*dx, ctx.canvas.height-2*dy);
                    UI.openTimer--;
                } else {
                    ctx.drawImage(UIArt.ded, 0, 0, ctx.canvas.width, ctx.canvas.height);
                }
                break;
            case "pause":
                if(UI.openTimer > 0){
                    let dx = Math.floor(UI.openTimer * -Math.random());
                    let dy = Math.floor(UI.openTimer * -Math.random());
                    ctx.drawImage(UIArt.pause, dx, dy, ctx.canvas.width-2*dx, ctx.canvas.height-2*dy);
                    UI.openTimer--;
                } else if(UI.closeTimer > 0) {
                    let dx = Math.floor((UI.closeTimer - 30) * Math.random());
                    let dy = Math.floor((UI.closeTimer - 30) * Math.random());
                    ctx.drawImage(UIArt.pause, dx, dy, ctx.canvas.width-2*dx, ctx.canvas.height-2*dy);
                    UI.closeTimer--;
                    if(UI.closeTimer === 0){
                        inUI = false;
                    }
                } else {
                    ctx.drawImage(UIArt.pause, 0, 0, ctx.canvas.width, ctx.canvas.height);
                }
                break;
            case "upgrade":
                ctx.textBaseline = "top";
                ctx.textAlign = "left";
                let iconSize = Math.floor(metric*0.125)*2, iconsY = Math.floor((ctx.canvas.height-iconSize)*0.5);
                if(UI.openTimer > 80) {
                    ctx.drawImage(UIArt.icons, 48, 72, 24, 24, Math.floor(ctx.canvas.width*0.2-iconSize*0.5), iconsY, iconSize, iconSize);
                } else {
                    ctx.drawImage(UIArt.icons, (UI.meta[0].ID%3)*24, Math.floor(UI.meta[0].ID/3)*24, 24, 24, Math.floor(ctx.canvas.width*0.2-iconSize*0.5), iconsY, iconSize, iconSize);
                }
                if(UI.openTimer > 40) {
                    ctx.drawImage(UIArt.icons, 48, 72, 24, 24, Math.floor((ctx.canvas.width-iconSize)*0.5), iconsY, iconSize, iconSize);
                } else {
                    ctx.drawImage(UIArt.icons, (UI.meta[1].ID%3)*24, Math.floor(UI.meta[1].ID/3)*24, 24, 24, Math.floor((ctx.canvas.width-iconSize)*0.5), iconsY, iconSize, iconSize);
                }
                if(UI.openTimer > 0){
                    ctx.drawImage(UIArt.icons, 48, 72, 24, 24, Math.floor(ctx.canvas.width*0.8-iconSize*0.5), iconsY, iconSize, iconSize);
                    UI.openTimer--;
                } else {
                    ctx.drawImage(UIArt.icons, (UI.meta[2].ID%3)*24, Math.floor(UI.meta[2].ID/3)*24, 24, 24, Math.floor(ctx.canvas.width*0.8-iconSize*0.5), iconsY, iconSize, iconSize);

                    ctx.fillStyle = `rgb(${255}, ${255}, ${255})`;
                    ctx.fillRect(Math.floor(ctx.canvas.width*0.2-iconSize*0.5),  Math.floor(ctx.canvas.height*0.5+iconSize*0.75), Math.floor(ctx.canvas.width*0.6+iconSize), iconSize);
                    ctx.fillStyle = `rgb(${19}, ${16}, ${31})`;
                    ctx.fillRect(Math.floor(ctx.canvas.width*0.2-iconSize*0.4583),  Math.floor(ctx.canvas.height*0.5+iconSize*0.7917), Math.floor(ctx.canvas.width*0.6+iconSize*0.9167), Math.floor(iconSize*0.9167));

                    if(UI.closeTimer == 0){
                        if(my >= iconsY && my <= iconsY + iconSize){
                            let id = -1;
                            if(Math.abs(mx - ctx.canvas.width*0.2) <= iconSize*0.5){
                                id = 0
                            } else if(Math.abs(mx - ctx.canvas.width*0.5) <= iconSize*0.5){
                                id = 1;
                            } else if(Math.abs(mx - ctx.canvas.width*0.8) <= iconSize*0.5){
                                id = 2
                            }
    
                            if(id != -1){
                                ctx.fillStyle = `rgb(${255}, ${255}, ${255})`;
                                ctx.font = "50px Courier";
                                ctx.fillText(upgrades[UI.meta[id].ID].name, Math.floor(ctx.canvas.width*0.2-iconSize*0.4167), Math.floor(ctx.canvas.height*0.5+iconSize*0.8333));
                                ctx.font = "20px Courier";
                                switch(upgrades[UI.meta[id].ID].text.length){
                                    case 1: 
                                        ctx.fillText(upgrades[UI.meta[id].ID].text[0] + UI.meta[id].Val, Math.floor(ctx.canvas.width*0.2-iconSize*0.4167), Math.floor(ctx.canvas.height*0.5+iconSize*0.8333)+50);
                                        break;
                                    case 2: 
                                        ctx.fillText(upgrades[UI.meta[id].ID].text[0] + UI.meta[id].Val + upgrades[UI.meta[id].ID].text[1], Math.floor(ctx.canvas.width*0.2-iconSize*0.4167), Math.floor(ctx.canvas.height*0.5+iconSize*0.8333)+50);
                                        break;
                                    default: break;
                                }
    
                                if(md){
                                    switch(UI.meta[id].ID){
                                        case 0: break; //not used
                                        case 1: break; //not used
                                        case 2: 
                                            swordSize += UI.meta[id].Val;
                                            break;
                                        case 3: 
                                            swordAttackSpeed -= UI.meta[id].Val;
                                            break;
                                        case 4: 
                                            swordDamage += UI.meta[id].Val;
                                            break;
                                        case 5: 
                                            ferocity += UI.meta[id].Val;
                                            break;
                                        case 6: 
                                            maxHealth += UI.meta[id].Val;
                                            break;
                                        case 7: 
                                            absorption += UI.meta[id].Val;
                                            break;
                                        case 8: 
                                            playerHP += UI.meta[id].Val;
                                            if(playerHP > maxHealth){
                                                absorption+=playerHP-maxHealth;
                                                playerHP = maxHealth;
                                            }
                                            break;
                                        case 9: 
                                            movementSpeed += UI.meta[id].Val;
                                            break;
                                        case 10: 
                                            vampChance += UI.meta[id].Val;
                                            break;
                                        default: break;
                                    }

                                    xp -= nextLevel;
                                    nextLevel = Math.ceil(nextLevel*1.2); 
                                    inUI = false;
                                }
                            }
                        }
                    }
                }

                md = false;
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
