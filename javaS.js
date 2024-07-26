const inputSlider = document.getElementById("passLength");
const displayLength = document.querySelector(".len-no");
const passwordDisplay = document.querySelector(".result");
const copyBtn = document.querySelector(".copy");
const copyMsg = document.querySelector(".copy-pass"); //custom attribute
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector(".light");
const generateBtn = document.querySelector(".generate");
const allCheckBox = document.querySelectorAll("input[type=checkbox");

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<>,.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
//set indicator to grey colcor
handleSlider();

function handleSlider() {
  inputSlider.value = passwordLength;
  displayLength.innerText = passwordLength;

  const min=inputSlider.min;
  const max=inputSlider.max;
  inputSlider.style.backgroundSize=((passwordLength-min)*100)/(max-min) + "% 100%"
}


function setIndicator(color) {
  indicator.style.backgroundColor = color;
  //add box shadow
  indicator.style.boxShadow=`0px 0px 5px 5px ${color}`;
}

function getRndInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRndNumber() {
  return getRndInt(0, 9);
}

function generateRndupperCase() {
  return String.fromCharCode(getRndInt(65, 91));
}
function generateRndlowerCase() {
  return String.fromCharCode(getRndInt(97, 123));
}

function generateSymbols() {
  const random = getRndInt(0, symbols.length);
  return symbols.charAt(random);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNumber = false;
  let hasSymbol = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numberCheck.checked) hasNumber = true;
  if (symbolCheck.checked) hasSymbol = true;

  if (hasLower && hasUpper && (hasNumber || hasSymbol) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasNumber || hasSymbol) &&
    (hasLower || hasUpper) &&
    passwordLength >= 6
  ) {
    setIndicator("#0000FF");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="Copied";
    }
    catch(e){
        copyMsg.innerText="Failed!";
    }

    copyMsg.classList.add("copyActive");
    setTimeout(function(){
        copyMsg.classList.remove("copyActive");
    },2000);
}

inputSlider.addEventListener('input',function(e){
    passwordLength=e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click',function(){
    if(passwordDisplay.value)
        copyContent();
});

function handlecheckboxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    });

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handlecheckboxChange);
    
});

function shufflepassword(array){
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}

generateBtn.addEventListener('click',function(){
    if(checkCount==0){
        return;
    }
    if(passwordLength<checkCount){
        passwordLength=checkCount;
    }
    password="";

    let funArr=[];

    if(uppercaseCheck.checked){
        funArr.push(generateRndupperCase);
    }
    if(lowercaseCheck.checked){
        funArr.push(generateRndlowerCase);
    }
    if(numberCheck.checked){
        funArr.push(generateRndNumber);
    }
    if(symbolCheck.checked){
        funArr.push(generateSymbols);
    }

    for(let i=0;i<funArr.length;i++){
        password+=funArr[i]();
    }
    for(let i=0;i<passwordLength-funArr.length;i++){
        let randIndex=getRndInt(0,funArr.length);
        password+=funArr[randIndex]();
    }
    password=shufflepassword(Array.from(password));
    passwordDisplay.value=password;
    calcStrength();
})