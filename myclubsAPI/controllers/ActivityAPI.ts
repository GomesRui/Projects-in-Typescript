 
import fetch from 'node-fetch';
import * as data from './frontend_challenge_activities.json';
import Activity from './Activity';
 
export default class ActivityAPI{

    private _activity: Activity;
    public get activity(): Activity {
        return this._activity;
    }
    public set activity(value: Activity) {
        this._activity = value;
    }

    constructor(objectID: string, lat?: number, lon?: number)
    {
        if(lat !== undefined && lon !== undefined)
            this.activity = new Activity(objectID, lat,lon);
        else
            this.activity = new Activity(objectID);
    }
    getActivity() : Activity
    {
        const object : Array<any> = data.hits.hits.filter(e => e._source.activityDate.objectId.includes(this.activity.objectID));
        if(object != null && object.length == 1)
        {
            const status : string = object[0]["_source"]["status"] === null ? "not active" : object[0]["_source"]["status"].toLowerCase();
            const participationModes: string[] = object[0]["_source"]["participationModes"];
            const startActivity = object[0]["_source"]["activityDate"]["start"]["iso"];
            
            this.activity.name = object[0]["_source"]["name"] === null ? "undefined" : object[0]["_source"]["name"];

            if(participationModes != null && participationModes.length > 0)
            {
                participationModes.forEach(pm => pm.toLowerCase());
                if(participationModes.includes("outdoor"))
                {
                    this.activity.isOutside = true;
                    const geo : number[] = object[0]["_source"]["geo"];
                    const lat : number = geo[0];
                    const lon : number = geo[1];

                    if(lat != null && lon != null)
                    {
                        this.activity.lat =  lat;
                        this.activity.lon = lon;
                        if(status != null && status === "active")
                        {
                            this.activity.isActive = true;
                            if(startActivity != null && startActivity !== "")
                            {
                                this.activity.date = startActivity;
                            } else {
                                throw new Error("Activity does not have a start date ["+startActivity+"]! Discarding...");
                            }
                        } else {
                            this.activity.isActive = false;
                            throw new Error("Activity is no longer active ["+status+"]! Discarding...");
                        }
                    } else {
                        throw new Error("Activity does not have the correct GEO Location values ["+geo+"]! Discarding...");
                    }
                    
                } else {
                    this.activity.isOutside = false;
                    throw new Error("Activity is not outside ["+participationModes+"]! Ignoring getting the weather forecast...");
                }
                
            } else {
                    this.activity.isOutside = false;
                    throw new Error("Activity does not have any participation mode! Discarding...");
                }
            
        } else{
            throw new Error("More than one Activity was selected with the objectID " + this.activity.objectID);
        }
        
        return this.activity;
    }   
}
