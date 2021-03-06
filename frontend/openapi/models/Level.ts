// @ts-nocheck
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

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface Level
 */
export interface Level {
    /**
     * 
     * @type {number}
     * @memberof Level
     */
    current?: number;
    /**
     * 
     * @type {number}
     * @memberof Level
     */
    progress?: number;
}

export function LevelFromJSON(json: any): Level {
    return LevelFromJSONTyped(json, false);
}

export function LevelFromJSONTyped(json: any, ignoreDiscriminator: boolean): Level {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'current': !exists(json, 'current') ? undefined : json['current'],
        'progress': !exists(json, 'progress') ? undefined : json['progress'],
    };
}

export function LevelToJSON(value?: Level | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'current': value.current,
        'progress': value.progress,
    };
}
