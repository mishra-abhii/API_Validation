import { APIRequestContext } from '@playwright/test';
import { urls } from '../utils/urls';

export class AppointmentService {
  private requestContext: APIRequestContext;

  constructor(requestContext: APIRequestContext) {
    this.requestContext = requestContext;
  }
  
  // Fetch Contact Details
  async getContactDetails(contactId: string, token: string): Promise<any> {
    const url = `${urls.GET_CONTACTS_URL}${contactId}`;
    const response = await this.requestContext.get(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        Version: '2021-04-15',
      },
    });

    if (response.status() !== 200) {
      throw new Error(`Failed to fetch contact details: ${response.status()} - ${response.statusText()}`);
    }

    const contactDetails = await response.json();
    console.log(`Contact Details:`, JSON.stringify(contactDetails, null, 2));
    return contactDetails;
  }

  // Fetch Appointment Details
  async getAppointmentDetails(eventId: string, token: string): Promise<any> {
    const url = `${urls.GET_APPOINTMENT_URL}${eventId}`;
    const response = await this.requestContext.get(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        Version: '2021-04-15',
      },
    });

    if (response.status() !== 200) {
      throw new Error(`Failed to fetch appointment details: ${response.status()} - ${response.statusText()}`);
    }

    const appointmentDetails = await response.json();
    console.log(`Appointment Details:`, JSON.stringify(appointmentDetails, null, 2));
    return appointmentDetails;
  }
}
