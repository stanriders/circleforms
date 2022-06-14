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

import { exists, mapValues } from "../runtime";
import {
  PostContract,
  PostContractFromJSON,
  PostContractFromJSONTyped,
  PostContractToJSON
} from "./PostContract";
import {
  Submission,
  SubmissionFromJSON,
  SubmissionFromJSONTyped,
  SubmissionToJSON
} from "./Submission";

/**
 *
 * @export
 * @interface AnswerPostContract
 */
export interface AnswerPostContract {
  /**
   *
   * @type {Array<Submission>}
   * @memberof AnswerPostContract
   */
  answer?: Array<Submission> | null;
  /**
   *
   * @type {PostContract}
   * @memberof AnswerPostContract
   */
  post?: PostContract;
}

export function AnswerPostContractFromJSON(json: any): AnswerPostContract {
  return AnswerPostContractFromJSONTyped(json, false);
}

export function AnswerPostContractFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): AnswerPostContract {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    answer: !exists(json, "answer")
      ? undefined
      : json["answer"] === null
      ? null
      : (json["answer"] as Array<any>).map(SubmissionFromJSON),
    post: !exists(json, "post") ? undefined : PostContractFromJSON(json["post"])
  };
}

export function AnswerPostContractToJSON(value?: AnswerPostContract | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    answer:
      value.answer === undefined
        ? undefined
        : value.answer === null
        ? null
        : (value.answer as Array<any>).map(SubmissionToJSON),
    post: PostContractToJSON(value.post)
  };
}
