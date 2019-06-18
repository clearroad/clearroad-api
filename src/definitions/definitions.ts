import { portalType } from '../message-types';
import { IDefinition } from './index';

import billingPeriodMessage from './billing-period-message';
import odometerReadingMessage from './odometer-reading-message';
import roadAccountMessage from './road-account-message';
import roadEventMessage from './road-event-message';
import roadMessage from './road-message';
import roadReportRequest from './road-report-request';

export const definitions: {
  [type in portalType]: IDefinition;
} = {
  'Billing Period Message': billingPeriodMessage,
  'Odometer Reading Message': odometerReadingMessage,
  'Road Account Message': roadAccountMessage,
  'Road Event Message': roadEventMessage,
  'Road Message': roadMessage,
  'Road Report Request': roadReportRequest
};
