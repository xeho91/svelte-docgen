/**
 * @import { BaseDocumentation } from "./shared.js";
 */

/**
 * @typedef OptionalProp
 * @prop {true} isOptional
 * @prop {string} default
 */

/**
 * @typedef RequiredProp
 * @prop {false} isOptional
 * @prop {never} default
 */

/**
 * @typedef BasePropDocumentation
 * @prop {boolean} isBindable
 * @prop {boolean} isSnippet
 * @prop {boolean} isEventHandler
 */

/**
 * @typedef {BaseDocumentation & BasePropDocumentation & (RequiredProp | OptionalProp)} PropDocumentation
 */

export {};
