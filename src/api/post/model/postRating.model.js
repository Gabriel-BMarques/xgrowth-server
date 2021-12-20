const mongoose = require('mongoose');
const CompanyProfile = require('../../company-profile/model/companyProfile.model');
const Post = require('./post.model');
const stringSimilarity = require("string-similarity")

const postRatingSchema = new mongoose.Schema({
  post: {
    type: mongoose.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  organization: {
    type: mongoose.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  rate: {
      type: Number,
      required: false
  },
  reason: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: false,
  },
  answer: {
    message: {
      type: String,
      required: false,
    },
    organization: {
      type: mongoose.Types.ObjectId,
      ref: 'Organization',
      required: false,
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: false
    },
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

function replaceStrings(str, strArray, replace) {
  strArray.forEach((s) => {
    str = str.replace(new RegExp(s, 'i'), replace);
  });
  return str;
}

function bestMatchStrings(str, strArray, precision) {
  return stringSimilarity.findBestMatch(str, strArray).ratings.filter((r) => r.rating > precision).map((r) => r.target);
}

async function removeConfidentialInfoFromComment(rating, req) {
    let replaceString = '[Information hidden by XGrowth]';

    // First replace all emails
    let emailPattern = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    let userFullNamePattern = new RegExp(`${ req.user.firstName } ${ req.user.familyName }`, 'i');
    let userFirstNamePattern = new RegExp(`${ req.user.firstName }`, 'i');
    let userFamilyNamePattern = new RegExp(`${ req.user.familyName }`, 'i');
    
    rating.comment = rating.comment.replace(emailPattern, replaceString);
    rating.comment = rating.comment.replace(userFullNamePattern, replaceString);
    rating.comment = rating.comment.replace(userFirstNamePattern, replaceString);
    rating.comment = rating.comment.replace(userFamilyNamePattern, replaceString);

    let userCompany = (await CompanyProfile.findById(req.user.company).populate('organization'));
    let commentWordsArray = rating.comment.split(' ');
    let companyNameSimilarity = bestMatchStrings(userCompany.companyName, commentWordsArray, 0.4);
    let organizationNameSimilarity = bestMatchStrings(userCompany.organization.name, commentWordsArray, 0.4);

    let stringsToReplace = [
      ...companyNameSimilarity,
      ...organizationNameSimilarity,
    ];

    // Non mandatory fields
    if (userCompany.organization.website) {
      let organizationWebsiteSimilarity = bestMatchStrings(userCompany.organization.website, commentWordsArray, 0.5);
      stringsToReplace.push(...organizationWebsiteSimilarity);
    }

    rating.comment = replaceStrings(rating.comment, stringsToReplace, replaceString);
}

async function checkIfCanRatePost(rating, user) {
  let foundRating = await PostRatingSchema.findOne({ post: mongoose.Types.ObjectId(rating.post), user: mongoose.Types.ObjectId(user._id) });
  let isFromDifferentOrg = (await Post.findById(rating.post))?.organization.toString() !== user.organization.toString();
  return !!!foundRating && isFromDifferentOrg;
}

postRatingSchema.pre("save", async function save(next, req) {
  try {
    if (this.comment) await removeConfidentialInfoFromComment(this, req);
    let canRate = await checkIfCanRatePost(this, req.user);
    if (!canRate) throw new Error('Cannot respond.');
  } catch (error) {
    return next(error);
  }
});

/**
 * @typedef PostRating
 */
const PostRatingSchema = mongoose.model('PostRating', postRatingSchema);
module.exports = PostRatingSchema;