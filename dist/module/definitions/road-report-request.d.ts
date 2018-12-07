import { IDefinition, PortalTypes, IPostData } from './index';
declare const json: IDefinition;
export default json;
export interface IPostRoadReportRequest extends IPostData {
    portal_type: PortalTypes.RoadReportRequest;
    /**
     * The type of the requested report.
     * @example 'AccountBalance'
     */
    report_type: string;
    /**
     * The reference of the billing period. The billing period should already exist in the ClearRoad Platform.
     * @example '2018Q1'
     */
    billing_period_reference: string;
    /**
     * The datetime for which the request is made. Should be in UTC.
     * @example '2017-07-18T00:00:00Z'
     */
    request_date: string;
    /**
     * Used to give specific parameters to report if needed. This filed could be left empty for an AccountBalance report.
     */
    request?: string;
}
