/* tslint:disable: no-console */
import { jIO } from 'jio';
import { ClearRoad, ValidationStates, dateToISO } from './clearroad';
import { postData } from './definitions/interfaces';
import { PortalTypes } from './message-types';
import * as definitions from './definitions';
import { getQueue } from './queue';

const url = '//fake-url';

class FakeJio {
  put() {}
  allDocs() {}
  repair() {}
  getAttachment() {}
  allAttachments() {}
}

describe('dateToISO', () => {
  it('should remove the milliseconds of ISO date', () => {
    const date = new Date(2018, 0, 1, 0, 0, 0);
    expect(dateToISO(date)).toEqual('2018-01-01T00:00:00Z');
  });
});

describe('ClearRoad', () => {
  beforeEach(() => {
    spyOn(jIO, 'createJIO').and.returnValue(new FakeJio());
  });

  describe('constructor', () => {
    it('should init a messages storage', () => {
      const cr = new ClearRoad(url);
      expect((cr as any).messagesStorage != undefined).toEqual(true);
    });

    it('should init a ingestionReport storage', () => {
      const cr = new ClearRoad(url);
      expect((cr as any).ingestionReportStorage != undefined).toEqual(true);
    });

    it('should init a directory storage', () => {
      const cr = new ClearRoad(url);
      expect((cr as any).directoryStorage != undefined).toEqual(true);
    });

    it('should init a report storage', () => {
      const cr = new ClearRoad(url);
      expect((cr as any).reportStorage != undefined).toEqual(true);
    });

    it('should defaul to local storage', () => {
      const cr = new ClearRoad(url);
      expect((cr as any).useLocalStorage).toEqual(true);
    });
  });

  describe('.queryMinDate', () => {
    let cr;
    let minDate: Date;

    beforeEach(() => {
      cr = new ClearRoad(url);
      minDate = new Date();
    });

    describe('with a minDate', () => {
      beforeEach(() => {
        cr.options = {minDate};
      });

      it('should return a subquery', () => {
        expect(cr.queryMinDate()).toEqual(`modification_date: >= "${minDate.toJSON()}"`);
      });
    });

    describe('without a minDate', () => {
      beforeEach(() => {
        cr.options = {};
      });

      it('should return an empty string', () => {
        expect(cr.queryMinDate()).toEqual('');
      });
    });
  });

  describe('.localSubStorage', () => {
    let cr;
    const reference = 'reference';

    beforeEach(() => {
      cr = new ClearRoad(url);
      cr.options = {
        localStorage: {}
      };
    });

    describe('using "dropbox"', () => {
      beforeEach(() => {
        cr.localStorageType = 'dropbox';
      });

      it('should surround with a query storage', () => {
        expect(cr.localSubStorage(reference)).toEqual({
          type: 'mapping',
          sub_storage: {
            type: 'query',
            sub_storage: {}
          },
          mapping_dict: {
            portal_type: ['equalSubProperty', reference]
          }
        });
      });
    });

    describe('using "indexeddb"', () => {
      beforeEach(() => {
        cr.localStorageType = 'indexeddb';
      });

      it('should surround with a query storage', () => {
        expect(cr.localSubStorage(reference)).toEqual({
          type: 'query',
          sub_storage: {
            type: 'indexeddb',
            database: 'clearroad'
          }
        });
      });
    });

    describe('using "memory"', () => {
      beforeEach(() => {
        cr.localStorageType = 'memory';
      });

      it('should surround with a query storage', () => {
        expect(cr.localSubStorage(reference)).toEqual({
          type: 'query',
          sub_storage: {
            type: 'memory'
          }
        });
      });
    });

    describe('using any other storage', () => {
      beforeEach(() => {
        cr.localStorageType = 'storage';
      });

      it('should return the config', () => {
        expect(cr.localSubStorage(reference)).toEqual({});
      });

      describe('force using query storage', () => {
        beforeEach(() => {
          cr.options.useQueryStorage = true;
        });

        it('should return the config', () => {
          expect(cr.localSubStorage(reference)).toEqual({
            type: 'query',
            sub_storage: {}
          });
        });
      });
    });
  });

  describe('.signatureSubStorage', () => {
    let cr;
    const database = 'database';

    beforeEach(() => {
      cr = new ClearRoad(url);
      cr.options = {
        localStorage: {}
      };
    });

    describe('using "dropbox"', () => {
      beforeEach(() => {
        cr.localStorageType = 'dropbox';
      });

      it('should surround with a query storage', () => {
        expect(cr.signatureSubStorage(database)).toEqual({
          type: 'query',
          sub_storage: {
            type: 'memory'
          }
        });
      });
    });

    describe('using "indexeddb"', () => {
      beforeEach(() => {
        cr.localStorageType = 'indexeddb';
      });

      it('should surround with a query storage', () => {
        expect(cr.signatureSubStorage(database)).toEqual({
          type: 'query',
          sub_storage: {
            type: 'indexeddb',
            database
          }
        });
      });
    });

    describe('using any other storage', () => {
      beforeEach(() => {
        cr.localStorageType = 'storage';
      });

      it('should set the database', () => {
        expect(cr.signatureSubStorage(database)).toEqual({
          database
        });
      });

      describe('force using query storage', () => {
        beforeEach(() => {
          cr.options.useQueryStorage = true;
        });

        it('should return the config', () => {
          expect(cr.signatureSubStorage(database)).toEqual({
            type: 'query',
            sub_storage: {
              database
            }
          });
        });
      });
    });
  });

  describe('.post', () => {
    let cr: ClearRoad;
    let putSpy: jasmine.Spy;

    beforeEach(() => {
      cr = new ClearRoad(url);
      putSpy = spyOn((cr as any).messagesStorage, 'put').and.callFake((_id, data) => data);
    });

    it('should validate message', async () => {
      spyOn(definitions, 'validateDefinition');
      await cr.post({
        portal_type: PortalTypes.RoadAccountMessage
      } as any);
      expect(definitions.validateDefinition).toHaveBeenCalled();
    });

    describe('missing portal_type', () => {
      it('should throw an error', async () => {
        try {
          await cr.post({} as any);
          expect(true).toBeFalsy();
        }
        catch (err) {
          expect(err).toEqual(new Error('portal_type: "undefined" not found'));
        }
      });
    });

    describe(PortalTypes.RoadAccountMessage, () => {
      it('should put a message', async () => {
        const options: postData = {
          portal_type: PortalTypes.RoadAccountMessage,
          account_manager: 'testamref',
          data_collector: 'testmpref',
          condition: 'test-stc-1',
          cert_id: '1051',
          account_reference: 'USER000011',
          effective_date: '2017-01-02T14:21:20Z',
          fuel_consumption: '12.0',
          fuel_taxable: '1',
          obu_reference: '977298026d50a5b1795c6563',
          vehicle_reference: '2C1MR2295T6789740',
          product_line: 'ruc_metrics'
        };
        const data: any = await cr.post(options);
        expect(data.parent_relative_url).toEqual('road_account_message_module');
        expect(putSpy).toHaveBeenCalled();
      });
    });

    describe(PortalTypes.RoadEventMessage, () => {
      it('should put a message', async () => {
        const options: postData = {
          portal_type: PortalTypes.RoadEventMessage,
          request: {
            vehicle_reference: '1GTG6BE38F1262119',
            obu_reference: '977298026d50a5b1795c6563',
            event_details: [{
              type: 12,
              date: '2018-01-04T00:00:00Z'
            }, {
              type: 5,
              date: '2018-01-03T00:00:00Z'
            }]
          }
        };
        const data: any = await cr.post(options);
        expect(data.parent_relative_url).toEqual('road_event_message_module');
        expect(typeof data.request).toEqual('string');
        expect(putSpy).toHaveBeenCalled();
      });
    });

    describe(PortalTypes.RoadMessage, () => {
      it('should put a message', async () => {
        const options: postData = {
          portal_type: PortalTypes.RoadMessage,
          request: {
            description: 'Mileage data',
            vehicle_reference: '1GTG6BE38F1262119',
            obu_reference: '977298026d50a5b1795c6563',
            type: 'MRP',
            transaction_date: '2018-05-03T00:00:00Z',
            mileage_details: [{
              fuel_price: -0.3,
              fuel_quantity: 0.14,
              miles_price: 0.015,
              miles_quantity: 3.7,
              rule_id: 41,
              sub_rule_id: 1
            }, {
              fuel_quantity: 0.07,
              miles_quantity: 2,
              rule_id: 0,
              sub_rule_id: 1
            }]
          }
        };
        const data: any = await cr.post(options);
        expect(data.parent_relative_url).toEqual('road_message_module');
        expect(typeof data.request).toEqual('string');
        expect(putSpy).toHaveBeenCalled();
      });
    });

    describe(PortalTypes.BillingPeriodMessage, () => {
      it('should put a message', async () => {
        const options: postData = {
          portal_type: PortalTypes.BillingPeriodMessage,
          reference: '2018Q1',
          start_date: '2018-01-01T00:00:00Z',
          stop_date: '2018-04-01T00:00:00Z'
        };
        const data: any = await cr.post(options);
        expect(data.parent_relative_url).toEqual('billing_period_message_module');
        expect(putSpy).toHaveBeenCalled();
      });
    });

    describe(PortalTypes.RoadReportRequest, () => {
      it('should put a message', async () => {
        const options: postData = {
          portal_type: PortalTypes.RoadReportRequest,
          report_type: 'AccountBalance',
          billing_period_reference: '2018Q1',
          request_date: '2018-07-13T00:00:00Z'
        };
        const data: any = await cr.post(options);
        expect(data.parent_relative_url).toEqual('road_report_request_module');
        expect(putSpy).toHaveBeenCalled();
      });
    });
  });

  describe('.state', () => {
    let cr: ClearRoad;
    const id = 'id';
    const state = ValidationStates.Rejected;

    beforeEach(() => {
      cr = new ClearRoad(url);
    });

    describe('no document found', () => {
      beforeEach(() => {
        spyOn(cr, 'allDocs').and.returnValue({
          push: callback => callback({data: {rows: []}})
        });
      });

      it('should return not synced state', async () => {
        expect(await cr.state(id)).toEqual(ValidationStates.Unprocessed);
      });
    });

    describe('document found', () => {
      beforeEach(() => {
        spyOn(cr, 'allDocs').and.returnValue({
          push: callback => callback({data: {rows: [{value: {state}}]}})
        });
      });

      it('should return the state', async () => {
        expect(await cr.state(id)).toEqual(state);
      });
    });
  });

  describe('.sync', () => {
    let cr: ClearRoad;
    let repairSpy: jasmine.Spy;

    beforeEach(() => {
      cr = new ClearRoad(url);
      repairSpy = spyOn((cr as any).messagesStorage, 'repair').and.returnValue({
        push: callback => callback()
      });
    });

    it('should repair all storages', async () => {
      await cr.sync();
      expect(repairSpy.calls.count()).toEqual(4);
    });

    describe('progress', () => {
      it('should call progress for all storages', async () => {
        const progressSpy = jasmine.createSpy();
        await cr.sync(progressSpy);
        expect(progressSpy.calls.count()).toEqual(4);
      });
    });
  });

  describe('.queryByState', () => {
    let cr: ClearRoad;
    const document = {
      id: 'id1',
      value: {
        portal_type: 'type'
      }
    };

    beforeEach(() => {
      cr = new ClearRoad(url);
    });

    describe(ValidationStates.Unprocessed, () => {
      beforeEach(() => {
        spyOn(cr, 'allDocs').and.callFake(params => {
          // first query
          if (params.query === 'grouping_reference: "data"') {
            return getQueue().push(() => ({data: {rows: [document, {
              id: 'id2',
              value: {
                portal_type: 'type'
              }
            }]}}));
          }
          else if (params.query === 'grouping_reference: "report" AND source_reference: "id1"') {
            return getQueue().push(() => ({data: {rows: []}}));
          }

          return getQueue().push(() => ({data: {rows: [{id: 'id3'}]}}));
        });
      });

      it('should return the messages', async () => {
        const results = await cr.queryByState(ValidationStates.Unprocessed);
        expect(results.data.rows).toEqual([document]);
      });
    });

    describe(ValidationStates.Processed, () => {
      beforeEach(() => {
        spyOn(cr, 'allDocs').and.returnValue(getQueue().push(() => ({data: {rows: [{
          id: 'id2',
          value: {
            portal_type: document.value.portal_type,
            source_reference: document.id
          }
        }]}})));
      });

      it('should return the messages', async () => {
        const results = await cr.queryByState(ValidationStates.Processed);
        expect(results.data.rows).toEqual([document]);
      });
    });
  });

  describe('.allDocs', () => {
    let cr: ClearRoad;
    let querySpy: jasmine.Spy;

    beforeEach(() => {
      cr = new ClearRoad(url);
      querySpy = spyOn((cr as any).messagesStorage, 'allDocs').and.callFake(options => options);
    });

    it('should query the messages', async () => {
      await cr.allDocs({
        query: ''
      });
      expect(querySpy).toHaveBeenCalled();
    });
  });

  describe('.getReport', () => {
    let cr: ClearRoad;
    let getAttachmentSpy: jasmine.Spy;
    let allAttachmentsSpy: jasmine.Spy;
    const id = 'reportId';

    beforeEach(() => {
      cr = new ClearRoad(url);
      spyOn(jIO.util, 'readBlobAsText').and.returnValue({
        target: {result: '{}'}
      });
      allAttachmentsSpy = spyOn((cr as any).reportStorage, 'allAttachments').and.returnValue({});
    });

    describe('getAttachment success', () => {
      beforeEach(() => {
        getAttachmentSpy = spyOn((cr as any).reportStorage, 'getAttachment').and.returnValue({});
      });

      it('should get the report', async () => {
        await cr.getReport(id);
        expect(allAttachmentsSpy).not.toHaveBeenCalledWith(id);
      });
    });

    describe('getAttachment fails', () => {
      beforeEach(() => {
        getAttachmentSpy = spyOn((cr as any).reportStorage, 'getAttachment').and.callFake(() => {
          throw new Error('undefined');
        });
      });

      it('should get the report', async () => {
        await cr.getReport(id);
        expect(getAttachmentSpy).toHaveBeenCalledWith(id, 'data');
      });
    });
  });

  describe('.getReportFromRequest', () => {
    let cr: ClearRoad;
    let getReportSpy: jasmine.Spy;
    const id = 'reportId';
    const result: any = {
      data: {}
    };

    beforeEach(() => {
      cr = new ClearRoad(url);
      spyOn(cr, 'allDocs').and.returnValue({
        push: (callback) => callback(result)
      });
      getReportSpy = spyOn(cr, 'getReport').and.returnValue({});
    });

    describe('when the report exists', () => {
      beforeEach(() => {
        result.data.rows = [{
          value: {
            source_reference: id,
            reference: 'reference'
          }
        }];
      });

      it('should get the report', async () => {
        await cr.getReportFromRequest(id);
        expect(getReportSpy).toHaveBeenCalledWith('reference');
      });
    });

    describe('when the report does not exist', () => {
      beforeEach(() => {
        result.data.rows = [];
      });

      it('should get the report', async () => {
        const res = await cr.getReportFromRequest(id);
        expect(getReportSpy).not.toHaveBeenCalled();
        expect(res).toBeNull();
      });
    });
  });
});
