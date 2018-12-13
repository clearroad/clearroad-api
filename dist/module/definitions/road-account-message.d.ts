import { IDefinition, IPostData } from './index';
import { PortalTypes } from '../message-types';
declare const json: IDefinition;
export default json;
export interface IPostRoadAccountMessage extends IPostData {
    portal_type: PortalTypes.RoadAccountMessage;
    /**
     * The reference of an account manager that already exists in ClearRoad Platform.
     * @example 'testamref'
     */
    account_manager?: string;
    /**
     * The reference should be of a data provider that already exists in ClearRoad Platform.
     * @example 'testmpref'
     */
    data_collector: string;
    /**
     * Sale Trade Condition to apply. The reference should be of an object that already exists in ClearRoad Platform.
     * @example 'test-stc-1'
     */
    condition: string;
    /**
     * The DOT certificate ID value
     * @example '1051'
     */
    cert_id: string;
    /**
     * The reference of the road account to be defined.
     * @example 'USER000011'
     */
    account_reference: string;
    /**
     * The start date of the customer account. Could not be left empty. Should be in UTC.
     * @example '2018-04-01T00:00:00Z'
     */
    effective_date: string;
    /**
     * The stop date of the customer account. Could be left empty - the road account will have no expiration date. Should be in UTC.
     * @example '2018-04-01T00:00:00Z'
     */
    expiration_date?: string;
    /**
     * Combined EPA Miles Per Gallon (MPG) rating for the vehicle.
     * @example '12.0'
     */
    fuel_consumption: string;
    /**
     * Boolean defining if customer is subject to taxable fuel.
     * @example '1'
     */
    fuel_taxable: string;
    /**
     * An object for this on board unit will be created in the ClearRoad platform if it is nor already present.
     * @example '977298026d50a5b1795c6563'
     */
    obu_reference?: string;
    /**
     * An onject for this vehicle will be created in the ClearRoad Platform if it is not already present.
     * @example '2C1MR2295T6789740'
     */
    vehicle_reference: string;
    /**
     * The reporting method the customer choosed to use.
     * @example 'ruc_metrics'
     */
    product_line: string;
}
