"use strict";

function concatStringNTimes(string, n) {
  var res = "";
  while (--n >= 0) { res += string; }
  return res;
}

function jsonId(value, replacer, space) {
  var indent, key_value_space = "";
  if (typeof space === "string") {
    if (space !== "") {
      indent = space;
      key_value_space = " ";
    }
  } else if (typeof space === "number") {
    if (isFinite(space) && space > 0) {
      indent = concatStringNTimes(" ", space);
      key_value_space = " ";
    }
  }

  function jsonIdRec(key, value, deep) {
    var i, l, res, my_space;
    if (value && typeof value.toJSON === "function") {
      value = value.toJSON();
    }
    if (typeof replacer === "function") {
      value = replacer(key, value);
    }

    if (indent) {
      my_space = concatStringNTimes(indent, deep);
    }
    if (Array.isArray(value)) {
      res = [];
      for (i = 0; i < value.length; i += 1) {
        res[res.length] = jsonIdRec(i, value[i], deep + 1);
        if (res[res.length - 1] === undefined) {
          res[res.length - 1] = "null";
        }
      }
      if (res.length === 0) { return "[]"; }
      if (indent) {
        return "[\n" + my_space + indent +
          res.join(",\n" + my_space + indent) +
          "\n" + my_space + "]";
      }
      return "[" + res.join(", ") + "]";
    }
    if (typeof value === "object" && value !== null) {
      if (Array.isArray(replacer)) {
        res = replacer.reduce(function (p, c) {
          p.push(c);
          return p;
        }, []);
      } else {
        res = Object.keys(value);
      }
      res.sort();
      for (i = 0, l = res.length; i < l; i += 1) {
        key = res[i];
        res[i] = jsonIdRec(key, value[key], deep + 1);
        if (res[i] !== undefined) {
          res[i] = JSON.stringify(key) + ": " + key_value_space + res[i];
        } else {
          res.splice(i, 1);
          l -= 1;
          i -= 1;
        }
      }
      if (res.length === 0) { return "{}"; }
      if (indent) {
        return "{\n" + my_space + indent +
          res.join(",\n" + my_space + indent) +
          "\n" + my_space + "}";
      }
      return "{" + res.join(", ") + "}";
    }
    return JSON.stringify(value);
  }
  return jsonIdRec("", value, 0);
}

function ClearRoad(url, login, password) {
  if (!(this instanceof ClearRoad)) {
    return new ClearRoad();
  }
  var DATABASE = "clearroad";
  var query = 'portal_type:("Road Account Message" OR "Road Event Message" OR "Road Message" OR "Billing Period Message" OR "Road Report Request") AND grouping_reference:"data"';
  this.jio = jIO.createJIO({
    type: "replicate",
    parallel_operation_amount: 1,
    use_remote_post: false,
    conflict_handling: 1,
    signature_hash_key: 'source_reference',
    signature_sub_storage: {
      type: "query",
      sub_storage: {
        type: "indexeddb",
        database: DATABASE + "-messages-signatures"
      }
    },
    query: {
      query: query,
      sort_on: [['modification_date', 'descending']],
      limit: [0, 1234567890]
    },
    check_local_modification: false, // we only create new message
    check_local_creation: true,
    check_local_deletion: false, // once created, message are not deleted
    check_remote_modification: false, // ERP5 does not modify the message
    check_remote_creation: true, // we want message back in case we delete our local db
    check_remote_deletion: false, // ERP5 does not delete message
    local_sub_storage: {
      type: "query",
      sub_storage: {
        type: "indexeddb",
        database: DATABASE
      }
    },
    remote_sub_storage: {
      type: "mapping",
      id: ["equalSubProperty", "source_reference"],
      sub_storage: {
        type: "erp5",
        url: url,
        default_view_reference: "jio_view",
        login: login,
        password: password

      }
    }
  });
  var ingestion_query = 'portal_type:("Road Account Message" OR "Road Event Message" OR "Road Message" OR "Billing Period Message" OR "Road Report Request") AND validation_state:("processed" OR "rejected")';
  this.ingestion_report_jio = jIO.createJIO({
    type: "replicate",
    parallel_operation_amount: 1,
    use_remote_post: false,
    conflict_handling: 1,
    signature_hash_key: 'destination_reference',
    signature_sub_storage: {
      type: "query",
      sub_storage: {
        type: "indexeddb",
        database: DATABASE + "-ingestion-signatures"
      }
    },
    query: {
      query: ingestion_query,
      sort_on: [['modification_date', 'descending']],
      limit: [0, 1234567890]
    },
    check_local_modification: false, // local modification will always be erased
    check_local_creation: false,
    check_local_deletion: false,
    check_remote_modification: false, // there is no modification, only creation of report
    check_remote_creation: true,
    check_remote_deletion: true,
    local_sub_storage: {
      type: "query",
      sub_storage: {
        type: "indexeddb",
        database: DATABASE
      }
    },
    remote_sub_storage: {
      type: "mapping",
      id: ["equalSubProperty", "destination_reference"],
      sub_storage: {
        type: "erp5",
        url: url,
        default_view_reference: "jio_ingestion_report_view",
        login: login,
        password: password
      }
    }
  });
  var directory_query = 'portal_type:("Road Account" OR "Road Event" OR "Road Transaction")';
  this.directory_jio = jIO.createJIO({
    type: "replicate",
    parallel_operation_amount: 1,
    use_remote_post: false,
    conflict_handling: 1,
    signature_hash_key: 'source_reference',
    signature_sub_storage: {
      type: "query",
      sub_storage: {
        type: "indexeddb",
        database: DATABASE + "-directory-signatures"
      }
    },
    query: {
      query: directory_query,
      sort_on: [['modification_date', 'descending']],
      limit: [0, 200]
    },
    check_local_modification: false, // local modification will always be erased
    check_local_creation: false,
    check_local_deletion: false,
    check_remote_modification: false,
    check_remote_creation: true,
    check_remote_deletion: true,
    local_sub_storage: {
      type: "query",
      sub_storage: {
        type: "indexeddb",
        database: DATABASE
      }
    },
    remote_sub_storage: {
      type: "mapping",
      id: ["equalSubProperty", "source_reference"],
      sub_storage: {
        type: "erp5",
        url: url,
        default_view_reference: "jio_directory_view",
        login: login,
        password: password
      }
    }
  });
  var report_query = 'portal_type:("File")';
  this.report_jio = jIO.createJIO({
    type: "replicate",
    parallel_operation_amount: 1,
    use_remote_post: false,
    conflict_handling: 1,
    signature_hash_key: 'reference',
    signature_sub_storage: {
      type: "query",
      sub_storage: {
        type: "indexeddb",
        database: DATABASE + "-file-signatures"
      }
    },
    query: {
      query: report_query,
      sort_on: [['modification_date', 'descending']],
      limit: [0, 1234567890]
    },
    check_local_modification: false, // local modification will always be erased
    check_local_creation: false,
    check_local_deletion: false,
    check_remote_modification: false,
    check_remote_creation: true,
    check_remote_deletion: true,
    check_remote_attachment_creation: true,
    check_remote_attachment_modification: false,
    check_remote_attachment_deletion: true,
    check_local_attachment_creation: false,
    check_local_attachment_modification: false,
    check_local_attachment_deletion: false,
    local_sub_storage: {
      type: "query",
      sub_storage: {
        type: "indexeddb",
        database: DATABASE
      }
    },
    remote_sub_storage: {
      type: "mapping",
      id: ["equalSubProperty", "reference"],
      attachment_list: ["data"],
      attachment: {
        "data": {
          "get": {
            "uri_template": url + "/{id}/Base_downloadWithCors"
          },
          "put": {
            "erp5_put_template": url + "/{+id}/Base_edit"
          }
        }
      },
      sub_storage: {
        type: "erp5",
        url: url,
        default_view_reference: "jio_report_view",
        login: login,
        password: password
      }
    }
  });
}
ClearRoad.prototype = Object.create(ClearRoad.prototype);
ClearRoad.prototype.constructor = ClearRoad;
ClearRoad.prototype.post = function (data) {
  var self = this;
  if (data.portal_type === "Road Account Message") {
    data.parent_relative_url = 'road_account_message_module';
  }
  else if (data.portal_type === "Road Event Message") {
    data.parent_relative_url = 'road_event_message_module';
  }
  else if (data.portal_type === "Road Message") {
    data.parent_relative_url = 'road_message_module';
  }
  else if (data.portal_type === "Billing Period Message") {
    data.parent_relative_url = 'billing_period_message_module';
  }
  else if (data.portal_type === "Road Report Request") {
    data.parent_relative_url = 'road_report_request_module';
  }
  data.grouping_reference = "data";
  var data_as_string = jsonId(data, "", ""); // jio.util.stringify
  var rusha = new Rusha();
  var reference = rusha.digestFromString(data_as_string);
  data.source_reference = reference;
  data.destination_reference = reference;
  return new RSVP.Queue().push(function () {
    return self.jio.put(data.source_reference, data);
  });
};

ClearRoad.prototype.sync = function () {
  var self = this;
  return new RSVP.Queue().push(function () {
    return self.jio.repair.apply(self.jio, arguments);
  }).push(function () {
    return self.ingestion_report_jio.repair.apply(self.ingestion_report_jio, arguments);
  }).push(function () {
    return self.directory_jio.repair.apply(self.directory_jio, arguments);
  }).push(function () {
    return self.report_jio.repair.apply(self.report_jio, arguments);
  });
};

ClearRoad.prototype.allDocs = function () {
  return this.jio.allDocs.apply(this.jio, arguments);
};
ClearRoad.prototype.getAttachment = function () {
  return this.report_jio.getAttachment.apply(this.report_jio, arguments);
};
