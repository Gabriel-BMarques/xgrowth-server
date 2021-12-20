/* eslint-disable max-len */
/* eslint-disable no-shadow */
/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const {
  toLower, startCase, flatten, sortBy,
} = require('lodash');
const moment = require('moment-timezone');

const User = require('../../user/model/user.model');
const Interest = require('../../interests/model/interest.model');
const Post = require('../../post/model/post.model');
const UserAction = require('../../user/model/userAction.model');
const Organization = require('../../organization/model/organization.model');
const CompanyRelation = require('../../company-relation/model/companyRelation.model');

const { sendWeeklyPostNotifications } = require('../services/mailService');
const vars = require('../../../config/vars');

const { senderEmail } = vars;

// Posts dos últimos 7 dias para não repetir
const DAYS = 7;
const MAX_PUBLIC_POSTS = 2;
const MIN_POSTS = 0;
const MAX_POSTS = 8;

class WeeklyPostNotificationController {
  constructor() {
    this.users = [];
    this.posts = [];
    this.dynamic_template_data = {};
    this.message = {};
  }

  async loadUsers() {
    this.users = await User.find({ organization: { $ne: undefined }})
      .populate({
        path: 'organization',
        model: 'Organization',
      })
      .lean();
    return this;
  }

  async getUsersInterestedPosts(users) {
    for (let user of users) {
      const { _id, email, company, organization } = user;
      const organizationType = (await Organization.find({ _id: organization?._id }).populate('organizationType')).organizationType?.name;
      const relatedCompaniesIds = (await CompanyRelation.find({ companyA: company })).map((cr) => cr.companyB);
      // Find posts that interests the user
      const userCategoryInterestsIds = (
        await Interest.find(
          { userId: _id },
          { categoryId: 1, userId: 1 },
        ).lean()
      ).map(interest => interest.categoryId);

      // Critérios básicos de controle de visualização

      let isPotentialClient = organizationType === 'CPG Industry' ?  
        { Privacy: 'Potential Clients' } :
        {
          SupplierId: { $in: relatedCompaniesIds },
          Privacy: 'Potential Clients',
        };
      let isPublic = { Privacy: 'All Companies' };
      let isTargetedCompany = {
        RecipientsCompanyProfileId: { $in: company },
        Privacy: 'Selected Companies',
      };
      let isProactivePosting = { BriefId: { $exists: false } };
      let isFromAnotherCompany = { SupplierId: { $ne: company } };
      let isPublished = { IsDraft: false };
      let hasInterests = { Categories: { $in: userCategoryInterestsIds } };
      let createdInLastWeek = { createdAt: { $gte: moment().subtract(DAYS, 'days').toDate() } };

      let basicCriteriaQuery = {
        $and: [
          {
            $or: [
              isPotentialClient,
              isPublic,
              isTargetedCompany,
            ]
          },
          createdInLastWeek,
          isProactivePosting,
          isFromAnotherCompany,
          isPublished,
          hasInterests,
        ]
      };

      let filteredPosts = (
        await Post.find({ ...basicCriteriaQuery })
          .populate({
            path: 'SupplierId',
            model: 'CompanyProfile',
            populate: {
              path: 'organization',
            },
          },
          )
          .sort({ createdAt: -1 })
          .limit(10)
          .lean()
      ).map(post => ({
        id: post._id,
        organizationName: post.SupplierId?.organization.name,
        organizationId: post.SupplierId?.organization.toString(),
        postTitle: startCase(toLower(post.Title ? post.Title.trim() : '')),
        description: post.Description ? post.Description.trim() : '',
        imgUrl: post.UploadedFiles[0]?.url || '',
        supplierId: post.SupplierId?._id.toString(),
      }));

      // Critério básico B
      filteredPosts = (await removeNDuplicateOrgPost(filteredPosts, filteredPosts.length));

      // Critério básico C e D
      if (filteredPosts.length) {
        filteredPosts = await truncatePostsDescription(filteredPosts);

        const firstName = startCase(toLower(user.firstName ? user.firstName.trim() : ''));
        const familyName = startCase(toLower(user.familyName ? user.familyName.trim() : ''));

        this.dynamic_template_data = {
          username: `${firstName} ${familyName}`,
          posts: filteredPosts,
        };

        this.message = {
          to: email,
          from: senderEmail,
          templateId: 'd-ea903fad1d18454cb8e42c33ba93267d',
          asm: { group_id: 16056, groups_to_display: [16056] },
          dynamic_template_data: this.dynamic_template_data,
        };

        await this.sendEmail(this.message);
      }
    }
  }

  async sendEmail(message) {
    await sendWeeklyPostNotifications(this.message);
  }

  async notify() {
    this.getUsersInterestedPosts(this.users);
  }
}

const truncatePostsDescription = async (posts) => {
  posts.map((post) => {
    let truncatedDescription = '';
    if (post.description && post.description.length) {
      truncatedDescription = post.description.slice(0, 120);
      // eslint-disable-next-line no-param-reassign
      post.description = truncatedDescription.trim();
    }
    return post;
  });
  return posts;
};

const removeNDuplicateOrgPost = async (arr, n) => {
  let counter = 0;
  const newArray = [];

  for (let i = 0; i < n; i++) {
    if (
      i < n - 2 &&
      arr[i].organizationId === arr[i + 1].organizationId &&
      arr[i].organizationId === arr[i + 2].organizationId
    ) {
      continue;
    } else {
      newArray[counter] = arr[i];
      counter++;
    }
  }
  return newArray;
};

module.exports = {
  WeeklyPostNotificationController,
};
