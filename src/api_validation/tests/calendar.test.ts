import{test, expect, Page} from "@playwright/test";
import { CalendarsPage } from "../pages/CalendarsPage";
import { urls } from "../utils/urls";

test.describe('Collective Calendar Appointment Booking With Default Timezone', async ()=>{
    let page: Page;
    let calendarsPage: CalendarsPage;
    
    test.beforeAll(async ({browser})=>{
        page = await browser.newPage();
        calendarsPage = new CalendarsPage(page);
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
        await calendarsPage.scheduleAppointmentAndGetResponse();
        console.log('Schedule Appointment Button Clicked');
    })    
})