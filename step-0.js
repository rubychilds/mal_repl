const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'mal>'
});

rl.prompt();

// produce an abstract syntax tree
function read(code){
  return code;
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
