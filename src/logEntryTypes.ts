const types = ['debug','info','warn','error','change','add','success','remove','get','put'] as const
type LogEntryTypes = typeof types[number]
export default LogEntryTypes