import { IDefinition, PortalTypes, IPostData } from './index';
declare const json: IDefinition;
export default json;
export interface IPostRoadMessage extends IPostData {
    portal_type: PortalTypes.RoadMessage;
    request: {
        /**
         * The description of the reported mileage
         * @example 'Mileage data'
         */
        description: string;
        /**
         * The Vehicle Identification Number of the vehicle for which the message is reported.
         * @example '1GTG6BE38F1262119'
         */
        vehicle_reference: string;
        /**
         * The On Board Unit reference of the device for which the message is reported
         * @example '977298026d50a5b1795c6563'
         */
        obu_reference: string;
        /**
         * A value to indicate the type of message.
         * @example 'MRP'
         */
        type: string;
        /**
         * The date at which mileage was traveled. Should be in UTC.
         * @example '2018-04-01T00:00:00Z'
         */
        transaction_date: string;
        mileage_details: Array<{
            /**
             * The price of the fuel consumed at the transaction date.
             * @example -0.30000001192092896
             */
            fuel_price?: number;
            /**
             * The quantity of fuel consumed at the transaction date.
             * @example 0.14000000059604645
             */
            fuel_quantity: number;
            /**
             * The price of miles traveled.
             * @example 0.014999999664723873
             */
            miles_price?: number;
            /**
             * The number of miles traveled.
             * @example 3.700000047683716
             */
            miles_quantity: number;
            /**
             * An identifier associated with a geographic area, or zone, in which a specific rate per mile will be assessed for miles traveled.  FIPS codes are used to identify states.
             * @example 41
             */
            rule_id: number;
            /**
             * 0 if the travel was on public roads, 1 if it was on private roads
             * @example 1
             */
            sub_rule_id: number;
        }>;
    };
}
