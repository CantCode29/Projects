// 1. we need to know how much money the ser is playing with
// 2. determing number of lines to bet on
// 3. collect a bet amount 
// 5.spin the slot machine
// 6.check if they won or lost
//7. play again/no money/quit

const prompt  = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    "A":2,
    "B":4,
    "C":6,
    "D":8
}

const SYMBOLS_VALUES ={
    "A":5,
    "B":4,
    "C":3,
    "D":2
}

const depositMoney = () => {
    while (true) {
    const depositAmt = parseFloat(prompt("Enter the amount of money you're depositing : "))
    if (isNaN(depositAmt) || depositAmt <=0) {
        console.log("Invalid deposit amount , try again")
        }
    else{return depositAmt}
    }      
}

const getNumberOfLines = () =>{
    while (true) {
    const numlines = parseInt(prompt("Enter the number of lines (1-3) : "))
    if( isNaN(numlines) || numlines <=0 || numlines > 3){
        console.log("Invalid number of lines\nPlease try again : ")
    } 
    else{return numlines} 
    }
}

const getBetAmount = (balance, lineAmt) =>{
    while (true) {
        const betAmt = parseFloat(prompt("Enter the amount that you're betting per line"))
        if(isNaN(betAmt) || betAmt <=0 || betAmt > balance/lineAmt){
        console.log("Invalid bet amount. Please enter a correct amount : ")
    
        }
        else{return betAmt}
    }
}  


const spin = () =>{

    const symbols = [];
    for (const[symbol,count] of Object.entries(SYMBOLS_COUNT)){ 
        for(let i = 0; i <count; i++){
            symbols.push(symbol)
        }
    }
    const reels = [];
    for ( let i = 0; i < COLS;i++){
        reels.push([]);
        const reelSymbol = [...symbols];
        for (let j = 0; j < ROWS;j++){
            const randomIndex = Math.floor(Math.random()*reelSymbol.length);
            const selectSymbol = reelSymbol[randomIndex];
            reels[i].push(selectSymbol);
            reelSymbol.splice(randomIndex,1);
        }
    }
    return reels;
}

const transpose =(reels) => {
     const rows = [];

     for    (let i = 0; i < ROWS; i++){
        rows.push([]);
     ``
        for(let j = 0; j < COLS; j++){
            rows[i].push(reels[j][i])    
        }
    }
    

        return rows;
}

const printRows = (rows) =>{
    for (const row of rows){
        let rowString ="";
        for(const[i,symbol] of row.entries()){
            rowString += symbol + "|";
            if(i == rows.length-1){
            rowString += ""
            }
        }
    console.log(rowString)
    }
}

const getWinnings = (rows,bet,lineAmt) =>{

let winnings = 0;
console.log("Number of lines: " + lineAmt);

for(let row = 0; row < lineAmt; row++){
const symbols = rows[row];
let allSame = true;

for(const symbol of symbols){
        if(symbol != symbols[0]){
          
            allSame = false;
            break;
            }
        }

        if(allSame){
           
            winnings += (bet*SYMBOLS_VALUES[symbols[0]]);
           
        }
    }
    return winnings;
}
const game = () =>{

    let balance = depositMoney();

    while(true){
        console.log("Balance: " + balance);
    const lineAmt = getNumberOfLines();
    const bet  = getBetAmount(balance,lineAmt);
    balance -= bet * lineAmt;
    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);
    const winnings = getWinnings(rows,bet,lineAmt);
    console.log("you won : $" + winnings);
    balance +=winnings

    if(balance <=0){
        console.log("you ran out of money!");
        break;
    }
    const playAgain = prompt("Do you want to play again? (y/n)");

    if(playAgain != "y"){
        break;
    }
}
}

game();
