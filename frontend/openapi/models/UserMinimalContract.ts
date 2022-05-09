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
 * @interface UserMinimalContract
 */
export interface UserMinimalContract {
    /**
     * 
     * @type {string}
     * @memberof UserMinimalContract
     */
    id?: string | null;
    /**
     * 
     * @type {string}
     * @memberof UserMinimalContract
     */
    avatarUrl?: string | null;
    /**
     * 
     * @type {string}
     * @memberof UserMinimalContract
     */
    discord?: string | null;
    /**
     * 
     * @type {string}
     * @memberof UserMinimalContract
     */
    username?: string | null;
}

export function UserMinimalContractFromJSON(json: any): UserMinimalContract {
    return UserMinimalContractFromJSONTyped(json, false);
}

export function UserMinimalContractFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserMinimalContract {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'avatarUrl': !exists(json, 'avatar_url') ? undefined : json['avatar_url'],
        'discord': !exists(json, 'discord') ? undefined : json['discord'],
        'username': !exists(json, 'username') ? undefined : json['username'],
    };
}

export function UserMinimalContractToJSON(value?: UserMinimalContract | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'avatar_url': value.avatarUrl,
        'discord': value.discord,
        'username': value.username,
    };
}

