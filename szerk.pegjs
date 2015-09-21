{
  function combine(first, rest, combiners) {
    var result = first, i;

    for (i = 0; i < rest.length; i++) {
      result = combiners[rest[i][1]](result, rest[i][3]);
    }

    return result;
  }
}


start = (rule)+

rule
  = _ r:startingPoint _ { return r }
  / _ r:pointFromOtherPoint _ { return r}
  / _ r:intersection _ { return r}
  / _ r:comment _ { return r}
  / _ r: variable _ { return r}


expression
  = startingPoint
  / pointFromOtherPoint
  / intersection



// ----

startingPoint
  = id:pointId _ "=" _ "start" { return {type: 'newpoint', id: id }}

pointFromOtherPoint
  = id_startingpoint:pointId _ "-" _ id_newpoint:pointId _ "=" _ direction:direction _ distance:length {
    return {
      type: 'pontFromOtherPoint',
      startingpoint: id_startingpoint,
      id: id_newpoint,
      direction:direction,
      distance: distance
      }
    }

intersection
  = id:pointId _ "=" _ line1:line _ "intersect" _ line2:line {
   return {
     type: 'intersection',
     id: id,
     line1: line1,
     line2: line2
   }
  }

line
  = "l(" + point1:pointId + "-"+ point2:pointId + ")" { return {type: 'line', a: point1, b: point2} }
  / point:pointId ".verticalLine" { return {type: 'verticalLine', p: point}}
  / point:pointId ".horizontalLine" { return {type: 'horizontalLine', p: point}}

comment = "//" [^\n]* { return {type: "comment", value: text()} }

_  = [ \t\r\n;]*



pointId = [0-9a-z]+

direction = "direction"
   / "up"
   / "down"
   / "left"
   / "right"
   / angle

length
  = [-.0-9]+ "cm" { return +text().join("")}
  / [-.0-9]+ "inch" { return +text().join("") * 2.54 }
  / line
  / "c(" + exp:[0-9a-z.+-/* ]  + ")" { return {type: 'eval', value: exp.join("")} }
  / [^\n]+ { return text().join("") }

angle
  = [-.0-9]+ "deg" { return {type:'angle', value: +text().join("") + "deg" } }
  / [-.0-9]+ "rad" { return {type: 'angle', value: +text().join("") + "rad" } }
  / angleOf

angleOf
  = "angle(" + point1:pointId + "-"+ point2:pointId + ")" { return "l(" + point1 + "-"+ point2 + ").angle" }


variable
  = "var " name:[a-z]+ _ "=" _ value:[^\n]+ {
    return {type: "variable", name: name.join(""), value: +value.join("") }
  }
