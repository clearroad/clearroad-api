import { IDefinition, IPostData } from './index';
import { PortalTypes } from '../message-types';
declare const json: IDefinition;
export default json;
export interface IPostOdometerReadingMessage extends IPostData {
    portal_type: PortalTypes.OdometerReadingMessage;
    /**
     * The name of the entity which was used to provide the odometer data. Usually, it is the data collector.
     * @example 'testmpref'
     */
    data_collector: string;
    /**
     * The name of the entity which provided the odometer data. Usually it is the account manager
     * @example 'testamref'
     */
    account_manager: string;
    /**
     * The legislation could require that, from time to time, a special agent verifies the correctness of the message. This field is reserved for the identifier of the verifier, if the verification took place.
     */
    message_verification?: string;
    /**
     * The Vehicle Identification Number (VIN) of the vehicle whose odometer is being reported.
     * @example '1GTG6BE38F1262119'
     */
    vehicle_reference: string;
    /**
     * Value of Odometer Reading
     * @example 456
     */
    odometer_reading: number;
    /**
     * Timestamp when the odometer reading was captured.
     * @example '2018-05-01T00:00:00Z'
     */
    effective_date: string;
}
