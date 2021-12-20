const NotificationUser = require('../../notification-user/model/notificationUser.model');
const BriefMember = require('../../brief-member/model/briefMember.model');
const Brief = require('../../brief/model/brief.model');
const CompanyProfile = require('../../company-profile/model/companyProfile.model');
const OrganizationType = require('../../organization/model/organizationType.model');
const User = require('../../user/model/user.model');
const mailService = require('./mailService');
const BriefSupplier = require('../../brief-supplier/model/briefSupplier.model');
const CompanyRelation = require('../../company-relation/model/companyRelation.model');
const Interest = require('../../interests/model/interest.model');
const mongoose = require('mongoose');
const _ = require('lodash');
const Organization = require('../../organization/model/organization.model');
const day = 1000 * 60 * 60 * 24;
const mailLinkPrefix =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:4200/#/'
    : process.env.NODE_ENV === 'demo'
    ? 'https://xgrowth-test.azurewebsites.net/#/'
    : 'https://xgrowth.growinco.com/#/';
const videoFormats = ['mp4', 'wmv', 'avi', 'mov'];
let cpgTypeId;

// FUNCTIONS SCOPE
async function getCpgType() {
  try {
    const cpg = await OrganizationType.findOne({ name: 'CPG Industry' });
    cpgTypeId = cpg._id;
  } catch (error) {
    console.log(error);
  }
}

getCpgType();

function isVideo(file) {
  if (videoFormats.includes(file.Type)) return true;
  else return false;
}

function getVideoSource(url, fileOption) {
  const blobNameWithExtension = url.split('https://weleverimages.blob.core.windows.net/app-images/').pop();
  const blobExtension = blobNameWithExtension.split('.').pop();
  const blobName = blobNameWithExtension.split('.')[0];
  if (blobExtension && blobExtension !== '' && fileOption !== 'thumbnail.png') {
    return `https://weleverimages.blob.core.windows.net/app-images/${blobName}-${fileOption}.${blobExtension}`;
  } else {
    return `https://weleverimages.blob.core.windows.net/app-images/${blobName}-${fileOption}`;
  }
}

async function getRecipientCompanies(post, loggedUser) {
  let receiverCompanies;
  switch (post.Privacy) {
    case 'All Companies':
      receiverCompanies = await CompanyProfile.find({ $or: [{ disable: false }, { disable: undefined }] });
      break;
    case 'My Organization':
      const userCompany = await CompanyProfile.findOne({ _id: loggedUser.company });
      receiverCompanies = await CompanyProfile.find({
        $or: [{ disable: false }, { disable: undefined }],
        organization: mongoose.Types.ObjectId(userCompany.organization),
      });
      break;
    case 'Potential Clients':
      const companyId = {
        $or: [{ companyB: mongoose.Types.ObjectId(loggedUser.company) }],
      };
      const companyRelations = await CompanyRelation.find(companyId);
      const relationIds = companyRelations.map((cr) => {
        return cr.companyA;
      });
      const cpgOrganizations = await Organization.find({ organizationType: mongoose.Types.ObjectId(cpgTypeId) });
      const cpgOrganizationsIds = cpgOrganizations.map((org) => org._id);
      const cpgCompanies = await CompanyProfile.find({ organization: { $in: cpgOrganizationsIds } });
      const cpgCompanyIds = cpgCompanies.map((comp) => comp._id);
      const companyIds = relationIds.concat(cpgCompanyIds);
      receiverCompanies = await CompanyProfile.find({
        $or: [{ disable: false }, { disable: undefined }],
        _id: { $in: companyIds },
      });
      break;
    case 'Selected Companies':
      receiverCompanies = await CompanyProfile.find({
        $or: [{ disable: false }, { disable: undefined }],
        _id: { $in: post.RecipientsCompanyProfileId },
      });
      break;
    default:
      break;
  }
  return receiverCompanies;
}
// END OF FUNCTIONS SCOPE

exports.getNotifications = async (notificationData, loggedUser) => {
  let notifications = [];
  let briefSuppliers;
  let brief;
  let briefMember = {};
  let companyUsers;
  let mailData;
  let company = {};
  let users;
  let notification = {};
  let receiversUsers;
  let solverIds = [];

  switch (notificationData.type) {
    case 'brief-decline-notification':
      briefMember = await BriefMember.findOne({
        BriefId: mongoose.Types.ObjectId(notificationData.brief._id),
        IsContact: true,
      }).populate('UserId');
      notification.title = 'A solver declined your Brief';
      notification.description = `${notificationData.company.companyName} declined your Brief: ${notificationData.brief.Title}`;
      notification.link = `/briefs/my-brief/${notificationData.brief._id}/participating-solvers`;
      notification.briefId = notificationData.brief._id;
      notification.receiverId = briefMember.UserId._id;
      notifications.push(_.cloneDeep(notification));
      mailData = {
        body: {
          companyName: notificationData.company.companyName,
          userEmail: briefMember.UserId.email,
          briefName: notificationData.brief.Title,
        },
      };
      mailService.sendSupplierDeclinedBriefMessage(mailData);
      break;
    case 'brief-nda-upload':
      const receivers = await User.find({ _id: { $in: notificationData.receiversIDs } });
      notification.brief = `${notificationData.brief.Title}`;
      notification.companyName = `${notificationData.company.companyName}`;
      notification.title = `${notificationData.company.companyName} uploaded an NDA to ${notificationData.brief.Title}`;
      notification.description = `${notificationData.company.companyName} uploaded an NDA to ${notificationData.brief.Title}`;
      notification.link = `briefs/my-brief/${notificationData.brief._id}/participating-solvers`;
      notification.briefId = notificationData.brief._id;
      receivers.map((receiver) => {
        notification.receiverId = receiver._id;
        notifications.push(_.cloneDeep(notification));
        mailData = {
          body: {
            receiverEmail: receiver.email,
            firstName: receiver.firstName,
            brief: notificationData.brief.Title,
            companyName: notificationData.company.companyName,
            link: `${mailLinkPrefix}${notification.link}`,
          },
        };
        mailService.sendSignedNDAMessage(mailData);
      });
      break;
    case 'brief-nda-acceptance':
      brief = await Brief.findById({ _id: notificationData.briefSupplier.BriefId });
      companyUsers = await User.find({
        company: mongoose.Types.ObjectId(notificationData.briefSupplier.SupplierId._id),
      });
      notification.title = `NDA Acceptance for Brief: ${brief.Title}`;
      notification.description = 'Your NDA has been accepted!';
      notification.link = `/briefs/accept/${notificationData.briefSupplier.BriefId}`;
      notification.briefId = notificationData.briefSupplier.BriefId;
      companyUsers.map((user) => {
        notification.receiverId = user.id;
        notifications.push(_.cloneDeep(notification));
        mailData = {
          body: {
            userEmail: user.email,
            brief: brief.Title,
          },
        };
        mailService.sendNDAAcceptedMessage(mailData);
      });
      break;
    case 'brief-nda-decline':
      brief = await Brief.findById({ _id: notificationData.briefSupplier.BriefId });
      companyUsers = await User.find({ company: notificationData.briefSupplier.SupplierId });
      notification.title = `NDA declined for Brief: ${brief.Title}`;
      notification.description = `Decline reason: ${notificationData.briefSupplier.NdaAcceptanceReason}`;
      notification.link = `/briefs/upload/${notificationData.briefSupplier.BriefId}`;
      notification.briefId = notificationData.briefSupplier.BriefId;
      companyUsers.map((user) => {
        notification.receiverId = user.id;
        notifications.push(_.cloneDeep(notification));
        mailData = {
          body: {
            userEmail: user.email,
            brief: brief.Title,
            ndaDeclineReason: notificationData.briefSupplier.NdaAcceptanceReason,
          },
        };
        mailService.sendNDADeclineMessage(mailData);
      });
      break;
    case 'post-share':
      notification.title = 'New post shared with you!';
      notification.description = `${notificationData.user.firstName} ${notificationData.user.familyName} shared a post with you`;
      notification.receiverId = notificationData.coworker._id;
      notification.link = `/post/details/${notificationData.postId}`;
      notification.postId = notificationData.postId;
      notifications.push(_.cloneDeep(notification));
      break;
    case 'organization-share':
      notification.title = `${req.user.firstName} ${req.user.familyName} shared an organization profile with you. Check it out!`;
      notification.description = `${notificationData.user.firstName} ${notificationData.user.familyName} shared an organization with you`;
      notification.receiverId = notificationData.coworkerId;
      notification.link = `/organization/${notificationData.organizationId}/overview`;
      notification.organizationId = notificationData.organizationId;
      notifications.push(_.cloneDeep(notification));
      break;
    case 'new-brief':
      solverIds = notificationData.solvers.map((solver) => {
        return solver._id;
      });
      users = await User.find({ company: { $in: solverIds } });
      notification.title = `New Brief posted by ${notificationData.brief.ClientId.companyName}`;
      notification.description = notificationData.brief.Title;
      if (notificationData.brief.NdaRequirementMode === 2 || notificationData.brief.Nda === null) {
        notification.link = `briefs/accept/${notificationData.brief._id}`;
      } else {
        notification.link = `briefs/upload/${notificationData.brief._id}`;
      }
      notification.briefId = notificationData.brief._id;
      users.map((user) => {
        notification.receiverId = user._id;
        notifications.push(_.cloneDeep(notification));
        mailData = {
          body: {
            userEmail: user.email,
            link: `${mailLinkPrefix}${notification.link}`
          },
        };
        mailService.sendNewBriefMessage(mailData);
      });

      if (!notificationData.previouslyPublished) createBriefMemberRoleNotifications(notificationData.brief, notifications, loggedUser);
      
      mailService.sendNewBriefMessage({
        body: {
          userEmail: 'support@growinco.com',
        },
      });
      break;
    case 'new-post':
      let companies;
      const url = isVideo(notificationData.post.UploadedFiles[0])
        ? getVideoSource(notificationData.post.UploadedFiles[0].url, 'thumbnail.png')
        : notificationData.post.UploadedFiles[0].url;
      recipients = notificationData.post.RecipientsCompanyProfileId;
      notification.title = 'New Post of your interest!';
      notification.description = `Post by ${notificationData.userCompany.companyName}`;
      notification.link = `post/details/${notificationData.post._id}`;
      notification.postId = notificationData.post._id;
      companies = await getRecipientCompanies(notificationData.post, loggedUser);
      let companyIds = companies.map((comp) => {
        return comp._id;
      });
      companyIds = _.uniqWith(companyIds, _.isEqual);
      users = await User.find({ company: { $in: companyIds } });
      let index = 0;
      while (index < users.length) {
        let interests = await Interest.find({ userId: mongoose.Types.ObjectId(users[index]._id) });
        let categoryIds = interests.map((interest) => {
          return interest.categoryId.toString();
        });
        let found = notificationData.post.Categories.some((categoryId) => {
          return categoryIds.includes(categoryId.toString());
        });
        if (found && users[index]._id.toString() !== loggedUser._id.toString()) {
          notification.receiverId = users[index]._id;
          notifications.push(_.cloneDeep(notification));
          mailData = {
            body: {
              userEmail: users[index].email,
              firstName: users[index].firstName,
              companyName: notificationData.userCompany.companyName,
              imageURL: url,
              postDescription: notificationData.post.Description,
              postTitle: notificationData.post.Title,
              link: `${mailLinkPrefix}${notification.link}`,
            },
          };
          mailService.sendNewPostMessage(mailData);
        }
        index += 1;
      }
      break;
    case 'brief-accept':
      let briefContact = await BriefMember.findOne({
        BriefId: mongoose.Types.ObjectId(notificationData.briefId),
        IsContact: true,
      }).populate('UserId');
      const currentUserCompany = await CompanyProfile.findById({ _id: loggedUser.company });
      notification.title = `${currentUserCompany.companyName} accepted your Brief!`;
      notification.receiverId = briefContact.UserId._id;
      notification.link = `/briefs/my-brief/${notificationData.briefId}/participating-solvers`;
      notification.briefId = notificationData.briefId;
      notifications.push(_.cloneDeep(notification));
      mailData = {
        body: {
          briefContact,
          currentUserCompany,
        },
      };
      mailService.sendSupplierAcceptedBriefMessage(mailData);
      break;
    case 'brief-changes':
      briefSuppliers = await BriefSupplier.find({
        BriefId: mongoose.Types.ObjectId(notificationData.brief._id),
        Accepted: true,
      });
      const briefCompany = notificationData.brief.ClientId;
      solverIds = briefSuppliers.map((briefSupplier) => {
        return briefSupplier.SupplierId;
      });
      receiversUsers = await User.find({ company: { $in: solverIds } });

      if (notificationData.briefChanges.includes('Deadline')) {
        const newDeadline = new Date(notificationData.brief.Deadline).toDateString();
        notification.title = `${notificationData.brief.Title} has a new deadline: ${newDeadline}`;
        notification.description = '';
        notification.briefId = notificationData.brief._id;
        receiversUsers.map((user) => {
          const currentBriefSupplier = briefSuppliers.find((bs) => {
            return bs.SupplierId.toString() === user.company.toString();
          });
          const hasNda = notificationData.brief.Nda || currentBriefSupplier.Nda;
          const ndaDenied = currentBriefSupplier.NdaAcceptance === 2;
          const pendingNda = currentBriefSupplier.NdaAcceptance === 3;
          if ((hasNda && ndaDenied) || pendingNda) {
            notification.link = `briefs/upload/${notificationData.brief._id}`;
          } else {
            notification.link = `briefs/accept/${notificationData.brief._id}`;
          }
          notification.receiverId = user._id;
          notifications.push(_.cloneDeep(notification));
          mailData = {
            body: {
              user,
              brief: notificationData.brief,
              newDeadline,
              link: `${mailLinkPrefix}${notification.link}`,
            },
          };
          mailService.sendBriefChangeDeadlineMessage(mailData);
        });
      }
      if (notificationData.briefChanges.includes('Description')) {
        notification.title = `${notificationData.brief.Title} description was updated`;
        notification.description = '';
        notification.briefId = notificationData.brief._id;
        receiversUsers.map((user) => {
          const currentBriefSupplier = briefSuppliers.find((bs) => {
            return bs.SupplierId.toString() === user.company.toString();
          });
          const hasNda = notificationData.brief.Nda || currentBriefSupplier.Nda;
          const ndaDenied = currentBriefSupplier.NdaAcceptance === 2;
          const pendingNda =
            currentBriefSupplier.NdaAcceptance === 3 || currentBriefSupplier.NdaAcceptance === undefined;
          if (hasNda && (ndaDenied || pendingNda)) {
            notification.link = `briefs/upload/${notificationData.brief._id}`;
          } else {
            notification.link = `briefs/accept/${notificationData.brief._id}`;
          }
          notification.receiverId = user._id;
          notifications.push(_.cloneDeep(notification));
          mailData = {
            body: {
              user,
              companyName: briefCompany.companyName,
              brief: notificationData.brief,
              link: `${mailLinkPrefix}${notification.link}`,
            },
          };
          mailService.sendBriefChangeDescriptionMessage(mailData);
        });
      }
      if (notificationData.briefChanges.includes('Attachments')) {
        notification.title = `There's new attachment(s) available on ${notificationData.brief.Title} brief`;
        notification.description = '';
        notification.briefId = notificationData.brief._id;
        receiversUsers.map((user) => {
          const currentBriefSupplier = briefSuppliers.find((bs) => {
            return bs.SupplierId.toString() === user.company.toString();
          });
          const hasNda = notificationData.brief.Nda || currentBriefSupplier.Nda;
          const ndaDenied = currentBriefSupplier.NdaAcceptance === 2;
          const pendingNda = currentBriefSupplier.NdaAcceptance === 3;
          if ((hasNda && ndaDenied) || pendingNda) {
            notification.link = `briefs/upload/${notificationData.brief._id}`;
          } else {
            notification.link = `briefs/accept/${notificationData.brief._id}`;
          }
          notification.receiverId = user._id;
          notifications.push(_.cloneDeep(notification));
          mailData = {
            body: {
              userEmail: user.email,
              companyName: briefCompany.companyName,
              briefName: notificationData.brief.Title,
              link: `${mailLinkPrefix}${notification.link}`,
            },
          };
          mailService.sendBriefChangeAttachmentMessage(mailData);
        });
      }
      break;
    case 'brief-response':
      const briefResponseInfo = notificationData.briefResponse;
      const { _id: briefResponseId } = briefResponseInfo;
      const { BriefId } = briefResponseInfo;
      // Titulo do brief que foi respondido
      const { Title } = await Brief.findById(BriefId);
      //Todos os Solvers que pertencem ao brief
      const userInformation = await BriefMember.find({ BriefId }).populate('UserId', User);
      const user = _.map(userInformation, 'UserId');
      const userIdentifier = _.map(user, '_id');
      const firstName = _.map(user, 'firstName');
      const email = _.map(user, 'email');
      // Nome da Company que respondeu o Brief
      const {
        CreatedBy: { company },
      } = notificationData.briefResponse;
      const { companyName } = await CompanyProfile.findById(company);

            mailData = {
                body: {
                    userEmail: emailWelcomeMessage,
                    firstName: firstNameWelcomeMessage,
                    templateId
                }
            }

            await mailService.sendWelcomeMessage(mailData);
            break;
        case 'post-rating-answered':
            let userId = notificationData.user;
            let userInformationRating = await User.findById(userId);
            
            let emailPostRating = userInformationRating.email;
            let postTitlePostRating = notificationData.post.postTitle;
            let firstNamePostRating = userInformationRating.firstName;
            let commentPreviewPostRating = notificationData.post.commentPreview;

            notification.title = 'Your post ' + notificationData.post.postTitle + ' received a reply';
            notification.description = '';
            notification.receiverId =  userInformationRating._id;
            notification.link = `/post/details/${notificationData.post.id}`;
            notification.postId = notificationData.post.id;
            
            notifications.push(_.cloneDeep(notification));

            mailData = {
                body: {
                    userEmail: emailPostRating,
                    firstName: firstNamePostRating,
                    postTitle: postTitlePostRating,
                    commentPreview: commentPreviewPostRating,
                    link: `${mailLinkPrefix}${notification.link}`
                }
            }

            await mailService.sendPostRatingAnsweredMessage(mailData);
            break;
        case 'new-post-rating':
            let emailNewRating = notificationData.user.email;
            let firstNameNewRating = notificationData.user.firstName;
            let postTitleNewRating = notificationData.post.postTitle;
            let organizationId = notificationData.post.organizationName;
            let commentPreviewNewRating = notificationData.post.commentPreview; 
            let reasonNewRating = notificationData.post.reason; 

            
            let orgInformationRating = await Organization.findById(organizationId);
            let orgNameNewRating = orgInformationRating.name;

            notification.title = 'Your post ' + notificationData.post.postTitle + ' has been rated';
            notification.description = '';
            notification.receiverId =  notificationData.user._id;
            notification.link = `/post/details/${notificationData.post.id}`;
            notification.postId = notificationData.post.id;

            notifications.push(_.cloneDeep(notification));

            mailData = {
                body: {
                    userEmail: emailNewRating,
                    firstName: firstNameNewRating,
                    postTitle: postTitleNewRating,
                    organizationName: orgNameNewRating,
                    commentPreview: commentPreviewNewRating,
                    reason: reasonNewRating,
                    link: `${mailLinkPrefix}${notification.link}`
                }
            }

            await mailService.sendNewPostRatingMessage(mailData);
            break;
        case 'admin-panel-notification':
            const receiverUsers = await User.find({
                blocked: {
                    $ne: true
                }
            });
            receiverUsers.map((u) => {
                notification.title = notificationData.title;
                notification.link = notificationData.link;
                notification.receiverId = u._id;
                notifications.push(_.cloneDeep(notification));
            });
            break;
        default:
            break;
    }

  return notifications;
};

async function createBriefMemberRoleNotifications(brief, notifications, currentUser) {
  let notification = {};
  const briefMembers = await BriefMember.find({
    BriefId: brief._id,
    $or: [{ Admin: true }, { IsContact: true }],
  }).populate('UserId');
  briefMembers.map((member) => {
    const isCurrentUser = member.UserId._id === currentUser._id;
    const user = member.UserId;
    if (!isCurrentUser) {
      let role;
      if (member.IsContact) role = 'main contact';
      else role = 'admin';
      notification.title = `You have been selected as ${role} to ${brief.Title} brief`;
      notification.description = '';
      notification.receiverId = user._id;
      notification.briefId = brief._id;
      notification.link = `/briefs/my-brief/${brief._id}`;
      notifications.push(_.cloneDeep(notification));
      const mailData = {
        body: {
          userEmail: member.UserId.email,
          userName: member.UserId.firstName,
          briefName: brief.Title,
          role,
        },
      };
      mailService.sendBriefMemberRoleMessage(mailData);
    }
  });
}

function clearNotificationsPerMonth() {
  setInterval(() => {
    const month = day * 29;
    const lastMonth = Date.now() - month;
    NotificationUser.updateMany(
      {
        read: true,
        display: true,
        readOn: { $lt: lastMonth },
      },
      { $set: { display: false } }
    ).then(() => {});
  }, day);
}

function sendNDAReviewNotifications() {
  setInterval(() => {
    const lastDay = Date.now() - day;
    BriefSupplier.find({ NdaAcceptance: 3, SignedNdaOn: { $lt: lastDay } })
      .populate('BriefId')
      .populate('SupplierId')
      .then((resSup) => {
        let briefs = resSup.map((briefSupplier) => {
          return briefSupplier.BriefId;
        });
        briefs = _.uniqWith(briefs, _.isEqual);
        briefs.map((brief) => {
          const briefLink = `briefs/my-brief/${brief._id}/participating-solvers`;
          const briefIsActive = Date.now() <= brief.Deadline;
          if (briefIsActive) {
            BriefMember.find({ BriefId: brief._id, Admin: true })
              .populate('UserId')
              .then((resMemb) => {
                const briefSuppliers = resSup.filter((briefSupplier) => {
                  return briefSupplier.BriefId._id.toString() === brief._id.toString();
                });
                let solvers = briefSuppliers.map((briefSupplier) => {
                  return briefSupplier.SupplierId.companyName;
                });
                solvers = _.uniqWith(solvers, _.isEqual);
                const solversNames = solvers.join();
                resMemb.map((member) => {
                  const mailData = {
                    body: {
                      userEmail: member.UserId.email,
                      userName: member.UserId.firstName,
                      briefName: brief.Title,
                      solvers: solversNames,
                      link: `${mailLinkPrefix}${briefLink}`,
                    },
                  };
                  mailService.sendNDAReviewReminder(mailData);
                });
              });
          }
        });
      });
  }, day);
}

exports.startNotificationsSending = () => {
  sendNDAReviewNotifications();
  clearNotificationsPerMonth();
};
