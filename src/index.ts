import { Dim, FgCyan, FgGreen, FgMagenta, FgRed, FgWhite, FgYellow, Reset } from "./consoleColors"

export class LogEngine {
  constructor(logStack:string[], showDebug:boolean=false, logStackColumnWidth:number=40) {
    this.logStack=logStack;
    this._showDebug = showDebug
    this._logStackColumnWidth = logStackColumnWidth
    if(showDebug) {
      this.AddLogEntry(LogEngine.EntryType.Info, `LogEngine initialized (showDebug=${this._showDebug.toString()})`)
    }
  }

  public logStack:string[]=[]
  private _showDebug:boolean=false
  private _logStackColumnWidth:number = 40
  private _entityColumnWidth:number = 24

  public AddLogEntry(type:LogEngine.EntryType, message:string, splitMessageAtString:string="\n") {
    
    try {
      if(type!=LogEngine.EntryType.Debug || (type===LogEngine.EntryType.Debug && this._showDebug)) {

        let entryColorSequence = FgWhite
        let entryColorText = '';

        switch(type) {
          case LogEngine.EntryType.Debug:
            entryColorSequence=FgYellow
            entryColorText='*'
            break;
          case LogEngine.EntryType.Info:
            entryColorSequence=FgWhite
            entryColorText='\u00b7'
            break;

          case LogEngine.EntryType.Warning:
            entryColorSequence=FgYellow
            entryColorText='!'
            break;
          case LogEngine.EntryType.Error:
            entryColorSequence=FgRed
            entryColorText='X'
            break;
          case LogEngine.EntryType.Change:
            entryColorSequence=FgMagenta
            entryColorText='\u0394'
            break;
          case LogEngine.EntryType.Add:
            entryColorSequence=FgCyan
            entryColorText='+'
            break;
          case LogEngine.EntryType.Success:
            entryColorSequence=FgGreen
            entryColorText='\u221a'
            break;
          default:
            entryColorSequence=FgWhite
            entryColorText='-';
            break;
        }

        const dt = LogEngine.getDateTimeString();

        const delimiter = Dim + " | " + Reset

        const messageParts = message.split(splitMessageAtString)

        let outputLines:string[] = []

        for(let i=0; i<messageParts.length; i++) {
        

          let outputLine = dt
          outputLine += delimiter
        
          let logStackOutput:string = ''
          for(let j=0;j<this.logStack.length;j++) {
            logStackOutput += Dim + `${this.logStack[j]}` + Reset
            if(j<this.logStack.length-1) { logStackOutput += ':'}
          }
          logStackOutput = LogEngine.padString(logStackOutput, ' ', this._logStackColumnWidth, LogEngine.Direction.Right)

          outputLine += logStackOutput
          outputLine += delimiter
          outputLine += entryColorSequence + entryColorText + Reset
          outputLine += delimiter
          outputLine += entryColorSequence + messageParts[i] + Reset
         
          console.log(outputLine);

        }
      
      }
        
    } catch (err) {
      console.error(err);
      throw err;
    }

    
  }

  public AddDelimiter(delimiterLabel:string) {
    const delimiterCharacter:string="-"
    this.AddLogEntry(LogEngine.EntryType.Info, `${delimiterCharacter.repeat(2)}[ ${delimiterLabel} ]${delimiterCharacter.repeat(120-this._logStackColumnWidth)}`)
  }

  private static padString(stringToPad:string, padCharacter:string=' ', width:number=16, padSide:LogEngine.Direction=LogEngine.Direction.Right) {
    if (typeof stringToPad === 'undefined' || !stringToPad || stringToPad===null) {
      return Array(width).join(padCharacter).toString()
    }
    else if (stringToPad.length>width) {
      return stringToPad.substring(0,width-3) + '..'
    }
    else {

      const padString:string = Array(width-stringToPad.length).join(padCharacter).toString()

      if (padSide===LogEngine.Direction.Left) {
        return (padString + stringToPad)
      } else {
        return (stringToPad + padString)
      }
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

export namespace LogEngine {

  export enum EntryType {
    Debug,
    Info,
    Warning,
    Error,
    Add,
    Change,
    Remove,
    Success
  }

  
  export enum Direction {
    Left,
    Right
  }
}