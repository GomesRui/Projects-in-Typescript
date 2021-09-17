
import Activity from "./Activity";
import { URL, URLSearchParams } from 'url';
import fetch from 'node-fetch';
import { Json } from "aws-sdk/clients/robomaker";

export default class WeatherAPI{

    private url : URL;
    private query : any = 
    {
        appid: "81ab80f5fa9d2fc6f34057c41c22348d",
        exclude: "minutely,hourly",
    };

    private _weatherDescription: string = "No weather description can be provided";
    public get weatherDescription(): string {
        return this._weatherDescription;
    }
    public set weatherDescription(value: string) {
        this._weatherDescription = value;
    }
    private lat : number;
    private lon : number;
    private day : number;
    
    constructor(lat : number, lon : number, date : string)
    {
       this.weatherDescription = undefined;
       this.url = undefined;
       this.lat = lat;
       this.lon = lon;
       this.day = new Date(Date.parse(date)).getTime()/1000;
    }
    
    async getHistoricWeatherAPIService()
    {
      
            this.url = new URL("https://api.openweathermap.org/data/2.5/onecall/timemachine");
            this.query["dt"] = this.day.toString();
            this.weatherDescription = await this.getWeatherAPIService().catch(e => { throw e;});
    }
    async getForecastWeatherAPIService()
    {
       
            
            this.url = new URL("https://api.openweathermap.org/data/2.5/onecall");
            this.weatherDescription = await this.getWeatherAPIService().catch(e => { throw e;});
    
    }
    private async getWeatherAPIService(): Promise<string>
    {
        this.query["lat"] = this.lat.toString();
        this.query["lon"] = this.lon.toString();
        
        this.url.search = new URLSearchParams(this.query).toString();
        

            let response = await fetch(this.url.toString(), {})
            .then(r => 
            {
                //console.log("Is ok? ["+r.url+"]" + r.ok);
                if(!r.ok)
                    throw new Error("HTTP error [" + r.status + " - " + r.url + "]: " + r.statusText);

                return r.json();
            })
            .then(json =>
            {
                const days : number[] = (json["daily"] === null || json["daily"] === undefined)  
                ? ((json["current"] === null || json["current"] === undefined) 
                ? null : []) : json["daily"].map(el => el["dt"]);
                
                let result : string = undefined;
                
                if(days != null)
                { 
                    if(days.length === 0)
                    {
                        result = json["current"]["weather"][0]["description"];
                    } else 
                    {
                        days.push(json["current"]["dt"]);
                        if(days.length > 1)
                        {
                            days.sort(); 
                            //console.log("this.day: " + this.day);
                            for(let index = 0; index < days.length - 1; index++)
                            {
                                //console.log(index +": " + days[index] + " AND " + (index+1) + ": " + days[index+1]);
                                if(days[index] <= this.day && days[index+1] >= this.day)
                                {
                                    result = json["daily"][index]["weather"][0]["description"];
                                    break;
                                }
                            }
                        } else 
                        {
                            result = json["daily"][0]["weather"][0]["description"];
                        }
                        
                    }

                } else {
                    throw new Error("No days were fetched from the Weather API!");
                }

                              
                if(result === null || result === undefined)
                    throw new Error("No Weather Description was fetched from the Weather API!");

                return result;

            }).catch(e => {throw e;});
        
        return response;
    }

}


