import { IDefinition, IPostData } from './index';
import { PortalTypes } from '../message-types';
const json: IDefinition = {
  type: 'object',
  definitions: {
    datetime: {
      pattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2}T ?[0-9]{2}:[0-9]{2}:[0-9]{2}(Z|[+-][0-9]{4})?$',
      type: 'string',
      examples: [
        '2018-05-01T00:00:00Z'
      ]
    }
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  required: [
    'data_collector',
    'account_manager',
    'vehicle_reference',
    'odometer_reading',
    'effective_date',
    'portal_type'
  ],
  properties: {
    data_collector: {
      type: 'string',
      description: 'The name of the entity which was used to provide the odometer data. Usually, it is the data collector.',
      examples: [
        'testmpref'
      ]
    },
    account_manager: {
      type: 'string',
      description: 'The name of the entity which provided the odometer data. Usually it is the account manager',
      examples: [
        'testamref'
      ]
    },
    message_verification: {
      type: 'string',
      description: 'The legislation could require that, from time to time, a special agent verifies the correctness of the message. This field is reserved for the identifier of the verifier, if the verification took place.'
    },
    vehicle_reference: {
      type: 'string',
      description: 'The Vehicle Identification Number (VIN) of the vehicle whose odometer is being reported.',
      examples: [
        '1GTG6BE38F1262119'
      ]
    },
    odometer_reading: {
      description: 'Value of Odometer Reading',
      type: 'number',
      examples: [
        456
      ]
    },
    effective_date: {
      $ref: '#/definitions/datetime',
      description: 'Timestamp when the odometer reading was captured.'
    },
    portal_type: {
      type: 'string',
      description: 'The type of the message in the ClearRoad Platform. Only one value is possible.',
      default: 'Odometer Reading Message',
      enum: [
        'Odometer Reading Message'
      ],
      examples: [
        'Odometer Reading Message'
      ]
    }
  }
};
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
