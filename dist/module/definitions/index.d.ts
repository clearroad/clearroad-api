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
/**
 * Each message is represented by a "portal_type" (or message category)
 */
export declare enum PortalTypes {
    BillingPeriodMessage = "Billing Period Message",
    File = "File",
    RoadAccount = "Road Account",
    RoadAccountMessage = "Road Account Message",
    RoadEvent = "Road Event",
    RoadEventMessage = "Road Event Message",
    RoadMessage = "Road Message",
    RoadReportRequest = "Road Report Request",
    RoadTransaction = "Road Transaction"
}
export interface IPostData {
    portal_type: portalType;
}
export declare const validateDefinition: (type: portalType, data: any) => any;
