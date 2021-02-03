
import AmoCRM from 'amocrm-js';
import { formatDate } from '../utils/date.js';

//= ============================================================================

export default class {
  responsibleUserIndex = 0;

  //= ============================================================================

  crmOptions = {
    domain: process.env.AMOCRM_DOMAIN,
    auth: {
      login: process.env.AMOCRM_LOGIN,
      hash: process.env.AMOCRM_HASH
    }
  }

  //= ============================================================================

  getResponsibleUsers() {
    return Object.keys(process.env)
      .filter(el => el.startsWith('AMOCRM_RESPONSIBLE_USER_ID'))
      .sort()
      .map(el => process.env[el]);
  }

  //= ============================================================================

  constructor() {
    this.responsibleUsers = this.getResponsibleUsers();
  }

  //= ============================================================================

  get tags() {
    const { address } = this.ufopItem;
    const tags = [formatDate('DD.MM.YYYY')];
    if (/місто Київ/.test(address)) tags.unshift('Київ');
    else if (/Київська обл\./.test(address)) tags.unshift('Київщина');
    else if (/(Тернопільська)|(Львівська) обл\./.test(address)) tags.unshift('Галичина');
    else if (/(Харківська)|(Полтавська) обл\./.test(address)) tags.unshift('Слобожанщина');
    return tags.join(',');
  }

  //= ============================================================================

  get companyOptions() {
    return {
      add: [{
        name: this.fullName,
        responsible_user_id: this.responsibleUserId,
        tags: this.tags
      }]
    };
  }

  // -------------------------------

  get contactOptions() {
    return {
      name: this.name,
      company_id: this.companyId,
      responsible_user_id: this.responsibleUserId,
      tags: this.tags,
      custom_fields: [{
        id: 212713,
        values: [{
          value: this.ufopItem.phone1,
          enum: 'WORK'
        },
        {
          value: this.ufopItem.phone2,
          enum: 'WORKDD'
        }]
      },
      {
        id: 212715,
        values: [{
          value: this.ufopItem.email1,
          enum: 'WORK'
        }]
      }]
    };
  }

  // -------------------------------

  getNoteOptions(text, index) {
    return {
      element_id: this.contactId,
      element_type: 1,
      text,
      note_type: 4,
      responsible_user_id: this.responsibleUserId,
      created_at: Math.ceil(Date.now() / 1000) + index
    };
  }

  // -------------------------------

  get notesOptions() {
    const { dateRegistration, isOrganization } = this.ufopItem;

    const notes = [];
    if (isOrganization) notes.push(`ЄДРПОУ: ${this.ufopItem.code}`);
    notes.push(`Адреса: ${this.ufopItem.address}`);
    notes.push(this.ufopItem.activities || this.ufopItem.activity);
    if (isOrganization) notes.push(`Капітал: ${this.ufopItem.capital}`);

    if (dateRegistration) {
      notes.push(`Дата реєстрації: ${formatDate('DD.MM.YYYY', dateRegistration)}`);
    }

    return { add: notes.map(this.getNoteOptions.bind(this)) };
  }

  // -------------------------------

  get leadOptions() {
    return {
      name: this.fullName,
      pipeline_id: this.pipelineId,
      status_id: this.statusId,
      responsible_user_id: this.responsibleUserId,
      contacts_id: this.contactId,
      company_id: this.companyId,
      tags: this.tags
    };
  }

  // -------------------------------

  getResponsibleUserId() {
    ++this.responsibleUserIndex;
    if (this.responsibleUserIndex === this.responsibleUsers.length) this.responsibleUserIndex = 0;
    return this.responsibleUsers[this.responsibleUserIndex];
  }

  // -------------------------------
  static throwError(message, request, response) {
    const error = new Error(message);
    error.request = JSON.stringify(request, null, 2);
    error.response = JSON.stringify(response, null, 2);
    throw error;
  }
  // -------------------------------

  async send(ufopItem) {
    this.responsibleUserId = this.getResponsibleUserId();
    this.ufopItem = ufopItem;

    const crm = new AmoCRM(this.crmOptions);
    try {
      await crm.connect();

      if (ufopItem.isOrganization) {
        this.fullName = ufopItem.fullName.replace('ТОВАРИСТВО З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЮ', 'ТОВ');
        this.name = this.ufopItem.manager;
        this.pipelineId = 769888; // Base ТОВ
        this.statusId = 16357765; // Первичный контакт
      } else {
        this.name = this.ufopItem.fullName;
        this.fullName = `ФОП ${this.name}`;
        this.pipelineId = 1719457; // Base ФОП
        this.statusId = 28986694; // Первичный контакт
      }

      const resCompany = await crm.request.post('/api/v2/companies', this.companyOptions);
      this.companyId = resCompany?._embedded?.items?.[0]?.id;
      if (!this.companyId) this.constructor.throwError('NO_COMPANY', this.companyOptions, resCompany);

      const contact = new crm.Contact(this.contactOptions);
      const resContact = await contact.save();
      this.contactId = resContact.id;

      if (!this.contactId) this.constructor.throwError('NO_CONTACT', this.contactOptions, resContact);

      await crm.request.post('/api/v2/notes', this.notesOptions);
      const lead = new crm.Lead(this.leadOptions);
      await lead.save();
    } catch (err) {
      err.message = `AMO_${err.message}`;
      throw err;
    } finally {
      crm.disconnect();
    }
  }
};
