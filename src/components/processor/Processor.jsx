export const processors = [
  {
    key: "append",
    content: {
      append: {
        field: "tags",
        value: ["production"],
      },
    },
  },
  {
    key: "convert",
    content: {
      convert: {
        field: "source.ip",
        type: "ip",
      },
    },
  },
  {
    key: "csv",
    content: {
      csv: {
        field: "message",
        target_fields: ["field1", "field2"],
      },
    },
  },
  {
    key: "date",
    content: {
      date: {
        field: "message",
        target_field: ["timestamp"],
        formats: ["dd/MM/yyyy"],
        timezone: "Europe/Amsterdam",
      },
    },
  },
  {
    key: "dissect",
    content: {
      dissect: {
        field: "message",
        pattern:
          '%{clientip} %{ident} %{auth} [%{@timestamp}] "%{verb} %{request} HTTP/%{httpversion}" %{status} %{size}',
      },
    },
  },
  {
    key: "dot_expander",
    content: {
      dot_expander: {
        field: "foo.bar",
      },
    },
  },
  {
    key: "drop",
    content: {
      drop: {
        if: "ctx.network_name == 'Guest'",
      },
    },
  },
  {
    key: "enrich",
    content: {
      enrich: {
        field: "message",
        target_field: "destinationfield",
      },
    },
  },
  {
    key: "fail",
    content: {
      fail: {
        if: "ctx.tags.contains('production') != true",
        message: "The production tag is not present, found tags: {{{tags}}}",
      },
    },
  },
  {
    key: "fingerprint",
    content: {
      fingerprint: {
        fields: ["field1", "field2"],
        target_field: "fingerprintfield",
      },
    },
  },
  {
    key: "foreach",
    content: {
      foreach: {
        field: "field1",
        if: "ctx.tags.contains('production') != true",
        processor: {
          uppercase: {
            field: "_ingest._value",
          },
        },
      },
    },
  },
  {
    key: "geoip",
    content: {
      geoip: {
        field: "client.ip",
        target_field: "client.geo",
      },
    },
  },
  {
    key: "grok",
    content: {
      grok: {
        field: "client.ip",
        patterns: [
          "%{IP:client} %{WORD:method} %{URIPATHPARAM:request} %{NUMBER:bytes:int} %{NUMBER:duration:double}",
        ],
      },
    },
  },
  {
    key: "gsub",
    content: {
      gsub: {
        field: "client.ip",
        pattern: "\\.",
        replacement: "-",
      },
    },
  },
  {
    key: "join",
    content: {
      join: {
        field: "joined_array_field",
        separator: "-",
      },
    },
  },
  {
    key: "json",
    content: {
      json: {
        field: "message",
        target_field: "json",
      },
    },
  },
  {
    key: "kv",
    content: {
      kv: {
        field: "message",
        field_split: " ",
        value_split: "=",
      },
    },
  },
  {
    key: "lowercase",
    content: {
      lowercase: {
        field: "message",
      },
    },
  },
  {
    key: "network_direction",
    content: {
      network_direction: {
        internal_networks: ["private"],
      },
    },
  },
  {
    key: "pipeline",
    content: {
      pipeline: {
        name: "custompipelinename",
      },
    },
  },
  {
    key: "redact",
    content: {
      redact: {
        field: "message",
        patterns: ["%{IP:client}"],
      },
    },
  },
  {
    key: "registered_domain",
    content: {
      registered_domain: {
        field: "fqdn",
        target_field: "url",
      },
    },
  },
  {
    key: "remove",
    content: {
      remove: {
        field: ["field1", "field2"],
        if: "ctx.field1 == ''",
      },
    },
  },
  {
    key: "rename",
    content: {
      rename: {
        field: "message",
        target_field: "newfield",
      },
    },
  },
  {
    key: "script",
    content: {
      script: {
        lang: "painless",
        source: "test",
      },
    },
  },
  {
    key: "set",
    content: {
      set: {
        field: "field1",
        value: "value1",
      },
    },
  },
  {
    key: "sort",
    content: {
      sort: {
        field: "field1",
        order: "desc",
      },
    },
  },
  {
    key: "split",
    content: {
      split: {
        field: "field1",
        separator: "\\s+",
      },
    },
  },
  {
    key: "trim",
    content: {
      trim: {
        field: "field1",
      },
    },
  },
  {
    key: "uppercase",
    content: {
      uppercase: {
        field: "field1",
      },
    },
  },
  {
    key: "urldecode",
    content: {
      urldecode: {
        field: "field1",
      },
    },
  },
  {
    key: "uri_parts",
    content: {
      uri_parts: {
        field: "someurl",
        target_field: "url",
      },
    },
  },
  {
    key: "user_agent",
    content: {
      user_agent: {
        field: "someuser",
        target_field: "user_agent",
      },
    },
  },
];

export default processors;
