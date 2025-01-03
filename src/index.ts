import { Dim, FgCyan, FgGreen, FgMagenta, FgRed, FgWhite, FgYellow, Reset } from "./consoleColors"

export class LogEngine {
  constructor(logStack:string[], logStackColumnWidth:number=48, showDebug:boolean=false) {
    this.logStack=logStack;
    this._showDebug = showDebug
    this._logStackColumnWidth = logStackColumnWidth
    if(showDebug) {
      this.AddLogEntry('debug', `LogEngine initialized (showDebug=${this._showDebug.toString()})`)
    }
  }

  public logStack:string[]=[]
  private _showDebug:boolean=false
  private _logStackColumnWidth:number = 48

  public AddLogEntry(type:'debug'|'info'|'warn'|'error'|'change'|'add'|'success'|'remove', message:string|string[], preceedingBlankLine:boolean=false, subsequentBlankLine:boolean=false) {
    
    try {
      if(message && message.length>0 && (type!='debug' || (type==='debug' && this._showDebug))) {

        let entryColorSequence = FgWhite
        let entryColorText = '';

        switch(type) {
          case 'debug':
            entryColorSequence=FgYellow
            entryColorText='#'
            break;
          case 'info':
            entryColorSequence=FgWhite
            entryColorText='\u00b7'
            break;

          case 'warn':
            entryColorSequence=FgYellow
            entryColorText='>'
            break;
          case 'error':
            entryColorSequence=FgRed
            entryColorText='X'
            break;
          case 'change':
            entryColorSequence=FgMagenta
            entryColorText='\u0394'
            break;
          case 'add':
            entryColorSequence=FgCyan
            entryColorText='+'
            break;
          case 'success':
            entryColorSequence=FgGreen
            entryColorText='\u221a'
            break;
          case 'remove':
            entryColorSequence=FgRed
            entryColorText="-"
            break;
          default:
            entryColorSequence=FgWhite
            entryColorText='@';
            break;
        }

        const dt = LogEngine.getDateTimeString();

        const delimiter = Dim + " | " + Reset

        let messageParts:string[]=[]
        if(Array.isArray(message)) {
          messageParts = message
        } else {
          try {
            messageParts = message.split("\n")
          } catch {
            console.error("oops, couldn't parse the message:")
            console.debug(message)
            messageParts=[]
          }
          
        }

        if(preceedingBlankLine) { console.log() }
        
        for(let i=0; i<messageParts.length; i++) {

          let outputLine = dt
          outputLine += delimiter
        
          let logStackOutput:string = this.logStack.join(":")
          logStackOutput = LogEngine.padString(logStackOutput, ' ', this._logStackColumnWidth)

          outputLine += Dim + logStackOutput + Reset
          outputLine += delimiter
          outputLine += entryColorSequence + entryColorText + Reset
          outputLine += delimiter
          outputLine += entryColorSequence + messageParts[i] + Reset
          
          
          console.log(outputLine);

        }

        if(subsequentBlankLine) { console.log() }
      
      }
        
    } catch (err) {
      console.error(err);
      throw err;
    }

    
  }

  public AddDelimiter(delimiterLabel:string) {
    const delimiterCharacter:string="-"
    console.log("")
    this.AddLogEntry('info', `${delimiterCharacter.repeat(3)}[ ${delimiterLabel} ]${delimiterCharacter.repeat(120-this._logStackColumnWidth)}`)
  }

  private static padString(stringToPad:string, padCharacter:string=' ', width:number) {
    if (typeof stringToPad === 'undefined' || !stringToPad || stringToPad===null) {
      return Array(width).join(padCharacter).toString()
    }
    else if (stringToPad.length>width) {
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

  private static getDateTimeString():string {

    let output:string = '';
  
    try {
      // parse the date/time ourselves, so we don't have any dependencies.
      const timestamp = new Date();
      const d = timestamp.getDate();
      const m = timestamp.getMonth() + 1;
      const y = timestamp.getFullYear();
      const date = `${y}-${m <= 9 ? "0" + m : m}-${d <= 9 ? "0" + d : d}`;
  
      const h = timestamp.getHours();
      const mm = timestamp.getMinutes();
      const s = timestamp.getSeconds();
      const time = `${h <= 9 ? "0" + h : h}:${mm <= 9 ? "0" + mm : mm}:${
        s <= 9 ? "0" + s : s
      }`;
  
      output = `${date} ${time}`
  
    } catch (err) {
      throw(`${arguments.callee.toString()}: ${err}`)
    }
  
    return output;
  
  }

}
