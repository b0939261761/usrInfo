import sgMail from '@sendgrid/mail';

const options = {
  from: `'${process.env.COMPANY_SIGN}' <${process.env.SENDGRID_EMAIL_FROM}>`,
  templateId: process.env.SENDGRID_TEMPLATE_ID,
  hideWarnings: process.env.NODE_ENV === 'production'
};

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async email => {
  try {
    await sgMail.send({ ...options, to: email });
  } catch (err) {
    console.error(err.toString());
  }
};
