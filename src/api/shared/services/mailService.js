/* eslint-disable prefer-const */
/* eslint-disable camelcase */
const sgMail = require('@sendgrid/mail');
const vars = require('../../../config/vars');
const generate = require('nanoid/generate');
const Company = require('../../company-profile/model/companyProfile.model');
const MailAction = require('../../mail-action/model/mailAction.model');
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';


sgMail.setApiKey(vars.SENDGRID_API_KEY_SECRET);

exports.sendResetPasswordMail = async (userEmail, password) => {
  const msg = {
    to: userEmail,
    from: vars.senderEmail,
    templateId: 'd-783cef0ad13a4436bf112a02567f3e1e',
    dynamic_template_data: {
      userEmail,
      password,
    },
    // subject: 'Welever - New password',
    // html: `
    // <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:20% !important; width:20%; height:auto !important;" width="120" alt="" data-proportionally-constrained="true" data-responsive="true" src="http://cdn.mcauto-images-production.sendgrid.net/2ffe5d7e66ebe4ed/b094debe-f145-4d67-bdfd-9e8919a2f314/2276x2132.png">
    // <br /><br /><span style="font-size: 1.2rem">Dear user,</span>
    // <br /><br /><span style="font-size: 1.2rem">You are receiving a new password.</span>
    // <br /><span style="font-size: 1.2rem">We recommend that you change it after your first login.</span>
    // <br /><br /><strong>${password}</strong>
    // <br /><br /><span style="font-size: 1.2rem">Best regards,</span>
    // <br /><span style="font-size: 1.2rem">Welever Team</span>
    // <br /><br />© Welever by GrowinCo
    // <br /><a href="https://welever.growinco.com">https://welever.growinco.com</a>
    // `,
  };
  try {
    sgMail.send(msg);
  } catch (error) {
    console.log(error);
  }
};

exports.sendContactMessage = async (name, email, subject, message, receiver) => {
  const msg = {
    to: receiver,
    from: vars.senderEmail,
    templateId: 'd-df0cd854bb874f5b937a278eb98dbc78',
    dynamic_template_data: {
      name,
      email,
      subject,
      message,
    },
  };
  sgMail.send(msg);
};

exports.sendNewUserMessage = async (firstName, familyName, userEmail, password) => {
  const msg = {
    to: userEmail,
    from: vars.senderEmail,
    templateId: 'd-997b59ba11484fe189b037403a67dc9f',
    dynamic_template_data: {
      firstName,
      familyName,
      userEmail,
      password,
    },
  };
  sgMail.send(msg);
};

exports.sendWelcomeMessage =  async (req, next) => {
  let userEmail = req.body.userEmail;
  let firstName = req.body.firstName;
  const msg = {
    to: req.body.userEmail,
    from: 'george@growinco.com',
    templateId: req.body.templateId,
    dynamic_template_data: {
      firstName,
      userEmail,
    },
  };
  sgMail.send(msg);
};


exports.sendFollowUpMessage =  async (req, next) => {
  let userEmail = req.body.userEmail;
  let firstName = req.body.firstName;
  const msg = {
    to: req.body.userEmail,
    from: 'guillermo.medrano@growinco.com',
    templateId: 'd-e2902c69052742979d92d01fae474212',
    dynamic_template_data: {
      firstName,
      userEmail,
    },
  };
  sgMail.send(msg);
};

exports.sendCompleteOrgProfileFupMessage =  async (req, next) => {
  let userEmail = req.body.userEmail;
  let firstName = req.body.firstName;
  const msg = {
    to: req.body.userEmail,
    from: 'george@growinco.com',
    templateId: 'd-d9517865058f474cbd9c47e9c4f1db73',
    dynamic_template_data: {
      firstName,
      userEmail,
    },
  };
  sgMail.send(msg);
};

exports.sendCompleteOrgProfileRemember4Days =  async (req, next) => {
  let userEmail = req.body.userEmail;
  let firstName = req.body.firstName;
  const msg = {
    to: req.body.userEmail,
    from: 'george@growinco.com',
    templateId: 'd-fa59e8984b564f479c11f334a9eff8d4',
    dynamic_template_data: {
      firstName,
      userEmail,
    },
  };
  const entity = new MailAction({ receiverId: req.body.userId, type: 'org-profile-complete' });
  entity.save();
  sgMail.send(msg);
};

exports.sendCompleteOrgExtManufacturingRemember4Days =  async (req, next) => {
  let userEmail = req.body.userEmail;
  let firstName = req.body.firstName;
  let mailActions = await MailAction.find({ receiverId: user._id, type: 'org-profile-complete' });
  const msg = {
    to: req.body.userEmail,
    from: 'george@growinco.com',
    templateId: 'd-cddbc8d019954fe785541eb42cecc2c9',
    dynamic_template_data: {
      firstName,
      userEmail,
    },
  };
  const entity = new MailAction({ receiverId: user._id, type: 'org-profile-complete' });
  entity.save();
  sgMail.send(msg);
};

exports.newUserEmail = async (email) => {
  const msg = {
      to: vars.contactEmail,
      from: vars.senderEmail,
      subject: 'A new user has registered in xgrowth!',
      html: 
      `<p><h2><span style="color: orange">
        ${email} has just registered in xgrowth, contact them!
      </span></h2></p>`,
  };


  sgMail.send(msg).then(() => 
      console.log("Message Sent Successfully")
  ).catch((error) =>{
      console.log(error.body);
      console.log('error', error.response.body.errors);
  });
}

exports.sendAccountActivationMessage = async (userEmail, activationKey) => {
  const msg = {
    to: userEmail,
    from: vars.senderEmail,
    templateId: 'd-bf6fe81723af46f69ae3a5986f47ec18',
    dynamic_template_data: {
      userEmail,
      buttonLink: `${vars.CLIENT_BASE_URL}/#/login?activationKey=${activationKey}`,
    },
  };
  sgMail.send(msg);
};

exports.sendForgottenPasswordMessage = async (userEmail, reactivationKey) => {
  const key = reactivationKey;
  const msg = {
    to: userEmail,
    from: vars.senderEmail,
    templateId: 'd-e663647fdad54a90bb472063febe7a1f',
    dynamic_template_data: {
      userEmail,
      buttonLink: `${vars.CLIENT_BASE_URL}/#/reactivate?reactivationKey=${key}`,
    },
  };
  sgMail.send(msg);
};

exports.sendAccountReactivationMessage = async (userEmail, reactivationKey) => {
  const key = reactivationKey;
  const msg = {
    to: userEmail,
    from: vars.senderEmail,
    templateId: 'd-c39fd4bff5b84d5aaba130a90ee160cd',
    dynamic_template_data: {
      userEmail,
      buttonLink: `${vars.CLIENT_BASE_URL}/#/reactivate?reactivationKey=${key}`,
    },
  };
  sgMail.send(msg);
};

exports.sendAccountReactivationMessageFromClient = async (req, res) => {
  const key = await generate(alphabet, 20);
  const userEmail = req.body.userEmail;
  const msg = {
    to: userEmail,
    from: vars.senderEmail,
    templateId: 'd-c39fd4bff5b84d5aaba130a90ee160cd',
    dynamic_template_data: {
      userEmail,
      buttonLink: `${vars.CLIENT_BASE_URL}/#/reactivate?reactivationKey=${key}`,
    },
  };
  sgMail.send(msg);
  res.json(key);
};

exports.sendSupplierAcceptedBriefMessage = async (req, next) => {
  const msg = {
    to: req.body.userEmail,
    // to: vars.contactEmail,
    from: vars.senderEmail,
    templateId: 'd-b87605ff700b456a80145112f14c539c',
    asm: { group_id: 16056, groups_to_display: [ 16056 ] },
    dynamic_template_data: {
      userEmail: req.body.userEmail,
      firstName: req.body.firstName,
      companyName: req.body.companyName,
    },
  };
  sgMail.send(msg);
};

exports.sendSupplierDeclinedBriefMessage = async (req, next) => {
  const msg = {
    to: req.body.userEmail,
    from: vars.senderEmail,
    templateId: 'd-4224b80c2a3f46f1b0c4123afa6f70af',
    dynamic_template_data: {
      briefName: req.body.briefName,
      companyName: req.body.companyName,
    },
  };
  sgMail.send(msg);
};

// new post
exports.sendNewPostMessage = async (req, next) => {
  const { firstName, companyName, imageURL, userEmail, postDescription, link, postTitle } = req.body;
  const truncatedDescription = postDescription.slice(0, 120);
  const msg = {
    to: userEmail,
    from: vars.senderEmail,
    templateId: 'd-3630ca6cdd8e49eabea31909aa81ae16',
    asm: { group_id: 16056, groups_to_display: [ 16056 ] },
    dynamic_template_data: {
      firstName,
      companyName,
      imageURL,
      truncatedDescription,
      link,
      postTitle
    },
  };
  sgMail.send(msg);
};

/**
 * Seend Weekly Post Notifications to all users email.
 * @public
 */
exports.sendWeeklyPostNotifications = async (msg) => {
  try {
    const result = await sgMail.send(msg);
    return result;
  } catch (error) {
    console.log(error.message, 'error');
  }
};

exports.sendWebinarInvitations = async (req, next) => {
  const {
    imageURL,
    userEmails,
    webinarDescription,
    link,
    title,
    meetingLink,
    attachments,
  } = req.body;
  const truncatedDescription = webinarDescription.slice(0, 120);
  const msg = {
    attachments,
    to: vars.contactEmail,
    bcc: userEmails,
    from: vars.senderEmail,
    templateId: 'd-c48fb6fbf3ee4b8a9455023b9c1b1975',
    asm: { group_id: 16056, groups_to_display: [16056] },
    subject: 'You have been invited to a webinar!',
    dynamic_template_data: {
      imageURL,
      truncatedDescription,
      link,
      title,
      meetingLink,
    },
  };
  sgMail.send(msg);
};

exports.sendWebinarCreatedMessage = async (req, next) => {
  const { createdBy, webinarTitle } = req;
  const msg = {
    to: vars.contactEmail,
    from: vars.senderEmail,
    subject: 'New webinar created! Review needed.',
    html: `<span style="font-weight: bold; font-size: 1.2rem">A new webinar has been submitted by: </span> ${createdBy}<br />
    <br /><span style="font-weight: bold; font-size: 1.2rem">Webinar title: </span>${webinarTitle}<br />`,
  };
  sgMail.send(msg);
};

exports.sendWebinarApproval = async (req, next) => {
  const { firstName, imageURL, userEmail, webinarDescription, link, title } = req.body;
  const truncatedDescription = webinarDescription.slice(0, 120);
  const msg = {
    to: userEmail,
    from: vars.senderEmail,
    templateId: 'd-52b33ac1d63747d680652b5ea81423e8',
    asm: { group_id: 16056, groups_to_display: [ 16056 ] },
    dynamic_template_data: {
      firstName,
      imageURL,
      truncatedDescription,
      link,
      title
    },
  };
  sgMail.send(msg);
};

exports.sendWebinarDenial = async (req, next) => {
  const { firstName, imageURL, denialReason, userEmail, webinarDescription, link, title } = req.body;
  const truncatedDescription = webinarDescription.slice(0, 120);
  const msg = {
    to: userEmail,
    from: vars.senderEmail,
    templateId: 'd-83b7d8a31a424c02898d46f2c085cf4e',
    asm: { group_id: 16056, groups_to_display: [ 16056 ] },
    dynamic_template_data: {
      firstName,
      imageURL,
      denialReason,
      truncatedDescription,
      link,
      title
    },
  };
  sgMail.send(msg);
};

exports.sendNewBriefMessage = async (req, next) => {
  const msg = {
    to: req.body.userEmail,
    from: vars.senderEmail,
    templateId: 'd-de028b33c26e4e71be5f4557a43b8a94',
       asm: { group_id: 16056, groups_to_display: [ 16056 ] },
    dynamic_template_data: {
      userEmail: req.body.userEmail,
      link: req.body.link,
    },
  };
  sgMail.send(msg);
};

exports.sendBriefMemberRoleMessage = async (req, next) => {
  try {
    const adminDescription = 'Your role as a Brief Administrator is to manage the Brief, accept or decline the submitted NDAs and edit the information, at any time.';
    const mainContactDescription = 'Your role as a Brief Contact is to answer suppliers` technical questions, as your e-mail was made available for suppliers` contact. Whenever suppliers click on "Contact" button, the platform will address the questions to you!';
    const formalRole = req.body.role === 'admin' ? 'Brief Administrator' : 'Brief Contact';
    const roleDescription = req.body.role === 'admin' ? adminDescription : mainContactDescription;
    const msg = {
      to: req.body.userEmail,
      from: vars.senderEmail,
      templateId: 'd-f6afcabb60954b9088a2f2d6fe14ed79',
      asm: { group_id: 16056, groups_to_display: [ 16056 ] },
      dynamic_template_data: {
        userName: req.body.userName,
        briefName: req.body.briefName,
        role: req.body.role,
        roleDescription,
        formalRole
      }
    };
    sgMail.send(msg);
  } catch (error) {
    console.log(error);
  }
}

exports.sendNewBriefResponse = async (req, res, next) => {
  try{
    const {userEmail, briefTitle, firstName, companyName} = req.body
     const msg = {
    to: userEmail,
    subject: companyName,
    from: vars.senderEmail,
    templateId: 'd-f4e37cf118ae43498a63a469ea8b739a',
    asm: { group_id: 16056, groups_to_display: [ 16056 ] },
    dynamic_template_data: {
      firstName,
      companyName,
     briefTitle,
    },
  }
  sgMail.send(msg);
  }catch(e){
    return e
  }
}

exports.sendNDAAcceptedMessage = async (req, next) => {
  const msg = {
    to: req.body.userEmail,
    // to: vars.contactEmail,
    from: vars.senderEmail,
    templateId: 'd-6240343f8ca74082b6219539a2dcc7be',
    asm: { group_id: 16056, groups_to_display: [ 16056 ] },
    dynamic_template_data: {
      userEmail: req.body.userEmail,
      brief: req.body.brief,
    },
  };
  sgMail.send(msg);
};

exports.sendNDADeclineMessage = async (req, next) => {
  const msg = {
    to: req.body.userEmail,
    // to: vars.contactEmail,
    from: vars.senderEmail,
    templateId: 'd-2d40537d66cf423198016a4f82bf9a6e',
    dynamic_template_data: {
      userEmail: req.body.userEmail,
      brief: req.body.brief,
      ndaDeclineReason: req.body.ndaDeclineReason,
    },
  };
  sgMail.send(msg);
};

exports.sendNDAReviewReminder = async (req, next) => {
  try {
    const msg = {
      to: req.body.userEmail,
      from: vars.senderEmail,
      templateId: 'd-dd39161d44c44256bb546ae55ab5edd6',
      dynamic_template_data: {
        userEmail: req.body.userEmail,
        userName: req.body.userName,
        briefName: req.body.briefName,
        solversNames: req.body.solvers,
        link: req.body.link
      },
    };
    sgMail.send(msg);
  } catch (error) {
    console.log(error);
  }
}

exports.sendSignedNDAMessage = async (req, next) => {
  console.log(req.body);
  const { receiverEmail, firstName, brief, companyName, link } = req.body;
  const msg = {
    to: receiverEmail,
    from: vars.senderEmail,
    templateId: 'd-1a38abbdc0f546dd96806026118764e9',
      asm: { group_id: 16056, groups_to_display: [ 16056 ] },
    dynamic_template_data: {
      brief,
      firstName,
      companyName,
      link
    },
  };
  sgMail.send(msg);
};

exports.sendInviteMessage = async (
  userEmail,
  firstName,
  familyName,
  company,
  message,
  invitationKey,
) => {
  const msg = {
    to: userEmail,
    from: vars.senderEmail,
    templateId: 'd-6941cee79b3b4d178b82d2d1ae995349',
    dynamic_template_data: {
      userEmail,
      firstName,
      familyName,
      company,
      message,
      buttonLink: `${vars.CLIENT_BASE_URL}/#/register?invitationKey=${invitationKey}`,
    },
  };
  sgMail.send(msg);
};

exports.sendBriefChangeDeadlineMessage = async (req, next) => {
  try {
    const briefName = req.body.brief.Title;
    const userName = req.body.user.firstName;
    const newDeadline = req.body.newDeadline;
    const link = req.body.link;
    const msg = {
      to: req.body.user.email,
      from: vars.senderEmail,
      templateId: 'd-808d9138b6dd40e88fe9413fd6768277',
      dynamic_template_data: {
        briefName, 
        userName, 
        newDeadline, 
        link
      }
    };
    sgMail.send(msg);
  } catch (error) {
    return console.log(error);
  }
}

exports.sendBriefChangeDescriptionMessage = async (req, next) => {
  console.log(req.body);
  try {
    const briefName = req.body.brief.Title;
    const userName = req.body.user.firstName;
    const companyName = req.body.companyName;
    const link = req.body.link;
    console.log(req.body);
    const msg = {
      to: req.body.user.email,
      from: vars.senderEmail,
      templateId: 'd-a0d52c5bf2904701b5651675ca89c7e2',
      dynamic_template_data: {
        briefName, 
        userName, 
        companyName, 
        link
      }
    };
    sgMail.send(msg);
  } catch (error) {
    console.log(error);
  }
}

exports.sendBriefChangeAttachmentMessage = async (req, next) => {
  try {
    const briefName = req.body.briefName;
    const companyName = req.body.companyName;
    const link = req.body.link;
    const msg = {
      to: req.body.userEmail,
      from: vars.senderEmail,
      templateId: 'd-7d3f6d443bae49f2b229545d07acb556',
      dynamic_template_data: {
        briefName, 
        companyName, 
        link
      }
    };
    sgMail.send(msg);
  } catch (error) {
    return console.log(error);
  }
}

exports.sendReferSolverMessage = async (req, next) => {
  try {
    const foundCompany = await Company.findById(req.user.company);
    const senderCompany = foundCompany.companyName;
    const { companyName, contactData } = req.body;
    const { contactEmail, contactPhone, briefName, briefOwner, briefCompany } = contactData
    const contactWebsite = req.body.contactData.website;
    const senderEmail = req.user.email;
    const msg = {
      to: vars.contactEmail,
      from: vars.senderEmail,
      templateId: 'd-8ce6d49a6765428ab49faaf78fc105b7',
      // group_id: 16056 - Unsubscribe de tudo. groups_to_display: unsubscribe options
      asm: { group_id: 16056, groups_to_display: [ 16056, 16059 ] },
      dynamic_template_data: {
        companyName,
        contactEmail,
        contactWebsite,
        contactPhone,
        senderCompany,
        senderEmail,
        briefName,
        briefOwner, 
        briefCompany
      }
    };
    sgMail.send(msg);
  } catch (error) {
    res.next(error);
  }
}

exports.sendProposalMessage = async (
  senderEmail,
  cost,
  freeCap,
  proposalED,
  proposalSD,
  proposalLine,
  message,
) => {
  const msg = {
    to: vars.contactEmail,
    from: vars.senderEmail,
    subject: 'New Proposal Received! Proposal Details',
    // eslint-disable-next-line max-len
    html: `<span style="font-weight: bold; font-size: 1.2rem">Proposal sent by: </span> ${senderEmail
    }<br /><br /><span style="font-weight: bold; font-size: 1.2rem">Message: </span>${message
    }<br /><br /><span style="font-weight: bold; font-size: 1.2rem">Listing Details: </span>` +
            `<br /><span style="font-weight: bold">Conversion Cost: </span>${cost
            }<br /><span style="font-weight: bold">Free Capacity: </span>${freeCap
            }<br /><span style="font-weight: bold">Start Date: </span>${proposalSD
            }<br /><span style="font-weight: bold">End Date: </span>${proposalED
            }<br /><span style="font-weight: bold">Proposal Line: </span>${proposalLine}`,

  };
  sgMail.send(msg);
};

exports.sendRequestMessage = async (
  senderEmail,
  productName,
  productLine,
  companyName,
  productDescription,
  message,
  packageType,
  productAmount,
) => {
  if (packageType === '' || packageType === undefined) {
    // eslint-disable-next-line no-param-reassign
    packageType = 'Not defined';
  }
  const msg = {
    to: vars.contactEmail,
    from: vars.senderEmail,
    subject: 'New Sample Requested! Request Details',
    html: `Requested By: ${senderEmail
    }<br /><br />Product Company: ${companyName
    }<br /><br />Product Name: ${productName
    }<br /><br />Product Line: ${productLine
    }<br /><br />Product Amount: ${productAmount
    }<br /><br />Product Description: ${productDescription
    }<br /><br />Package Type: ${packageType
    }<br /><br />Additional Details: ${message}`,
  };
  sgMail.send(msg);
};

exports.sendOrgProfileComplete = async (user) => {
  let userEmail = user.email;

  const mailActions = await MailAction.find({ receiverId: user._id, type: 'org-profile-complete' }).count();
  const msg = {
    to: userEmail,
    from: 'george@growinco.com',
    templateId: 'd-9445149ec8d24befae4c25188b1342f4',
    dynamic_template_data: {
      userEmail,
    },
  };

  if (mailActions < 1) {
    const entity = new MailAction({ receiverId: user._id, type: 'org-profile-complete' });
    entity.save();
    sgMail.send(msg);
  }
};
exports.sendPostRatingAnsweredMessage =  async (req, next) => {
  let userEmail = req.body.userEmail;
  let firstName = req.body.firstName;
  let postTitle = req.body.postTitle;
  let commentPreview = req.body.commentPreview; 
  let link = req.body.link;

  const msg = {
    to: userEmail,
    from: 'support@growinco.com',
    templateId: 'd-1ff9b1c6f907412da4408db6a799d2df',
    dynamic_template_data: {
      firstName,
      userEmail,
      postTitle,
      commentPreview,
      link,
    },
  };
  sgMail.send(msg);
};
exports.sendNewPostRatingMessage =  async (req, next) => {
  let userEmail = req.body.userEmail;
  let firstName = req.body.firstName;
  let postTitle = req.body.postTitle;
  let commentPreview = req.body.commentPreview; 
  let organizationName = req.body.organizationName;
  let reason = req.body.reason;
  let link = req.body.link;

  const msg = {
    to: userEmail,
    from: 'support@growinco.com',
    templateId: 'd-17a6a49f9d844477beb913c5c0ef023c',
    dynamic_template_data: {
      firstName,
      userEmail,
      postTitle,
      commentPreview,
      organizationName,
      reason,
      link,
    },
  };
  sgMail.send(msg);
};