const sendEmail = require('../../utils/sendEmail');

exports.handler = async (event) => {
  // ✅ CORS headers (REQUIRED)
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // ✅ Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true })
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');

    const {
      fullname,
      mobile,
      email,
      comments,
      profile_for,
      gender,
      age,
      height,
      marital_status,
      religion,
      caste,
      caste_manual,
      education,
      specialization,
      occupation,
      salary
    } = data;

    const finalCaste =
      caste === 'Other' && caste_manual
        ? `${caste} (${caste_manual})`
        : caste || '-';

    const html = `
      <h2>New BharathShaadi Submission 💍</h2>
      <table border="1" cellpadding="6" cellspacing="0">
        <tr><td>Name</td><td>${fullname || '-'}</td></tr>
        <tr><td>Profile For</td><td>${profile_for || '-'}</td></tr>
        <tr><td>Gender</td><td>${gender || '-'}</td></tr>
        <tr><td>Age</td><td>${age || '-'}</td></tr>
        <tr><td>Height</td><td>${height || '-'}</td></tr>
        <tr><td>Marital Status</td><td>${marital_status || '-'}</td></tr>
        <tr><td>Religion</td><td>${religion || '-'}</td></tr>
        <tr><td>Caste</td><td>${finalCaste}</td></tr>
        <tr><td>Education</td><td>${education || '-'}</td></tr>
        <tr><td>Specialization</td><td>${specialization || '-'}</td></tr>
        <tr><td>Occupation</td><td>${occupation || '-'}</td></tr>
        <tr><td>Salary</td><td>${salary || '-'}</td></tr>
        <tr><td>Mobile</td><td>${mobile || '-'}</td></tr>
        <tr><td>Email</td><td>${email || '-'}</td></tr>
        <tr><td>Comments</td><td>${comments || '-'}</td></tr>
      </table>
    `;

    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Match Request - ${fullname || 'User'}`,
      html
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true })
    };

  } catch (error) {
    console.error('EMAIL ERROR:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
