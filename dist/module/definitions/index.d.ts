import { portalType } from '../message-types';
export declare type definitionPropertyType = 'object' | 'array' | 'string' | 'integer' | 'number';
export interface IDefinitionProperty {
    $id?: string;
    type?: definitionPropertyType;
    $ref?: string;
    $comment?: string;
    description?: string;
    title?: string;
}
export interface IDefinitionNumber extends IDefinitionProperty {
    type: 'integer' | 'number';
    default?: number;
    examples?: number[];
}
export interface IDefinitionString extends IDefinitionProperty {
    type: 'string';
    default?: string;
    enum?: string[];
    examples?: string[];
    pattern?: string;
}
export interface IDefinitionObject extends IDefinitionProperty {
    type: 'object';
    properties: IDefinitionProperties;
    required?: string[];
}
export interface IDefinitionArray extends IDefinitionProperty {
    type: 'array';
    items: IDefinitionObject;
}
export interface IDefinitionProperties {
    [key: string]: IDefinitionObject | IDefinitionArray | IDefinitionString | IDefinitionNumber | IDefinitionProperty;
}
export interface IDefinition extends IDefinitionObject {
    $id?: string;
    definitions?: IDefinitionProperties;
    $schema: string;
}
export interface IPostData {
    portal_type: portalType;
}
export declare const validateDefinition: (type: portalType, data: any) => any;
