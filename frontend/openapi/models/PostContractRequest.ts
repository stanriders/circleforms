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
  Accessibility,
  AccessibilityFromJSON,
  AccessibilityFromJSONTyped,
  AccessibilityToJSON
} from "./Accessibility";
import { Gamemode, GamemodeFromJSON, GamemodeFromJSONTyped, GamemodeToJSON } from "./Gamemode";
import {
  Limitations,
  LimitationsFromJSON,
  LimitationsFromJSONTyped,
  LimitationsToJSON
} from "./Limitations";
import { Question, QuestionFromJSON, QuestionFromJSONTyped, QuestionToJSON } from "./Question";

/**
 *
 * @export
 * @interface PostContractRequest
 */
export interface PostContractRequest {
  /**
   *
   * @type {string}
   * @memberof PostContractRequest
   */
  title: string;
  /**
   *
   * @type {string}
   * @memberof PostContractRequest
   */
  description?: string | null;
  /**
   *
   * @type {string}
   * @memberof PostContractRequest
   */
  excerpt?: string | null;
  /**
   *
   * @type {Gamemode}
   * @memberof PostContractRequest
   */
  gamemode?: Gamemode;
  /**
   *
   * @type {Accessibility}
   * @memberof PostContractRequest
   */
  accessibility?: Accessibility;
  /**
   *
   * @type {Limitations}
   * @memberof PostContractRequest
   */
  limitations?: Limitations;
  /**
   *
   * @type {Date}
   * @memberof PostContractRequest
   */
  activeTo?: Date;
  /**
   *
   * @type {boolean}
   * @memberof PostContractRequest
   */
  allowAnswerEdit?: boolean;
  /**
   *
   * @type {Array<Question>}
   * @memberof PostContractRequest
   */
  questions: Array<Question>;
}

export function PostContractRequestFromJSON(json: any): PostContractRequest {
  return PostContractRequestFromJSONTyped(json, false);
}

export function PostContractRequestFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): PostContractRequest {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    title: json["title"],
    description: !exists(json, "description") ? undefined : json["description"],
    excerpt: !exists(json, "excerpt") ? undefined : json["excerpt"],
    gamemode: !exists(json, "gamemode") ? undefined : GamemodeFromJSON(json["gamemode"]),
    accessibility: !exists(json, "accessibility")
      ? undefined
      : AccessibilityFromJSON(json["accessibility"]),
    limitations: !exists(json, "limitations")
      ? undefined
      : LimitationsFromJSON(json["limitations"]),
    activeTo: !exists(json, "active_to") ? undefined : new Date(json["active_to"]),
    allowAnswerEdit: !exists(json, "allow_answer_edit") ? undefined : json["allow_answer_edit"],
    questions: (json["questions"] as Array<any>).map(QuestionFromJSON)
  };
}

export function PostContractRequestToJSON(value?: PostContractRequest | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    title: value.title,
    description: value.description,
    excerpt: value.excerpt,
    gamemode: GamemodeToJSON(value.gamemode),
    accessibility: AccessibilityToJSON(value.accessibility),
    limitations: LimitationsToJSON(value.limitations),
    active_to: value.activeTo === undefined ? undefined : value.activeTo.toISOString(),
    allow_answer_edit: value.allowAnswerEdit,
    questions: (value.questions as Array<any>).map(QuestionToJSON)
  };
}
