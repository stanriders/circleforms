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
export enum PostFilter {
    Both = 'Both',
    Active = 'Active',
    Inactive = 'Inactive'
}

export function PostFilterFromJSON(json: any): PostFilter {
    return PostFilterFromJSONTyped(json, false);
}

export function PostFilterFromJSONTyped(json: any, ignoreDiscriminator: boolean): PostFilter {
    return json as PostFilter;
}

export function PostFilterToJSON(value?: PostFilter | null): any {
    return value as any;
}

