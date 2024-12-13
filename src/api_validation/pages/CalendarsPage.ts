import { Page } from '@playwright/test';
import { locators } from '../locator/locators';
import { faker } from '@faker-js/faker';
import { urls } from '../utils/urls';

export class CalendarsPage {

  private page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }

  async validateStatusCodeForNetworkResponse(filter : string): Promise<void> {
    this.page.on('response', (response) => {
      const responseUrl = response.url();

      if (responseUrl.includes(filter)) {
        const statusCode = response.status();
        console.log(`Response for ${filter}: ${statusCode} - ${responseUrl}`);
        if (statusCode !== 200) {
          throw new Error(`Unexpected status code for ${filter}: ${statusCode}`);
        }
      }
    });
  }

  async openCalendar() {
    await this.page.goto(urls.CALENDARS_PAGE_URL);
    await this.validateStatusCodeForNetworkResponse('free-slots');
  }

  async navigateToYear2025() {
    let currYear = await this.page.locator(locators.currYearOnWidget).innerText();

    while (!currYear.includes('2025')) {
      await this.page.locator(locators.nextMonthButton).click();
      await this.page.waitForTimeout(500);
      currYear = await this.page.locator(locators.currYearOnWidget).innerText();
    }
  }

  async selectRandomMonth() {
    const randomMonth = Math.floor(Math.random() * 12);
    for (let i = 0; i < randomMonth; i++) {
      await this.page.locator(locators.nextMonthButton).click();
      await this.page.waitForTimeout(500);
    }
    await this.page.waitForLoadState('networkidle');
  }

  async selectRandomDate() {
    const dateElements = await this.page.locator(locators.dateElements).all();

    const availableDates = await Promise.all(
      dateElements.map(async (dateElement) => ({
        date: await dateElement.innerText(),
        element: dateElement,
      }))
    );

    if (availableDates.length === 0) {
      throw new Error('No selectable dates available for the selected month.');
    }
    // Pick a random date from the available options
    const randomIndex = Math.floor(Math.random() * availableDates.length);
    const randomDate = availableDates[randomIndex];
    await randomDate.element.click();
  }

  async selectRandomTimeZone() {
    await this.page.locator(locators.selectTimeZoneButton).click();
    const allTimeZones = await this.page.locator(locators.alltimeZones).all();

    if(allTimeZones.length === 0){
      throw new Error('No available timezone to select.');
    }
    const randomTimezone = allTimeZones[Math.floor(Math.random() * (allTimeZones.length-2))];
    await randomTimezone.waitFor({state: 'visible'});
    await randomTimezone.click();
    console.log(randomTimezone.locator('.option__title').textContent());
  }

  async selectRandomSlot() {
    // Get all the available slots
    const allSlots = await this.page.locator(locators.allAvailableSlots).all();
   
    if (allSlots.length === 0) {
      throw new Error('No available slots to select.');
    }
    const randomSlot = allSlots[Math.floor(Math.random() * allSlots.length)];
    // Wait for the slot to be visible before clicking
    await randomSlot.waitFor({ state: 'visible' });
    await randomSlot.click();
    const selectSlotButton = await this.page.locator(locators.selectSlotButton);
    await selectSlotButton.click();
  }
  
  async fillUserDetailsAndCheckBox() {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.email();

    const prefixes = ['7', '8', '9'];
    const firstDigit = prefixes[Math.floor(Math.random() * prefixes.length)]; // Randomly choose 7, 8, or 9
    const remainingDigits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join(''); // Generate 9 random digits

    const indianPhoneNumber = `+91 ${firstDigit}${remainingDigits}`;

    await this.page.locator(locators.inputFirstName).fill(firstName);
    await this.page.locator(locators.inputLastName).fill(lastName);
    await this.page.locator(locators.inputPhoneNumber).fill(indianPhoneNumber);
    await this.page.locator(locators.inputEmail).fill(email);
    await this.page.locator(locators.clickCheckbox).check();
  }

  async scheduleAppointmentAndGetResponse(): Promise<any> {
    const [response] = await Promise.all([
      this.page.waitForResponse((response) =>
        response.url().includes('/appointment') && 
        response.request().method() === 'POST'
      ),
      this.page.click(locators.scheduleMeetingButton),
      this.page.waitForTimeout(2000)
    ]);
    // Get the response body
    const responseBody = await response.json();
    console.log('Network Response for Appointment:', JSON.stringify(responseBody, null, 2));
    return responseBody;
  }
}