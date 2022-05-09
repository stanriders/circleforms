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
export enum Accessibility {
    Public = 'Public',
    Link = 'Link',
    FriendsOnly = 'FriendsOnly',
    Whitelist = 'Whitelist'
}

export function AccessibilityFromJSON(json: any): Accessibility {
    return AccessibilityFromJSONTyped(json, false);
}

export function AccessibilityFromJSONTyped(json: any, ignoreDiscriminator: boolean): Accessibility {
    return json as Accessibility;
}

export function AccessibilityToJSON(value?: Accessibility | null): any {
    return value as any;
}

