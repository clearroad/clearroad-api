import { IDefinition, PortalTypes, IPostData } from './index';
declare const json: IDefinition;
export default json;
export interface IPostBillingPeriodMessage extends IPostData {
    portal_type: PortalTypes.BillingPeriodMessage;
    /**
     * The reference given to the new billing period which will be used to reference it in the future.
     * @example '2018Q1'
     */
    reference: string;
    /**
     * The date, starting which, the billing period is going to be active. Should be in UTC.
     * @example '2018-04-01T00:00:00Z'
     */
    start_date: string;
    /**
     * The date, starting which, the billing period will become inactive. Should be UTC. If it is left empty, the billing period will never turn inactive, once activated.
     * @example '2018-04-01T00:00:00Z'
     */
    stop_date: string;
}
