import helpers from '../util/helpers';

const titleCase = function(str) {
  str = str.toLowerCase().split(' ').map(function(word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  });
  return str.join(' ');
};

export default {
  key: 'propertyInfo',
  icon: 'home',
  label: 'Property Info',
  // REVIEW can these be calculated from vue deps?
  dataSources: ['assessmentHist', 'opa', 'zoningBase', 'zoningAppeals', 'zoningOverlay', 'rco'],
  components: [
    {
      type: 'callout',
      slots: {
        text: '\
          Property assessment and sale information for this address. Source: Office of Property Assessments (OPA). OPA was formerly a part of the Bureau of Revision of Taxes (BRT) and some City records may still use that name.\
        '
      }
    },
    {
      type: 'vertical-table',
      slots: {
        fields: [
          {
            label: 'OPA Account #',
            value: function(state) {
              return state.geocode.data.properties.opa_account_num;
            }
          },
          {
            label: 'Owners',
            value: function(state) {
              var owners = state.geocode.data.properties.opa_owners;
              var ownersJoined = owners.join(', ');
              return ownersJoined;
            }
          },
          {
            label: 'OPA Address',
            value: function(state) {
              return state.geocode.data.properties.opa_address;
            }
          },
        ],
      },
      options: {
        id: 'opaData',
        // requiredSources: ['opa'],
        externalLink: {
          action: function() {
            return 'View the Real Estate Tax Balance';
          },
          href: function() {
            return '//legacy.phila.gov/revenue/realestatetax/';
          }
        }
      }
    },
    {
      type: 'horizontal-table',
      options: {
        id: 'valueHist',
        fields: [
          {
            label: 'Year',
            value: function(state, item){
              return item.year
            }
          },
          {
            label: 'Market Value',
            value: function(state, item){
              return item.market_value
            },
            transforms: ['currency'],
          },
          {
            label: 'Taxable Land',
            value: function(state, item){
              return item.taxable_land
            },
            transforms: ['currency'],
          },
          {
            label: 'Taxable Improvement',
            value: function(state, item){
              return item.taxable_building
            },
            transforms: ['currency'],
          },
          {
            label: 'Exempt Land',
            value: function(state, item){
              return item.exempt_land
            },
            transforms: ['currency'],
          },
          {
            label: 'Exempt Improvement',
            value: function(state, item){
              return item.exempt_building
            },
            transforms: ['currency']
          },
        ],
        sort: {
          // this should return the val to sort on
          getValue: function(item) {
            return item.year;
          },
          // asc or desc
          order: 'desc'
        },
      },
      slots: {
        title: 'Valuation History',
        items: function(state) {
          var data = state.sources['assessmentHist'].data.rows;
          var rows = data.map(function(row){
            var itemRow = row;
            return itemRow;
          });
          return rows;
        },
      },
    },
    {
      type: 'vertical-table',
      slots: {
        title: 'Sales Details',
        fields: [
          {
            label: 'Sales Price',
            value: function(state) {
              return state.sources.opa.data.sale_price;
            },
            transforms: [
              'currency'
            ]
          },
          {
            label: 'Sales Date',
            value: function(state) {
              return state.sources.opa.data.sale_date;
            },
            transforms: [
              'date'
            ]
          },
        ],
      },
    },
    {
      type: 'vertical-table',
      slots: {
        title: 'Sales Details',
        fields: [
          {
            label: 'OPA Account #',
            value: function(state) {
              return state.geocode.data.properties.opa_account_num;
            }
          },
          {
            label: 'Homestead Exemption',
            value: function(state) {
              if (state.sources.opa.data.homestead_exemption > 0) {
                return state.sources.opa.data.homestead_exemption
              } else {
                return "No"
              }
            },
          },
          {
            label: 'Description',
            value: function(state) {
              return titleCase(state.sources.opa.data.building_code_description);
            },
          },
          {
            label: 'Condition',
            value: function(state) {
              const exterior = state.sources.opa.data.exterior_condition
              const condition =  exterior  == 0 ? 'Not Applicable' :
                                 exterior  == 2 ? 'Newer Construction / Rehabbed' :
                                 exterior  == 3 ? 'Above Average' :
                                 exterior  == 4 ? 'Average' :
                                 exterior  == 5 ? 'Below Average' :
                                 exterior  == 6 ? 'Vacant' :
                                 exterior  == 7 ? 'Sealed / Structurally Compromised, Open to the Weather' :
                                'Not available';
              return condition;
            },
          },
          {
            label: 'Beginning Point',
            value: function(state) {
              return titleCase(state.sources.opa.data.beginning_point);
            },
          },
          {
            label: 'Land Area',
            value: function(state, item) {
              return "Placeholder";
            },
          },
          {
            label: 'Improvement Area',
            value: function(state) {
              return "Placeholder";
            }
          },
        ],
      },
    },
    {
      type: 'tab-group',
      options: {
        getKey: function(item) {
          return item.properties.OBJECTID;
        },
        getTitle: function(item) {
          return item.properties.MAPREG;
        },
        getAddress: function(item) {
          var address = hf.concatDorAddress(item);
          return address;
        },
        // components for the content pane. this essentially a topic body.
        components: [
          {
            type: 'badge-custom',
            options: {
              titleBackground: '#58c04d',
              externalLink: {
                forceShow: true,
                action: function() {
                  return 'See related zoning permit documents - ADD LINK';
                },
                name: '',
                href: function(state) {
                  // var address = state.geocode.data.properties.street_address;
                  // var addressEncoded = encodeURIComponent(address);
                  return '//atlas.phila.gov/';
                }
              },
              components: [
                {
                  type: 'horizontal-table',
                  options: {
                    topicKey: 'zoning',
                    shouldShowFilters: false,
                    shouldShowHeaders: false,
                    id: 'baseZoning',
                    // defaultIncrement: 10,
                    // showAllRowsOnFirstClick: true,
                    // showOnlyIfData: true,
                    fields: [
                      {
                        label: 'Code',
                        value: function (state, item) {
                          return item;
                        },
                        transforms: [
                          'nowrap',
                          'bold'
                        ]
                      },
                      {
                        label: 'Description',
                        value: function (state, item) {
                          return helpers.ZONING_CODE_MAP[item];
                        },
                      },
                    ], // end fields
                  },
                  slots: {
                    // title: 'Base Zoning',
                    items(state, item) {
                      // console.log('state.sources:', state.sources['zoningBase'].data.rows);
                      const id = item.properties.OBJECTID;
                      const target = state.sources.zoningBase.targets[id] || {};
                      const { data={} } = target;
                      const { rows=[] } = data;

                      // get unique zoning codes
                      const longCodes = rows.map(row => row.long_code);
                      const longCodesUniqueSet = new Set(longCodes);
                      const longCodesUnique = Array.from(longCodesUniqueSet);

                      return longCodesUnique;
                    },
                  }, // end slots
                }, // end table
              ],
            },
            slots: {
              title: 'Base District',
            },
          }, // end of badge-custom
        ], // end of tab-group components
      },
      slots: {
        items: function (state) {
          // return state.dorParcels.data;
          return state.parcels.dor.data;
        }
      },
    },

  ],
  identifyFeature: 'address-marker',
  parcels: 'pwd',
  // identifyFeature: 'dor-parcel',
  // parcels: 'dor'
}
