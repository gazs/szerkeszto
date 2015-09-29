start = (rule)+

rule
  = _ r:comment _ { return r}
  / _ r:startingPoint _ { return r }
  / _ r:pointFromOtherPoint _ { return r}

comment = "//" [^\n]* {
	return {type: "comment", value: text()}
}

_  = [ \t\r\n;]*

pointId = [0-9a-z]+ { return text() }

startingPoint
  = id:pointId _ "=" _ "start" { return {type: 'newpoint', id: id }}

direction = "direction"
   / "up"
   / "down"
   / "left"
   / "right"

length
  = [-.0-9]+ { return +text()}

pointFromOtherPoint
  = id_startingpoint:pointId _ "-" _ id_newpoint:pointId _ "=" _ direction:direction _ distance:length {
    return {
      type: 'pointFromOtherPoint',
      startingpoint: id_startingpoint,
      id: id_newpoint,
      direction: direction,
      distance: distance
      }
    }
