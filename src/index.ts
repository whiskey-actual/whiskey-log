import { BrightPurple, Dim, FgCyan, FgGreen, FgLightGrey, FgMagenta, FgRed, FgWhite, FgYellow, Reset, Yellow } from "./consoleColors"
import getDateTimeString from "./getDateTimeString"
import LogEntryTypes from "./logEntryTypes"
import padString from "./padString"

export class LogEngine {

  private _showDebug:boolean=false
  private _logStackColumnWidth:number = 24
  private _terminalWidth:number = 180
  public logStack:string[]=[]
  public useEmoji:boolean = false

  constructor(logStackColumnWidth:number=48, terminalWidth:number=180, showDebug:boolean=false) {
    this._showDebug = showDebug
    this._logStackColumnWidth = logStackColumnWidth
    this._terminalWidth = terminalWidth
    if(showDebug) {
      this.AddLogEntry('debug', `LogEngine initialized (showDebug=${this._showDebug.toString()})`)
    }
  }

  public AddLogEntry(logEntryType:LogEntryTypes, message:string|string[], preceedingBlankLine:boolean=false, tabs:number=0) {
    
    try {
      if(message && message.length>0 && (logEntryType!='debug' || (logEntryType==='debug' && this._showDebug))) { 

        let entryColorSequence = FgWhite
        let entryIcon = '';
        let entryEmoji = 'ℹ💬'

        switch(logEntryType) {
          case 'debug':
            entryColorSequence=FgLightGrey
            entryIcon='#'
            entryIcon='🔍'
            break;
          case 'info':
            entryColorSequence=FgWhite
            entryIcon='\u00b7'
            entryEmoji='ℹ💬'
            break;
          case 'warn':
            entryColorSequence=Yellow
            entryIcon='>'
            entryEmoji='⚠️'
            break;
          case 'error':
            entryColorSequence=FgRed
            entryIcon='X'
            entryEmoji='❌'
            break;
          case 'change':
            entryColorSequence=BrightPurple
            entryIcon='\u0394'
            entryEmoji='♻️'
            break;
          case 'add':
            entryColorSequence=FgCyan
            entryIcon='+'
            entryEmoji='➕'
            break;
          case 'success':
            entryColorSequence=FgGreen
            entryIcon='\u221a'
            entryEmoji='✅'
            break;
          case 'remove':
            entryColorSequence=FgRed
            entryIcon="-"
            entryEmoji='➖'
            break;
          case 'get':
            entryIcon="<"
            entryEmoji='⬅️'
            break;
          case 'put':
            entryIcon=">"
            entryEmoji='➡️'
            break;
          default:
            entryColorSequence=FgWhite
            entryIcon='@';
            break;
        }

        const dt = getDateTimeString();

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

        let lines:string[]=[]
        messageParts.map((m)=> {
          let line:string[]=[]
          let words = m.split(/[\s\n]/)
          for(let i=0; i<words.length; i++) {

            for(let j=0; j<tabs; j++) {
              line.push("  ")
            }
            line.push(`${words[i]}`)
            let currentLineLength=0
            line.map((w)=>{
              currentLineLength+=w.length+1 // +1 to accomodate spaces
            })
            currentLineLength-=1 // remove trailing space
            if(i===words.length-1 || (i<words.length-1 && (currentLineLength + words[i+1].length>(this._terminalWidth-this._logStackColumnWidth)))) {
              lines.push(line.join(" "))
              line = []
            }
          }
        })

        if(preceedingBlankLine) { console.log() }
        
        for(let i=0; i<lines.length; i++) {

          let outputLine = dt
          outputLine += delimiter

          let newLogStack:string[]=[]
          this.logStack.map((stackItem) => {
            if(newLogStack.length===0 || newLogStack[newLogStack.length]!==stackItem) {
              newLogStack.push(stackItem) // prevents recursive expansion
            }
          })
        
          let logStackOutput:string = newLogStack.join(":")
          logStackOutput = padString(logStackOutput, this._logStackColumnWidth)

          outputLine += Dim + logStackOutput + Reset
          outputLine += delimiter
          outputLine += this.useEmoji ? entryEmoji : entryColorSequence + entryIcon + Reset
          outputLine += delimiter
          outputLine += entryColorSequence + lines[i] + Reset
          
          
          console.log(outputLine);

        }
      
      }
        
    } catch (err) {
      console.debug(err);
      throw err;
    }

  }

  public AddDelimiter(delimiterLabel:string) {
    const delimiterCharacter:string="-"
    console.log("")
    this.AddLogEntry('info', `${delimiterCharacter.repeat(3)}[ ${delimiterLabel} ]${delimiterCharacter.repeat(100-this._logStackColumnWidth)}`)
  }

}
