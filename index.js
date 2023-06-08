import CasambiAPI from "./api";
import CasambiWebSocket from "./webSocket";

class Casambi{
  constructor(apiKey,networkSessionEmail,networkSessionPassword,websocketReferanceId){
    this.webSocket = null
    this.websocketReferanceId = websocketReferanceId
    this.apiKey = apiKey
    this.api = new CasambiAPI( this.apiKey,networkSessionEmail,networkSessionPassword)
    this.ready = false
  }

  //INIT
  init = async()=>{
    return new Promise(async(resolve,reject)=>{
      try{
        await this.api.init()
        this.initWebSocket((webSocket)=> resolve(webSocket))
      }
      catch(e){
        console.error(e)
        return reject(null)
      }
    })
  }

  initWebSocket = (callback)=>{
    const networkId = this.api.network.session.id
    const sessionId = this.api.network.session.sessionId

    this.webSocket = new CasambiWebSocket(this.apiKey,networkId,sessionId,this.websocketReferanceId,()=>{
      this.ready = true
      return callback(this)
    })
  }

  //METHODS

  restablishConnection = async()=>{
    return new Promise(async(resolve,reject)=>{
      try{
        if(!this.webSocket.isConnected()){
          this.ready = false
          this.initWebSocket((webSocket)=> resolve(true))
        }
        else{
          this.webSocket.ping()
          this.ready = true
          return resolve(true)
        } 
      }
      catch(e){
        console.error("CASAMBI_FAILED_TO_RESTABLISH_CONNECTION -",e)
        return reject(false)
      }
    })
  }

  validateParameters = (parameters)=>{
    for(const param of parameters){
      if(!param.value && param.value != 0){
        console.error(`CASAMBI_ERROR - Invalid ${param.name}`,param.value)
        return false
      }
    
      if(param.value != 0 && param.type === "numeric" && !(typeof param.value === "number")){
        console.error(`CASAMBI_ERROR - Invalid ${param.name}`,param.value)
        return false
      }
      
      if(param.type === "boolean" &&!(typeof param.value == "boolean")){
        console.error(`CASAMBI_ERROR - Invalid ${param.name}`,param.value)
        return false
      }

      if(param.type === "array-numeric" &&!(typeof param.value == "array")){
        for(let i = 0 ; i < param.value.length; i++){
          if(param.value[i] != 0 && !param.value[i] && !(typeof param.value[i] === "number")){
            console.error(`CASAMBI_ERROR - Invalid ${param.name} index ${i}`,param.value[i])
            return false
          }
        }
      }
    }

    return true
  }

  dimLights = async(unitIds,value)=>{  
    return new Promise(async(resolve,reject)=>{
      try{
        await this.restablishConnection()
        const callBack = (status)=>{
          if(status.success = true) return resolve()
          else return reject()
        }

        const parmeters = [
          {value: unitIds, name: "Unit IDs",type:"array-numeric"},
          {value: value, name: "Value",type:"numeric"}
        ]

        if(!this.validateParameters(parmeters))return reject()

        const targetControls = {
          "Dimmer": {"value": value}
        }

        if(unitIds.length === 1) this.webSocket.controlLuminaire(unitIds[0],targetControls,callBack)
        else if(unitIds.length > 1) this.webSocket.controlLuminaires(unitIds,targetControls,callBack)
      }
      catch(e){
        console.error(e)
        return reject()
      }
    })
  }

  dimScene = async(sceneId,value)=>{  
    return new Promise(async(resolve,reject)=>{
      try{
        await this.restablishConnection()
        const callBack = (status)=>{
          if(status.success = true) return resolve()
          else return reject()
        }

        const parmeters = [
          {value: sceneId, name: "Scene ID",type:"numeric"},
          {value: value, name: "Value",type:"numeric"}
        ]

        if(!this.validateParameters(parmeters)) return reject()

        this.webSocket.controlScene(sceneId,value,callBack)
      }
      catch(e){
        console.error(e)
        return reject()
      }
    })
  }

  dimLightGroup = async(groupId,value)=>{  
    return new Promise(async(resolve,reject)=>{
      try{
        await this.restablishConnection()
        const callBack = (status)=>{
          if(status.success = true) return resolve()
          else return reject()
        }

        const parmeters = [
          {value: groupId, name: "Group ID",type:"numeric"},
          {value: value, name: "Value",type:"numeric"}
        ]

        if(!this.validateParameters(parmeters)) return reject()

        this.webSocket.controlLuminaireGroup(groupId,value,callBack)
      }
      catch(e){
        console.error(e)
        return reject()
      }
    })
  }

  dimNetwork = async(value)=>{  
    return new Promise(async(resolve,reject)=>{
      try{
        await this.restablishConnection()
        const callBack = (status)=>{
          if(status.success = true) return resolve()
          else return reject()
        }

        const parmeters = [
          {value: value, name: "Value",type:"numeric"}
        ]

        if(!this.validateParameters(parmeters)) return reject()

        this.webSocket.controlNetwork(groupId,value,callBack)
      }
      catch(e){
        console.error(e)
        return reject()
      }
    })
  }

  updateColorTempreture = async(unitId,value)=>{
    return new Promise(async(resolve,reject)=>{
      try{
        await this.restablishConnection()
        const callBack = (status)=>{
          if(status.success = true) return resolve()
          else return reject()
        }

        const parmeters = [
          {value: value, name: "Value",type:"numeric"},
          {value: unitId, name: "Unit ID",type:"numeric"}
        ]

        if(!this.validateParameters(parmeters)) return reject()

        let targetControls = {
          "ColorTemperature": {"value" : value}, 
          "Colorsource": {"source": "TW"}
        }

        this.webSocket.controlColorTempreture(unitId,targetControls,callBack)
      }
      catch(e){
        console.error(e)
        return reject()
      }
    })
  }

  updateOnOff = async(unitId,isOn)=>{
    return new Promise(async(resolve,reject)=>{
      try{
        await this.restablishConnection()
        const callBack = (status)=>{
          if(status.success = true) return resolve()
          else return reject()
        }

        const parmeters = [
          {value: unitId, name: "Unit ID",type:"numeric"},
          {value: isOn, name: "isOn",type:"boolean"}
        ]

        if(!this.validateParameters(parmeters)) return reject()

        let targetControls = {
          "OnOff": {"value": isOn ? 1.0 : 0}
        }

        this.webSocket.controlOnOff(unitId,targetControls,callBack)
      }
      catch(e){
        console.error(e)
        return reject()
      }
    })
  }

  updateSlider = async(unitId,value)=>{
    return new Promise(async(resolve,reject)=>{
      try{
        await this.restablishConnection()
        const callBack = (status)=>{
          if(status.success = true) return resolve()
          else return reject()
        }

        const parmeters = [
          {value: value, name: "Value",type:"numeric"},
          {value: unitId, name: "Unit ID",type:"numeric"}
        ]

        if(!this.validateParameters(parmeters)) return reject()
        
        let targetControls = {
          "Slider": {"value": value}
        }

        this.webSocket.controlSlider(unitId,targetControls,callBack)
      }
      catch(e){
        console.error(e)
        return reject()
      }
    })
  }

  updateColorHueSaturation = async(unitId,hue,saturation)=>{
    return new Promise(async(resolve,reject)=>{
      try{
        await this.restablishConnection()
        const callBack = (status)=>{
          if(status.success = true) return resolve()
          else return reject()
        }

        const parmeters = [
          {value: unitId, name: "Unit ID",type:"numeric"},
          {value: hue, name: "Hue",type:"numeric"},
          {value: saturation, name: "Saturation",type:"numeric"}
        ]

        if(!this.validateParameters(parmeters)) return reject()

        let targetControls = {
          "RGB": {"hue": hue, "sat": saturation}, 
          "Colorsource": {"source": "RGB"}
        }

        this.webSocket.controlHueSaturationColor(unitId,targetControls,callBack)
      }
      catch(e){
        console.error(e)
        return reject()
      }
    })
  }

  updateColorRGB = async(unitId,r,g,b)=>{
    return new Promise(async(resolve,reject)=>{
      try{
        await this.restablishConnection()
        const callBack = (status)=>{
          if(status.success = true) return resolve()
          else return reject("Control Callback Status failed")
        }

        const parmeters = [
          {value: unitId, name: "Unit ID",type:"numeric"},
          {value: r, name: "R",type:"numeric"},
          {value: g, name: "G",type:"numeric"},
          {value: b, name: "B",type:"numeric"}
        ]

        if(!this.validateParameters(parmeters)) return reject()

        let targetControls = {
          "RGB": {"rgb": `rgb(${r}, ${g}, ${b})`}, 
          "Colorsource": {"source": "RGB"},
          "ColorBalance": {"value": 1}
        };

        this.webSocket.controlHueSaturationColor(unitId,targetControls,callBack)
      }
      catch(e){
        console.error(e)
        return reject()
      }
    })
  }

  updateColorXY = async(unitId,x,y)=>{
    return new Promise(async(resolve,reject)=>{
      try{
        await this.restablishConnection()
        const callBack = (status)=>{
          if(status.success = true) return resolve()
          else return reject()
        }

        const parmeters = [
          {value: value, name: "Value",type:"numeric"},
          {value: x, name: "X",type:"numeric"},
          {value: y, name: "Y",type:"numeric"},
        ]

        if(!this.validateParameters(parmeters)) return reject()

        let targetControls = {
          "XY": {"x": x, "y": y }
        }

        this.webSocket.controlXYColor(unitId,targetControls,callBack)
      }
      catch(e){
        console.error(e)
        return reject()
      }
    })
  }
}

export default Casambi