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
    var head = ast.list[0];
    var headEvaluated = evaluate(ast.list[0], environment);
    var tail = ast.list.slice(1);
    console.log(head);
    console.log(headEvaluated);
    console.log(tail);
    return headEvaluated(evaluate(tail[0], environment), evaluate(tail[1], environment));
  }
  else if(ast.symbol) {
    var symbolInEnv = environment[ast.symbol];
    if(symbolInEnv == undefined){
      throw "Issue: " + symbolInEnv + " is undefined";
    }
    return environment[ast.symbol];
  }
  else {
    return ast;
  }
};

var defaultEnvironment = {
  "+": function(a,b) {return a + b},
  "-": function(a,b) {return a - b},
  "/": function(a,b) {return a / b},
  "*": function(a,b) {return a * b}
}

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
    var value = evaluate(ast, defaultEnvironment);
    var output = print(value);
    console.log(output);
    rl.prompt();
  }
});
