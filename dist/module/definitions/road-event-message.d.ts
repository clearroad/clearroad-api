import { IDefinition, PortalTypes, IPostData } from './index';
declare const json: IDefinition;
export default json;
export interface IPostRoadEventMessage extends IPostData {
    portal_type: PortalTypes.RoadEventMessage;
    request: {
        /**
         * The Vehicle Identification Number of the road account registration for which the event is reported
         * @example '1GTG6BE38F1262119'
         */
        vehicle_reference: string;
        /**
         * The On Board Unit reference of the road account registration for which the event is reported
         * @example '977298026d50a5b1795c6563'
         */
        obu_reference: string;
        /**
         * The details of the event that is reported.
         */
        event_details: Array<{
            /**
             * The ID of the event. Every type has it own ID.
             * @example 12
             */
            type: number;
            /**
             * The datetime of the event. Should be a UTC time.
             * @example '2018-04-01T00:00:00Z'
             */
            date: string;
        }>;
    };
}
