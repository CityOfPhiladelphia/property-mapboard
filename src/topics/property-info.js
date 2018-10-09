import transforms from '../general/transforms';

export default {
  key: 'propertyInfo',
  icon: 'home',
  label: 'Property Info',
  // REVIEW can these be calculated from vue deps?
  dataSources: ['opa'],
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
            transforms: [
              'currency'
            ]
          },
          {
            label: 'Taxable Land',
            value: function(state, item){
              return transforms.currency.transform(item.taxable_land)
            },
          },
          {
            label: 'Taxable Improvement',
            value: function(state, item){
              return transforms.currency.transform(item.taxable_building)
            },
          },
          {
            label: 'Exempt Land',
            value: function(state, item){
              return transforms.currency.transform(item.exempt_land)
            },
          },
          {
            label: 'Exempt Improvement',
            value: function(state, item){
              return transforms.currency.transform(item.exempt_building)
            }
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

  ],
  identifyFeature: 'address-marker',
  parcels: 'pwd',
}
