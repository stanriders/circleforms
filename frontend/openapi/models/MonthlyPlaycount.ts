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
 * @interface MonthlyPlaycount
 */
export interface MonthlyPlaycount {
    /**
     * 
     * @type {Date}
     * @memberof MonthlyPlaycount
     */
    start_date?: Date;
    /**
     * 
     * @type {number}
     * @memberof MonthlyPlaycount
     */
    count?: number;
}

export function MonthlyPlaycountFromJSON(json: any): MonthlyPlaycount {
    return MonthlyPlaycountFromJSONTyped(json, false);
}

export function MonthlyPlaycountFromJSONTyped(json: any, ignoreDiscriminator: boolean): MonthlyPlaycount {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'start_date': !exists(json, 'start_date') ? undefined : (new Date(json['start_date'])),
        'count': !exists(json, 'count') ? undefined : json['count'],
    };
}

export function MonthlyPlaycountToJSON(value?: MonthlyPlaycount | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'start_date': value.start_date === undefined ? undefined : (value.start_date.toISOString()),
        'count': value.count,
    };
}
