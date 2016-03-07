var theMap = new GMap();

Template.map.onCreated(function () {
  this.autorun(() => {
    // ensure timeline is loaded first so that we have a date
    let mapDataContext = Session.get('mapDataContext');
    if (!mapDataContext) {
      return;
    }

    // empty client cache if exists
    if (this.subs && this.oldSubscription !== this.subs.subscriptionId) {
      this.oldSubscription = this.subs.subscriptionId;
      this.subs.stop();
    }

    let { subscription, range, query } = mapDataContext;
    this.subs = this.subscribe(subscription, range, query, () => {
      query = _.defaults(query, {
        date: {
          $gte: range[0],
          $lte: range[1]
        }
      });
      // this after flush thingy ensures the template is re-rendered (if needed)
      Tracker.afterFlush(() => {
        theMap.addData(TaxisCollection.find(query).fetch());
      });
    });
  });
});

Template.map.onRendered(function createMap() {
  theMap.setup(this.find('#map'));

});
