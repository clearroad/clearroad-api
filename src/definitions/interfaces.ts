import { IPostBillingPeriodMessage } from './billing-period-message';
export { IPostBillingPeriodMessage };
import { IPostOdometerReadingMessage } from './odometer-reading-message';
export { IPostOdometerReadingMessage };
import { IPostRoadAccountMessage } from './road-account-message';
export { IPostRoadAccountMessage };
import { IPostRoadEventMessage } from './road-event-message';
export { IPostRoadEventMessage };
import { IPostRoadMessage } from './road-message';
export { IPostRoadMessage };
import { IPostRoadReportRequest } from './road-report-request';
export { IPostRoadReportRequest };

export type postData = IPostBillingPeriodMessage |
  IPostOdometerReadingMessage |
  IPostRoadAccountMessage |
  IPostRoadEventMessage |
  IPostRoadMessage |
  IPostRoadReportRequest;
