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

/**
 * 
 * @export
 * @enum {string}
 */
export enum ImageQuery {
    Icon = 'Icon',
    Banner = 'Banner'
}

export function ImageQueryFromJSON(json: any): ImageQuery {
    return ImageQueryFromJSONTyped(json, false);
}

export function ImageQueryFromJSONTyped(json: any, ignoreDiscriminator: boolean): ImageQuery {
    return json as ImageQuery;
}

export function ImageQueryToJSON(value?: ImageQuery | null): any {
    return value as any;
}
