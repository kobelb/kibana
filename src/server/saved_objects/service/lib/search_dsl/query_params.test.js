import { getQueryParams } from './query_params';

const MAPPINGS = {
  rootType: {
    properties: {
      type: {
        type: 'keyword'
      },
      pending: {
        properties: {
          title: {
            type: 'text',
          }
        }
      },
      saved: {
        properties: {
          title: {
            type: 'text',
            fields: {
              raw: {
                type: 'keyword'
              }
            }
          },
          obj: {
            properties: {
              key1: {
                type: 'text'
              }
            }
          }
        }
      }
    }
  }
};

describe('searchDsl/queryParams', () => {
  describe('{}', () => {
    it('searches for everything', () => {
      expect(getQueryParams(MAPPINGS))
        .toEqual({
          query: {
            bool: {
              filter: []
            }
          }
        });
    });
  });

  describe('{type}', () => {
    it('includes just a terms filter', () => {
      expect(getQueryParams(MAPPINGS, 'saved'))
        .toEqual({
          query: {
            bool: {
              filter: [
                {
                  term: { type: 'saved' }
                }
              ]
            }
          }
        });
    });
  });

  describe('{type,filters}', () => {
    it('includes filters and a term filter for type', () => {
      expect(getQueryParams(MAPPINGS, 'saved', null, null, [{ terms: { foo: ['bar', 'baz' ] } }]))
        .toEqual({
          query: {
            bool: {
              filter: [
                { terms: { foo: ['bar', 'baz' ] } },
                {
                  term: { type: 'saved' }
                }
              ]
            }
          }
        });
    });
  });

  describe('{search}', () => {
    it('includes just a sqs query', () => {
      expect(getQueryParams(MAPPINGS, null, 'us*'))
        .toEqual({
          query: {
            bool: {
              filter: [],
              must: [
                {
                  simple_query_string: {
                    query: 'us*',
                    all_fields: true
                  }
                }
              ]
            }
          }
        });
    });
  });

  describe('{search,filters}', () => {
    it('includes filters and a sqs query', () => {
      expect(getQueryParams(MAPPINGS, null, 'us*', null, [{ terms: { foo: ['bar', 'baz' ] } }]))
        .toEqual({
          query: {
            bool: {
              filter: [
                { terms: { foo: ['bar', 'baz' ] } }
              ],
              must: [
                {
                  simple_query_string: {
                    query: 'us*',
                    all_fields: true
                  }
                }
              ]
            }
          }
        });
    });
  });

  describe('{type,search}', () => {
    it('includes bool with sqs query and term filter for type', () => {
      expect(getQueryParams(MAPPINGS, 'saved', 'y*'))
        .toEqual({
          query: {
            bool: {
              filter: [
                { term: { type: 'saved' } }
              ],
              must: [
                {
                  simple_query_string: {
                    query: 'y*',
                    all_fields: true
                  }
                }
              ]
            }
          }
        });
    });
  });

  describe('{type,search,filters}', () => {
    it('includes bool with sqs query, filters and term filter for type', () => {
      expect(getQueryParams(MAPPINGS, 'saved', 'y*', null, [{ terms: { foo: ['bar', 'baz' ] } }]))
        .toEqual({
          query: {
            bool: {
              filter: [
                { terms: { foo: ['bar', 'baz' ] } },
                { term: { type: 'saved' } }
              ],
              must: [
                {
                  simple_query_string: {
                    query: 'y*',
                    all_fields: true
                  }
                }
              ]
            }
          }
        });
    });
  });

  describe('{search,searchFields}', () => {
    it('includes all types for field', () => {
      expect(getQueryParams(MAPPINGS, null, 'y*', ['title']))
        .toEqual({
          query: {
            bool: {
              filter: [],
              must: [
                {
                  simple_query_string: {
                    query: 'y*',
                    fields: [
                      'type.title',
                      'pending.title',
                      'saved.title'
                    ]
                  }
                }
              ]
            }
          }
        });
    });
    it('supports field boosting', () => {
      expect(getQueryParams(MAPPINGS, null, 'y*', ['title^3']))
        .toEqual({
          query: {
            bool: {
              filter: [],
              must: [
                {
                  simple_query_string: {
                    query: 'y*',
                    fields: [
                      'type.title^3',
                      'pending.title^3',
                      'saved.title^3'
                    ]
                  }
                }
              ]
            }
          }
        });
    });
    it('supports field and multi-field', () => {
      expect(getQueryParams(MAPPINGS, null, 'y*', ['title', 'title.raw']))
        .toEqual({
          query: {
            bool: {
              filter: [],
              must: [
                {
                  simple_query_string: {
                    query: 'y*',
                    fields: [
                      'type.title',
                      'pending.title',
                      'saved.title',
                      'type.title.raw',
                      'pending.title.raw',
                      'saved.title.raw',
                    ]
                  }
                }
              ]
            }
          }
        });
    });
  });

  describe('{search,searchFields,filters}', () => {
    it('specifies filters and includes all types for field', () => {
      expect(getQueryParams(MAPPINGS, null, 'y*', ['title'], [{ terms: { foo: ['bar', 'baz' ] } }]))
        .toEqual({
          query: {
            bool: {
              filter: [
                { terms: { foo: ['bar', 'baz' ] } },
              ],
              must: [
                {
                  simple_query_string: {
                    query: 'y*',
                    fields: [
                      'type.title',
                      'pending.title',
                      'saved.title'
                    ]
                  }
                }
              ]
            }
          }
        });
    });
    it('specifies filters and supports field boosting', () => {
      expect(getQueryParams(MAPPINGS, null, 'y*', ['title^3'], [{ terms: { foo: ['bar', 'baz' ] } }]))
        .toEqual({
          query: {
            bool: {
              filter: [
                { terms: { foo: ['bar', 'baz' ] } },
              ],
              must: [
                {
                  simple_query_string: {
                    query: 'y*',
                    fields: [
                      'type.title^3',
                      'pending.title^3',
                      'saved.title^3'
                    ]
                  }
                }
              ]
            }
          }
        });
    });
    it('specifies filters and supports field and multi-field', () => {
      expect(getQueryParams(MAPPINGS, null, 'y*', ['title', 'title.raw'], [{ terms: { foo: ['bar', 'baz' ] } }]))
        .toEqual({
          query: {
            bool: {
              filter: [
                { terms: { foo: ['bar', 'baz' ] } },
              ],
              must: [
                {
                  simple_query_string: {
                    query: 'y*',
                    fields: [
                      'type.title',
                      'pending.title',
                      'saved.title',
                      'type.title.raw',
                      'pending.title.raw',
                      'saved.title.raw',
                    ]
                  }
                }
              ]
            }
          }
        });
    });
  });

  describe('{type,search,searchFields}', () => {
    it('includes bool, and sqs with field list', () => {
      expect(getQueryParams(MAPPINGS, 'saved', 'y*', ['title']))
        .toEqual({
          query: {
            bool: {
              filter: [
                { term: { type: 'saved' } }
              ],
              must: [
                {
                  simple_query_string: {
                    query: 'y*',
                    fields: [
                      'saved.title'
                    ]
                  }
                }
              ]
            }
          }
        });
    });
    it('supports fields pointing to multi-fields', () => {
      expect(getQueryParams(MAPPINGS, 'saved', 'y*', ['title.raw']))
        .toEqual({
          query: {
            bool: {
              filter: [
                { term: { type: 'saved' } }
              ],
              must: [
                {
                  simple_query_string: {
                    query: 'y*',
                    fields: [
                      'saved.title.raw'
                    ]
                  }
                }
              ]
            }
          }
        });
    });
    it('supports multiple search fields', () => {
      expect(getQueryParams(MAPPINGS, 'saved', 'y*', ['title', 'title.raw']))
        .toEqual({
          query: {
            bool: {
              filter: [
                { term: { type: 'saved' } }
              ],
              must: [
                {
                  simple_query_string: {
                    query: 'y*',
                    fields: [
                      'saved.title',
                      'saved.title.raw'
                    ]
                  }
                }
              ]
            }
          }
        });
    });
  });

  describe('{type,search,searchFields,filters}', () => {
    it('includes specified filters, type filter and sqs with field list', () => {
      expect(getQueryParams(MAPPINGS, 'saved', 'y*', ['title'], [{ terms: { foo: ['bar', 'baz' ] } }]))
        .toEqual({
          query: {
            bool: {
              filter: [
                { terms: { foo: ['bar', 'baz' ] } },
                { term: { type: 'saved' } }
              ],
              must: [
                {
                  simple_query_string: {
                    query: 'y*',
                    fields: [
                      'saved.title'
                    ]
                  }
                }
              ]
            }
          }
        });
    });
    it('supports fields pointing to multi-fields', () => {
      expect(getQueryParams(MAPPINGS, 'saved', 'y*', ['title.raw'], [{ terms: { foo: ['bar', 'baz' ] } }]))
        .toEqual({
          query: {
            bool: {
              filter: [
                { terms: { foo: ['bar', 'baz' ] } },
                { term: { type: 'saved' } }
              ],
              must: [
                {
                  simple_query_string: {
                    query: 'y*',
                    fields: [
                      'saved.title.raw'
                    ]
                  }
                }
              ]
            }
          }
        });
    });
    it('supports multiple search fields', () => {
      expect(getQueryParams(MAPPINGS, 'saved', 'y*', ['title', 'title.raw'], [{ terms: { foo: ['bar', 'baz' ] } }]))
        .toEqual({
          query: {
            bool: {
              filter: [
                { terms: { foo: ['bar', 'baz' ] } },
                { term: { type: 'saved' } }
              ],
              must: [
                {
                  simple_query_string: {
                    query: 'y*',
                    fields: [
                      'saved.title',
                      'saved.title.raw'
                    ]
                  }
                }
              ]
            }
          }
        });
    });
  });
});
