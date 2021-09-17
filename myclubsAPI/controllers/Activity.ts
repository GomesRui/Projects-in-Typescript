import { String128 } from "aws-sdk/clients/acmpca";

export default class Activity{
    private _objectID: string;
    public get objectID(): string {
        return this._objectID;
    }
    public set objectID(value: string) {
        this._objectID = value;
    }
    private _name: string;
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    private _isActive: boolean;
    public get isActive(): boolean {
        return this._isActive;
    }
    public set isActive(value: boolean) {
        this._isActive = value;
    }
    private _isOutside: boolean;
    public get isOutside(): boolean {
        return this._isOutside;
    }
    public set isOutside(value: boolean) {
        this._isOutside = value;
    }
    
    private _date: string;
    public get date(): string {
        return this._date;
    }
    public set date(value: string) {
        this._date = value;
    }
    private _weatherForecast: string;
    public get weatherForecast(): string {
        return this._weatherForecast;
    }
    public set weatherForecast(value: string) {
        this._weatherForecast = value;
    }
    private _lat: number;
    public get lat(): number {
        return this._lat;
    }
    public set lat(value: number) {
        this._lat = value;
    }
    private _lon: number;
    public get lon(): number {
        return this._lon;
    }
    public set lon(value: number) {
        this._lon = value;
    }

    constructor(objectID: string, lat?: number, lon?: number, name?: string, date?: string, isActive?: boolean, isOutside?: boolean, weatherForecast?: string)
    {
        this.objectID = objectID != null ? objectID : undefined;
        this.date = date != null ? date : undefined;
        this.weatherForecast = weatherForecast != null ? weatherForecast : undefined;
        this.name = name != null ? name : undefined;
        this.isActive = isActive != null ? isActive : false;
        this.isOutside = isOutside != null ? isOutside : false;
        this.lat = lat != null ? lat : undefined;
        this.lon = lon != null ? lon : undefined;
    }

}