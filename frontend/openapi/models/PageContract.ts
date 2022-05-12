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
import {
    MinimalPostContract,
    MinimalPostContractFromJSON,
    MinimalPostContractFromJSONTyped,
    MinimalPostContractToJSON,
} from './MinimalPostContract';
import {
    UserMinimalContract,
    UserMinimalContractFromJSON,
    UserMinimalContractFromJSONTyped,
    UserMinimalContractToJSON,
} from './UserMinimalContract';

/**
 * 
 * @export
 * @interface PageContract
 */
export interface PageContract {
    /**
     * 
     * @type {Array<UserMinimalContract>}
     * @memberof PageContract
     */
    users?: Array<UserMinimalContract> | null;
    /**
     * 
     * @type {Array<MinimalPostContract>}
     * @memberof PageContract
     */
    posts?: Array<MinimalPostContract> | null;
}

export function PageContractFromJSON(json: any): PageContract {
    return PageContractFromJSONTyped(json, false);
}

export function PageContractFromJSONTyped(json: any, ignoreDiscriminator: boolean): PageContract {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'users': !exists(json, 'users') ? undefined : (json['users'] === null ? null : (json['users'] as Array<any>).map(UserMinimalContractFromJSON)),
        'posts': !exists(json, 'posts') ? undefined : (json['posts'] === null ? null : (json['posts'] as Array<any>).map(MinimalPostContractFromJSON)),
    };
}

export function PageContractToJSON(value?: PageContract | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'users': value.users === undefined ? undefined : (value.users === null ? null : (value.users as Array<any>).map(UserMinimalContractToJSON)),
        'posts': value.posts === undefined ? undefined : (value.posts === null ? null : (value.posts as Array<any>).map(MinimalPostContractToJSON)),
    };
}
