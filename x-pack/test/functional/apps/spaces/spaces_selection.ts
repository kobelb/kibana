/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { KibanaFunctionalTestDefaultProviders } from '../../../types/providers';

// tslint:disable:no-default-export
export default function spaceSelectorFunctonalTests({
  getService,
  getPageObjects,
}: KibanaFunctionalTestDefaultProviders) {
  const esArchiver = getService('esArchiver');
  const PageObjects = getPageObjects([
    'common',
    'dashboard',
    'header',
    'home',
    'security',
    'spaceSelector',
  ]);

  describe('Spaces', () => {
    describe('Space Selector', () => {
      before(async () => await esArchiver.load('spaces/selector'));
      after(async () => await esArchiver.unload('spaces/selector'));

      afterEach(async () => {
        await PageObjects.security.logout();
      });

      it('allows user to navigate to different spaces', async () => {
        const spaceId = 'another-space';

        await PageObjects.security.login(null, null, {
          expectSpaceSelector: true,
        });

        await PageObjects.spaceSelector.clickSpaceCard(spaceId);

        await PageObjects.spaceSelector.expectHomePage(spaceId);

        await PageObjects.spaceSelector.openSpacesNav();

        // change spaces

        await PageObjects.spaceSelector.clickSpaceAvatar('default');

        await PageObjects.spaceSelector.expectHomePage('default');
      });
    });

    describe('Spaces Data', () => {
      const spaceId = 'another-space';
      const sampleDataHash = '/home/tutorial_directory/sampleData';

      const expectDashboardRenders = async (dashName: string) => {
        await PageObjects.dashboard.searchForDashboardWithName(dashName);
        await PageObjects.dashboard.selectDashboard(dashName);
        await PageObjects.header.waitUntilLoadingHasFinished();
        await PageObjects.dashboard.waitForRenderComplete(); // throws if all items are not rendered
      };

      before(async () => {
        await esArchiver.load('spaces/selector');
        await PageObjects.security.login(null, null, {
          expectSpaceSelector: true,
        });
        await PageObjects.spaceSelector.clickSpaceCard('default');
        await PageObjects.common.navigateToApp('home', {
          hash: sampleDataHash,
        });
        await PageObjects.home.addSampleDataSet('logs');
        await PageObjects.common.navigateToApp('home', {
          hash: sampleDataHash,
          basePath: `/s/${spaceId}`,
        });
        await PageObjects.home.addSampleDataSet('flights');
      });

      after(async () => {
        await PageObjects.common.navigateToApp('home', {
          hash: sampleDataHash,
        });
        await PageObjects.home.removeSampleDataSet('logs');
        await PageObjects.common.navigateToApp('home', {
          hash: sampleDataHash,
          basePath: `/s/${spaceId}`,
        });
        await PageObjects.home.removeSampleDataSet('flights');
        await PageObjects.security.logout();
        await esArchiver.unload('spaces/selector');
      });

      describe('displays separate data for each space', async () => {
        it('in the default space', async () => {
          await PageObjects.common.navigateToApp('dashboard');
          await expectDashboardRenders('[Logs] Web Traffic');
        });

        it('in a custom space', async () => {
          await PageObjects.common.navigateToApp('dashboard', {
            basePath: `/s/${spaceId}`,
          });
          await expectDashboardRenders('[Flights] Global Flight Dashboard');
        });
      });
    });
  });
}
