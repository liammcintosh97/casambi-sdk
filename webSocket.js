const websocketURL = 'wss://door.casambi.com/v1/bridge/'
const wire = 1

class CasambiWebSocket extends WebSocket{
  constructor(apiKey,networkId,sessionId,websocketReferanceId,onReady){
    super(websocketURL,apiKey)

    this.apiKey = apiKey
    this.networkId = networkId
    this.sessionId = sessionId

    //Listeners
    this.onReady = onReady
    this.controlCallback = null
    this.onResponseListener = null
    this.onEventUpdatedListener = null
    this.onPeerChangedListener = null
    this.onNetworkUpdatedListener = null
    this.onUnitChangedListener = null
    this.onInvalidDataListener = null
    this.onInvalidValueTypeListener = null
    this.onTooManyWiresListener = null
    this.onInvalidSessionListener = null
    this.onKeyAuthorizeFailedListener = null
    this.onKeyAuthenticateFailedListener = null
    this.onOpenWireSucceedListener = null
    this.onWireStatusListener = null
    this.onMessageListener = null
    this.onOpenListener = null

    this.connect()
  }

  //METHODS

  connect = ()=>{
    this.onopen = this.onOpen
    this.onmessage = (event) => this.onMessage(event)
    this.onerror = this.onError
    this.onclose = this.onClose
  }

  controlLuminaire = (unitId,targetControls,controlCallback)=>{
    this.controlCallback = controlCallback
    
    if(this.readyState === this.OPEN){
      const data = JSON.stringify({
        "wire": wire,
        "method":"controlUnit",
        "id": unitId,
        "targetControls": targetControls
      });

      this.send(decodeURIComponent(escape(data)));
    }
  }

  controlLuminaires = (unitIds,targetControls,controlCallback)=>{
    this.controlCallback = controlCallback

    if(this.readyState === this.OPEN){
      const data = JSON.stringify({
        "wire": wire,
        "method":"controlUnits",
        "ids": unitIds,
        "targetControls": targetControls
      });

      this.send(decodeURIComponent(escape(data)));
    }
  }

  controlLuminaireGroup = (groupId,value,controlCallback)=>{
    this.controlCallback = controlCallback

    if(this.readyState === this.OPEN){
      const data = JSON.stringify({
        "wire": wire,
        "method":"controlGroup",
        "id": groupId,
        "level": value
      });

      this.send(decodeURIComponent(escape(data)));
    }
  }

  controlScene = (sceneId,value,controlCallback)=>{
    this.controlCallback = controlCallback

    if(this.readyState === this.OPEN){
      const data = JSON.stringify({
        "wire": wire,
        "method":"controlScene",
        "id": sceneId,
        "level": value
      });

      this.send(decodeURIComponent(escape(data)));
    }
  }

  controlNetwork = (value,controlCallback)=>{
    this.controlCallback = controlCallback

    if(this.readyState === this.OPEN){
      const data = JSON.stringify({
        "wire": wire,
        "method":"controlNetwork",
        "level": value
      });
      
      this.send(decodeURIComponent(escape(data)));
    }
  }

  controlColorTempreture = (unitId,targetControls,controlCallback)=>{
    this.controlCallback = controlCallback

    if(this.readyState === this.OPEN){
      const data = JSON.stringify({
        "wire": wire,
        "method":"controlUnit",
        "id": unitId,
        "targetControls": targetControls
      });
    
      this.send(decodeURIComponent(escape(data)));
    }
  }

  controlOnOff = (unitId,targetControls,controlCallback)=>{
    this.controlCallback = controlCallback

    if(this.readyState === this.OPEN){
      const data = JSON.stringify({
        "wire": wire,
        "method":"controlUnit",
        "id": unitId,
        "targetControls": targetControls
      });
    
      this.send(decodeURIComponent(escape(data)));
    }
  }

  controlSlider = (unitId,targetControls,controlCallback)=>{
    this.controlCallback = controlCallback

    if(this.readyState === this.OPEN){
      const data = JSON.stringify({
        "wire": wire,
        "method":"controlUnit",
        "id": unitId,
        "targetControls": targetControls
      });

      this.send(decodeURIComponent(escape(data)));
    }
  }

  controlHueSaturationColor = (unitId,targetControls,controlCallback)=>{
    this.controlCallback = controlCallback

    if(this.readyState === this.OPEN){
      const data = JSON.stringify({
        "wire": wire,
        "method":"controlUnit",
        "id": unitId,
        "targetControls": targetControls
      });
    
      this.send(decodeURIComponent(escape(data)));
    }
  }

  controlXYColor = (unitId,targetControls,controlCallback)=>{
    this.controlCallback = controlCallback

    if(this.readyState === this.OPEN){
      const data = JSON.stringify({
        "wire": wire,
        "method":"controlUnit",
        "id": unitId,
        "targetControls": targetControls
      });
    
      this.send(decodeURIComponent(escape(data)));
    }
  }

  close = ()=>{
    if(this.readyState === this.OPEN) {
      const CLOSE = JSON.stringify({
        "method": "close",
        "wire": wire
      });
    
      this.send(decodeURIComponent(escape(CLOSE)));
    }
  }

  ping = ()=>{
    if(this.readyState === this.OPEN) {
      const PING = JSON.stringify({
        "method": "ping",
        "wire": wire
      });
    
      this.send(decodeURIComponent(escape(PING)));
    }
  }

  isConnected = ()=>{
    return this.readyState === WebSocket.OPEN
  }

  //LISTENERS

  onOpen = ()=>{
    if(this.onOpenListener) this.onOpenListener(data)

    const OPEN = JSON.stringify({
      "method": "open",
      "id": this.networkId,         // Received from API create session request
      "session": this.sessionId,    // Received from API create session request
      "ref": this.websocketReferanceId,  // Reference handle created by client to link messages to relevant callbacks
      "wire": wire,                 // Connection ID, incremental value to identify messages of network/connection
      "type": 1                     // Client type, use value 1 (FRONTEND)
    });

    this.send(decodeURIComponent(escape(OPEN)));
  }

  onMessage = (event)=>{
    (new Response(event.data)).text().then((result) => {

      let data = JSON.parse(result);
      if(this.onMessageListener) this.onMessageListener(data)
      //Method Message
      if ("method" in data) {
  
        // Initial device state info and device state changed event
        // In case data.id is not in "network.units" list (fetched via API) this event can be ignored.
        if (data.method === "unitChanged") this.onUnitChanged(event)
        
         // Network changed event, for example device added to a group within the network
        else if (data.method === "networkUpdated")this.onNetworkUpdated(event) 
        
        // Devices online changed event, for example new device has joined the network
        else if (data.method === "peerChanged" && !data.online) this.onPeerChanged(event)
      
        else if (data.method === "eventUpdated" && !data.online) this.onEventUpdated(event)
      

      }
      //Wire Status Message
      else if ("wireStatus" in data) this.onWireStatus(data)
      
      //Response Message
      else if ("response" in data) this.onResponse(data)
      
    }, function (error) {
      this.onError(error);
    });
  }

  onError = (error)=>{
    if(this.onErrorListener) this.onErrorListener(error)
    console.error("CASAMBI_WEBSOCKET_ERROR -", error);
    if(this.controlCallback){
      this.controlCallback({success: false})
      this.controlCallback = null
    }
  }

  onClose = ()=>{
    if(this.onCloseListener) this.onCloseListener()
    this.webSocket = null

    if(this.controlCallback){
      this.controlCallback({success: false})
      this.controlCallback = null
    }
  }

  //WIRE STATUS LISTENERS

  onWireStatus = (data)=>{
    if(this.onWireStatusListener) this.onWireStatusListener(data)

    switch(data.wireStatus){
      case "openWireSucceed":
        this.onOpenWireSucceed(data)
        break;
      case "keyAuthenticateFailed":
        this.onKeyAuthenticateFailed(data)
        break;
      case "keyAuthorizeFailed":
        this.onKeyAuthorizeFailed(data)
        break;
      case "invalidSession":
        this.onInvalidSession(data)
        break;
      case "tooManyWires":
        this.onTooManyWires(data)
        break;
      case "invalidValueType":
        this.onInvalidValueType(data)
        break;
      case "invalidData":
        this.onInvalidData(data)
        break;
      default:
        console.error("CASAMBI_WEBSOCKET_INVALID_WIRE_STATUS -",data.wireStatus)
        break;
    }
  }

  onOpenWireSucceed = (data)=>{
    if(this.onOpenWireSucceedListener) this.onOpenWireSucceedListener(data)
    this.ping()
    if(this.onReady) this.onReady()
  }

  onKeyAuthenticateFailed = (data)=>{
    if(this.onKeyAuthenticateFailedListener) this.onKeyAuthenticateFailedListener(data)
  }

  onKeyAuthorizeFailed = (data)=>{
    if(this.onKeyAuthorizeFailedListener) this.onKeyAuthorizeFailedListener(data)
  }

  onInvalidSession = (data)=>{
    if(this.onInvalidSessionListener) this.onInvalidSessionListener(data)
  }

  onTooManyWires = (data)=>{
    if(this.onTooManyWiresListener) this.onTooManyWiresListener(data)
  }

  onInvalidValueType = (data)=>{
    if(this.onInvalidValueTypeListener) this.onInvalidValueTypeListener(data)
  }

  onInvalidData = (data)=>{
    if(this.onInvalidDataListener) this.onInvalidDataListener(data)
  }

  //MESSAGE LISTENERS

  onUnitChanged = (event)=>{
    if(this.onUnitChangedListener) this.onUnitChangedListener(event)

    if(this.controlCallback){
      this.controlCallback({success: true})
      this.controlCallback = null
    }
  }

  onNetworkUpdated = (event)=>{
    if(this.onNetworkUpdatedListener) this.onNetworkUpdatedListener()
  }

  onPeerChanged = (event)=>{
    if(this.onPeerChangedListener) this.onPeerChangedListener(event)
  }

  onEventUpdated = (event)=>{
    if(this.onEventUpdatedListener) this.onEventUpdatedListener(event)
  }

  //RESPONSE LISTENERS

  onResponse = (data)=>{
    if(this.onResponseListener) this.onResponseListener(data)
  }
}


export default CasambiWebSocket