/* tslint:disable */
/* eslint-disable */
/**
 * CircleForms
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 * 
 * @export
 * @enum {string}
 */
export enum Gamemode {
    None = 'None',
    Osu = 'Osu',
    Taiko = 'Taiko',
    Fruits = 'Fruits',
    Mania = 'Mania'
}

export function GamemodeFromJSON(json: any): Gamemode {
    return GamemodeFromJSONTyped(json, false);
}

export function GamemodeFromJSONTyped(json: any, ignoreDiscriminator: boolean): Gamemode {
    return json as Gamemode;
}

export function GamemodeToJSON(value?: Gamemode | null): any {
    return value as any;
}

