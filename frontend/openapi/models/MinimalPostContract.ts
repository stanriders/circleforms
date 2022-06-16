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
    Accessibility,
    AccessibilityFromJSON,
    AccessibilityFromJSONTyped,
    AccessibilityToJSON,
} from './Accessibility';
import {
    Gamemode,
    GamemodeFromJSON,
    GamemodeFromJSONTyped,
    GamemodeToJSON,
} from './Gamemode';
import {
    Limitations,
    LimitationsFromJSON,
    LimitationsFromJSONTyped,
    LimitationsToJSON,
} from './Limitations';

/**
 * 
 * @export
 * @interface MinimalPostContract
 */
export interface MinimalPostContract {
    /**
     * 
     * @type {string}
     * @memberof MinimalPostContract
     */
    id?: string | null;
    /**
     * 
     * @type {string}
     * @memberof MinimalPostContract
     */
    author_id?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof MinimalPostContract
     */
    is_active?: boolean;
    /**
     * 
     * @type {Date}
     * @memberof MinimalPostContract
     */
    active_to?: Date;
    /**
     * 
     * @type {string}
     * @memberof MinimalPostContract
     */
    icon?: string | null;
    /**
     * 
     * @type {string}
     * @memberof MinimalPostContract
     */
    banner?: string | null;
    /**
     * 
     * @type {string}
     * @memberof MinimalPostContract
     */
    title?: string | null;
    /**
     * 
     * @type {string}
     * @memberof MinimalPostContract
     */
    description?: string | null;
    /**
     * 
     * @type {string}
     * @memberof MinimalPostContract
     */
    excerpt?: string | null;
    /**
     * 
     * @type {Gamemode}
     * @memberof MinimalPostContract
     */
    gamemode?: Gamemode;
    /**
     * 
     * @type {boolean}
     * @memberof MinimalPostContract
     */
    published?: boolean;
    /**
     * 
     * @type {Date}
     * @memberof MinimalPostContract
     */
    publish_time?: Date | null;
    /**
     * 
     * @type {Accessibility}
     * @memberof MinimalPostContract
     */
    accessibility?: Accessibility;
    /**
     * 
     * @type {Limitations}
     * @memberof MinimalPostContract
     */
    limitations?: Limitations;
    /**
     * 
     * @type {number}
     * @memberof MinimalPostContract
     */
    answer_count?: number;
}

export function MinimalPostContractFromJSON(json: any): MinimalPostContract {
    return MinimalPostContractFromJSONTyped(json, false);
}

export function MinimalPostContractFromJSONTyped(json: any, ignoreDiscriminator: boolean): MinimalPostContract {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'author_id': !exists(json, 'author_id') ? undefined : json['author_id'],
        'is_active': !exists(json, 'is_active') ? undefined : json['is_active'],
        'active_to': !exists(json, 'active_to') ? undefined : (new Date(json['active_to'])),
        'icon': !exists(json, 'icon') ? undefined : json['icon'],
        'banner': !exists(json, 'banner') ? undefined : json['banner'],
        'title': !exists(json, 'title') ? undefined : json['title'],
        'description': !exists(json, 'description') ? undefined : json['description'],
        'excerpt': !exists(json, 'excerpt') ? undefined : json['excerpt'],
        'gamemode': !exists(json, 'gamemode') ? undefined : GamemodeFromJSON(json['gamemode']),
        'published': !exists(json, 'published') ? undefined : json['published'],
        'publish_time': !exists(json, 'publish_time') ? undefined : (json['publish_time'] === null ? null : new Date(json['publish_time'])),
        'accessibility': !exists(json, 'accessibility') ? undefined : AccessibilityFromJSON(json['accessibility']),
        'limitations': !exists(json, 'limitations') ? undefined : LimitationsFromJSON(json['limitations']),
        'answer_count': !exists(json, 'answer_count') ? undefined : json['answer_count'],
    };
}

export function MinimalPostContractToJSON(value?: MinimalPostContract | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'author_id': value.author_id,
        'is_active': value.is_active,
        'active_to': value.active_to === undefined ? undefined : (value.active_to.toISOString()),
        'icon': value.icon,
        'banner': value.banner,
        'title': value.title,
        'description': value.description,
        'excerpt': value.excerpt,
        'gamemode': GamemodeToJSON(value.gamemode),
        'published': value.published,
        'publish_time': value.publish_time === undefined ? undefined : (value.publish_time === null ? null : value.publish_time.toISOString()),
        'accessibility': AccessibilityToJSON(value.accessibility),
        'limitations': LimitationsToJSON(value.limitations),
        'answer_count': value.answer_count,
    };
}
