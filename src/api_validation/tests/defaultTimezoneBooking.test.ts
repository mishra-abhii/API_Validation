import{test, expect, Page} from "@playwright/test";
import { CalendarsPage } from "../pages/CalendarsPage";
import { AppointmentService } from "../apiRepo/AppointmentService";
import { ids } from "../utils/ids";

// Appointment Booking With Default TimeZone
test.describe('Collective Calendar Appointment Booking With Default Timezone', async ()=>{
    let page: Page;
    let calendarsPage: CalendarsPage;
    let appointmentService : AppointmentService;
    let networkResponse: any;
    let contactId: string; 
    let eventId: string;
    
    test.beforeAll(async ({browser, playwright})=>{
        page = await browser.newPage();
        calendarsPage = new CalendarsPage(page);
        const requestContext = await playwright.request.newContext();
        appointmentService = new AppointmentService(requestContext);
        await calendarsPage.openCalendar();
    });

    test('Validate Calendars Page', async ()=>{
        await calendarsPage.validateStatusCodeForNetworkResponse('free-slots');
        console.log('Page loaded successfully');
    });

    test('Randomly Select Date In 2025 Year', async ()=>{
        await calendarsPage.navigateToYear2025();
        await calendarsPage.selectRandomMonth();
        await calendarsPage.selectRandomDate();
        console.log('Random date selected');
    })

    test('Randomly Select Slot', async ()=>{
        await calendarsPage.selectRandomSlot();
        console.log('Random slot selected');
    })

    test('Fill User Details and Checkbox', async ()=>{
        await calendarsPage.fillUserDetailsAndCheckBox();
        console.log('Details filled');
    })

    test('Schedule Appointment', async ()=>{
        networkResponse = await calendarsPage.scheduleAppointmentAndGetResponse();
        contactId = networkResponse?.contact?.id;
        eventId = networkResponse?.id;
        console.log(`Extracted contactId: ${contactId}, eventId: ${eventId}`);
    })   
    
    test('Validate Contact Details', async ()=>{
        const getContactResponse = await appointmentService.getContactDetails(contactId, ids.bearerTokenId);

        expect(getContactResponse?.contact?.id).toBe(contactId);
        expect(getContactResponse?.contact?.firstName).toBe(networkResponse?.contact?.first_name);
        expect(getContactResponse?.contact?.lastName).toBe(networkResponse?.contact?.last_name);
        expect(getContactResponse?.contact?.email).toBe(networkResponse?.contact?.email);
        expect(getContactResponse?.contact?.phone).toBe(networkResponse?.contact?.phone);
        expect(getContactResponse?.contact?.locationId).toBe(ids.locationId);

        console.log('Validated contact details successfully');
    })

    test('Validate Appointment Details', async ()=>{
        const getAppointmentResponse = await appointmentService.getAppointmentDetails(eventId, ids.bearerTokenId);

        expect(getAppointmentResponse?.appointment?.id).toBe(eventId);
        expect(getAppointmentResponse?.appointment?.appointmentStatus).toBe('confirmed');
        expect(getAppointmentResponse?.appointment?.assignedUserId).toBe(ids.assignedUserId);
        expect(getAppointmentResponse?.appointment?.calendarId).toBe(ids.calendarId);
        expect(getAppointmentResponse?.appointment?.contactId).toBe(contactId);
        expect(getAppointmentResponse?.appointment?.locationId).toBe(ids.locationId);

        const selectedTimezone = await networkResponse?.appointment?.timezone;
        console.log('Default Selected TimeZone:' + selectedTimezone);
        console.log('Validated appointment details successfully');
    })
})