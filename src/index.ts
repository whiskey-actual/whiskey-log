export class LogEngine {
  constructor(logStack:string[], showDebug:boolean=false) {
    this.logStack=logStack;
    this._showDebug = showDebug
    this.AddLogEntry(LogEngine.Severity.Info, LogEngine.Action.Success, `LogEngine initialized (showDebug=${this._showDebug.toString()})`)
  }

  public logStack:string[]=[]
  private _showDebug:boolean=false

  public AddLogEntry(severity: LogEngine.Severity, action: LogEngine.Action, message: string, columnWidth:number=48) {

    if(severity!=LogEngine.Severity.Debug || (severity===LogEngine.Severity.Debug && this._showDebug)) {
    let output = "";

    let severityColorSequence = '';
    let severityColorText = '';

    switch(severity) {
      case LogEngine.Severity.Debug:
        severityColorSequence='\x1b[97m',
        severityColorText='*'
        break;
      case LogEngine.Severity.Info:
        severityColorSequence='\x1b[96m',
        severityColorText='i'
        break;

      case LogEngine.Severity.Warning:
        severityColorSequence='\x1b[93m',
        severityColorText='!'
        break;
      case LogEngine.Severity.Error:
        severityColorSequence='\x1b[31m',
        severityColorText='X'
        break;
      default:
        severityColorSequence='';
        severityColorText='';
        break;
    }

    let actionColorSequence = '';
    let actionColorText = '';

    switch(action) {
      case LogEngine.Action.Change:
        actionColorSequence='\x1b[95m',
        actionColorText='\u0394'
        break;
      case LogEngine.Action.Add:
        actionColorSequence='\x1b[94m',
        actionColorText='+'
        break;
      case LogEngine.Action.Success:
        actionColorSequence='\x1b[92m',
        actionColorText='\u221a'
        break;
      case LogEngine.Action.Note:
        actionColorSequence='\x1b[90m'
        actionColorText='\u00b7'
        break;
      default:
        actionColorSequence='';
        actionColorText='-';
        break;
    }

    try {
      const dt = LogEngine.getDateTimeString();

      const delimiter = '\x1b[0m|'
      
      output = `${dt}`
      output += `${delimiter}`
      output += `${severityColorSequence}\xa0${severityColorText}\xa0`;
      output += `${delimiter}`
      

      let logStackOutput:string = ' '
      for(let i=0;i<this.logStack.length;i++) {
        logStackOutput += `${this.logStack[i]}`
        if(i<this.logStack.length-1) { logStackOutput += ':'}
      }
      logStackOutput = LogEngine.padString(logStackOutput, ' ', columnWidth, LogEngine.Direction.Right)

      output += `${logStackOutput}`
      output += `${delimiter}`
      output += `${actionColorSequence}\xa0${actionColorText}\xa0`;
      output += `${delimiter}`
      output += ` ${message}`;

    } catch (err) {
      console.error(err);
      throw err;
    }

    console.log(output);

    }
  }

  private static padString(stringToPad:string, padCharacter:string=' ', width:number=16, padSide:LogEngine.Direction=LogEngine.Direction.Right) {
    if (typeof stringToPad === 'undefined') {
      return padCharacter;
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

  export enum Severity {
    Debug,
    Info,
    Warning,
    Error,
  }

  export enum Action {
    Note,
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