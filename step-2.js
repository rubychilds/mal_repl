const readline = require("readline");
const pegjs = require("pegjs");

var parser = pegjs.generate(`
  start =  expression

  expression = e: (number / string / list / symbol) whitespace {return e}
  whitespace = [ \\n]*

  list = '('  content:expression* ')' { return {list:content} }
  number = before:integer after:('.' after:integer)?
  {
    if (after == null){
      return before
    } else {
      return parseFloat(before + after.join(''))
    }
  }

  integer = num:[0-9]+ { return parseInt(num.join('')) }
  symbol = s:[^\(\) ]+ { return {symbol:s.join('')} }

  double_quoted = '"' c:[^"]*  '"' { return c.join('') }
  single_quoted = '\\'' c:[^']* '\\'' { return c.join('') }
  string = double_quoted / single_quoted

`);

//
  // bool = b: [a-zA-Z]{4,5} {
  //     if(b.join("") == "true"){
  //       return true
  //     }
  //     if(b.join("") == "false"){
  //       return false
  //     }
  // }

// equ = left:eval right:eval
//
// eval = "("sign:[*|/|+]" "num1:number" "num2:number")" {
//   if(sign == "*"){
//     return num1 * num2
//   }
//   else if(sign == "/"){
//     return num1 / num2
//   }
//   else if(sign == "/"){
//     return num1 / num2
//   }
//   else{
//     return num1 + num2
//   }
// }

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

  if(ast.list){
    return "list: needs work";
  }
  else if(ast.symbol) {
    return "symbol: needs work";
  }
  else {
    return ast;
  }
};

// prints value
function print(value){
  return value;
}

rl.on('line', function(code){
  if(code == 'exit()' || code == 'quit()'){
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
