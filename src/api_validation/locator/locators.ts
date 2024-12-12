import { scheduler } from "timers/promises";

export const locators = {
    
    currYearOnWidget: '(//div[@class="vdpPeriodControl"]/button)[2]',
    nextMonthButton: '//button[@class="arrowNext"]',
    dateElements: '//tr[@class="vdpRow"]//td[not(contains(@class, "disabled vdpCell")) and not(contains(@class, "disabled outOfRange vdpCell"))]',
    allAvailableSlots: '//li[@class="widgets-time-slot"]',
    selectSlotButton: '//button[@class="btn selected-slot"]',

    inputFirstName: '//input[@id="first_name"]',
    inputLastName: '//input[@id="last_name"]',
    inputPhoneNumber: '//input[@id="phone"]',
    inputEmail: '//div[@class="email-input block"]/input',
    clickCheckbox: '//div[@class="terms-and-conditions"]/input',
    scheduleMeetingButton: '//button[@id="schedule-meeting-button"]',

    selectTimeZoneButton: '//div[@class="multiselect__select"]',
    alltimeZones: '//ul[@id="listbox-null"]/li'
    
}