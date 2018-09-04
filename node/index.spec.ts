import { expect } from 'chai';
import * as sinon from 'sinon';
import 'mocha';

const jioImport = require('./lib/jio.js');

import { ClearRoad } from './';

const url = '//fake-url';

let stubs: sinon.SinonStub[] = [];

class FakeJio {
  put() {}
  allDocs() {}
  repair() {}
  getAttachment() {}
}

describe('ClearRoad', () => {
  beforeEach(() => {
    stubs = [];
    stubs.push(sinon.stub(jioImport.jIO, 'createJIO').returns(new FakeJio()));
  });

  afterEach(() => {
    stubs.forEach(stub => stub.restore());
  });

  describe('constructor', () => {
    it('should init a messages storage', () => {
      const cr = new ClearRoad(url, null, {});
      expect((cr as any).messagesStorage != undefined).to.equal(true);
    });

    it('should init a ingestionReport storage', () => {
      const cr = new ClearRoad(url, null, {});
      expect((cr as any).ingestionReportStorage != undefined).to.equal(true);
    });

    it('should init a directory storage', () => {
      const cr = new ClearRoad(url, null, {});
      expect((cr as any).directoryStorage != undefined).to.equal(true);
    });

    it('should init a report storage', () => {
      const cr = new ClearRoad(url, null, {});
      expect((cr as any).reportStorage != undefined).to.equal(true);
    });
  });

  describe('.post', () => {
    let cr;
    let portalType;
    let putStub: sinon.SinonStub;

    beforeEach(() => {
      cr = new ClearRoad(url, null, {});
      putStub = sinon.stub((cr as any).messagesStorage, 'put').callsFake((_id, data) => data);
      stubs.push(putStub);
    });

    describe('road account', () => {
      beforeEach(() => {
        portalType = 'Road Account Message';
      });

      it('should put a message', async () => {
        const options = {
          portal_type: portalType,
          account_manager: 'testamref',
          data_collector: 'testmpref',
          condition: 'test-stc-1',
          cert_id: '1051',
          account_reference: 'USER000011',
          effective_date: '2017-01-02T14:21:20Z',
          expiration_date: '',
          fuel_consumption: '12.0',
          fuel_taxable: '1',
          obu_reference: '123456789MRDID',
          vehicle_reference: '2C1MR2295T6789740',
          product_line: 'ruc_metrics'
        };
        const data = await cr.post(options);
        expect(data.parent_relative_url).to.equal('road_account_message_module');
        expect(putStub.called).to.equal(true);
      });
    });

    describe('road event', () => {
      beforeEach(() => {
        portalType = 'Road Event Message';
      });

      it('should put a message', async () => {
        const options = {
          portal_type: portalType,
          request: JSON.stringify({
            vehicle_reference: '1GTG6BE38F1262119',
            obu_reference: '977298026d50a5b1795c6563',
            event_details: [{
              type: 12,
              date: '2018-01-04T00:00:00Z'
            }, {
              type: 5,
              date: '2018-01-03T00:00:00Z'
            }]
          })
        };
        const data = await cr.post(options);
        expect(data.parent_relative_url).to.equal('road_event_message_module');
        expect(putStub.called).to.equal(true);
      });
    });

    describe('road message', () => {
      beforeEach(() => {
        portalType = 'Road Message';
      });

      it('should put a message', async () => {
        const options = {
          portal_type: portalType,
          request: JSON.stringify({
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
          })
        };
        const data = await cr.post(options);
        expect(data.parent_relative_url).to.equal('road_message_module');
        expect(putStub.called).to.equal(true);
      });
    });

    describe('billing period', () => {
      beforeEach(() => {
        portalType = 'Billing Period Message';
      });

      it('should put a message', async () => {
        const options = {
          portal_type: portalType,
          reference: '2018Q1',
          start_date: '2018-01-01T00:00:00Z',
          stop_date: '2018-04-01T00:00:00Z'
        };
        const data = await cr.post(options);
        expect(data.parent_relative_url).to.equal('billing_period_message_module');
        expect(putStub.called).to.equal(true);
      });
    });

    describe('road report', () => {
      beforeEach(() => {
        portalType = 'Road Report Request';
      });

      it('should put a message', async () => {
        const options = {
          portal_type: portalType,
          report_type: 'AccountBalance',
          billing_period_reference: '2018Q1',
          request_date: '2018-07-13T00:00:00Z'
        };
        const data = await cr.post(options);
        expect(data.parent_relative_url).to.equal('road_report_request_module');
        expect(putStub.called).to.equal(true);
      });
    });
  });

  describe('.sync', () => {
    let cr;
    let repairStub: sinon.SinonStub;

    beforeEach(() => {
      cr = new ClearRoad(url, null, {});
      repairStub = sinon.stub((cr as any).messagesStorage, 'repair').callsFake((_id, data) => data);
      stubs.push(repairStub);
    });

    it('should repair all storages', async () => {
      await cr.sync();
      expect(repairStub.callCount).to.equal(4);
    });

    describe('progress', () => {
      it('should call progress for all storages', async () => {
        const progressStub = sinon.stub();
        await cr.sync(progressStub);
        expect(progressStub.callCount).to.equal(4);
      });
    });
  });

  describe('.allDocs', () => {
    let cr;
    let queryStub: sinon.SinonStub;

    beforeEach(() => {
      cr = new ClearRoad(url, null, {});
      queryStub = sinon.stub((cr as any).messagesStorage, 'allDocs').callsFake(options => options);
      stubs.push(queryStub);
    });

    it('should query the messages', async () => {
      await cr.allDocs({});
      expect(queryStub.called).to.equal(true);
    });
  });

  describe('.getAttachment', () => {
    let cr;
    let getAttachmentStub: sinon.SinonStub;

    beforeEach(() => {
      cr = new ClearRoad(url, null, {});
      getAttachmentStub = sinon.stub((cr as any).messagesStorage, 'getAttachment').callsFake(options => options);
      stubs.push(getAttachmentStub);
    });

    it('should get the report', async () => {
      await cr.getAttachment();
      expect(getAttachmentStub.called).to.equal(true);
    });
  });
});
