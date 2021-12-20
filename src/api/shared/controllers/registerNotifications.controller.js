const {
  sendFollowUpMessage,
  sendCompleteOrgProfileFupMessage,
  sendCompleteOrgProfileRemember4Days,
  sendCompleteOrgExtManufacturingRemember4Days,
} = require("../services/mailService");
const User = require("../../user/model/user.model");
const Organization = require("../../organization/model/organization.model");
const OrganizationType = require("../../organization/model/organizationType.model");

class RegisterNotificationsController {
  constructor() {}

  async notify() {
    // Query 2 days ago
    var startDate = new Date().setDate(new Date().getDate() - 2);
    startDate = new Date(startDate).setHours(0, 0, 0, 0);
    var endDate = new Date().setDate(new Date().getDate() - 1);
    endDate = new Date(endDate).setHours(0, 0, 0, 0);

    var followUpUsers = await User.find({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    if (followUpUsers) {
      followUpUsers.forEach((user) => {
        let userEmail = user.email;
        let firstName = user.firstName;

        console.log("userEmail follow", userEmail);
        console.log("firstName follow", firstName);

        let mailData = {
          body: {
            userEmail,
            firstName,
          },
        };
        sendFollowUpMessage(mailData);
      });
    }

    // Query 4 days ago
    startDate = new Date().setDate(new Date().getDate() - 4);
    startDate = new Date(startDate).setHours(0, 0, 0, 0);
    endDate = new Date().setDate(new Date().getDate() - 3);
    endDate = new Date(endDate).setHours(0, 0, 0, 0);

    var firstOrgProfileUsers = await User.find({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    if (firstOrgProfileUsers) {
      firstOrgProfileUsers.forEach(async function (user) {
        try {
          let userEmail = user.email;
          let firstName = user.firstName;
          let userId = user._id;

          const userOrganization = await Organization.findById(
            user.organization
          ).populate("organizationType");

          let mailData = {
            body: {
              userEmail,
              firstName,
              userId
            },
          };
          if (!userOrganization?.isComplete) {
            if (
              userOrganization?.organizationType.name === "External Manufacturer"
            )
              sendCompleteOrgExtManufacturingRemember4Days(mailData);
            else sendCompleteOrgProfileRemember4Days(mailData);
          }
        } catch (error) {
          console.log(error);
        }
      });
    }

    // Query 7 days ago
    startDate = new Date().setDate(new Date().getDate() - 7);
    startDate = new Date(startDate).setHours(0, 0, 0, 0);
    endDate = new Date().setDate(new Date().getDate() - 6);
    endDate = new Date(endDate).setHours(0, 0, 0, 0);

    var secondOrgProfileUsers = await User.find({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    if (secondOrgProfileUsers) {
      secondOrgProfileUsers.forEach(async function (user) {
        let userEmail = user.email;
        let firstName = user.firstName;

        const userOrganization = await Organization.findById(
          user.organization
        ).populate("organizationType");

        let mailData = {
          body: {
            userEmail,
            firstName,
          },
        };

        if (!userOrganization?.isComplete) sendCompleteOrgProfileFupMessage(mailData);
      });
    }
  }
}

module.exports = {
  RegisterNotificationsController,
};
