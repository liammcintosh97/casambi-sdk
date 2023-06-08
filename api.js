const baseAPIURL = 'https://door.casambi.com/v1/'

class CasambiAPI {
  constructor(_apiKey,networkSessionEmail,networkSessionPassword){
   
    //Variables
    this.network =  {
      session: null,
      information: null
    }
    this.units = []
    this.groups = []
    this.gallery = []
    this.scenes = []
    this.apiKey = _apiKey
    this.networkSessionEmail = networkSessionEmail
    this.networkSessionPassword = networkSessionPassword
  }

  init = async ()=>{
    return new Promise(async(resolve,reject) => {
      try{
        await this.createNetworkSession()
        await this.requestUnitList()
        await this.requestNetworkScenes()
        
        return resolve()
      }
      catch(e){
        console.error(e)
        return reject()
      }
    })
  }

  requestFixtureIcon = (fixtureId)=>{
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'image/png',
        'X-Casambi-Key': `${this.apiKey}`
      }
    }
    const url = baseAPIURL + `fixtures/${fixtureId}/icon`

    return new Promise((resolve,reject)=>{
      fetch(url,options)
        .then(async(res)=>{
          const data = await res.json()
          resolve(data)
        })
        .catch((e)=>{ reject(e)})
    })
  }

  requestFixtureInformation = (fixtureId)=>{
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Casambi-Key': `${this.apiKey}`
      }
    }
    const url = baseAPIURL + `fixtures/${fixtureId}`

    return new Promise((resolve,reject)=>{
      fetch(url,options)
        .then(async(res)=>{
          const data = await res.json()
          resolve(data)
        })
        .catch((e)=>{ reject(e)})
    })
  }

  requestNetworkImage = (imageId)=>{
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'image/png',
        'X-Casambi-Session' : `${this.network.session.sessionId}`,
        'X-Casambi-Key': `${this.apiKey}`
      }
    }
    const url = baseAPIURL + `networks/${this.network.session.id}/images/${imageId}`

    return new Promise((resolve,reject)=>{
      fetch(url,options)
        .then(async(res)=>{
          const data = await res.json()
          resolve(data)
        })
        .catch((e)=>{ reject(e)})
    })
  }

  requestNetworkGallery = ()=>{
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Casambi-Session' : `${this.network.session.sessionId}`,
        'X-Casambi-Key': `${this.apiKey}`
      }
    }
    const url = baseAPIURL + `networks/${this.network.session.id}/gallery`

    return new Promise((resolve,reject)=>{
      fetch(url,options)
        .then(async(res)=>{
          const data = await res.json()
          this.gallery = data
          resolve(data)
        })
        .catch((e)=>{ reject(e)})
    })
  }

  requestNetworkUnitIcon = (unitId)=>{
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Casambi-Session' : `${this.network.session.sessionId}`,
        'X-Casambi-Key': `${this.apiKey}`
      }
    }
    const url = baseAPIURL + `networks/${this.network.session.id}/units/${unitId}/icon`

    return new Promise((resolve,reject)=>{
      fetch(url,options)
        .then(async(res)=>{
          const data = await res.json()
          resolve(data)
        })
        .catch((e)=>{ reject(e)})
    })
  }

  requestNetworkDataPoints = (filter)=>{
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Casambi-Session' : `${this.network.session.sessionId}`,
        'X-Casambi-Key': `${this.apiKey}`
      }
    }
    const url = baseAPIURL + `networks/${this.network.session.id}/datapoints?${formatQueryString(filter)}`

    return new Promise((resolve,reject)=>{
      fetch(url,options)
        .then(async(res)=>{
          const data = await res.json()
          resolve(data)
        })
        .catch((e)=>{ reject(e)})
    })
  }

  requestNetworkScenes = ()=>{
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Casambi-Session' : `${this.network.session.sessionId}`,
        'X-Casambi-Key': `${this.apiKey}`
      }
    }
    const url = baseAPIURL + `networks/${this.network.session.id}/scenes`

    return new Promise((resolve,reject)=>{
      fetch(url,options)
        .then(async(res)=>{
          const data = await res.json()
          const keys = Object.keys(data)
          const scenes = []

          for(const key of keys){
            scenes.push(data[key])
          }

          this.scenes = scenes
          resolve(scenes)
        })
        .catch((e)=>{ reject(e)})
    })
  }

  requestNetworkGroups = ()=>{
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Casambi-Session' : `${this.network.session.sessionId}`,
        'X-Casambi-Key': `${this.apiKey}`
      }
    }
    const url = baseAPIURL + `networks/${this.network.session.id}/groups`

    return new Promise((resolve,reject)=>{
      fetch(url,options)
        .then(async(res)=>{
          const data = await res.json()
          const keys = Object.keys(data)
          const groups = []

          for(const key of keys){
            groups.push(data[key])
          }

          this.groups = groups
          resolve(groups)
        })
        .catch((e)=>{ reject(e)})
    })
  }

  requestNetworkState = ()=>{
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Casambi-Session' : `${this.network.session.sessionId}`,
        'X-Casambi-Key': `${this.apiKey}`
      }
    }
    const url = baseAPIURL + `networks/${this.network.session.id}/state`

    return new Promise((resolve,reject)=>{
      fetch(url,options)
        .then(async(res)=>{
          const data = await res.json()
          resolve(data)
        })
        .catch((e)=>{ reject(e)})
    })
  }

  requestUnitState = (id)=>{
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Casambi-Session' : `${this.network.session.sessionId}`,
        'X-Casambi-Key': `${this.apiKey}`
      }
    }
    const url = baseAPIURL + `networks/${this.network.session.id}/units/${id}/state`

    return new Promise((resolve,reject)=>{
      fetch(url,options)
        .then(async(res)=>{
          const data = await res.json()
          resolve(data)
        })
        .catch((e)=>{ reject(e)})
    })
  }

  requestUnitList = ()=>{
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Casambi-Session' : `${this.network.session.sessionId}`,
        'X-Casambi-Key': `${this.apiKey}`
      }
    }
    const url = baseAPIURL + `networks/${this.network.session.id}/units`

    return new Promise((resolve,reject)=>{
      fetch(url,options)
        .then(async(res)=>{
          const data = await res.json()
          const props = Object.keys(data)
          const units = []

          for(const prop of props){
            units.push(data[prop])
          }

          this.units = units
          resolve(this.units)
        })
        .catch((e)=>{ reject(e)})
    })
  }

  requestNetworkInformation = ()=>{
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Casambi-Session' : `${this.network.session.sessionId}`,
        'X-Casambi-Key': `${this.apiKey}`
      }
    }
    const url = baseAPIURL + `networks/${this.network.session.id}`

    return new Promise((resolve,reject)=>{
      fetch(url,options)
        .then(async(res)=>{
          const data = await res.json()
          this.network.information = data
          resolve(this.network.session)
        })
        .catch((e)=>{ reject(e)})
    })
  }

  createNetworkSession = ()=>{
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Casambi-Key': `${this.apiKey}`
      },
      body: JSON.stringify({
        email: this.networkSessionEmail,
        password: this.networkSessionPassword
      })
    }
    const url = baseAPIURL + 'networks/session'

    return new Promise((resolve,reject)=>{
      fetch(url,options)
        .then(async(res)=>{
          const data = await res.json()
          this.network.session = data[Object.keys(data)[0]]
          resolve(this.network.session)
        })
        .catch((e)=>{ reject(e)})
    })
  }

}

function formatQueryString(parameters){
  if(!parameters) return ""
  
  var queryString = "?"
  var i = 0

  for(const prop in parameters){
    if(typeof parameters[prop] === 'object'){
      queryString += formatObjectQueryString(prop,parameters[prop])
    }
    else queryString += `${prop}=${parameters[prop]}`
    
    if(i < Object.keys(parameters).length - 1) queryString += "&"
    i++
  }

  return queryString
}

function formatObjectQueryString(name,object){
  var string = ""
  var i = 0

  for(const prop in object){
    if(object[prop]){
      string += `${name}[${prop}]=${object[prop]}`

      if(i < Object.keys(object).length - 1) string += "&"
      i++
    }
    
  }

  return string
}

export default CasambiAPI