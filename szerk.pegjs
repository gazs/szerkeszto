/*
 * Simple Arithmetics Grammar
 * ==========================
 *
 * Accepts expressions like "2 * (3 + 4)" and computes their value.
 */

{
var  variables = { 
  };
var  functions = {
    squared : function(n) { return n * n; },
    incr    : function(n) { return n + 1; }
  }
}

start 
  = _ seq:Expressions { return seq; }

comment = "//" [^\n]* {
	return {type: "comment", value: text()}
}

startingPoint
  = id:id _ "=" _ "start" { return {type: 'newpoint', id: id }}

direction = "direction"
   / "up"
   / "down"
   / "left"
   / "right"

pointFromOtherPoint
  = id_startingpoint:id _ "-" _ id_newpoint:id _ "=" _ direction:direction _ distance:Expression {
    return {
      type: 'pointFromOtherPoint',
      startingpoint: id_startingpoint,
      id: id_newpoint,
      direction: direction,
      distance: distance
      }
    }

line
  = "[" _ id1:id _ "-" _ id2:id _ "]" { return {"type": "simpleLine", id1: id1, id2: id2}}
  / id:id ".vertical" {return {"type": "verticalLine", id: id}}
  / id:id ".horizontal" {return {"type": "horizontalLine", id: id}}

intersection
  = id:id _ "=" _ "intersect" _ line1:line _ line2:line {
return {type: "intersection", id: id, line1: line1, line2: line2}
}

Expressions
  = _ s:Expression ss:Expressions* _ {
   return ss.reduce(function(ac, el) { el.forEach(function (e) { ac.push(e) }); return ac; }, [s]); }

Expression
  = DefineVariable
  / comment
  / startingPoint
  / intersection
  / pointFromOtherPoint
  / head:Term tail:(_ ("+" / "-") _ Term)* {
      var result = head, i;

      for (i = 0; i < tail.length; i++) {
        if (tail[i][1] === "+") { result += tail[i][3]; }
        if (tail[i][1] === "-") { result -= tail[i][3]; }
      }

      return result;
    }

Term
  = head:Factor tail:(_ ("*" / "/") _ Factor)* {
      var result = head, i;

      for (i = 0; i < tail.length; i++) {
        if (tail[i][1] === "*") { result *= tail[i][3]; }
        if (tail[i][1] === "/") { result /= tail[i][3]; }
      }

      return result;
    }

Factor
  = "(" _ expr:Expression _ ")" { return expr; }
  / Primary

Primary
  = Measurement
  / Number
  / i:id "(" e:Expression ")" { return functions[i](e); }
  / i:id                    { return variables[i]; }

Measurement
  = n:Number + "cm" { return 10 * n }
  / n:Number + "inch" { return 254 * n }

DefineVariable
  = "var" _ i:id _ "=" _ value:Expression { variables[i] = value; console.log(i, value); return {"variable": [i, value] }}

id
 = [a-zA-Z0-9_]+[a-zA-Z0-9_]* { return text() }

Integer "integer"
  = [0-9]+ { return parseInt(text(), 10); }

Number "number"
  = [0-9.]+ { return +text() }

_ "whitespace"
  = [ \t\n\r;]*
