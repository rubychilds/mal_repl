const readline = require("readline");
const pegjs = require("pegjs");

var parser = pegjs.generate(`
  start = eval
  integer = num:[0-9]+ { return parseInt(num.join('')) }
  number = before:integer after:('.' after:integer)?
  {
    if (after == null){
      return before
    }
    else{
      return parseFloat(before + after.join(''))
    }
  }
  Characters = text: [a-zA-Z0-9]+ {
      if(text.join("") == "true"){
        return true
      }
      if(text.join("") == "true"){
        return false
      }
      else {
        return text.join("")
      }
  }
  equ = left:eval right:eval

  eval = "("sign:[*|/|+]" "num1:number" "num2:number")" {
    if(sign == "*"){
      return num1 * num2
    }
    else if(sign == "/"){
      return num1 / num2
    }
    else if(sign == "/"){
      return num1 / num2
    }
    else{
      return num1 + num2
    }
  }
`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'mal>'
});

rl.prompt();

// produce an abstract syntax tree
function read(code){
  return parser.parse(code);
};

// evaluates ast to take action
function evaluate(ast, environment){
  return ast;
};

// prints value
function print(value){
  return value;
}

rl.on('line', function(code){
  if(code == 'exit()'){
    rl.close();
  }
  else{
    var ast = read(code);
    var value = evaluate(ast, {});
    var output = print(value);
    console.log(output);
    rl.prompt();
  }
});
