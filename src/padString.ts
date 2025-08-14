export default function padString(stringToPad:string, width:number, padCharacter:string=' ') {
    if (typeof stringToPad === 'undefined' || !stringToPad || stringToPad===null) {
      return Array(width).join(padCharacter).toString()
    }
    else if (stringToPad.length>=width) {
      return stringToPad.substring(0,width-3) + '..'
    }
    else {
      let padString:string=""
      let padLength = Math.max(width-stringToPad.length-1,0)
      for(let i=0; i<padLength; i++) {
        padString += " "
      }
      return (stringToPad + padString)
    }
}