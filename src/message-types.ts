/**
 * Each message is represented by a "portal_type" (or message category)
 */
export enum PortalTypes {
  BillingPeriodMessage = 'Billing Period Message',
  File = 'File',
  RoadAccount = 'Road Account',
  RoadAccountMessage = 'Road Account Message',
  RoadEvent = 'Road Event',
  RoadEventMessage = 'Road Event Message',
  RoadMessage = 'Road Message',
  RoadReportRequest = 'Road Report Request',
  RoadTransaction = 'Road Transaction'
}

export type portalType = 'Billing Period Message' |
  'Road Account Message' |
  'Road Event Message' |
  'Road Message' |
  'Road Report Request';
