/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { map as mapAsync } from 'bluebird';
import { FtrProviderContext } from '../../ftr_provider_context';

export function SavedObjectsPageProvider({ getService, getPageObjects }: FtrProviderContext) {
  const log = getService('log');
  const retry = getService('retry');
  const browser = getService('browser');
  const find = getService('find');
  const testSubjects = getService('testSubjects');
  const PageObjects = getPageObjects(['header', 'common']);

  class SavedObjectsPage {
    async searchForObject(objectName: string) {
      const searchBox = await testSubjects.find('savedObjectSearchBar');
      await searchBox.clearValue();
      await searchBox.type(objectName);
      await searchBox.pressKeys(browser.keys.ENTER);
    }

    async importFile(path: string, overwriteAll = true) {
      log.debug(`importFile(${path})`);

      log.debug(`Clicking importObjects`);
      await testSubjects.click('importObjects');
      await PageObjects.common.setFileInputPath(path);

      if (!overwriteAll) {
        log.debug(`Toggling overwriteAll`);
        await testSubjects.click('importSavedObjectsOverwriteToggle');
      } else {
        log.debug(`Leaving overwriteAll alone`);
      }
      await testSubjects.click('importSavedObjectsImportBtn');
      log.debug(`done importing the file`);

      // Wait for all the saves to happen
      await PageObjects.header.waitUntilLoadingHasFinished();
    }

    async checkImportSucceeded() {
      await testSubjects.existOrFail('importSavedObjectsSuccess', { timeout: 20000 });
    }

    async checkNoneImported() {
      await testSubjects.existOrFail('importSavedObjectsSuccessNoneImported', { timeout: 20000 });
    }

    async checkImportConflictsWarning() {
      await testSubjects.existOrFail('importSavedObjectsConflictsWarning', { timeout: 20000 });
    }

    async checkImportLegacyWarning() {
      await testSubjects.existOrFail('importSavedObjectsLegacyWarning', { timeout: 20000 });
    }

    async checkImportFailedWarning() {
      await testSubjects.existOrFail('importSavedObjectsFailedWarning', { timeout: 20000 });
    }

    async clickImportDone() {
      await testSubjects.click('importSavedObjectsDoneBtn');
      await this.waitTableIsLoaded();
    }

    async clickConfirmChanges() {
      await testSubjects.click('importSavedObjectsConfirmBtn');
    }

    async waitTableIsLoaded() {
      return retry.try(async () => {
        const exists = await find.existsByDisplayedByCssSelector(
          '*[data-test-subj="savedObjectsTable"] .euiBasicTable-loading'
        );
        if (exists) {
          throw new Error('Waiting');
        }
        return true;
      });
    }

    async getElementsInTable() {
      const rows = await testSubjects.findAll('~savedObjectsTableRow');
      return mapAsync(rows, async (row) => {
        const checkbox = await row.findByCssSelector('[data-test-subj*="checkboxSelectRow"]');
        // return the object type aria-label="index patterns"
        const objectType = await row.findByTestSubject('objectType');
        const titleElement = await row.findByTestSubject('savedObjectsTableRowTitle');
        // not all rows have inspect button - Advanced Settings objects don't
        let inspectElement;
        const innerHtml = await row.getAttribute('innerHTML');
        if (innerHtml.includes('Inspect')) {
          inspectElement = await row.findByTestSubject('savedObjectsTableAction-inspect');
        } else {
          inspectElement = null;
        }
        const relationshipsElement = await row.findByTestSubject(
          'savedObjectsTableAction-relationships'
        );
        return {
          checkbox,
          objectType: await objectType.getAttribute('aria-label'),
          titleElement,
          title: await titleElement.getVisibleText(),
          inspectElement,
          relationshipsElement,
        };
      });
    }

    async getRowTitles() {
      await this.waitTableIsLoaded();
      const table = await testSubjects.find('savedObjectsTable');
      const $ = await table.parseDomContent();
      return $.findTestSubjects('savedObjectsTableRowTitle')
        .toArray()
        .map((cell) => $(cell).find('.euiTableCellContent').text());
    }

    async getRelationshipFlyout() {
      const rows = await testSubjects.findAll('relationshipsTableRow');
      return mapAsync(rows, async (row) => {
        const objectType = await row.findByTestSubject('relationshipsObjectType');
        const relationship = await row.findByTestSubject('directRelationship');
        const titleElement = await row.findByTestSubject('relationshipsTitle');
        const inspectElement = await row.findByTestSubject('relationshipsTableAction-inspect');
        return {
          objectType: await objectType.getAttribute('aria-label'),
          relationship: await relationship.getVisibleText(),
          titleElement,
          title: await titleElement.getVisibleText(),
          inspectElement,
        };
      });
    }

    async getTableSummary() {
      const table = await testSubjects.find('savedObjectsTable');
      const $ = await table.parseDomContent();
      return $('tbody tr')
        .toArray()
        .map((row) => {
          return {
            title: $(row).find('td:nth-child(3) .euiTableCellContent').text(),
            canViewInApp: Boolean($(row).find('td:nth-child(3) a').length),
          };
        });
    }

    async clickTableSelectAll() {
      await testSubjects.click('checkboxSelectAll');
    }

    async canBeDeleted() {
      return await testSubjects.isEnabled('savedObjectsManagementDelete');
    }

    async clickDelete() {
      await testSubjects.click('savedObjectsManagementDelete');
      await testSubjects.click('confirmModalConfirmButton');
      await this.waitTableIsLoaded();
    }
  }

  return new SavedObjectsPage();
}
