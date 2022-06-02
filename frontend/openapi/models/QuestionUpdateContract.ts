// @ts-nocheck
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
    QuestionType,
    QuestionTypeFromJSON,
    QuestionTypeFromJSONTyped,
    QuestionTypeToJSON,
} from './QuestionType';

/**
 * 
 * @export
 * @interface QuestionUpdateContract
 */
export interface QuestionUpdateContract {
    /**
     * 
     * @type {string}
     * @memberof QuestionUpdateContract
     */
    questionId?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof QuestionUpdateContract
     */
    _delete?: boolean;
    /**
     * 
     * @type {number}
     * @memberof QuestionUpdateContract
     */
    order?: number;
    /**
     * 
     * @type {QuestionType}
     * @memberof QuestionUpdateContract
     */
    type?: QuestionType;
    /**
     * 
     * @type {string}
     * @memberof QuestionUpdateContract
     */
    title?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof QuestionUpdateContract
     */
    isOptional?: boolean;
    /**
     * 
     * @type {Array<string>}
     * @memberof QuestionUpdateContract
     */
    questionInfo?: Array<string> | null;
}

export function QuestionUpdateContractFromJSON(json: any): QuestionUpdateContract {
    return QuestionUpdateContractFromJSONTyped(json, false);
}

export function QuestionUpdateContractFromJSONTyped(json: any, ignoreDiscriminator: boolean): QuestionUpdateContract {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'questionId': !exists(json, 'question_id') ? undefined : json['question_id'],
        '_delete': !exists(json, 'delete') ? undefined : json['delete'],
        'order': !exists(json, 'order') ? undefined : json['order'],
        'type': !exists(json, 'type') ? undefined : QuestionTypeFromJSON(json['type']),
        'title': !exists(json, 'title') ? undefined : json['title'],
        'isOptional': !exists(json, 'is_optional') ? undefined : json['is_optional'],
        'questionInfo': !exists(json, 'question_info') ? undefined : json['question_info'],
    };
}

export function QuestionUpdateContractToJSON(value?: QuestionUpdateContract | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'question_id': value.questionId,
        'delete': value._delete,
        'order': value.order,
        'type': QuestionTypeToJSON(value.type),
        'title': value.title,
        'is_optional': value.isOptional,
        'question_info': value.questionInfo,
    };
}
